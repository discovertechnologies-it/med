import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { m, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { format, addDays } from 'date-fns';
import {
  Repeat,
  Pause,
  Play,
  SkipForward,
  X,
  Plus,
  Calendar,
  ShoppingBag,
} from 'lucide-react';
import clsx from 'clsx';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import ProductImage from '@/components/ProductImage';
import { useSubscriptionStore } from '@/store/useSubscriptionStore';
import { findMedicine, medicines } from '@/data/mockCatalog';
import { formatPrice } from '@/utils/formatPrice';
import { staggerContainer, fadeUp } from '@/motion/variants';
import { springs } from '@/motion/transitions';

const frequencyOptions = [
  { unit: 'week', value: 1, label: 'Weekly' },
  { unit: 'week', value: 2, label: 'Every 2 weeks' },
  { unit: 'month', value: 1, label: 'Monthly' },
  { unit: 'month', value: 2, label: 'Every 2 months' },
  { unit: 'month', value: 3, label: 'Every 3 months' },
];

function frequencyLabel(freq) {
  return (
    frequencyOptions.find((f) => f.unit === freq.unit && f.value === freq.value)?.label ??
    `Every ${freq.value} ${freq.unit}${freq.value > 1 ? 's' : ''}`
  );
}

export default function Subscriptions() {
  const subs = useSubscriptionStore((s) => s.subscriptions);
  const create = useSubscriptionStore((s) => s.create);
  const pause = useSubscriptionStore((s) => s.pause);
  const resume = useSubscriptionStore((s) => s.resume);
  const skip = useSubscriptionStore((s) => s.skip);
  const cancel = useSubscriptionStore((s) => s.cancel);
  const remove = useSubscriptionStore((s) => s.remove);

  const [adding, setAdding] = useState(false);

  const enriched = useMemo(
    () => subs.map((s) => ({ ...s, medicine: findMedicine(s.medicineId) })).filter((s) => s.medicine),
    [subs]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-h2 text-text-primary">Subscriptions</h2>
          <p className="text-caption text-text-secondary mt-0.5">
            Auto-deliver chronic medicines on a schedule.
          </p>
        </div>
        {!adding && (
          <Button leftIcon={<Plus size={18} />} onClick={() => setAdding(true)}>
            New subscription
          </Button>
        )}
      </div>

      <AnimatePresence initial={false}>
        {adding && (
          <m.div
            key="form"
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={springs.snappy}
          >
            <NewSubscriptionForm
              onCancel={() => setAdding(false)}
              onCreate={(payload) => {
                create(payload);
                toast.success('Subscription created');
                setAdding(false);
              }}
            />
          </m.div>
        )}
      </AnimatePresence>

      {enriched.length === 0 ? (
        <Empty onAdd={() => setAdding(true)} />
      ) : (
        <m.ul
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-3"
        >
          <AnimatePresence initial={false}>
            {enriched.map((sub) => (
              <m.li
                key={sub.id}
                layout
                variants={fadeUp}
                exit={{ opacity: 0, x: -16, transition: { duration: 0.18 } }}
              >
                <SubCard
                  sub={sub}
                  onPause={() => {
                    pause(sub.id);
                    toast(`${sub.medicine.brand} subscription paused`);
                  }}
                  onResume={() => {
                    resume(sub.id);
                    toast.success(`${sub.medicine.brand} subscription resumed`);
                  }}
                  onSkip={() => {
                    skip(sub.id, 7);
                    toast('Next delivery pushed by 7 days');
                  }}
                  onCancel={() => {
                    cancel(sub.id);
                    toast(`Subscription cancelled`, {
                      action: {
                        label: 'Undo',
                        onClick: () => resume(sub.id),
                      },
                    });
                  }}
                  onDelete={() => remove(sub.id)}
                />
              </m.li>
            ))}
          </AnimatePresence>
        </m.ul>
      )}
    </div>
  );
}

function SubCard({ sub, onPause, onResume, onSkip, onCancel, onDelete }) {
  const { medicine, qty, frequency, nextRunAt, status } = sub;
  const isCancelled = status === 'cancelled';
  const isPaused = status === 'paused';

  const statusVariant = isCancelled ? 'danger' : isPaused ? 'warning' : 'success';
  const statusLabel = isCancelled ? 'Cancelled' : isPaused ? 'Paused' : 'Active';

  return (
    <article className="bg-bg-surface border border-border-subtle rounded-2xl shadow-card p-4 md:p-5 flex gap-3 md:gap-4">
      <Link to={`/medicine/${medicine.id}`} className="shrink-0 w-20 sm:w-24">
        <ProductImage
          medicine={medicine}
          variant="strip"
          size="sm"
          withGuides={false}
          rounded="rounded-xl"
        />
      </Link>
      <div className="min-w-0 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              to={`/medicine/${medicine.id}`}
              className="text-body font-semibold text-text-primary line-clamp-1 hover:text-primary"
            >
              {medicine.brand}
            </Link>
            <p className="text-caption text-text-secondary line-clamp-1">{medicine.salt}</p>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <Badge variant={statusVariant}>{statusLabel}</Badge>
              <span className="text-caption text-text-tertiary tabular">
                {qty} × {medicine.packSize}
              </span>
            </div>
          </div>
          <div className="text-right tabular shrink-0">
            <p className="text-body-lg font-semibold text-text-primary">
              {formatPrice(medicine.sellingPrice * qty)}
            </p>
            <p className="text-caption text-text-tertiary">per delivery</p>
          </div>
        </div>

        {!isCancelled && (
          <div className="mt-3 inline-flex items-center gap-1.5 text-caption text-text-secondary">
            <Calendar size={14} className="text-primary" />
            <span>{frequencyLabel(frequency)}</span>
            <span className="text-text-tertiary">·</span>
            <span>
              Next on{' '}
              <span className="text-text-primary font-semibold">
                {format(new Date(nextRunAt), 'd MMM yyyy')}
              </span>
            </span>
          </div>
        )}

        <div className="mt-auto pt-3 flex flex-wrap gap-1.5">
          {isCancelled ? (
            <Button size="sm" variant="ghost" onClick={onDelete} leftIcon={<X size={14} />}>
              Remove
            </Button>
          ) : (
            <>
              {isPaused ? (
                <Button
                  size="sm"
                  variant="secondary"
                  leftIcon={<Play size={14} />}
                  onClick={onResume}
                >
                  Resume
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="secondary"
                  leftIcon={<Pause size={14} />}
                  onClick={onPause}
                >
                  Pause
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                leftIcon={<SkipForward size={14} />}
                onClick={onSkip}
              >
                Skip 7 days
              </Button>
              <Button size="sm" variant="ghost" onClick={onCancel}>
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}

function NewSubscriptionForm({ onCancel, onCreate }) {
  const [medicineId, setMedicineId] = useState('');
  const [qty, setQty] = useState(1);
  const [freqIdx, setFreqIdx] = useState(2); // monthly default
  const [startDate, setStartDate] = useState(() =>
    format(addDays(new Date(), 7), 'yyyy-MM-dd')
  );

  const medicine = findMedicine(medicineId);
  const freq = frequencyOptions[freqIdx];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!medicine) {
      toast.error('Pick a medicine');
      return;
    }
    onCreate({
      medicineId,
      qty,
      frequency: { unit: freq.unit, value: freq.value },
      nextRunAt: new Date(startDate).toISOString(),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-bg-surface border border-border-subtle rounded-2xl shadow-card p-5 md:p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-h3 text-text-primary">New subscription</h3>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Cancel"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-text-tertiary hover:bg-bg-muted hover:text-text-primary transition"
        >
          <X size={16} />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label htmlFor="med" className="block text-label uppercase text-text-tertiary mb-1.5">
            Medicine
          </label>
          <select
            id="med"
            value={medicineId}
            onChange={(e) => setMedicineId(e.target.value)}
            className="w-full h-11 px-3 rounded-full bg-bg-page border border-border-subtle hover:border-border-strong focus:border-primary text-text-primary outline-none transition-colors"
            required
          >
            <option value="">Choose a medicine</option>
            {medicines
              .filter((m) => m.requiresPrescription || m.category === 'vitamins')
              .map((m) => (
                <option key={m.id} value={m.id}>
                  {m.brand} — {m.salt}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label htmlFor="qty" className="block text-label uppercase text-text-tertiary mb-1.5">
            Quantity per delivery
          </label>
          <input
            id="qty"
            type="number"
            min="1"
            max="6"
            value={qty}
            onChange={(e) => setQty(Math.max(1, Math.min(6, parseInt(e.target.value) || 1)))}
            className="w-full h-11 px-4 rounded-full bg-bg-page border border-border-subtle hover:border-border-strong focus:border-primary text-text-primary outline-none transition-colors tabular"
          />
        </div>

        <div>
          <label htmlFor="start" className="block text-label uppercase text-text-tertiary mb-1.5">
            First delivery on
          </label>
          <input
            id="start"
            type="date"
            value={startDate}
            min={format(new Date(), 'yyyy-MM-dd')}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full h-11 px-4 rounded-full bg-bg-page border border-border-subtle hover:border-border-strong focus:border-primary text-text-primary outline-none transition-colors"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-label uppercase text-text-tertiary mb-1.5">Frequency</label>
          <div className="flex flex-wrap gap-1.5">
            {frequencyOptions.map((f, i) => (
              <button
                key={f.label}
                type="button"
                onClick={() => setFreqIdx(i)}
                className={clsx(
                  'px-3 h-9 rounded-full text-caption font-semibold border transition-colors',
                  i === freqIdx
                    ? 'bg-primary text-white border-primary'
                    : 'bg-bg-surface text-text-secondary border-border-subtle hover:border-border-strong hover:text-text-primary'
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {medicine && (
        <div className="mt-4 bg-primary-muted text-primary rounded-xl px-4 py-3">
          <p className="text-caption">
            <strong className="font-semibold tabular">
              {formatPrice(medicine.sellingPrice * qty)}
            </strong>{' '}
            per delivery, charged on each delivery date. Pause or skip anytime.
          </p>
        </div>
      )}

      <div className="mt-5 flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" leftIcon={<Repeat size={18} />}>
          Create subscription
        </Button>
      </div>
    </form>
  );
}

function Empty({ onAdd }) {
  return (
    <div className="bg-bg-surface border border-border-subtle rounded-2xl shadow-card p-8 text-center">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-muted text-primary">
        <Repeat size={22} />
      </span>
      <h3 className="mt-4 text-h3 text-text-primary">No subscriptions yet</h3>
      <p className="mt-2 text-body text-text-secondary max-w-sm mx-auto">
        Set up auto-delivery for chronic medication and never run out. Pause or cancel anytime.
      </p>
      <div className="mt-5 inline-flex flex-col sm:flex-row gap-2">
        <Button leftIcon={<Plus size={18} />} onClick={onAdd}>
          Create subscription
        </Button>
        <Link to="/search">
          <Button variant="secondary" leftIcon={<ShoppingBag size={18} />}>
            Browse medicines
          </Button>
        </Link>
      </div>
    </div>
  );
}
