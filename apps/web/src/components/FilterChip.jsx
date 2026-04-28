import { m } from 'framer-motion';
import { Check } from 'lucide-react';
import clsx from 'clsx';
import { springs } from '@/motion/transitions';

export default function FilterChip({ active, onClick, children }) {
  return (
    <m.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      transition={springs.soft}
      aria-pressed={active}
      className={clsx(
        'inline-flex items-center gap-1.5 px-3 h-9 rounded-full text-caption font-semibold',
        'border transition-colors',
        active
          ? 'bg-primary text-white border-primary'
          : 'bg-bg-surface text-text-secondary border-border-subtle hover:border-border-strong hover:text-text-primary'
      )}
    >
      {active && <Check size={14} aria-hidden />}
      {children}
    </m.button>
  );
}
