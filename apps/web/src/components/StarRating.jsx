import { Star } from 'lucide-react';
import clsx from 'clsx';

// Display-only star rating with half-star support via clip mask.
export default function StarRating({ value = 0, size = 16, color = 'text-warning', className }) {
  return (
    <div
      className={clsx('inline-flex items-center gap-0.5', className)}
      role="img"
      aria-label={`Rating ${value.toFixed(1)} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((n) => {
        const fill = Math.max(0, Math.min(1, value - (n - 1)));
        return (
          <span key={n} className="relative inline-block" style={{ width: size, height: size }}>
            <Star
              size={size}
              className="absolute inset-0 text-border-strong"
              fill="currentColor"
              strokeWidth={0}
            />
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fill * 100}%` }}
            >
              <Star size={size} className={color} fill="currentColor" strokeWidth={0} />
            </span>
          </span>
        );
      })}
    </div>
  );
}
