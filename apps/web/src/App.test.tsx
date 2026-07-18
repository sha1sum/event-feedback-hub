import { MockedProvider } from '@apollo/client/testing/react';
import type { MockLink } from '@apollo/client/testing';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from './App';
import {
  EVENTS_QUERY,
  FEEDBACK_ADDED_SUBSCRIPTION,
  FEEDBACK_QUERY,
  SUBMIT_FEEDBACK_MUTATION,
} from '@/graphql/operations';
import { buildFeedbackFilter, buildFeedbackSubscriptionFilter } from '@/lib/feedback-filters';
import type { EventOption, FeedbackEntry, FeedbackFilterInput, StarRating } from '@/types/graphql';

const PAGE_SIZE = 10;

// The InMemoryCache normalizes results by `__typename` (+ id), so mocked
// responses must include it explicitly or fields silently disappear on read.
type WithTypename<T> = T & { __typename: string };

function asEvent(event: EventOption): WithTypename<EventOption> {
  return { __typename: 'Event', ...event };
}

function asFeedback(entry: FeedbackEntry): WithTypename<FeedbackEntry> {
  return { __typename: 'Feedback', ...entry };
}

const EVENT_1: EventOption = {
  id: 'event-1',
  name: 'Annual Tech Summit 2026',
  date: '2026-03-14',
  location: 'San Francisco, CA',
};
const EVENT_2: EventOption = {
  id: 'event-2',
  name: 'Design Systems Workshop',
  date: '2026-05-18',
  location: 'Remote',
};
const EVENTS = [EVENT_1, EVENT_2];

const FEEDBACK_1: FeedbackEntry = {
  id: 'fb-1',
  eventId: EVENT_1.id,
  eventName: EVENT_1.name,
  submitterName: 'Maria Chen',
  rating: 5,
  description: 'Fantastic lineup of speakers this year.',
  createdAt: '2026-03-15T09:24:00Z',
};

function eventsMock(): MockLink.MockedResponse {
  return {
    request: { query: EVENTS_QUERY, variables: {} },
    result: { data: { events: EVENTS.map(asEvent) } },
    delay: 0,
  };
}

function feedbackMock(
  filter: FeedbackFilterInput,
  items: FeedbackEntry[],
  overrides: Partial<{ totalCount: number; hasMore: boolean }> = {},
): MockLink.MockedResponse {
  return {
    request: { query: FEEDBACK_QUERY, variables: { filter } },
    result: {
      data: {
        feedback: {
          __typename: 'FeedbackPage',
          items: items.map(asFeedback),
          totalCount: overrides.totalCount ?? items.length,
          offset: filter.offset ?? 0,
          limit: filter.limit ?? PAGE_SIZE,
          hasMore: overrides.hasMore ?? false,
        },
      },
    },
    delay: 0,
  };
}

/** A subscription mock that never resolves, so it stays quietly subscribed without affecting the test. */
function idleSubscriptionMock(
  eventId?: string,
  ratings?: StarRating[],
): MockLink.MockedResponse {
  return {
    request: {
      query: FEEDBACK_ADDED_SUBSCRIPTION,
      variables: { filter: buildFeedbackSubscriptionFilter(eventId, ratings) },
    },
    delay: Infinity,
  };
}

function feedbackAddedMock(
  eventId: string | undefined,
  ratings: StarRating[] | undefined,
  feedbackAdded: FeedbackEntry,
): MockLink.MockedResponse {
  return {
    request: {
      query: FEEDBACK_ADDED_SUBSCRIPTION,
      variables: { filter: buildFeedbackSubscriptionFilter(eventId, ratings) },
    },
    result: { data: { feedbackAdded: asFeedback(feedbackAdded) } },
    delay: 20,
  };
}

function renderApp(mocks: readonly MockLink.MockedResponse[]) {
  return render(
    <MockedProvider mocks={mocks}>
      <App />
    </MockedProvider>,
  );
}

async function selectEvent(user: ReturnType<typeof userEvent.setup>, eventName: string) {
  await user.click(await screen.findByRole('combobox', { name: 'Event' }));
  await user.click(await screen.findByRole('option', { name: eventName }));
}

