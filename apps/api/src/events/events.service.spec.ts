import { NotFoundException } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { In, Repository } from 'typeorm';
import { FeedbackFilterInput } from './dto/feedback-filter.input';
import { SubmitFeedbackInput } from './dto/submit-feedback.input';
import { Event } from './entities/event.entity';
import { Feedback } from './entities/feedback.entity';
import { EventsService, FEEDBACK_ADDED_EVENT } from './events.service';

type MockRepository<T extends object> = {
  [K in keyof Repository<T>]?: jest.Mock;
};

function createMockRepository<T extends object>(): MockRepository<T> {
  return {
    find: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };
}

describe('EventsService', () => {
  let service: EventsService;
  let eventsRepository: MockRepository<Event>;
  let feedbackRepository: MockRepository<Feedback>;
  let pubSub: Pick<PubSub, 'publish'>;

  beforeEach(() => {
    eventsRepository = createMockRepository<Event>();
    feedbackRepository = createMockRepository<Feedback>();
    pubSub = { publish: jest.fn().mockResolvedValue(undefined) };

    service = new EventsService(
      eventsRepository as unknown as Repository<Event>,
      feedbackRepository as unknown as Repository<Feedback>,
      pubSub as PubSub,
    );
  });

  describe('findAllEvents', () => {
    it('lists events ordered by date then name', async () => {
      eventsRepository.find!.mockResolvedValue([]);

      await service.findAllEvents();

      expect(eventsRepository.find).toHaveBeenCalledWith({
        order: { date: 'ASC', name: 'ASC' },
      });
    });
  });

  describe('findFeedback', () => {
    it('filters by eventId and ratings, orders newest first, and paginates', async () => {
      feedbackRepository.findAndCount!.mockResolvedValue([[], 0]);

      const filter: FeedbackFilterInput = {
        eventId: 'evt-1',
        ratings: [4, 5],
        offset: 10,
        limit: 20,
      };

      await service.findFeedback(filter);

      expect(feedbackRepository.findAndCount).toHaveBeenCalledWith({
        where: { eventId: 'evt-1', rating: In([4, 5]) },
        relations: { event: true },
        order: { createdAt: 'DESC', id: 'DESC' },
        skip: 10,
        take: 20,
      });
    });

    it('omits eventId/rating constraints when not provided', async () => {
      feedbackRepository.findAndCount!.mockResolvedValue([[], 0]);

      await service.findFeedback({ offset: 0, limit: 20 });

      expect(feedbackRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({ where: {} }),
      );
    });

    it('reports totalCount, offset, limit, and hasMore', async () => {
      const items = [
        Object.assign(new Feedback(), { id: 'fb-1' }),
        Object.assign(new Feedback(), { id: 'fb-2' }),
      ];
      feedbackRepository.findAndCount!.mockResolvedValue([items, 5]);

      const page = await service.findFeedback({ offset: 0, limit: 2 });

      expect(page).toEqual({
        items,
        totalCount: 5,
        offset: 0,
        limit: 2,
        hasMore: true,
      });
    });

    it('reports hasMore as false once the page reaches the end', async () => {
      const items = [Object.assign(new Feedback(), { id: 'fb-1' })];
      feedbackRepository.findAndCount!.mockResolvedValue([items, 1]);

      const page = await service.findFeedback({ offset: 0, limit: 20 });

      expect(page.hasMore).toBe(false);
    });
  });

  describe('submitFeedback', () => {
    const input: SubmitFeedbackInput = {
      eventId: 'evt-1',
      submitterName: '  Maria Chen  ',
      rating: 5,
      description: '  Fantastic event.  ',
    };

    it('throws NotFoundException when the event does not exist', async () => {
      eventsRepository.findOne!.mockResolvedValue(null);

      await expect(service.submitFeedback(input)).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(feedbackRepository.create).not.toHaveBeenCalled();
    });

    it('trims submitterName and description and persists the server-owned event relation', async () => {
      const event = Object.assign(new Event(), { id: 'evt-1', name: 'Demo' });
      eventsRepository.findOne!.mockResolvedValue(event);
      const created = Object.assign(new Feedback(), {
        id: 'fb-1',
        eventId: 'evt-1',
        event,
      });
      feedbackRepository.create!.mockReturnValue(created);
      feedbackRepository.save!.mockResolvedValue(created);

      const result = await service.submitFeedback(input);

      expect(feedbackRepository.create).toHaveBeenCalledWith({
        eventId: 'evt-1',
        event,
        submitterName: 'Maria Chen',
        rating: 5,
        description: 'Fantastic event.',
      });
      expect(result.event).toBe(event);
    });

    it('publishes the saved feedback on the feedbackAdded topic', async () => {
      const event = Object.assign(new Event(), { id: 'evt-1', name: 'Demo' });
      eventsRepository.findOne!.mockResolvedValue(event);
      const created = Object.assign(new Feedback(), {
        id: 'fb-1',
        eventId: 'evt-1',
      });
      feedbackRepository.create!.mockReturnValue(created);
      feedbackRepository.save!.mockResolvedValue(created);

      await service.submitFeedback(input);

      expect(pubSub.publish).toHaveBeenCalledWith(FEEDBACK_ADDED_EVENT, {
        feedbackAdded: created,
      });
    });
  });
});
