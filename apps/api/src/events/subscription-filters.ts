import { FeedbackSubscriptionFilterInput } from './dto/feedback-subscription-filter.input';
import { Feedback } from './entities/feedback.entity';

export function matchesFeedbackFilter(
  feedback: Feedback,
  filter?: FeedbackSubscriptionFilterInput,
): boolean {
  if (!filter) {
    return true;
  }
  if (filter.eventId && feedback.eventId !== filter.eventId) {
    return false;
  }
  if (
    filter.ratings &&
    filter.ratings.length > 0 &&
    !filter.ratings.includes(feedback.rating)
  ) {
    return false;
  }
  return true;
}
