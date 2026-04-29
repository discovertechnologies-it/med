import { useMemo } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { m, useReducedMotion } from 'framer-motion';
import {
  CheckCircle2,
  MapPin,
  CreditCard,
  Smartphone,
  Banknote,
  Package,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import { format } from 'date-fns';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import OrderTimeline from '@/components/OrderTimeline';
import { useOrderStore } from '@/store/useOrderStore';
import { formatPrice } from '@/utils/formatPrice';
import { springs } from '@/motion/transitions';

const paymentIcons = {
  upi: <Smartphone size={18} />,
  card: <CreditCard size={18} />,
  cod: <Banknote size={18} />,
};

export default function OrderDetail() {
  const { id } = useParams();
  const order = useOrderStore((s) => s.orders.find((o) => o.id === id));
  const reduce = useReducedMotion();

  if (!order) {
    return <Navigate to="/orders" replace />;
  }

  const placedDate = useMemo(() => new Date(order.placedAt), [order.placedAt]);

  return (
    <main className="mx-auto max-w-screen-xl px-4 md:px-6 lg:px-8 py-6 md:py-10">
      {/* Success banner */}
      <m.section
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springs.snappy}
        className="bg-bg-surface border border-border-subtle rounded-2xl shadow-card p-6 md:p-8"
      >
        <div className="flex items-start gap-4">
          <m.span
            initial={reduce ? false : { scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ ...springs.snappy, delay: 0.05 }}
            className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-success-muted text-success shrink-0"
          >
            <CheckCircle2 size={24} />
          </m.span>
          <div className="min-w-0">
            <h1 className="text-h1 md:text-h1-lg text-text-primary">Order placed</h1>
            <p className="mt-1 text-body text-text-secondary">
              Thanks{order.userId ? '' : ' for your purchase'}. Order
              <span className="ml-1 inline-flex items-center gap-1">
                <span className="font-semibold text-text-primary tabular">#{order.id}</span>
              </span>{' '}
              placed on {format(placedDate, 'd MMM yyyy, h:mm a')}.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {order.hasRx && (
                <Badge variant="warning" icon={<ShieldAlert size={12} />}>
                  Awaiting prescription review
                </Badge>
              )}
              <Badge variant="success" icon={<ShieldCheck size={12} />}>
                Pharmacist verified
              </Badge>
            </div>
          </div>
        </div>

        <div className="mt-6 md:mt-8">
          <OrderTimeline status={order.status} hasRx={order.hasRx} />
        </div>
      </m.section>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* Items */}
        <section className="lg:col-span-7 xl:col-span-8">
          <Card title="Items" icon={<Package size={18} />}>
            <ul className="divide-y divide-border-subtle">
              {order.items.map((it) => (
                <li key={it.id} className="py-3 first:pt-0 last:pb-0 flex items-center gap-3">
                  <Link
                    to={`/medicine/${it.id}`}
                    className="min-w-0 flex-1"
                  >
                    <p className="text-body font-semibold text-text-primary line-clamp-1 hover:text-primary">
                      {it.brand}
                    </p>
                    <p className="text-caption text-text-secondary line-clamp-1">{it.salt}</p>
                  </Link>
                  <span className="text-caption text-text-tertiary tabular shrink-0">× {it.qty}</span>
                  <span className="text-body font-semibold text-text-primary tabular shrink-0">
                    {formatPrice(it.price * it.qty)}
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mt-6">
            <Card title="Delivery address" icon={<MapPin size={18} />}>
              <p className="text-body font-semibold text-text-primary">
                {order.address.label}
              </p>
              <p className="mt-1 text-body text-text-secondary">
                {order.address.line1}, {order.address.line2}
              </p>
              <p className="text-body text-text-secondary">
                {order.address.city}, {order.address.state} {order.address.pincode}
              </p>
              <p className="mt-3 inline-flex items-center gap-1.5 text-caption text-text-tertiary">
                <Package size={14} className="text-primary" />
                {order.delivery.label} &middot; {order.delivery.eta}
              </p>
            </Card>

            <Card title="Payment" icon={paymentIcons[order.payment.id] || <CreditCard size={18} />}>
              <p className="text-body font-semibold text-text-primary">
                {order.payment.label}
              </p>
              <p className="mt-1 text-caption text-text-secondary">
                {order.payment.id === 'cod'
                  ? 'Pay when you receive your order'
                  : 'Payment captured successfully'}
              </p>
            </Card>
          </div>
        </section>

        {/* Totals */}
        <aside className="lg:col-span-5 xl:col-span-4">
          <div className="bg-bg-surface border border-border-subtle rounded-2xl shadow-card p-5 md:p-6 lg:sticky lg:top-20">
            <h2 className="text-h2 text-text-primary">Bill summary</h2>
            <dl className="mt-4 space-y-2.5 text-body">
              <Row label="Subtotal">{formatPrice(order.totals.subtotal)}</Row>
              {order.coupon && order.totals.discount > 0 && (
                <Row label={`Coupon (${order.coupon.code})`} valueClassName="text-success">
                  &minus; {formatPrice(order.totals.discount)}
                </Row>
              )}
              <Row
                label="Delivery"
                valueClassName={order.totals.deliveryFee === 0 ? 'text-success' : ''}
              >
                {order.totals.deliveryFee === 0 ? 'Free' : formatPrice(order.totals.deliveryFee)}
              </Row>
            </dl>
            <div className="mt-4 pt-4 border-t border-border-subtle flex items-baseline justify-between">
              <span className="text-h3 text-text-primary">Total paid</span>
              <span className="text-h2 font-bold text-text-primary tabular">
                {formatPrice(order.totals.total)}
              </span>
            </div>

            <div className="mt-5 flex flex-col gap-2">
              <Link to="/search">
                <Button fullWidth variant="secondary" rightIcon={<ArrowRight size={18} />}>
                  Continue shopping
                </Button>
              </Link>
              <Link to="/orders">
                <Button fullWidth variant="ghost">
                  View all orders
                </Button>
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

function Card({ title, icon, children }) {
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
