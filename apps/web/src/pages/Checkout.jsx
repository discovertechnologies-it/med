import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { m } from 'framer-motion';
import { toast } from 'sonner';
import {
  ArrowLeft,
  ArrowRight,
  CreditCard,
  Banknote,
  Smartphone,
  Truck,
  Zap,
  MapPin,
  ShieldAlert,
  ShieldCheck,
  Plus,
} from 'lucide-react';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import RadioCard from '@/components/RadioCard';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useOrderStore } from '@/store/useOrderStore';
import { useAddressStore, selectDefaultAddress } from '@/store/useAddressStore';
import { findMedicine } from '@/data/mockCatalog';
import { findCoupon, applyCouponToTotals } from '@/data/mockCoupons';
import { formatPrice } from '@/utils/formatPrice';
import { fadeUp, staggerContainer } from '@/motion/variants';

const FREE_DELIVERY_THRESHOLD = 500;
const STANDARD_FEE = 49;
const EXPRESS_FEE = 99;

const deliveryOptions = [
  {
    id: 'standard',
    label: 'Standard',
    icon: <Truck size={18} />,
    eta: '24 to 48 hours',
    fee: STANDARD_FEE,
  },
  {
    id: 'express',
    label: 'Express',
    icon: <Zap size={18} />,
    eta: 'Within 2 hours',
    fee: EXPRESS_FEE,
  },
];

const paymentOptions = [
  { id: 'upi', label: 'UPI', icon: <Smartphone size={18} />, hint: 'Any UPI app' },
  { id: 'card', label: 'Credit or debit card', icon: <CreditCard size={18} />, hint: 'Visa, Mastercard, Rupay' },
  { id: 'cod', label: 'Cash on delivery', icon: <Banknote size={18} />, hint: 'Pay when you receive' },
];