describe('App', () => {
  it('renders the branded header, form, stream, and footer', async () => {
    renderApp([
      eventsMock(),
      feedbackMock(buildFeedbackFilter(undefined, undefined, 0, PAGE_SIZE), []),
      idleSubscriptionMock(),
    ]);

    expect(screen.getByAltText('Event Feedback Hub logo')).toBeInTheDocument();
    expect(
      screen.getByText((_, element) => element?.tagName === 'SPAN' && element.textContent === 'Event Feedback Hub'),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /log in/i })).toBeInTheDocument();
    expect(screen.getByText(/all rights reserved/i)).toBeInTheDocument();

    expect(await screen.findByRole('heading', { name: /share your feedback/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /feedback from attendees/i })).toBeInTheDocument();
  });

  it('reveals the rating and review fields only after an event is selected', async () => {
    const user = userEvent.setup();
    renderApp([
      eventsMock(),
      feedbackMock(buildFeedbackFilter(undefined, undefined, 0, PAGE_SIZE), []),
      idleSubscriptionMock(),
    ]);

    await screen.findByRole('combobox', { name: 'Event' });
    expect(screen.queryByRole('radiogroup', { name: /rating/i })).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/your review/i)).not.toBeInTheDocument();

    await selectEvent(user, EVENT_1.name);

    expect(screen.getByRole('radiogroup', { name: /rating/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/your review/i)).toBeInTheDocument();
  });

  it('submits new feedback anonymously and prepends it to the stream once the server confirms it', async () => {
    const user = userEvent.setup();
    const submittedFeedback: FeedbackEntry = {
      id: 'fb-new-1',
      eventId: EVENT_1.id,
      eventName: EVENT_1.name,
      submitterName: 'Anonymous',
      rating: 4,
      description: 'Really enjoyed the sessions this year.',
      createdAt: '2026-07-18T00:00:00Z',
    };

    renderApp([
      eventsMock(),
      feedbackMock(buildFeedbackFilter(undefined, undefined, 0, PAGE_SIZE), []),
      {
        request: {
          query: SUBMIT_FEEDBACK_MUTATION,
          variables: {
            input: {
              eventId: EVENT_1.id,
              submitterName: 'Anonymous',
              rating: 4,
              description: 'Really enjoyed the sessions this year.',
            },
          },
        },
        result: { data: { submitFeedback: asFeedback(submittedFeedback) } },
        delay: 0,
      },
      feedbackAddedMock(undefined, undefined, submittedFeedback),
    ]);

    await selectEvent(user, EVENT_1.name);
    await user.click(screen.getByRole('radio', { name: '4 stars' }));
    await user.type(screen.getByLabelText(/your review/i), 'Really enjoyed the sessions this year.');
    await user.click(screen.getByRole('button', { name: /submit feedback/i }));

    // The form resets after a successful submission.
    await screen.findByText('Select an event…');
    expect(screen.queryByLabelText(/your review/i)).not.toBeInTheDocument();

    // The realtime subscription then delivers the new item into the stream.
    const stream = await screen.findByRole('list');
    const card = await within(stream).findByText('Really enjoyed the sessions this year.');
    const cardContainer = card.closest('li');
    expect(cardContainer).not.toBeNull();
    expect(within(cardContainer!).getByText('Annual Tech Summit 2026')).toBeInTheDocument();
    expect(within(cardContainer!).getByText('Anonymous')).toBeInTheDocument();
    expect(within(cardContainer!).getByRole('img', { name: /rated 4 out of 5 stars/i })).toBeInTheDocument();
  });

  it('submits the form when pressing ctrl+enter or meta+enter in the review textarea', async () => {
    const user = userEvent.setup();
    const submittedFeedback: FeedbackEntry = {
      id: 'fb-new-2',
      eventId: EVENT_2.id,
      eventName: EVENT_2.name,
      submitterName: 'Anonymous',
      rating: 5,
      description: 'Submitted via keyboard shortcut.',
      createdAt: '2026-07-18T00:00:00Z',
    };

    renderApp([
      eventsMock(),
      feedbackMock(buildFeedbackFilter(undefined, undefined, 0, PAGE_SIZE), []),
      {
        request: {
          query: SUBMIT_FEEDBACK_MUTATION,
          variables: {
            input: {
              eventId: EVENT_2.id,
              submitterName: 'Anonymous',
              rating: 5,
              description: 'Submitted via keyboard shortcut.',
            },
          },
        },
        result: { data: { submitFeedback: asFeedback(submittedFeedback) } },
        delay: 0,
      },
      feedbackAddedMock(undefined, undefined, submittedFeedback),
    ]);

    await selectEvent(user, EVENT_2.name);
    await user.click(screen.getByRole('radio', { name: '5 stars' }));

    const review = screen.getByLabelText(/your review/i);
    await user.type(review, 'Submitted via keyboard shortcut.');
    await user.type(review, '{Control>}{Enter}{/Control}');

    const stream = await screen.findByRole('list');
    expect(await within(stream).findByText('Submitted via keyboard shortcut.')).toBeInTheDocument();
  });

  it('displays event name, rating, review text, and submitter for existing feedback cards', async () => {
    renderApp([
      eventsMock(),
      feedbackMock(buildFeedbackFilter(undefined, undefined, 0, PAGE_SIZE), [FEEDBACK_1]),
      idleSubscriptionMock(),
    ]);

    const stream = await screen.findByRole('list');
    const firstCard = within(stream).getAllByRole('listitem')[0];

    expect(within(firstCard).getByText('Maria Chen')).toBeInTheDocument();
    expect(within(firstCard).getByText(/fantastic lineup of speakers/i)).toBeInTheDocument();
    expect(within(firstCard).getByRole('img', { name: /rated 5 out of 5 stars/i })).toBeInTheDocument();

    const timestamp = within(firstCard).getByText(/ago$/i);
    expect(timestamp.tagName).toBe('TIME');
    expect(timestamp).toHaveAttribute('dateTime', '2026-03-15T09:24:00Z');
    expect(timestamp).toHaveAttribute('title');
    expect(timestamp.getAttribute('title')).not.toHaveLength(0);
  });

  it('shows a friendly error message and keeps entered values when submission fails', async () => {
    const user = userEvent.setup();
    renderApp([
      eventsMock(),
      feedbackMock(buildFeedbackFilter(undefined, undefined, 0, PAGE_SIZE), []),
      idleSubscriptionMock(),
      {
        request: {
          query: SUBMIT_FEEDBACK_MUTATION,
          variables: {
            input: {
              eventId: EVENT_1.id,
              submitterName: 'Anonymous',
              rating: 3,
              description: 'This event no longer exists.',
            },
          },
        },
        result: { errors: [{ message: 'Event event-1 was not found' }] },
      },
    ]);

    await selectEvent(user, EVENT_1.name);
    await user.click(screen.getByRole('radio', { name: '3 stars' }));
    await user.type(screen.getByLabelText(/your review/i), 'This event no longer exists.');
    await user.click(screen.getByRole('button', { name: /submit feedback/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Event event-1 was not found');
    // Entered values are preserved so the user can retry without retyping.
    expect(screen.getByLabelText(/your review/i)).toHaveValue('This event no longer exists.');
    expect(screen.getByRole('radio', { name: '3 stars', checked: true })).toBeInTheDocument();
  });

  it('allows toggling individual star ratings within the rating filter, refetching from the server', async () => {
    const user = userEvent.setup();
    renderApp([
      eventsMock(),
      feedbackMock(buildFeedbackFilter(undefined, undefined, 0, PAGE_SIZE), [FEEDBACK_1]),
      idleSubscriptionMock(),
      feedbackMock(buildFeedbackFilter(undefined, [5], 0, PAGE_SIZE), [FEEDBACK_1]),
      idleSubscriptionMock(undefined, [5]),
    ]);

    const stream = await screen.findByRole('list');
    expect(within(stream).getAllByRole('listitem')).toHaveLength(1);

    await user.click(screen.getByRole('button', { name: /all ratings/i }));
    const fiveStarCheckbox = await screen.findByRole('checkbox', { name: '5 stars' });
    await user.click(fiveStarCheckbox);

    expect(fiveStarCheckbox).toHaveAttribute('data-state', 'checked');
    // The filtered request still resolves to the same single matching item.
    expect(within(await screen.findByRole('list')).getAllByRole('listitem')).toHaveLength(1);
  });

  it('loads more feedback from the server when "Load more" is clicked', async () => {
    const user = userEvent.setup();
    const secondPageItem: FeedbackEntry = {
      id: 'fb-2',
      eventId: EVENT_1.id,
      eventName: EVENT_1.name,
      submitterName: 'Jordan Patel',
      rating: 4,
      description: 'Great content overall.',
      createdAt: '2026-03-15T14:02:00Z',
    };

    renderApp([
      eventsMock(),
      feedbackMock(buildFeedbackFilter(undefined, undefined, 0, PAGE_SIZE), [FEEDBACK_1], { hasMore: true, totalCount: 2 }),
      idleSubscriptionMock(),
      feedbackMock(buildFeedbackFilter(undefined, undefined, 1, PAGE_SIZE), [secondPageItem], {
        hasMore: false,
        totalCount: 2,
      }),
    ]);

    const stream = await screen.findByRole('list');
    expect(within(stream).getAllByRole('listitem')).toHaveLength(1);

    await user.click(screen.getByRole('button', { name: /load more/i }));

    expect(await screen.findByText('Great content overall.')).toBeInTheDocument();
    expect(within(screen.getByRole('list')).getAllByRole('listitem')).toHaveLength(2);
    expect(screen.queryByRole('button', { name: /load more/i })).not.toBeInTheDocument();
  });
});
