import { useState } from "react";
import { Star } from "lucide-react";

type StarRatingProps = {
  value: number;
  size?: number;
  disabled?: boolean;
  readOnly?: boolean;
  onChange?: (value: number) => void;
};

export function StarRating({
  value,
  size = 24,
  disabled = false,
  readOnly = false,
  onChange,
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const activeValue = hoverValue ?? value;

  return (
    <div className="inline-flex w-auto flex-nowrap items-center gap-0.5 whitespace-nowrap leading-none">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.round(activeValue);

        if (readOnly) {
          return (
            <Star
              key={star}
              size={size}
              className={
                filled
                  ? "shrink-0 fill-amber-400 text-amber-500"
                  : "shrink-0 fill-slate-200 text-slate-300 dark:fill-slate-700 dark:text-slate-600"
              }
            />
          );
        }

        return (
          <button
            key={star}
            type="button"
            disabled={disabled}
            aria-label={`Rate ${star} star${star === 1 ? "" : "s"}`}
            onMouseEnter={() => setHoverValue(star)}
            onMouseLeave={() => setHoverValue(null)}
            onFocus={() => setHoverValue(star)}
            onBlur={() => setHoverValue(null)}
            onClick={() => onChange?.(star)}
            className="inline-flex shrink-0 rounded-sm p-0.5 text-amber-500 transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:cursor-wait disabled:opacity-70"
          >
            <Star
              size={size}
              className={
                filled
                  ? "fill-amber-400 text-amber-500"
                  : "fill-slate-200 text-slate-300 dark:fill-slate-700 dark:text-slate-600"
              }
            />
          </button>
        );
      })}
    </div>
  );
}
