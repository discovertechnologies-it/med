import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { m, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  Trash2,
  ShieldAlert,
  Plus,
  Minus,
  ArrowRight,
  Tag,
  Truck,
  X,
  ShoppingBag,
  Upload,
  Search,
} from 'lucide-react';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import ProductImage from '@/components/ProductImage';
import EmptyCartIllustration from '@/components/EmptyCartIllustration';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore, selectIsAuthenticated } from '@/store/useAuthStore';
import { findMedicine } from '@/data/mockCatalog';
import { findCoupon, applyCouponToTotals, coupons as allCoupons } from '@/data/mockCoupons';
import { formatPrice } from '@/utils/formatPrice';
import { staggerContainer, fadeUp } from '@/motion/variants';
import { springs } from '@/motion/transitions';

const FREE_DELIVERY_THRESHOLD = 500;
const DELIVERY_FEE = 49;

export default function Cart() {
  const items = useCartStore((s) => s.items);
  const couponCode = useCartStore((s) => s.couponCode);
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const applyCoupon = useCartStore((s) => s.applyCoupon);
  const clear = useCartStore((s) => s.clear);

  const navigate = useNavigate();
  const isAuthed = useAuthStore(selectIsAuthenticated);

  const goToCheckout = () => {
    if (isAuthed) navigate('/checkout');
    else navigate('/auth/login?next=/checkout');
  };

  const enriched = useMemo(
    () => items.map((i) => ({ ...i, medicine: findMedicine(i.id) })).filter((i) => i.medicine),
    [items]
  );

  const hasRx = items.some((i) => i.requiresPrescription);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const totalQty = items.reduce((sum, i) => sum + i.qty, 0);

  const coupon = useMemo(() => findCoupon(couponCode), [couponCode]);
  const couponResult = useMemo(
    () => applyCouponToTotals(coupon, subtotal),
    [coupon, subtotal]
  );

  const baseDelivery = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const deliveryFee = couponResult.freeDelivery ? 0 : baseDelivery;
  const total = Math.max(0, subtotal - couponResult.discount + deliveryFee);
  const amountToFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);

  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <main className="mx-auto max-w-screen-xl px-4 md:px-6 lg:px-8 py-6 md:py-10 pb-32 md:pb-12">
      {/* Title row */}
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-h1 md:text-h1-lg text-text-primary">Your cart</h1>
          <p className="mt-1 text-body text-text-secondary">
            {totalQty} {totalQty === 1 ? 'item' : 'items'} ready for checkout
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            clear();
            toast('Cart cleared');
          }}
          className="text-caption font-semibold text-text-secondary hover:text-danger transition-colors"
        >
          Clear cart
        </button>
      </div>

      {/* Free delivery progress */}
      {amountToFreeDelivery > 0 && (
        <div className="mt-4 bg-primary-muted text-primary rounded-xl px-4 py-3 flex items-center gap-3">
          <Truck size={18} className="shrink-0" aria-hidden />
          <p className="text-caption">
            Add{' '}
            <strong className="font-semibold tabular">{formatPrice(amountToFreeDelivery)}</strong>{' '}
            more to qualify for free delivery.
          </p>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* Items column */}
        <section className="lg:col-span-7 xl:col-span-8 space-y-3">
          {hasRx && <RxBanner />}

          <m.ul
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-3"
          >
            <AnimatePresence initial={false}>
              {enriched.map((row) => (
                <m.li
                  key={row.id}
                  layout
                  variants={fadeUp}
                  exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                >
                  <CartLine
                    row={row}
                    onInc={() => updateQty(row.id, row.qty + 1)}
                    onDec={() => {
                      if (row.qty <= 1) removeItem(row.id);
                      else updateQty(row.id, row.qty - 1);
                    }}
                    onRemove={() => {
                      removeItem(row.id);
                      toast(`Removed ${row.medicine.brand}`, {
                        action: {
                          label: 'Undo',
                          onClick: () =>
                            useCartStore.getState().addItem(
                              {
                                id: row.medicine.id,
                                name: row.medicine.brand,
                                price: row.medicine.sellingPrice,
                                requiresPrescription: row.medicine.requiresPrescription,
                              },
                              row.qty
                            ),
                        },
                      });
                    }}
                  />
                </m.li>
              ))}
            </AnimatePresence>
          </m.ul>

          <Link
            to="/search"
            className="inline-flex items-center gap-1.5 text-caption font-semibold text-primary hover:text-primary-hover mt-2"
          >
            <Search size={14} />
            Continue shopping
          </Link>
        </section>

        {/* Summary column */}
        <aside className="lg:col-span-5 xl:col-span-4">
          <SummaryCard
            subtotal={subtotal}
            couponCode={couponCode}
            coupon={coupon}
            couponResult={couponResult}
            deliveryFee={deliveryFee}
            baseDelivery={baseDelivery}
            total={total}
            applyCoupon={applyCoupon}
            goToCheckout={goToCheckout}
            isAuthed={isAuthed}
            hasRx={hasRx}
          />
        </aside>
      </div>

      {/* Mobile sticky CTA */}
      <div className="md:hidden fixed inset-x-0 bottom-0 z-40 bg-bg-surface/95 backdrop-blur-md border-t border-border-subtle px-4 py-3 flex items-center gap-3">
        <div className="tabular">
          <p className="text-body-lg font-bold text-text-primary">{formatPrice(total)}</p>
          <p className="text-caption text-text-tertiary">
            {totalQty} {totalQty === 1 ? 'item' : 'items'}
          </p>
        </div>
        <div className="ml-auto">
          <Button rightIcon={<ArrowRight size={18} />} onClick={goToCheckout}>
            {isAuthed ? 'Checkout' : 'Sign in to checkout'}
          </Button>
        </div>
      </div>
    </main>
  );
}

