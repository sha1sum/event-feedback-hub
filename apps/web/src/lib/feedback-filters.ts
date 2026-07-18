import type { FeedbackFilterInput, FeedbackSubscriptionFilterInput, StarRating } from '@/types/graphql';

/**
 * Builds a `FeedbackFilterInput`, omitting `eventId`/`ratings` entirely when
 * unset rather than sending them as `undefined`/empty, so the GraphQL
 * variables sent over the wire (and matched in tests) stay predictable.
 */
export function buildFeedbackFilter(
  eventId: string | undefined,
  ratings: StarRating[] | undefined,
  offset: number,
  limit: number,
): FeedbackFilterInput {
  const filter: FeedbackFilterInput = { offset, limit };
  if (eventId) {
    filter.eventId = eventId;
  }
  if (ratings && ratings.length > 0) {
    filter.ratings = ratings;
  }
  return filter;
}

export function buildFeedbackSubscriptionFilter(
  eventId: string | undefined,
  ratings: StarRating[] | undefined,
): FeedbackSubscriptionFilterInput {
  const filter: FeedbackSubscriptionFilterInput = {};
  if (eventId) {
    filter.eventId = eventId;
  }
  if (ratings && ratings.length > 0) {
    filter.ratings = ratings;
  }
  return filter;
}
