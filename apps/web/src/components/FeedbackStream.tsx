import { useEffect, useId, useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { FeedbackCard } from '@/components/FeedbackCard';
import { RatingFilterDropdown } from '@/components/RatingFilterDropdown';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FEEDBACK_ADDED_SUBSCRIPTION, FEEDBACK_QUERY } from '@/graphql/operations';
import { buildFeedbackFilter, buildFeedbackSubscriptionFilter } from '@/lib/feedback-filters';
import { getFriendlyErrorMessage } from '@/lib/graphql-errors';
import type { EventOption, StarRating } from '@/types/graphql';

interface FeedbackStreamProps {
  events: EventOption[];
}

const ALL_EVENTS_VALUE = 'all';
const PAGE_SIZE = 10;

export function FeedbackStream({ events }: FeedbackStreamProps) {
  const [eventFilter, setEventFilter] = useState(ALL_EVENTS_VALUE);
  const [ratingFilter, setRatingFilter] = useState<Set<StarRating>>(new Set());
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [realtimeError, setRealtimeError] = useState(false);
  const [isStartingSimulation, setIsStartingSimulation] = useState(false);
  const [simulateError, setSimulateError] = useState<string | null>(null);

  const eventFilterId = useId();

  const eventId = eventFilter === ALL_EVENTS_VALUE ? undefined : eventFilter;
  const ratings = ratingFilter.size > 0 ? Array.from(ratingFilter) : undefined;
  const ratingsKey = ratings
    ? ratings
        .slice()
        .sort((a, b) => a - b)
        .join(',')
    : '';

  const { data, loading, error, fetchMore, subscribeToMore, refetch } = useQuery(FEEDBACK_QUERY, {
    variables: { filter: buildFeedbackFilter(eventId, ratings, 0, PAGE_SIZE) },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    setRealtimeError(false);

    const unsubscribe = subscribeToMore({
      document: FEEDBACK_ADDED_SUBSCRIPTION,
      variables: { filter: buildFeedbackSubscriptionFilter(eventId, ratings) },
      updateQuery: (_unsafePreviousData, options) => {
        const incoming = options.subscriptionData.data?.feedbackAdded;
        if (!options.complete || !incoming) {
          return;
        }
        const { previousData } = options;
        if (previousData.feedback.items.some((item) => item.id === incoming.id)) {
          return;
        }
        return {
          feedback: {
            ...previousData.feedback,
            items: [incoming, ...previousData.feedback.items],
            totalCount: previousData.feedback.totalCount + 1,
          },
        };
      },
      onError: () => setRealtimeError(true),
    });

    return unsubscribe;
    // `subscribeToMore` is a fresh bound function every render (tied to the
    // same underlying observable query), so it's intentionally omitted here:
    // including it would tear down and recreate the subscription on every
    // render instead of only when the active filter changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, ratingsKey]);

  async function handleLoadMore() {
    if (!data) {
      return;
    }
    setIsLoadingMore(true);
    try {
      await fetchMore({
        variables: {
          filter: buildFeedbackFilter(eventId, ratings, data.feedback.items.length, PAGE_SIZE),
        },
        updateQuery: (previousQueryResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return previousQueryResult;
          }
          return {
            feedback: {
              ...fetchMoreResult.feedback,
              items: [...previousQueryResult.feedback.items, ...fetchMoreResult.feedback.items],
            },
          };
        },
      });
    } finally {
      setIsLoadingMore(false);
    }
  }

  const items = data?.feedback.items ?? [];

  async function handleSimulate() {
    setSimulateError(null);
    setIsStartingSimulation(true);
    try {
      const response = await fetch('/api/events/simulate', { method: 'POST' });
      if (!response.ok) {
        setSimulateError(
          response.status === 409
            ? 'A simulation is already running. Please wait for it to finish.'
            : 'Unable to start the simulation. Please try again.',
        );
      }
    } catch {
      setSimulateError('Unable to start the simulation. Please try again.');
    } finally {
      setIsStartingSimulation(false);
    }
  }

  return (
    <section aria-labelledby="feedback-stream-heading" className="mt-8">
      <div className="flex items-center justify-between gap-3">
        <h2
          id="feedback-stream-heading"
          className="text-base font-semibold text-foreground sm:text-lg"
        >
          Feedback from attendees
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSimulate}
          disabled={isStartingSimulation}
        >
          {isStartingSimulation ? 'Starting…' : 'Simulate'}
        </Button>
      </div>

      {simulateError && (
        <p className="mt-2 text-xs text-destructive" role="alert">
          {simulateError}
        </p>
      )}

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex flex-col gap-2 sm:flex-1">
          <Label htmlFor={eventFilterId}>Filter by event</Label>
          <Select value={eventFilter} onValueChange={setEventFilter}>
            <SelectTrigger id={eventFilterId} className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_EVENTS_VALUE}>All events</SelectItem>
              {events.map((event) => (
                <SelectItem key={event.id} value={event.id}>
                  {event.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-foreground">Filter by rating</span>
          <RatingFilterDropdown selected={ratingFilter} onChange={setRatingFilter} />
        </div>
      </div>

      {realtimeError && (
        <p className="mt-3 text-xs text-muted-foreground">
          Live updates are temporarily unavailable. New feedback may not appear until you refresh.
        </p>
      )}

      {loading && !data && <p className="mt-4 text-sm text-muted-foreground">Loading feedback…</p>}

      {error && !data && (
        <div className="mt-4 flex flex-col items-start gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">
            {getFriendlyErrorMessage(error, 'Unable to load feedback. Please try again.')}
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}

      {data && items.length === 0 && (
        <p className="mt-4 text-sm text-muted-foreground">
          No feedback matches the current filters yet.
        </p>
      )}

      {data && items.length > 0 && (
        <>
          <ul className="mt-4 flex flex-col gap-3">
            {items.map((entry) => (
              <FeedbackCard key={entry.id} feedback={entry} />
            ))}
          </ul>

          {data.feedback.hasMore && (
            <div className="mt-4 flex justify-center">
              <Button variant="outline" onClick={handleLoadMore} disabled={isLoadingMore}>
                {isLoadingMore ? 'Loading…' : 'Load more'}
              </Button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
