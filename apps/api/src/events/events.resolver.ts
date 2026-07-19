import { Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';
import { FeedbackFilterInput } from './dto/feedback-filter.input';
import { FeedbackSubscriptionFilterInput } from './dto/feedback-subscription-filter.input';
import { SubmitFeedbackInput } from './dto/submit-feedback.input';
import { Event } from './entities/event.entity';
import { Feedback } from './entities/feedback.entity';
import { FEEDBACK_ADDED_EVENT, EventsService } from './events.service';
import { FeedbackPage } from './models/feedback-page.model';
import { PUB_SUB } from './pubsub.provider';
import { matchesFeedbackFilter } from './subscription-filters';

interface FeedbackAddedPayload {
  feedbackAdded: Feedback;
}

@Resolver()
export class EventsResolver {
  constructor(
    private readonly eventsService: EventsService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @Query(() => [Event])
  events(): Promise<Event[]> {
    return this.eventsService.findAllEvents();
  }

  @Query(() => FeedbackPage)
  feedback(
    @Args('filter', {
      type: () => FeedbackFilterInput,
      nullable: true,
    })
    filter: FeedbackFilterInput = new FeedbackFilterInput(),
  ): Promise<FeedbackPage> {
    return this.eventsService.findFeedback(filter);
  }

  @Mutation(() => Feedback)
  @UseGuards(ClerkAuthGuard)
  submitFeedback(@Args('input') input: SubmitFeedbackInput): Promise<Feedback> {
    return this.eventsService.submitFeedback(input);
  }

  @Subscription(() => Feedback, {
    filter: (
      payload: FeedbackAddedPayload,
      variables: { filter?: FeedbackSubscriptionFilterInput },
    ) => matchesFeedbackFilter(payload.feedbackAdded, variables.filter),
    resolve: (payload: FeedbackAddedPayload) => payload.feedbackAdded,
  })

  // The `filter` argument only exists to define the subscription's
  // GraphQL input; actual filtering happens in the `filter` option above,
  // which receives it via the resolver's `variables`.
  feedbackAdded(
    @Args('filter', {
      type: () => FeedbackSubscriptionFilterInput,
      nullable: true,
    })
    filter?: FeedbackSubscriptionFilterInput,
  ): AsyncIterableIterator<FeedbackAddedPayload> {
    void filter;
    return this.pubSub.asyncIterableIterator(FEEDBACK_ADDED_EVENT);
  }
}