function RxBanner() {
  return (
    <div className="bg-warning-muted border border-warning/20 rounded-xl px-4 py-3 flex items-start gap-3">
      <span className="mt-0.5 shrink-0 text-warning">
        <ShieldAlert size={18} aria-hidden />
      </span>
      <div className="text-caption">
        <p className="font-semibold text-warning">Prescription required</p>
        <p className="text-text-secondary mt-0.5">
          Some items in your cart need a valid prescription. Upload one before checkout, or our
          pharmacist will request it after order.
        </p>
      </div>
      <Link
        to="/prescriptions"
        className="ml-auto shrink-0 inline-flex items-center gap-1 text-caption font-semibold text-warning hover:text-warning/80"
      >
        <Upload size={14} />
        Upload
      </Link>
    </div>
  );
}

function CartLine({ row, onInc, onDec, onRemove }) {
  const { medicine, qty } = row;
  return (
    <article className="bg-bg-surface border border-border-subtle rounded-xl shadow-card overflow-hidden flex">
      <Link to={`/medicine/${medicine.id}`} className="shrink-0 w-24 sm:w-28">
        <ProductImage
          medicine={medicine}
          variant="front"
          size="sm"
          withGuides={false}
          rounded=""
        />
      </Link>
      <div className="flex-1 min-w-0 p-3 sm:p-4 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              to={`/medicine/${medicine.id}`}
              className="text-body font-semibold text-text-primary line-clamp-1 hover:text-primary"
            >
              {medicine.brand}
            </Link>
            <p className="text-caption text-text-secondary line-clamp-1">{medicine.salt}</p>
            <p className="text-caption text-text-tertiary line-clamp-1">{medicine.packSize}</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {medicine.requiresPrescription && (
                <Badge variant="warning" icon={<ShieldAlert size={10} />}>
                  Rx
                </Badge>
              )}
              {medicine.isGeneric && <Badge variant="primary">Generic</Badge>}
            </div>
          </div>
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${medicine.brand} from cart`}
            className="shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-full text-text-tertiary hover:bg-danger-muted hover:text-danger transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="mt-auto pt-3 flex items-end justify-between gap-2">
          <QtyStepper qty={qty} onInc={onInc} onDec={onDec} />
          <div className="text-right tabular">
            <p className="text-body-lg font-semibold text-text-primary">
              {formatPrice(medicine.sellingPrice * qty)}
            </p>
            {qty > 1 && (
              <p className="text-caption text-text-tertiary">
                {formatPrice(medicine.sellingPrice)} each
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function QtyStepper({ qty, onInc, onDec }) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-bg-muted p-1">
      <m.button
        type="button"
        onClick={onDec}
        whileTap={{ scale: 0.9 }}
        transition={springs.soft}
        aria-label={qty <= 1 ? 'Remove item' : 'Decrease quantity'}
        className="h-8 w-8 inline-flex items-center justify-center rounded-full text-text-primary hover:bg-bg-surface"
      >
        {qty <= 1 ? <Trash2 size={14} /> : <Minus size={14} />}
      </m.button>
      <span
        className="min-w-7 text-center text-body font-semibold tabular text-text-primary"
        aria-live="polite"
      >
        {qty}
      </span>
      <m.button
        type="button"
        onClick={onInc}
        whileTap={{ scale: 0.9 }}
        transition={springs.soft}
        aria-label="Increase quantity"
        disabled={qty >= 10}
        className="h-8 w-8 inline-flex items-center justify-center rounded-full text-text-primary hover:bg-bg-surface disabled:text-text-tertiary disabled:cursor-not-allowed"
      >
        <Plus size={14} />
      </m.button>
    </div>
  );
}

function SummaryCard({
  subtotal,
  couponCode,
  coupon,
  couponResult,
  deliveryFee,
  baseDelivery,
  total,
  applyCoupon,
  goToCheckout,
  isAuthed,
  hasRx,
}) {
  return (
    <div className="bg-bg-surface border border-border-subtle rounded-2xl shadow-card p-5 md:p-6 lg:sticky lg:top-20">
      <h2 className="text-h2 text-text-primary">Order summary</h2>

      <CouponInput
        couponCode={couponCode}
        coupon={coupon}
        couponResult={couponResult}
        applyCoupon={applyCoupon}
      />

      <dl className="mt-5 space-y-2.5 text-body">
        <Row label="Subtotal">{formatPrice(subtotal)}</Row>
        {couponResult.discount > 0 && (
          <Row label={`Coupon (${coupon?.code})`} valueClassName="text-success">
            &minus; {formatPrice(couponResult.discount)}
          </Row>
        )}
        <Row
          label="Delivery"
          valueClassName={deliveryFee === 0 ? 'text-success' : ''}
        >
          {deliveryFee === 0
            ? baseDelivery === 0
              ? 'Free'
              : 'Free (coupon)'
            : formatPrice(deliveryFee)}
        </Row>
      </dl>

      <div className="mt-4 pt-4 border-t border-border-subtle flex items-baseline justify-between">
        <span className="text-h3 text-text-primary">Total</span>
        <span className="text-h2 font-bold text-text-primary tabular">{formatPrice(total)}</span>
      </div>
      <p className="mt-1 text-caption text-text-tertiary text-right">Inclusive of taxes</p>

      <div className="mt-5 hidden md:block">
        <Button
          fullWidth
          size="lg"
          rightIcon={<ArrowRight size={18} />}
          onClick={goToCheckout}
        >
          {isAuthed ? 'Proceed to checkout' : 'Sign in to checkout'}
        </Button>
      </div>

      {hasRx && (
        <p className="mt-3 text-caption text-text-tertiary text-center">
          Prescription verification happens after payment. Refund within 24h if rejected.
        </p>
      )}
    </div>
  );
}

function Row({ label, children, valueClassName = '' }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-text-secondary">{label}</dt>
      <dd className={`tabular font-semibold text-text-primary ${valueClassName}`}>{children}</dd>
    </div>
  );
}

function CouponInput({ couponCode, coupon, couponResult, applyCoupon }) {
  const [input, setInput] = useState('');

  const handleApply = (e) => {
    e.preventDefault();
    const code = input.trim().toUpperCase();
    if (!code) return;
    const found = findCoupon(code);
    if (!found) {
      toast.error(`Coupon "${code}" not valid`);
      return;
    }
    applyCoupon(code);
    setInput('');
    toast.success(`Coupon ${code} applied`);
  };

  // Active coupon chip
  if (couponCode && coupon) {
    const error = couponResult.error;
    return (
      <div className="mt-4">
        <p className="text-label uppercase text-text-tertiary mb-1.5">Coupon</p>
        <div
          className={`flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 border ${
            error
              ? 'bg-danger-muted border-danger/20 text-danger'
              : 'bg-success-muted border-success/20 text-success'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <Tag size={16} aria-hidden className="shrink-0" />
            <div className="min-w-0">
              <p className="text-body font-semibold tabular">{couponCode}</p>
              <p className="text-caption opacity-80 line-clamp-1">{error || coupon.label}</p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Remove coupon"
            onClick={() => {
              applyCoupon(null);
              toast('Coupon removed');
            }}
            className="shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/40"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <form onSubmit={handleApply}>
        <p className="text-label uppercase text-text-tertiary mb-1.5">Have a coupon?</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter code"
            autoComplete="off"
            spellCheck={false}
            className="flex-1 h-11 px-4 rounded-full bg-bg-page border border-border-subtle hover:border-border-strong focus:border-primary text-text-primary placeholder:text-text-tertiary uppercase tracking-wide text-body transition-colors"
          />
          <Button type="submit" variant="secondary" disabled={!input.trim()}>
            Apply
          </Button>
        </div>
      </form>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {allCoupons.map((c) => (
          <button
            key={c.code}
            type="button"
            onClick={() => {
              applyCoupon(c.code);
              toast.success(`Coupon ${c.code} applied`);
            }}
            className="text-caption font-semibold text-primary hover:text-primary-hover bg-primary-muted hover:bg-primary-muted/70 rounded-full px-2.5 py-1 tabular transition-colors"
          >
            {c.code}
          </button>
        ))}
      </div>
    </div>
  );
}

function EmptyCart() {
  return (
    <main className="mx-auto max-w-screen-md px-4 py-16 md:py-24 text-center">
      <EmptyCartIllustration className="w-56 h-auto mx-auto" />
      <h1 className="mt-6 text-h1 md:text-h1-lg text-text-primary">Your cart is empty</h1>
      <p className="mt-3 text-body-lg text-text-secondary max-w-md mx-auto">
        Search for medicines, pick from popular categories, or upload a prescription and we will
        find what you need.
      </p>
      <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/search">
          <Button leftIcon={<ShoppingBag size={18} />}>Start shopping</Button>
        </Link>
        <Link to="/prescriptions">
          <Button variant="secondary" leftIcon={<Upload size={18} />}>
            Upload prescription
          </Button>
        </Link>
      </div>
    </main>
  );
}
