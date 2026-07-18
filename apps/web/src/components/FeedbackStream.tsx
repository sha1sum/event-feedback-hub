import { useId, useState } from 'react';
import { FeedbackCard } from '@/components/FeedbackCard';
import { RatingFilterDropdown } from '@/components/RatingFilterDropdown';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { EventOption, FeedbackEntry, StarRating } from '@/data/placeholder';

interface FeedbackStreamProps {
  events: EventOption[];
  feedback: FeedbackEntry[];
}

const ALL_EVENTS_VALUE = 'all';

export function FeedbackStream({ events, feedback }: FeedbackStreamProps) {
  const [eventFilter, setEventFilter] = useState(ALL_EVENTS_VALUE);
  const [ratingFilter, setRatingFilter] = useState<Set<StarRating>>(new Set());

  const eventFilterId = useId();

  return (
    <section aria-labelledby="feedback-stream-heading" className="mt-8">
      <h2
        id="feedback-stream-heading"
        className="text-base font-semibold text-foreground sm:text-lg"
      >
        Feedback from attendees
      </h2>

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

      <ul className="mt-4 flex flex-col gap-3">
        {feedback.map((entry) => (
          <FeedbackCard key={entry.id} feedback={entry} />
        ))}
      </ul>
    </section>
  );
}
