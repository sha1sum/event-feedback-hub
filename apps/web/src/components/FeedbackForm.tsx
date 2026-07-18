import { useEffect, useId, useState, type FormEvent, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
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
import type { EventOption, FeedbackEntry, StarRating } from '@/data/placeholder';

interface FeedbackFormProps {
  events: EventOption[];
  onSubmit: (entry: Omit<FeedbackEntry, 'id' | 'submittedAt'>) => void;
}

export function FeedbackForm({ events, onSubmit }: FeedbackFormProps) {
  const [eventId, setEventId] = useState('');
  const [rating, setRating] = useState<StarRating | null>(null);
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const eventSelectId = useId();
  const reviewId = useId();

  const selectedEvent = events.find((event) => event.id === eventId) ?? null;
  const isFormVisible = selectedEvent !== null;

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!selectedEvent) {
      return;
    }
    if (!rating) {
      setError('Please select a star rating.');
      return;
    }
    if (text.trim().length === 0) {
      setError('Please enter your feedback.');
      return;
    }

    setError(null);
    onSubmit({
      eventId: selectedEvent.id,
      eventName: selectedEvent.name,
      submitterName: 'You',
      rating,
      text: text.trim(),
    });

    setEventId('');
    setRating(null);
    setText('');
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
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
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

              <Button type="submit" className="self-start">
                Submit feedback
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
