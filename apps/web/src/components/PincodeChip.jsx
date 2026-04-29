import { useEffect, useRef, useState } from 'react';
import { m, AnimatePresence, useReducedMotion } from 'framer-motion';
import { toast } from 'sonner';
import { MapPin, X, Loader2, Check, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';
import { useUIStore } from '@/store/useUIStore';
import { checkPincode, etaLabel } from '@/data/mockPincodes';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { springs, baseTransition } from '@/motion/transitions';

export default function PincodeChip() {
  const pincode = useUIStore((s) => s.pincode);
  const setPincode = useUIStore((s) => s.setPincode);
  const [open, setOpen] = useState(false);

  const meta = pincode ? checkPincode(pincode) : null;
  const cityLabel = meta?.serviceable ? `${pincode} · ${meta.city}` : pincode || 'Set pincode';
  const isOutOfArea = pincode && !meta?.serviceable;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={pincode ? `Delivering to ${pincode}` : 'Set delivery pincode'}
        className={clsx(
          'inline-flex items-center gap-1.5 h-9 px-3 rounded-full text-caption font-semibold transition-colors',
          isOutOfArea
            ? 'bg-warning-muted text-warning hover:bg-warning-muted/70'
            : pincode
              ? 'bg-bg-muted text-text-primary hover:bg-border-subtle'
              : 'bg-primary-muted text-primary hover:bg-primary-muted/70'
        )}
      >
        <MapPin size={14} aria-hidden />
        <span className="line-clamp-1 max-w-[140px] tabular">{cityLabel}</span>
      </button>

      <PincodeDialog
        open={open}
        initial={pincode}
        onClose={() => setOpen(false)}
        onSet={(p) => {
          setPincode(p);
          setOpen(false);
        }}
      />
    </>
  );
}

function PincodeDialog({ open, initial, onClose, onSet }) {
  const reduce = useReducedMotion();
  const [value, setValue] = useState(initial || '');
  const [busy, setBusy] = useState(false);
  const inputRef = useRef(null);

  useBodyScrollLock(open);

  useEffect(() => {
    if (open) {
      setValue(initial || '');
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [open, initial]);

  const result = /^\d{6}$/.test(value) ? checkPincode(value) : null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(value)) {
      toast.error('Enter a 6-digit pincode');
      return;
    }
    setBusy(true);
    setTimeout(() => {
      const r = checkPincode(value);
      setBusy(false);
      if (!r?.serviceable) {
        toast(`We will notify you when ${value} is serviceable`);
      } else {
        toast.success(`Delivering to ${r.city}`);
      }
      onSet(value);
    }, 350);
  };

  return (
    <AnimatePresence>
      {open && (
        <m.div
          className="fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
          aria-label="Set delivery pincode"
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
            className="absolute inset-x-3 top-20 md:left-1/2 md:right-auto md:-translate-x-1/2 md:top-32 md:w-full md:max-w-md"
          >
            <div className="bg-bg-surface rounded-2xl shadow-pop border border-border-subtle p-5 md:p-6">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-h3 text-text-primary">Delivery pincode</h3>
                  <p className="mt-0.5 text-caption text-text-secondary">
                    We will show ETAs and serviceable products for this area.
                  </p>
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

              <form onSubmit={handleSubmit} noValidate>
                <label
                  htmlFor="pincode-input"
                  className="block text-label uppercase text-text-tertiary mb-1.5"
                >
                  Enter pincode
                </label>
                <input
                  id="pincode-input"
                  ref={inputRef}
                  type="tel"
                  inputMode="numeric"
                  maxLength={6}
                  value={value}
                  onChange={(e) => setValue(e.target.value.replace(/\D/g, ''))}
                  placeholder="560038"
                  className="w-full h-11 px-4 rounded-full bg-bg-page border border-border-subtle hover:border-border-strong focus:border-primary text-text-primary tabular outline-none transition-colors"
                />

                {result && (
                  <div
                    className={clsx(
                      'mt-3 rounded-xl px-4 py-3 flex items-start gap-2.5 text-caption',
                      result.serviceable
                        ? 'bg-success-muted text-success'
                        : 'bg-warning-muted text-warning'
                    )}
                  >
                    {result.serviceable ? (
                      <Check size={16} aria-hidden className="mt-0.5 shrink-0" />
                    ) : (
                      <AlertTriangle size={16} aria-hidden className="mt-0.5 shrink-0" />
                    )}
                    <div>
                      <p className="font-semibold">
                        {result.serviceable
                          ? `Delivers to ${result.city}, ${result.state}`
                          : 'Not serviceable yet'}
                      </p>
                      <p className="opacity-90">
                        {result.serviceable
                          ? `Standard delivery ${etaLabel(result.etaHours)}`
                          : `We will notify you when we deliver to ${value}`}
                      </p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={busy || !/^\d{6}$/.test(value)}
                  className="mt-4 w-full h-11 inline-flex items-center justify-center gap-2 rounded-full bg-primary text-white font-semibold disabled:bg-text-tertiary disabled:cursor-not-allowed hover:bg-primary-hover transition-colors"
                >
                  {busy && <Loader2 size={16} className="animate-spin" />}
                  {busy ? 'Checking' : 'Set pincode'}
                </button>
              </form>
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