export default function Checkout() {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const couponCode = useCartStore((s) => s.couponCode);
  const clearCart = useCartStore((s) => s.clear);
  const user = useAuthStore((s) => s.user);
  const placeOrder = useOrderStore((s) => s.place);
  const addresses = useAddressStore((s) => s.addresses);
  const initialAddress = useAddressStore(selectDefaultAddress);

  const [addressId, setAddressId] = useState(() => initialAddress?.id);
  const [deliveryId, setDeliveryId] = useState('standard');
  const [paymentId, setPaymentId] = useState('upi');
  const [placing, setPlacing] = useState(false);

  const enriched = useMemo(
    () => items.map((i) => ({ ...i, medicine: findMedicine(i.id) })).filter((i) => i.medicine),
    [items]
  );

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-screen-md px-4 py-16 text-center">
        <h1 className="text-h1 text-text-primary">Cart is empty</h1>
        <p className="mt-2 text-body text-text-secondary">
          Add medicines to your cart before checkout.
        </p>
        <Link to="/search" className="inline-block mt-6">
          <Button>Start shopping</Button>
        </Link>
      </main>
    );
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const totalQty = items.reduce((sum, i) => sum + i.qty, 0);
  const hasRx = items.some((i) => i.requiresPrescription);

  const coupon = findCoupon(couponCode);
  const couponResult = applyCouponToTotals(coupon, subtotal);

  const delivery = deliveryOptions.find((d) => d.id === deliveryId);
  const baseDelivery =
    deliveryId === 'standard' && subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : delivery.fee;
  const deliveryFee = couponResult.freeDelivery && deliveryId === 'standard' ? 0 : baseDelivery;
  const total = Math.max(0, subtotal - couponResult.discount + deliveryFee);

  const address = addresses.find((a) => a.id === addressId) ?? addresses[0];

  const handlePlace = async () => {
    if (!address) {
      toast.error('Select a delivery address');
      return;
    }
    setPlacing(true);
    const id = `MED${Date.now().toString(36).toUpperCase().slice(-6)}`;
    const now = new Date().toISOString();
    const order = {
      id,
      placedAt: now,
      status: hasRx ? 'rx_review' : 'confirmed',
      items: enriched.map((e) => ({
        id: e.medicine.id,
        brand: e.medicine.brand,
        salt: e.medicine.salt,
        qty: e.qty,
        price: e.medicine.sellingPrice,
        requiresPrescription: e.medicine.requiresPrescription,
      })),
      address,
      delivery: { id: delivery.id, label: delivery.label, eta: delivery.eta, fee: deliveryFee },
      payment: { id: paymentId, label: paymentOptions.find((p) => p.id === paymentId).label },
      coupon: coupon ? { code: coupon.code, discount: couponResult.discount } : null,
      totals: { subtotal, discount: couponResult.discount, deliveryFee, total },
      hasRx,
      userId: user?.id,
    };

    await toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1400)).then(() => {
        placeOrder(order);
        clearCart();
        return order;
      }),
      {
        loading: 'Placing your order',
        success: `Order ${id} placed`,
        error: 'Could not place order. Try again.',
      }
    );
    setPlacing(false);
    navigate(`/orders/${id}`, { replace: true });
  };

  return (
    <main className="mx-auto max-w-screen-xl px-4 md:px-6 lg:px-8 py-6 md:py-10 pb-32 md:pb-12">
      <Link
        to="/cart"
        className="inline-flex items-center gap-1 text-caption font-semibold text-text-secondary hover:text-text-primary"
      >
        <ArrowLeft size={14} />
        Back to cart
      </Link>

      <h1 className="mt-3 text-h1 md:text-h1-lg text-text-primary">Checkout</h1>
      <p className="mt-1 text-body text-text-secondary">
        {totalQty} {totalQty === 1 ? 'item' : 'items'} from your cart
      </p>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          {/* Address */}
          <Section title="Delivery address" icon={<MapPin size={18} />}>
            <m.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              {addresses.map((a) => (
                <m.div key={a.id} variants={fadeUp}>
                  <RadioCard active={addressId === a.id} onClick={() => setAddressId(a.id)}>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-body font-semibold text-text-primary">{a.label}</p>
                      {a.isDefault && <Badge variant="primary">Default</Badge>}
                    </div>
                    <p className="text-caption text-text-secondary">
                      {a.line1}
                      {a.line2 ? `, ${a.line2}` : ''}
                    </p>
                    <p className="text-caption text-text-secondary">
                      {a.city}, {a.state} {a.pincode}
                    </p>
                  </RadioCard>
                </m.div>
              ))}
              <m.div variants={fadeUp}>
                <Link
                  to="/account/addresses?new=1"
                  className="h-full flex items-center justify-center gap-2 border-2 border-dashed border-border-subtle hover:border-border-strong rounded-xl p-4 text-text-secondary hover:text-text-primary transition-colors min-h-[110px]"
                >
                  <Plus size={16} />
                  <span className="text-body font-semibold">Add new address</span>
                </Link>
              </m.div>
            </m.div>
          </Section>

          {/* Delivery option */}
          <Section title="Delivery option" icon={<Truck size={18} />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {deliveryOptions.map((d) => {
                const fee =
                  d.id === 'standard' && subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : d.fee;
                return (
                  <RadioCard
                    key={d.id}
                    active={deliveryId === d.id}
                    onClick={() => setDeliveryId(d.id)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary-muted text-primary">
                        {d.icon}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-body font-semibold text-text-primary">{d.label}</p>
                        <p className="text-caption text-text-secondary">{d.eta}</p>
                      </div>
                      <span className="text-body font-semibold tabular text-text-primary">
                        {fee === 0 ? 'Free' : formatPrice(fee)}
                      </span>
                    </div>
                  </RadioCard>
                );
              })}
            </div>
          </Section>

          {/* Payment */}
          <Section title="Payment" icon={<CreditCard size={18} />}>
            <div className="space-y-3">
              {paymentOptions.map((p) => {
                const disabled = p.id === 'cod' && total > 5000;
                return (
                  <RadioCard
                    key={p.id}
                    active={paymentId === p.id && !disabled}
                    onClick={() => !disabled && setPaymentId(p.id)}
                    className={disabled ? 'opacity-60 cursor-not-allowed' : ''}
                  >
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary-muted text-primary">
                        {p.icon}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-body font-semibold text-text-primary">{p.label}</p>
                        <p className="text-caption text-text-secondary">
                          {disabled ? 'Not available above ₹5,000' : p.hint}
                        </p>
                      </div>
                    </div>
                  </RadioCard>
                );
              })}
            </div>
          </Section>

          {hasRx && (
            <div className="bg-warning-muted border border-warning/20 rounded-xl px-4 py-3 flex items-start gap-3">
              <ShieldAlert size={18} className="mt-0.5 shrink-0 text-warning" aria-hidden />
              <div className="text-caption">
                <p className="font-semibold text-warning">Prescription review</p>
                <p className="text-text-secondary mt-0.5">
                  A pharmacist will review your prescription within 30 minutes during work hours.
                  Refund within 24 hours if rejected.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <aside className="lg:col-span-5 xl:col-span-4">
          <div className="bg-bg-surface border border-border-subtle rounded-2xl shadow-card p-5 md:p-6 lg:sticky lg:top-20">
            <h2 className="text-h2 text-text-primary">Order summary</h2>

            <ul className="mt-4 space-y-3 max-h-72 overflow-auto">
              {enriched.map((row) => (
                <li key={row.id} className="flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-body font-semibold text-text-primary line-clamp-1">
                      {row.medicine.brand}
                    </p>
                    <p className="text-caption text-text-tertiary line-clamp-1">
                      {row.medicine.salt}
                    </p>
                  </div>
                  <div className="text-caption text-text-tertiary tabular shrink-0">
                    × {row.qty}
                  </div>
                  <div className="text-body font-semibold tabular text-text-primary shrink-0">
                    {formatPrice(row.medicine.sellingPrice * row.qty)}
                  </div>
                </li>
              ))}
            </ul>

            <dl className="mt-4 pt-4 border-t border-border-subtle space-y-2 text-body">
              <Row label="Subtotal">{formatPrice(subtotal)}</Row>
              {couponResult.discount > 0 && (
                <Row label={`Coupon (${coupon.code})`} valueClassName="text-success">
                  &minus; {formatPrice(couponResult.discount)}
                </Row>
              )}
              <Row label="Delivery" valueClassName={deliveryFee === 0 ? 'text-success' : ''}>
                {deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}
              </Row>
            </dl>

            <div className="mt-4 pt-4 border-t border-border-subtle flex items-baseline justify-between">
              <span className="text-h3 text-text-primary">Total</span>
              <span className="text-h2 font-bold text-text-primary tabular">
                {formatPrice(total)}
              </span>
            </div>

            <div className="mt-5 hidden md:block">
              <Button
                fullWidth
                size="lg"
                loading={placing}
                rightIcon={!placing && <ArrowRight size={18} />}
                onClick={handlePlace}
              >
                {placing ? 'Placing order' : `Pay ${formatPrice(total)}`}
              </Button>
            </div>

            <p className="mt-3 inline-flex items-center gap-1.5 text-caption text-text-tertiary">
              <ShieldCheck size={14} className="text-primary" />
              Secured by 256-bit encryption
            </p>
          </div>
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
          <Button
            loading={placing}
            rightIcon={!placing && <ArrowRight size={18} />}
            onClick={handlePlace}
          >
            {placing ? 'Placing' : 'Place order'}
          </Button>
        </div>
      </div>
    </main>
  );
}

function Section({ title, icon, children }) {
  return (
    <section className="bg-bg-surface border border-border-subtle rounded-2xl shadow-card p-5 md:p-6">
      <div className="flex items-center gap-2.5 mb-4">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-muted text-primary">
          {icon}
        </span>
        <h2 className="text-h3 text-text-primary">{title}</h2>
      </div>
      {children}
    </section>
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
