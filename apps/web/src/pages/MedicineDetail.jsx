import { useEffect, useMemo } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { m } from 'framer-motion';
import { toast } from 'sonner';
import {
  ShieldAlert,
  Tag,
  ArrowLeft,
  Plus,
  Minus,
  ShieldCheck,
  TrendingDown,
  Truck,
  Info,
  CheckCircle2,
  AlertTriangle,
  Thermometer,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import MedicineCard from '@/components/MedicineCard';
import ProductGallery from '@/components/ProductGallery';
import WishlistButton from '@/components/WishlistButton';
import StarRating from '@/components/StarRating';
import ReviewsSection from '@/components/ReviewsSection';
import RecentlyViewed from '@/components/RecentlyViewed';
import FrequentlyBoughtTogether from '@/components/FrequentlyBoughtTogether';
import { getReviews, ratingSummary } from '@/data/mockReviews';
import { findMedicine, alternativesFor } from '@/data/mockCatalog';
import { formatPrice, discountPercent } from '@/utils/formatPrice';
import { useCartStore } from '@/store/useCartStore';
import { useRecentStore } from '@/store/useRecentStore';
import { staggerContainer, fadeUp } from '@/motion/variants';
import { springs } from '@/motion/transitions';

export default function MedicineDetail() {
  const { id } = useParams();
  const medicine = useMemo(() => findMedicine(id), [id]);

  const item = useCartStore((s) => s.items.find((i) => i.id === id));
  const addItem = useCartStore((s) => s.addItem);
  const updateQty = useCartStore((s) => s.updateQty);
  const trackView = useRecentStore((s) => s.addView);

  useEffect(() => {
    if (medicine) trackView(medicine.id);
  }, [medicine, trackView]);

  if (!medicine) {
    return <Navigate to="/search" replace />;
  }

  const discount = discountPercent(medicine.mrp, medicine.sellingPrice);
  const alts = alternativesFor(medicine).slice(0, 4);
  const reviewSummary = useMemo(() => ratingSummary(getReviews(medicine.id)), [medicine.id]);
  const cheapestAlt = alts.find((a) => a.sellingPrice < medicine.sellingPrice);
  const savings = cheapestAlt ? medicine.sellingPrice - cheapestAlt.sellingPrice : 0;
  const savingsPct = cheapestAlt
    ? Math.round((savings / medicine.sellingPrice) * 100)
    : 0;

  const handleAdd = () => {
    addItem(
      {
        id: medicine.id,
        name: medicine.brand,
        price: medicine.sellingPrice,
        requiresPrescription: medicine.requiresPrescription,
      },
      1
    );
    toast.success(`Added ${medicine.brand} to cart`);
  };

  const inc = () => updateQty(medicine.id, (item?.qty ?? 0) + 1);
  const dec = () => {
    if (!item) return;
    if (item.qty <= 1) {
      useCartStore.getState().removeItem(medicine.id);
    } else {
      updateQty(medicine.id, item.qty - 1);
    }
  };

  return (
    <main className="mx-auto max-w-screen-xl px-4 md:px-6 lg:px-8 py-4 md:py-8 pb-32 md:pb-12">
      <Link
        to="/search"
        className="inline-flex items-center gap-1 text-caption font-semibold text-text-secondary hover:text-text-primary"
      >
        <ArrowLeft size={14} />
        Back to search
      </Link>

      <div className="mt-4 md:mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
        {/* Gallery */}
        <div className="lg:col-span-5">
          <ProductGallery medicine={medicine} />
        </div>

        {/* Details */}
        <div className="lg:col-span-7">
          <div className="flex flex-wrap items-center gap-2">
            {medicine.requiresPrescription && (
              <Badge variant="warning" icon={<ShieldAlert size={12} />}>
                Prescription required
              </Badge>
            )}
            {medicine.isGeneric && (
              <Badge variant="primary" icon={<Sparkles size={12} />}>
                Generic
              </Badge>
            )}
            {discount > 0 && (
              <Badge variant="accent" icon={<Tag size={12} />}>
                {discount}% off
              </Badge>
            )}
            {medicine.inStock && (
              <Badge variant="success" icon={<CheckCircle2 size={12} />}>
                In stock
              </Badge>
            )}
          </div>

          <h1 className="mt-3 text-h1 md:text-h1-lg text-text-primary">{medicine.brand}</h1>
          <p className="mt-1 text-body-lg text-text-secondary">{medicine.salt}</p>
          <p className="mt-1 text-body text-text-tertiary">
            {medicine.manufacturer} &middot; {medicine.packSize}
          </p>

          {reviewSummary.total > 0 && (
            <a href="#reviews" className="mt-2 inline-flex items-center gap-2 group">
              <StarRating value={reviewSummary.avg} size={16} />
              <span className="text-caption text-text-secondary group-hover:text-text-primary tabular">
                {reviewSummary.avg.toFixed(1)} ({reviewSummary.total}{' '}
                {reviewSummary.total === 1 ? 'review' : 'reviews'})
              </span>
            </a>
          )}

          <div className="mt-5 flex flex-wrap items-end gap-x-3 gap-y-1 tabular">
            <span className="text-display md:text-display-lg text-text-primary font-bold">
              {formatPrice(medicine.sellingPrice)}
            </span>
            {discount > 0 && (
              <span className="text-body-lg text-text-tertiary line-through pb-1">
                {formatPrice(medicine.mrp)}
              </span>
            )}
            {discount > 0 && (
              <span className="text-body-lg font-semibold text-success pb-1">
                You save {formatPrice(medicine.mrp - medicine.sellingPrice)}
              </span>
            )}
          </div>
          <p className="mt-1 text-caption text-text-tertiary">Inclusive of all taxes.</p>

          {cheapestAlt && <SaveCallout cheaper={cheapestAlt} savings={savings} pct={savingsPct} />}

          {/* Desktop add-to-cart */}
          <div className="mt-6 hidden md:flex items-center gap-3">
            {item ? (
              <QtyStepper qty={item.qty} onInc={inc} onDec={dec} />
            ) : (
              <Button onClick={handleAdd} size="lg">
                Add to cart
              </Button>
            )}
            <WishlistButton
              medicineId={medicine.id}
              medicineName={medicine.brand}
              size="lg"
              variant="inline"
            />
          </div>

          {/* Trust strip */}
          <ul className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: <ShieldCheck size={16} />, label: 'Pharmacist verified' },
              { icon: <Truck size={16} />, label: '24 to 48 hour delivery' },
              { icon: <Tag size={16} />, label: '7-day return on damage' },
            ].map((t) => (
              <li
                key={t.label}
                className="flex items-center gap-2 text-caption text-text-secondary bg-bg-muted rounded-lg px-3 py-2"
              >
                <span className="text-primary">{t.icon}</span>
                {t.label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Sections */}
      <section className="mt-10 md:mt-14 grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <SectionCard icon={<Info size={18} />} title="About">
          <p className="text-body text-text-secondary">{medicine.description}</p>
        </SectionCard>
        <SectionCard icon={<CheckCircle2 size={18} />} title="Uses">
          <ul className="space-y-1.5">
            {medicine.uses.map((u) => (
              <li
                key={u}
                className="text-body text-text-secondary flex items-start gap-2"
              >
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" aria-hidden />
                {u}
              </li>
            ))}
          </ul>
        </SectionCard>
        <SectionCard icon={<AlertTriangle size={18} />} title="Side effects">
          <ul className="space-y-1.5">
            {medicine.sideEffects.map((s) => (
              <li
                key={s}
                className="text-body text-text-secondary flex items-start gap-2"
              >
                <span
                  className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-warning"
                  aria-hidden
                />
                {s}
              </li>
            ))}
          </ul>
        </SectionCard>
        <SectionCard icon={<Thermometer size={18} />} title="Storage" className="lg:col-span-3">
          <p className="text-body text-text-secondary">{medicine.storage}</p>
        </SectionCard>
      </section>

      {/* Reviews */}
      <div id="reviews" className="scroll-mt-20">
        <ReviewsSection medicine={medicine} />
      </div>

      {/* Cheaper alternatives */}
      {alts.length > 0 && (
        <section className="mt-10 md:mt-14">
          <h2 className="text-h2 md:text-h2-lg text-text-primary">Cheaper alternatives</h2>
          <p className="mt-1 text-body text-text-secondary">
            Same composition, often at a lower price.
          </p>
          <m.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-50px' }}
            className="mt-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 items-stretch"
          >
            {alts.map((m2) => (
              <m.div key={m2.id} variants={fadeUp} className="h-full">
                <MedicineCard medicine={m2} />
              </m.div>
            ))}
          </m.div>
        </section>
      )}

      {/* Frequently bought together */}
      <FrequentlyBoughtTogether medicine={medicine} />

      {/* Recently viewed (excludes current) */}
      <div className="mt-10 md:mt-14 -mx-4 md:-mx-6 lg:-mx-8">
        <RecentlyViewed excludeId={medicine.id} />
      </div>

      {/* Mobile sticky CTA */}
      <div className="md:hidden fixed inset-x-0 bottom-0 z-40 bg-bg-surface/95 backdrop-blur-md border-t border-border-subtle px-4 py-3 flex items-center gap-3">
        <div className="tabular">
          <p className="text-body-lg font-bold text-text-primary">
            {formatPrice(medicine.sellingPrice)}
          </p>
          <p className="text-caption text-text-tertiary line-clamp-1">{medicine.packSize}</p>
        </div>
        <div className="ml-auto">
          {item ? (
            <QtyStepper qty={item.qty} onInc={inc} onDec={dec} />
          ) : (
            <Button onClick={handleAdd}>Add to cart</Button>
          )}
        </div>
      </div>
    </main>
  );
}

function SaveCallout({ cheaper, savings, pct }) {
  return (
    <Link
      to={`/medicine/${cheaper.id}`}
      className="mt-5 group flex items-center gap-4 bg-primary text-white rounded-2xl p-4 md:p-5 hover:bg-primary-hover transition-colors"
    >
      <div className="hidden sm:flex shrink-0 h-12 w-12 items-center justify-center rounded-full bg-white/15">
        <TrendingDown size={22} aria-hidden />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-caption uppercase tracking-wide text-white/80">Cheaper alternative</p>
        <p className="text-body-lg font-semibold mt-0.5">
          Save {formatPrice(savings)} ({pct}%) with {cheaper.brand}
        </p>
        <p className="text-caption text-white/85 mt-0.5">
          Same composition &middot; {cheaper.isGeneric ? 'Generic' : 'Branded'} &middot;{' '}
          {cheaper.manufacturer}
        </p>
      </div>
      <ArrowRight size={20} className="shrink-0 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

function SectionCard({ icon, title, children, className = '' }) {
  return (
    <div
      className={`bg-bg-surface border border-border-subtle rounded-2xl p-5 md:p-6 shadow-card ${className}`}
    >
      <div className="flex items-center gap-2.5">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-muted text-primary">
          {icon}
        </span>
        <h3 className="text-h3 text-text-primary">{title}</h3>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function QtyStepper({ qty, onInc, onDec }) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-primary text-white p-1">
      <m.button
        type="button"
        onClick={onDec}
        whileTap={{ scale: 0.9 }}
        transition={springs.soft}
        aria-label="Decrease quantity"
        className="h-9 w-9 inline-flex items-center justify-center rounded-full hover:bg-primary-hover"
      >
        <Minus size={16} />
      </m.button>
      <span className="min-w-8 text-center text-body font-semibold tabular" aria-live="polite">
        {qty}
      </span>
      <m.button
        type="button"
        onClick={onInc}
        whileTap={{ scale: 0.9 }}
        transition={springs.soft}
        aria-label="Increase quantity"
        className="h-9 w-9 inline-flex items-center justify-center rounded-full hover:bg-primary-hover"
      >
        <Plus size={16} />
      </m.button>
    </div>
  );
}
