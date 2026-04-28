import clsx from 'clsx';

const variants = {
  primary: 'bg-primary-muted text-primary',
  accent: 'bg-accent-muted text-accent',
  success: 'bg-success-muted text-success',
  warning: 'bg-warning-muted text-warning',
  danger: 'bg-danger-muted text-danger',
  neutral: 'bg-bg-muted text-text-secondary',
};

export default function Badge({ children, variant = 'neutral', icon, className }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-caption font-semibold',
        variants[variant],
        className
      )}
    >
      {icon && (
        <span className="-ml-0.5" aria-hidden>
          {icon}
        </span>
      )}
      {children}
    </span>
  );
}
