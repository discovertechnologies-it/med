// Locked rule: thin-line, two-tone (primary teal + neutral grey), no fills, no gradients.
export default function EmptyCartIllustration({ className = '' }) {
  return (
    <svg
      viewBox="0 0 240 200"
      className={className}
      role="img"
      aria-label="Empty shopping bag"
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Soft circular backdrop */}
      <circle cx="120" cy="100" r="92" className="text-primary-muted" fill="currentColor" stroke="none" />

      {/* Concentric guide ring */}
      <circle cx="120" cy="100" r="74" className="text-text-tertiary opacity-50" stroke="currentColor" />

      {/* Shopping bag */}
      <g className="text-text-primary" stroke="currentColor">
        <path d="M82 88 h76 l-6 60 a6 6 0 0 1 -6 6 h-52 a6 6 0 0 1 -6 -6 z" />
        <path d="M100 88 v-12 a20 20 0 0 1 40 0 v12" />
      </g>

      {/* Plus marker (decorative) */}
      <g className="text-primary" stroke="currentColor" strokeWidth="2">
        <line x1="170" y1="62" x2="170" y2="78" />
        <line x1="162" y1="70" x2="178" y2="70" />
      </g>

      {/* Tiny dots */}
      <g className="text-text-tertiary" fill="currentColor" stroke="none">
        <circle cx="58" cy="62" r="2" />
        <circle cx="186" cy="142" r="2" />
        <circle cx="68" cy="156" r="1.5" />
      </g>
    </svg>
  );
}
