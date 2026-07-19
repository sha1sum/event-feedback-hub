import type { Server } from 'node:http';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PubSub } from 'graphql-subscriptions';
import request from 'supertest';
import { Repository } from 'typeorm';
import { AppModule } from '../src/app.module';
import { ClerkAuthGuard } from '../src/auth/clerk-auth.guard';
import dataSource from '../src/database/data-source';
import { Event } from '../src/events/entities/event.entity';
import { Feedback } from '../src/events/entities/feedback.entity';
import { FEEDBACK_ADDED_EVENT } from '../src/events/events.service';
import { PUB_SUB } from '../src/events/pubsub.provider';

interface GraphQLResponseBody<T> {
  data?: T;
  errors?: { message: string }[];
}

async function postGraphQL<T>(
  app: INestApplication<Server>,
  query: string,
  variables?: Record<string, unknown>,
): Promise<{ status: number; body: GraphQLResponseBody<T> }> {
  const response = await request(app.getHttpServer())
    .post('/graphql')
    .send({ query, variables });
  return {
    status: response.status,
    body: response.body as GraphQLResponseBody<T>,
  };
}

describe('Events GraphQL (e2e)', () => {
  let app: INestApplication<Server>;
  let eventRepository: Repository<Event>;
  let feedbackRepository: Repository<Feedback>;
  let seededEvent: Event;
  let otherEvent: Event;

  beforeAll(async () => {
    await dataSource.initialize();
    await dataSource.runMigrations();
    await dataSource.destroy();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(ClerkAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication<INestApplication<Server>>();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();

    eventRepository = app.get<Repository<Event>>(getRepositoryToken(Event));
    feedbackRepository = app.get<Repository<Feedback>>(
      getRepositoryToken(Feedback),
    );

    seededEvent = await eventRepository.save(
      eventRepository.create({
        name: 'Annual Tech Summit',
        date: '2026-03-14',
        location: 'San Francisco, CA',
      }),
    );
    otherEvent = await eventRepository.save(
      eventRepository.create({
        name: 'Design Systems Workshop',
        date: '2026-05-18',
        location: 'Remote',
      }),
    );
  });

  afterAll(async () => {
    await app.close();
  });

  it('generates a schema exposing the events object types and root operations', async () => {
    const { status, body } = await postGraphQL<{
      __schema: { types: { name: string }[] };
    }>(
      app,
      `
        query {
          __schema {
            types {
              name
            }
          }
        }
      `,
    );

    expect(status).toBe(200);
    const typeNames = (body.data?.__schema.types ?? []).map(
      (type) => type.name,
    );
    expect(typeNames).toEqual(
      expect.arrayContaining([
        'Event',
        'Feedback',
        'FeedbackPage',
        'Query',
        'Mutation',
        'Subscription',
      ]),
    );
  });

  it('lists events ordered by date', async () => {
    const { status, body } = await postGraphQL<{
      events: { id: string; name: string; date: string; location: string }[];
    }>(
      app,
      `
        query {
          events {
            id
            name
            date
            location
          }
        }
      `,
    );

    expect(status).toBe(200);
    const events = body.data?.events ?? [];

    // The database also carries the seeded placeholder fixtures, so assert
    // the test-created events are present and correctly ordered rather than
    // asserting the full (fixture-dependent) list contents.
    expect(events).toEqual(
      expect.arrayContaining([
        {
          id: seededEvent.id,
          name: seededEvent.name,
          date: seededEvent.date,
          location: seededEvent.location,
        },
        {
          id: otherEvent.id,
          name: otherEvent.name,
          date: otherEvent.date,
          location: otherEvent.location,
        },
      ]),
    );
    const dates = events.map((event) => event.date);
    expect(dates).toEqual([...dates].sort());
  });

  it('submits feedback for an existing event, trimming input and resolving eventName', async () => {
    interface SubmitFeedbackResult {
      submitFeedback: {
        id: string;
        eventId: string;
        eventName: string;
        submitterName: string;
        rating: number;
        description: string;
        createdAt: string;
      };
    }

    const { status, body } = await postGraphQL<SubmitFeedbackResult>(
      app,
      `
        mutation SubmitFeedback($input: SubmitFeedbackInput!) {
          submitFeedback(input: $input) {
            id
            eventId
            eventName
            submitterName
            rating
            description
            createdAt
          }
        }
      `,
      {
        input: {
          eventId: seededEvent.id,
          submitterName: '  Maria Chen  ',
          rating: 5,
          description: '  Fantastic lineup of speakers this year.  ',
        },
      },
    );

    expect(status).toBe(200);
    expect(body.errors).toBeUndefined();
    const feedback = body.data?.submitFeedback;
    expect(feedback?.eventId).toBe(seededEvent.id);
    expect(feedback?.eventName).toBe(seededEvent.name);
    expect(feedback?.submitterName).toBe('Maria Chen');
    expect(feedback?.description).toBe(
      'Fantastic lineup of speakers this year.',
    );
    expect(feedback?.rating).toBe(5);
    expect(feedback?.createdAt).toBeDefined();
  });

  it('rejects feedback submitted for a non-existent event', async () => {
    const { body } = await postGraphQL<{ submitFeedback: { id: string } }>(
      app,
      `
        mutation SubmitFeedback($input: SubmitFeedbackInput!) {
          submitFeedback(input: $input) {
            id
          }
        }
      `,
      {
        input: {
          eventId: '00000000-0000-0000-0000-000000000000',
          submitterName: 'Ghost',
          rating: 3,
          description: 'Should not be created.',
        },
      },
    );

    expect(body.data?.submitFeedback).toBeUndefined();
    expect(body.errors).toBeDefined();
  });

  it('rejects an out-of-range rating before it reaches the service', async () => {
    const { body } = await postGraphQL<{ submitFeedback: { id: string } }>(
      app,
      `
        mutation SubmitFeedback($input: SubmitFeedbackInput!) {
          submitFeedback(input: $input) {
            id
          }
        }
      `,
      {
        input: {
          eventId: seededEvent.id,
          submitterName: 'Test',
          rating: 9,
          description: 'Invalid rating.',
        },
      },
    );

    expect(body.data?.submitFeedback).toBeUndefined();
    expect(body.errors).toBeDefined();
  });

  it('filters and paginates feedback by event and rating', async () => {
    await feedbackRepository.save([
      feedbackRepository.create({
        eventId: otherEvent.id,
        submitterName: 'A',
        rating: 4,
        description: 'Great workshop.',
      }),
      feedbackRepository.create({
        eventId: otherEvent.id,
        submitterName: 'B',
        rating: 2,
        description: 'Could be better.',
      }),
    ]);

    interface FeedbackPageResult {
      feedback: {
        items: { eventId: string; rating: number }[];
        totalCount: number;
        offset: number;
        limit: number;
        hasMore: boolean;
      };
    }

    const { status, body } = await postGraphQL<FeedbackPageResult>(
      app,
      `
        query Feedback($filter: FeedbackFilterInput) {
          feedback(filter: $filter) {
            items {
              eventId
              rating
            }
            totalCount
            offset
            limit
            hasMore
          }
        }
      `,
      { filter: { eventId: otherEvent.id, ratings: [4] } },
    );

    expect(status).toBe(200);
    const page = body.data?.feedback;
    expect(page?.totalCount).toBe(1);
    expect(page?.items).toEqual([{ eventId: otherEvent.id, rating: 4 }]);
    expect(page?.hasMore).toBe(false);
  });

  it('publishes newly submitted feedback on the feedbackAdded topic', async () => {
    interface FeedbackAddedPayload {
      feedbackAdded: Feedback;
    }

    const pubSub = app.get<PubSub>(PUB_SUB);

    const iterator: AsyncIterableIterator<FeedbackAddedPayload> =
      pubSub.asyncIterableIterator<FeedbackAddedPayload>(FEEDBACK_ADDED_EVENT);
    const next: Promise<IteratorResult<FeedbackAddedPayload, undefined>> =
      iterator.next();

    const { body } = await postGraphQL<{
      submitFeedback: { id: string; eventId: string; rating: number };
    }>(
      app,
      `
        mutation SubmitFeedback($input: SubmitFeedbackInput!) {
          submitFeedback(input: $input) {
            id
            eventId
            rating
          }
        }
      `,
      {
        input: {
          eventId: seededEvent.id,
          submitterName: 'Realtime Subscriber Test',
          rating: 1,
          description: 'Testing realtime delivery.',
        },
      },
    );
    expect(body.errors).toBeUndefined();
    const created = body.data?.submitFeedback;

    const result: IteratorResult<FeedbackAddedPayload, undefined> = await next;
    expect(result.done).toBe(false);
    expect(result.value?.feedbackAdded.id).toBe(created?.id);

    await iterator.return?.();
  });
});
