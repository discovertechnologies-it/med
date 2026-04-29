import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { m, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Plus, Check, ShoppingBag, Sparkles } from 'lucide-react';
import clsx from 'clsx';
import Button from './Button';
import ProductImage from './ProductImage';
import { frequentlyBoughtFor } from '@/data/mockCatalog';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/utils/formatPrice';
import { springs } from '@/motion/transitions';
import { staggerContainer, fadeUp } from '@/motion/variants';

export default function FrequentlyBoughtTogether({ medicine }) {
  const partners = useMemo(() => frequentlyBoughtFor(medicine).slice(0, 3), [medicine]);
  const addItem = useCartStore((s) => s.addItem);

  // Bundle picker state — main + selected partners (default all selected)
  const [selected, setSelected] = useState(() => new Set(partners.map((p) => p.id)));

  if (partners.length === 0) return null;

  const all = [medicine, ...partners];
  const isSelected = (id) => id === medicine.id || selected.has(id);

  const toggle = (id) => {
    if (id === medicine.id) return; // main is always included
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const bundle = all.filter((m) => isSelected(m.id));
  const total = bundle.reduce((s, m) => s + m.sellingPrice, 0);
  const original = bundle.reduce((s, m) => s + m.mrp, 0);
  const youSave = original - total;

  const handleAddBundle = () => {
    bundle.forEach((m) =>
      addItem(
        {
          id: m.id,
          name: m.brand,
          price: m.sellingPrice,
          requiresPrescription: m.requiresPrescription,
        },
        1
      )
    );
    toast.success(`Added ${bundle.length} ${bundle.length === 1 ? 'item' : 'items'} to cart`);
  };

  return (
    <section className="mt-10 md:mt-14">
      <div className="flex items-end justify-between gap-3 mb-5">
        <div>
          <h2 className="inline-flex items-center gap-2 text-h2 md:text-h2-lg text-text-primary">
            <Sparkles size={22} className="text-primary" aria-hidden />
            Frequently bought together
          </h2>
          <p className="mt-1 text-body text-text-secondary">
            Other shoppers picked these alongside.
          </p>
        </div>
      </div>

      <div className="bg-bg-surface border border-border-subtle rounded-2xl shadow-card p-5 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8">
          {/* Bundle visual + select rows */}
          <m.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="lg:col-span-7 space-y-3"
          >
            {all.map((m1, idx) => (
              <m.div key={m1.id} variants={fadeUp}>
                <BundleRow
                  medicine={m1}
                  isMain={idx === 0}
                  selected={isSelected(m1.id)}
                  onToggle={() => toggle(m1.id)}
                />
              </m.div>
            ))}
          </m.div>

          {/* Bundle summary */}
          <div className="lg:col-span-5">
            <div className="bg-bg-page border border-border-subtle rounded-xl p-4 md:p-5 lg:sticky lg:top-20">
              <p className="text-label uppercase text-text-tertiary">Bundle</p>
              <div className="mt-1 flex items-baseline gap-2 tabular">
                <span className="text-h2 font-bold text-text-primary">{formatPrice(total)}</span>
                {youSave > 0 && (
                  <span className="text-caption text-text-tertiary line-through">
                    {formatPrice(original)}
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-caption text-text-secondary">
                {bundle.length} {bundle.length === 1 ? 'item' : 'items'}
                {youSave > 0 && (
                  <>
                    {' '}
                    &middot; <span className="text-success font-semibold">save {formatPrice(youSave)}</span>
                  </>
                )}
              </p>
              <div className="mt-4">
                <Button
                  fullWidth
                  leftIcon={<ShoppingBag size={18} />}
                  onClick={handleAddBundle}
                  disabled={bundle.length === 0}
                >
                  Add bundle to cart
                </Button>
              </div>
              <p className="mt-2 text-caption text-text-tertiary text-center">
                Uncheck items to remove them from the bundle.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BundleRow({ medicine, isMain, selected, onToggle }) {
  return (
    <m.div
      whileTap={isMain ? undefined : { scale: 0.99 }}
      transition={springs.soft}
      className={clsx(
        'flex items-center gap-3 p-3 rounded-xl border-2 transition-colors',
        selected
          ? 'border-primary bg-primary-muted/40'
          : 'border-border-subtle bg-bg-page'
      )}
    >
      <Link to={`/medicine/${medicine.id}`} className="shrink-0 h-14 w-14">
        <ProductImage
          medicine={medicine}
          variant="front"
          size="sm"
          withGuides={false}
          rounded="rounded-lg"
        />
      </Link>
      <div className="min-w-0 flex-1">
        <Link
          to={`/medicine/${medicine.id}`}
          className="text-body font-semibold text-text-primary line-clamp-1 hover:text-primary"
        >
          {medicine.brand}
        </Link>
        <p className="text-caption text-text-secondary line-clamp-1">{medicine.salt}</p>
        {isMain && (
          <p className="mt-0.5 text-caption text-primary font-semibold">This item</p>
        )}
      </div>
      <div className="text-right tabular shrink-0">
        <p className="text-body font-semibold text-text-primary">
          {formatPrice(medicine.sellingPrice)}
        </p>
      </div>
      {!isMain && (
        <button
          type="button"
          onClick={onToggle}
          aria-pressed={selected}
          aria-label={selected ? `Remove ${medicine.brand} from bundle` : `Add ${medicine.brand} to bundle`}
          className={clsx(
            'shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors',
            selected
              ? 'bg-primary border-primary text-white'
              : 'bg-bg-surface border-border-strong text-text-tertiary hover:border-primary hover:text-primary'
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            <m.span
              key={selected ? 'on' : 'off'}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={springs.snappy}
            >
              {selected ? <Check size={14} /> : <Plus size={14} />}
            </m.span>
          </AnimatePresence>
        </button>
      )}
    </m.div>
  );
}
