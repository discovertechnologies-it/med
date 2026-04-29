import { m } from 'framer-motion';
import clsx from 'clsx';
import { springs } from '@/motion/transitions';

export default function Toggle({ checked, onChange, label, disabled = false, size = 'md' }) {
  const sz = {
    sm: { w: 'w-8', h: 'h-5', knob: 'h-4 w-4', x: 12 },
    md: { w: 'w-11', h: 'h-6', knob: 'h-5 w-5', x: 20 },
  }[size];

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={clsx(
        'relative inline-flex shrink-0 items-center rounded-full transition-colors',
        sz.w,
        sz.h,
        checked ? 'bg-primary' : 'bg-bg-muted border border-border-subtle',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <m.span
        animate={{ x: checked ? sz.x : 2 }}
        transition={springs.snappy}
        className={clsx(
          'inline-block rounded-full bg-bg-surface shadow-card',
          sz.knob
        )}
      />
    </button>
  );
}
