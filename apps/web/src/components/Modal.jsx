import { m, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { springs, baseTransition } from '@/motion/transitions';

export default function Modal({ open, onClose, title, subtitle, children, footer, size = 'md' }) {
  const reduce = useReducedMotion();
  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  const widths = {
    sm: 'md:max-w-sm',
    md: 'md:max-w-md',
    lg: 'md:max-w-lg',
    xl: 'md:max-w-xl',
  };

  return (
    <AnimatePresence>
      {open && (
        <m.div
          className="fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={baseTransition}
            onClick={onClose}
            className="absolute inset-0 bg-text-primary/40 backdrop-blur-sm"
            aria-hidden
          />
          <m.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
            transition={springs.snappy}
            className={`absolute inset-x-3 top-12 md:left-1/2 md:right-auto md:-translate-x-1/2 md:top-24 md:w-full ${widths[size]}`}
          >
            <div className="bg-bg-surface rounded-2xl shadow-pop border border-border-subtle overflow-hidden flex flex-col max-h-[85vh]">
              <div className="flex items-start justify-between gap-3 p-5 md:p-6 border-b border-border-subtle">
                <div>
                  <h3 className="text-h3 text-text-primary">{title}</h3>
                  {subtitle && (
                    <p className="mt-0.5 text-caption text-text-secondary">{subtitle}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-full text-text-tertiary hover:bg-bg-muted hover:text-text-primary"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="p-5 md:p-6 overflow-y-auto">{children}</div>
              {footer && (
                <div className="p-5 md:p-6 border-t border-border-subtle bg-bg-page/50">
                  {footer}
                </div>
              )}
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
