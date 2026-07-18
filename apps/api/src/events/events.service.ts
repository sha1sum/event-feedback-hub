import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PubSub } from 'graphql-subscriptions';
import { FindOptionsWhere, In, Repository } from 'typeorm';
import { FeedbackFilterInput } from './dto/feedback-filter.input';
import { SubmitFeedbackInput } from './dto/submit-feedback.input';
import { Event } from './entities/event.entity';
import { Feedback } from './entities/feedback.entity';
import { FeedbackPage } from './models/feedback-page.model';
import { PUB_SUB } from './pubsub.provider';

export const FEEDBACK_ADDED_EVENT = 'feedbackAdded';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  findAllEvents(): Promise<Event[]> {
    return this.eventsRepository.find({
      order: { date: 'ASC', name: 'ASC' },
    });
  }

  async findFeedback(filter: FeedbackFilterInput): Promise<FeedbackPage> {
    const { eventId, ratings, offset, limit } = filter;

    const where: FindOptionsWhere<Feedback> = {};
    if (eventId) {
      where.eventId = eventId;
    }
    if (ratings && ratings.length > 0) {
      where.rating = In(ratings);
    }

    const [items, totalCount] = await this.feedbackRepository.findAndCount({
      where,
      relations: { event: true },
      order: { createdAt: 'DESC', id: 'DESC' },
      skip: offset,
      take: limit,
    });

    return {
      items,
      totalCount,
      offset,
      limit,
      hasMore: offset + items.length < totalCount,
    };
  }

  async submitFeedback(input: SubmitFeedbackInput): Promise<Feedback> {
    const event = await this.eventsRepository.findOne({
      where: { id: input.eventId },
    });
    if (!event) {
      throw new NotFoundException(`Event ${input.eventId} was not found`);
    }

    const feedback = this.feedbackRepository.create({
      eventId: event.id,
      event,
      submitterName: input.submitterName.trim(),
      rating: input.rating,
      description: input.description.trim(),
    });

    const saved = await this.feedbackRepository.save(feedback);
    saved.event = event;

    await this.pubSub.publish(FEEDBACK_ADDED_EVENT, {
      feedbackAdded: saved,
    });

    return saved;
  }
}
