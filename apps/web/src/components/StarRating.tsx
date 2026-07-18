import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { StarRating as StarRatingValue } from '@/types/graphql';

const STAR_VALUES: StarRatingValue[] = [1, 2, 3, 4, 5];

interface StarRatingDisplayProps {
  rating: StarRatingValue;
  className?: string;
}

export function StarRatingDisplay({ rating, className }: StarRatingDisplayProps) {
  return (
    <span
      className={cn('tracking-tight', className)}
      role="img"
      aria-label={`Rated ${rating} out of 5 stars`}
    >
      <span className="text-rating">{'★'.repeat(rating)}</span>
      <span className="text-muted-foreground">{'★'.repeat(5 - rating)}</span>
    </span>
  );
}

interface StarRatingSelectProps {
  value: StarRatingValue | null;
  onChange: (value: StarRatingValue) => void;
  className?: string;
}

export function StarRatingSelect({ value, onChange, className }: StarRatingSelectProps) {
  const [hovered, setHovered] = useState<StarRatingValue | null>(null);
  const displayed = hovered ?? value ?? 0;

  return (
    <div
      className={cn('flex items-center gap-1', className)}
      role="radiogroup"
      aria-label="Rating, 1 to 5 stars"
      onMouseLeave={() => setHovered(null)}
    >
      {STAR_VALUES.map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} star${star === 1 ? '' : 's'}`}
          className="rounded-sm text-2xl leading-none transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          onMouseEnter={() => setHovered(star)}
          onFocus={() => setHovered(star)}
          onBlur={() => setHovered(null)}
          onClick={() => onChange(star)}
        >
          <span className={star <= displayed ? 'text-rating' : 'text-muted-foreground'}>★</span>
        </button>
      ))}
    </div>
  );
}
