import { m, useReducedMotion } from 'framer-motion';
import { Check } from 'lucide-react';
import clsx from 'clsx';

const allSteps = [
  { id: 'placed', label: 'Order placed' },
  { id: 'rx_review', label: 'Prescription review' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'packed', label: 'Packed' },
  { id: 'shipped', label: 'Shipped' },
  { id: 'delivered', label: 'Delivered' },
];

const order = {
  placed: 0,
  rx_review: 1,
  confirmed: 2,
  packed: 3,
  shipped: 4,
  delivered: 5,
  cancelled: -1,
};

export default function OrderTimeline({ status, hasRx }) {
  const reduce = useReducedMotion();
  const steps = hasRx ? allSteps : allSteps.filter((s) => s.id !== 'rx_review');
  const currentIdx = steps.findIndex((s) => s.id === status);

  return (
    <ol className="grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-2 relative">
      {steps.map((step, i) => {
        const completed = i < currentIdx;
        const current = i === currentIdx;
        return (
          <li key={step.id} className="relative md:min-h-[72px]">
            <div className="flex md:flex-col items-start md:items-start gap-3 md:gap-2">
              <div className="relative shrink-0">
                <m.span
                  initial={false}
                  animate={
                    current && !reduce
                      ? { scale: [1, 1.1, 1], transition: { duration: 1.6, repeat: Infinity } }
                      : {}
                  }
                  className={clsx(
                    'inline-flex h-9 w-9 items-center justify-center rounded-full border-2 relative z-10',
                    completed
                      ? 'bg-primary border-primary text-white'
                      : current
                        ? 'bg-primary-muted border-primary text-primary'
                        : 'bg-bg-surface border-border-subtle text-text-tertiary'
                  )}
                >
                  {completed ? (
                    <Check size={16} />
                  ) : (
                    <span className="text-caption font-bold tabular">{i + 1}</span>
                  )}
                </m.span>
                {/* Mobile vertical connector */}
                {i < steps.length - 1 && (
                  <span
                    aria-hidden
                    className={clsx(
                      'md:hidden absolute left-1/2 top-9 -translate-x-1/2 w-0.5 h-[calc(100%+8px)]',
                      completed ? 'bg-primary' : 'bg-border-subtle'
                    )}
                  />
                )}
              </div>
              <div className="md:mt-1">
                <p
                  className={clsx(
                    'text-body font-semibold leading-tight',
                    completed || current ? 'text-text-primary' : 'text-text-tertiary'
                  )}
                >
                  {step.label}
                </p>
                {current && (
                  <p className="text-caption text-primary mt-0.5">In progress</p>
                )}
              </div>
            </div>
            {/* Desktop horizontal connector */}
            {i < steps.length - 1 && (
              <span
                aria-hidden
                className={clsx(
                  'hidden md:block absolute top-[18px] left-[calc(50%+18px)] right-[calc(-50%+18px)] h-0.5',
                  i < currentIdx ? 'bg-primary' : 'bg-border-subtle'
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

export { order as statusOrder };
