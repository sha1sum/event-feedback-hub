import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { StarRating } from '@/data/placeholder';

const STAR_VALUES: StarRating[] = [5, 4, 3, 2, 1];

interface RatingFilterDropdownProps {
  selected: Set<StarRating>;
  onChange: (selected: Set<StarRating>) => void;
}

export function RatingFilterDropdown({ selected, onChange }: RatingFilterDropdownProps) {
  const summary =
    selected.size === 0
      ? 'All ratings'
      : `${selected.size} rating${selected.size === 1 ? '' : 's'}`;

  function toggleStar(star: StarRating) {
    const next = new Set(selected);
    if (next.has(star)) {
      next.delete(star);
    } else {
      next.add(star);
    }
    onChange(next);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full min-w-[10rem] justify-between font-normal">
          {summary}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-48 p-2">
        <div role="group" aria-label="Filter by rating" className="flex flex-col gap-1">
          {STAR_VALUES.map((star) => {
            const inputId = `rating-filter-${star}`;
            const label = `${star} star${star === 1 ? '' : 's'}`;
            return (
              <label
                key={star}
                htmlFor={inputId}
                className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-muted"
              >
                <Checkbox
                  id={inputId}
                  aria-label={label}
                  checked={selected.has(star)}
                  onCheckedChange={() => toggleStar(star)}
                />
                <span aria-hidden="true">
                  <span className="text-rating">{'★'.repeat(star)}</span>
                  <span className="text-muted-foreground">{'★'.repeat(5 - star)}</span>
                </span>
              </label>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
