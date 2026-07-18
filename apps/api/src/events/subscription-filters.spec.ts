import { Feedback } from './entities/feedback.entity';
import { matchesFeedbackFilter } from './subscription-filters';

function buildFeedback(overrides: Partial<Feedback> = {}): Feedback {
  return Object.assign(new Feedback(), {
    id: 'fb-1',
    eventId: 'evt-1',
    submitterName: 'Maria Chen',
    rating: 4,
    description: 'Great event.',
    createdAt: new Date(),
    ...overrides,
  });
}

describe('matchesFeedbackFilter', () => {
  it('matches everything when no filter is provided', () => {
    expect(matchesFeedbackFilter(buildFeedback())).toBe(true);
  });

  it('matches everything when the filter has no constraints', () => {
    expect(matchesFeedbackFilter(buildFeedback(), {})).toBe(true);
  });

  it('rejects feedback for a different event when eventId is set', () => {
    const feedback = buildFeedback({ eventId: 'evt-2' });
    expect(matchesFeedbackFilter(feedback, { eventId: 'evt-1' })).toBe(false);
  });

  it('accepts feedback for the matching event', () => {
    const feedback = buildFeedback({ eventId: 'evt-1' });
    expect(matchesFeedbackFilter(feedback, { eventId: 'evt-1' })).toBe(true);
  });

  it('rejects feedback whose rating is not in the ratings list', () => {
    const feedback = buildFeedback({ rating: 2 });
    expect(matchesFeedbackFilter(feedback, { ratings: [4, 5] })).toBe(false);
  });

  it('accepts feedback whose rating is in the ratings list', () => {
    const feedback = buildFeedback({ rating: 5 });
    expect(matchesFeedbackFilter(feedback, { ratings: [4, 5] })).toBe(true);
  });

  it('applies both eventId and ratings constraints together', () => {
    const feedback = buildFeedback({ eventId: 'evt-1', rating: 5 });
    expect(
      matchesFeedbackFilter(feedback, { eventId: 'evt-1', ratings: [5] }),
    ).toBe(true);
    expect(
      matchesFeedbackFilter(feedback, { eventId: 'evt-2', ratings: [5] }),
    ).toBe(false);
    expect(
      matchesFeedbackFilter(feedback, { eventId: 'evt-1', ratings: [1] }),
    ).toBe(false);
  });
});
