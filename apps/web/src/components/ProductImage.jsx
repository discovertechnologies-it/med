import clsx from 'clsx';
import { tintFor } from '@/utils/tints';

// Three placeholder variants until real photography lands. Solid fills only — no gradients.
// `size` controls inner element scale (large for hero, small for thumbnails).

export default function ProductImage({
  medicine,
  variant = 'front',
  size = 'lg',
  withGuides = true,
  rounded = 'rounded-2xl',
  className,
}) {
  const tint = tintFor(medicine.id);
  const isLg = size === 'lg';

  return (
    <div
      className={clsx(
        'relative aspect-square bg-bg-image overflow-hidden flex items-center justify-center',
        rounded,
        className
      )}
    >
      {withGuides && isLg && (
        <div
          aria-hidden
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div className="h-[78%] w-[78%] rounded-full border border-border-subtle/70" />
          <div className="absolute h-[58%] w-[58%] rounded-full border border-border-subtle" />
        </div>
      )}

      {variant === 'front' && <FrontVariant medicine={medicine} tint={tint} isLg={isLg} />}
      {variant === 'pill' && <PillVariant tint={tint} isLg={isLg} />}
      {variant === 'strip' && <StripVariant tint={tint} isLg={isLg} />}
    </div>
  );
}

function FrontVariant({ medicine, tint, isLg }) {
  return (
    <div
      className={clsx(
        'relative rounded-3xl flex items-center justify-center',
        tint.bg,
        isLg ? 'h-[44%] w-[44%] shadow-card' : 'h-[58%] w-[58%]'
      )}
    >
      <span
        className={clsx(
          'leading-none font-bold opacity-90',
          tint.fg,
          isLg ? 'text-[5rem]' : 'text-display'
        )}
      >
        {medicine.brand.charAt(0)}
      </span>
    </div>
  );
}

function PillVariant({ tint, isLg }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={clsx('relative', tint.fg, isLg ? 'w-[58%]' : 'w-[72%]')}
      role="presentation"
    >
      <g transform="rotate(-28 100 100)">
        {/* Tinted half */}
        <path
          d="M30 80 h60 v40 h-60 a20 20 0 0 1 0 -40 z"
          fill="currentColor"
          fillOpacity="0.18"
          stroke="none"
        />
        {/* Outline */}
        <rect
          x="30"
          y="80"
          width="140"
          height="40"
          rx="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        />
        <line x1="100" y1="80" x2="100" y2="120" stroke="currentColor" strokeWidth="3" />
        {/* Dosage marks */}
        <line
          x1="120"
          y1="92"
          x2="135"
          y2="92"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="120"
          y1="108"
          x2="150"
          y2="108"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

function StripVariant({ tint, isLg }) {
  return (
    <svg
      viewBox="0 0 220 200"
      className={clsx('relative', tint.fg, isLg ? 'w-[64%]' : 'w-[78%]')}
      role="presentation"
    >
      {/* Strip outline */}
      <rect
        x="20"
        y="40"
        width="180"
        height="120"
        rx="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      {/* Six tablet wells */}
      {[
        [60, 80],
        [110, 80],
        [160, 80],
        [60, 120],
        [110, 120],
        [160, 120],
      ].map(([cx, cy]) => (
        <g key={`${cx}-${cy}`}>
          <circle cx={cx} cy={cy} r="14" fill="currentColor" fillOpacity="0.18" stroke="none" />
          <circle
            cx={cx}
            cy={cy}
            r="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeOpacity="0.6"
          />
        </g>
      ))}
      {/* Brand stripe */}
      <line
        x1="40"
        y1="50"
        x2="80"
        y2="50"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
