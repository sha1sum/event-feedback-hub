import { StarRatingDisplay } from '@/components/StarRating';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { formatAbsoluteTime, formatRelativeTime } from '@/lib/format-relative-time';
import type { FeedbackEntry } from '@/types/graphql';

interface FeedbackCardProps {
  feedback: FeedbackEntry;
}

export function FeedbackCard({ feedback }: FeedbackCardProps) {
  return (
    <li>
      <Card className="py-4">
        <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-2 px-4">
          <span className="text-sm font-semibold text-foreground">{feedback.eventName}</span>
          <StarRatingDisplay rating={feedback.rating} />
        </CardHeader>
        <CardContent className="px-4">
          <p className="text-sm text-foreground">{feedback.description}</p>
        </CardContent>
        <CardFooter className="justify-between gap-2 px-4">
          <span className="text-xs font-medium text-muted-foreground">{feedback.submitterName}</span>
          <time
            dateTime={feedback.createdAt}
            title={formatAbsoluteTime(feedback.createdAt)}
            className="text-xs text-muted-foreground"
          >
            {formatRelativeTime(feedback.createdAt)}
          </time>
        </CardFooter>
      </Card>
    </li>
  );
}
