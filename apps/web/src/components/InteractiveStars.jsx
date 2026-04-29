import { useState } from 'react';
import { m } from 'framer-motion';
import { Star } from 'lucide-react';
import clsx from 'clsx';
import { springs } from '@/motion/transitions';

// Interactive rating picker (1-5). Hover preview, click to set.
export default function InteractiveStars({ value, onChange, size = 28 }) {
  const [hover, setHover] = useState(0);
  const display = hover || value;

  return (
    <div role="radiogroup" aria-label="Rating" className="inline-flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => {
        const active = n <= display;
        return (
          <m.button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            onClick={() => onChange(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            whileTap={{ scale: 0.9 }}
            transition={springs.snappy}
            className={clsx(
              'inline-flex items-center justify-center p-1 rounded-md',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary'
            )}
          >
            <Star
              size={size}
              className={active ? 'text-warning' : 'text-border-strong'}
              fill={active ? 'currentColor' : 'none'}
              strokeWidth={active ? 0 : 1.5}
            />
          </m.button>
        );
      })}
    </div>
  );
}
