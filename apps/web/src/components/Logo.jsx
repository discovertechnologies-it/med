import { Link } from 'react-router-dom';

export default function Logo({ className = '' }) {
  return (
    <Link to="/" aria-label="Med, home" className={`inline-flex items-center gap-2 ${className}`}>
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <rect x="3" y="9" width="18" height="6" rx="3" />
          <path d="M12 9v6" />
        </svg>
      </span>
      <span className="text-h2 font-bold tracking-tight">Med</span>
    </Link>
  );
}
