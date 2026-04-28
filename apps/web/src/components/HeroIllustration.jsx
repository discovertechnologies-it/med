import { m, useReducedMotion } from 'framer-motion';
import { springs } from '@/motion/transitions';

// Locked illustration style: thin-line two-tone (primary + neutral) on transparent.
// Stroke 1.5, no fills, no gradients. Subtle parallax bob on the inner orbiting elements only.
export default function HeroIllustration({ className = '' }) {
  const reduce = useReducedMotion();
  const float = reduce
    ? {}
    : { y: [0, -4, 0], transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' } };

  const counterFloat = reduce
    ? {}
    : { y: [0, 4, 0], transition: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' } };

  return (
    <svg
      viewBox="0 0 480 420"
      className={className}
      role="img"
      aria-label="A pharmacist verifying a prescription bottle"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Soft circular backdrop — solid muted, not a gradient */}
      <circle cx="240" cy="210" r="190" className="text-primary-muted" fill="currentColor" stroke="none" />

      {/* Concentric guide rings */}
      <g className="text-text-tertiary opacity-60">
        <circle cx="240" cy="210" r="160" />
        <circle cx="240" cy="210" r="120" />
      </g>

      {/* Pill bottle (centerpiece) */}
      <g className="text-text-primary">
        <rect x="190" y="170" width="100" height="130" rx="12" />
        <rect x="200" y="155" width="80" height="22" rx="6" />
        <line x1="210" y1="220" x2="270" y2="220" />
        <line x1="210" y1="240" x2="270" y2="240" />
        <line x1="210" y1="260" x2="250" y2="260" />
      </g>

      {/* Verified shield badge — solid fill, white check for contrast */}
      <m.g animate={float}>
        <path
          d="M132 130c0-3 2-5 5-6l22-7c1-0.4 3-0.4 4 0l22 7c3 1 5 3 5 6v18c0 14-10 24-29 32-19-8-29-18-29-32z"
          className="text-primary"
          fill="currentColor"
          stroke="none"
        />
        <path
          d="M150 145l8 8 14-14"
          stroke="white"
          strokeWidth="2.5"
          fill="none"
        />
      </m.g>

      {/* Floating capsule pill */}
      <m.g animate={counterFloat} className="text-text-primary">
        <g transform="translate(330, 110) rotate(35)">
          <rect x="-30" y="-12" width="60" height="24" rx="12" />
          <line x1="0" y1="-12" x2="0" y2="12" className="text-primary" stroke="currentColor" />
        </g>
      </m.g>

      {/* Floating tablet */}
      <m.g animate={float} className="text-text-secondary">
        <g transform="translate(360, 280)">
          <circle cx="0" cy="0" r="22" />
          <line x1="-22" y1="0" x2="22" y2="0" />
        </g>
      </m.g>

      {/* Tiny plus marker */}
      <g className="text-primary">
        <line x1="100" y1="280" x2="100" y2="300" />
        <line x1="90" y1="290" x2="110" y2="290" />
      </g>

      {/* Tiny dot constellation */}
      <g className="text-text-tertiary">
        <circle cx="80" cy="170" r="2" fill="currentColor" stroke="none" />
        <circle cx="400" cy="200" r="2" fill="currentColor" stroke="none" />
        <circle cx="120" cy="350" r="2" fill="currentColor" stroke="none" />
      </g>
    </svg>
  );
}
