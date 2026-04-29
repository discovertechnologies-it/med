import { m } from 'framer-motion';
import { Check } from 'lucide-react';
import clsx from 'clsx';
import { springs } from '@/motion/transitions';

export default function RadioCard({ active, onClick, children, className }) {
  return (
    <m.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.99 }}
      transition={springs.soft}
      aria-pressed={active}
      className={clsx(
        'relative text-left w-full bg-bg-surface border-2 rounded-xl p-4 transition-colors',
        active
          ? 'border-primary'
          : 'border-border-subtle hover:border-border-strong',
        className
      )}
    >
      <span
        aria-hidden
        className={clsx(
          'absolute top-3 right-3 inline-flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors',
          active ? 'bg-primary border-primary text-white' : 'border-border-strong'
        )}
      >
        {active && <Check size={12} />}
      </span>
      {children}
    </m.button>
  );
}
