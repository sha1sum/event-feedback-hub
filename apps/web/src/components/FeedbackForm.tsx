import { useEffect, useId, useState, type FormEvent, type KeyboardEvent, type ReactNode } from 'react';
import { useMutation } from '@apollo/client/react';
import { cn } from '@/lib/utils';
import { getFriendlyErrorMessage } from '@/lib/graphql-errors';
import { StarRatingSelect } from '@/components/StarRating';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { SUBMIT_FEEDBACK_MUTATION } from '@/graphql/operations';
import type { EventOption, StarRating } from '@/types/graphql';

const ANONYMOUS_SUBMITTER_NAME = 'Anonymous';

interface FeedbackFormProps {
  events: EventOption[];
}

export function FeedbackForm({ events }: FeedbackFormProps) {
  const [eventId, setEventId] = useState('');
  const [rating, setRating] = useState<StarRating | null>(null);
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [submitFeedback, { loading: submitting }] = useMutation(SUBMIT_FEEDBACK_MUTATION);

  const eventSelectId = useId();
  const reviewId = useId();

  const selectedEvent = events.find((event) => event.id === eventId) ?? null;
  const isFormVisible = selectedEvent !== null;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!selectedEvent) {
      return;
    }
    if (!rating) {
      setError('Please select a star rating.');
      return;
    }
    const trimmedDescription = description.trim();
    if (trimmedDescription.length === 0) {
      setError('Please enter your feedback.');
      return;
    }

    setError(null);

    try {
      const { data } = await submitFeedback({
        variables: {
          input: {
            eventId: selectedEvent.id,
            submitterName: ANONYMOUS_SUBMITTER_NAME,
            rating,
            description: trimmedDescription,
          },
        },
      });

      if (!data) {
        setError('Something went wrong submitting your feedback. Please try again.');
        return;
      }

      setEventId('');
      setRating(null);
      setDescription('');
    } catch (submitError) {
      setError(
        getFriendlyErrorMessage(submitError, 'Unable to submit your feedback. Please try again.'),
      );
    }
  }

  function handleReviewKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    const isSubmitShortcut = e.key === 'Enter' && (e.metaKey || e.ctrlKey);
    if (isSubmitShortcut) {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">Share your feedback</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <Label htmlFor={eventSelectId}>Event</Label>
            <Select
              value={eventId}
              onValueChange={(value) => {
                setEventId(value);
                setError(null);
              }}
            >
              <SelectTrigger id={eventSelectId} className="w-full">
                <SelectValue placeholder="Select an event…" />
              </SelectTrigger>
              <SelectContent>
                {events.map((event) => (
                  <SelectItem key={event.id} value={event.id}>
                    {event.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isFormVisible && (
            <RevealedFields key={selectedEvent.id}>
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-foreground">Rating</span>
                <StarRatingSelect value={rating} onChange={setRating} />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor={reviewId}>Your review</Label>
                <Textarea
                  id={reviewId}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setError(null);
                  }}
                  onKeyDown={handleReviewKeyDown}
                  rows={4}
                  placeholder="Tell us what you thought about this event…"
                />
                <p className="text-xs text-muted-foreground">
                  Press <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-sans">⌘</kbd>/
                  <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-sans">Ctrl</kbd> +{' '}
                  <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-sans">Enter</kbd> to
                  submit.
                </p>
              </div>

              {error && (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              )}

              <Button type="submit" className="self-start" disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit feedback'}
              </Button>
            </RevealedFields>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

function RevealedFields({ children }: { children: ReactNode }) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      className={cn(
        'flex flex-col gap-4 pt-4 transition-all duration-300 ease-out motion-reduce:transition-none',
        entered ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0',
      )}
    >
      {children}
    </div>
  );
}
