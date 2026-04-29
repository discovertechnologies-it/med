import { useMemo, useState } from 'react';
import { Link, useParams, useNavigate, Navigate } from 'react-router-dom';
import { m, useReducedMotion } from 'framer-motion';
import { toast } from 'sonner';
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
  Repeat,
  XCircle,
  Flag,
  FileText,
  Image as ImageIcon,
  X,
} from 'lucide-react';
import { format } from 'date-fns';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import OrderTimeline from '@/components/OrderTimeline';
import Modal from '@/components/Modal';
import { useOrderStore } from '@/store/useOrderStore';
import { useCartStore } from '@/store/useCartStore';
import { findMedicine } from '@/data/mockCatalog';
import { formatPrice } from '@/utils/formatPrice';
import { springs } from '@/motion/transitions';

const paymentIcons = {
  upi: <Smartphone size={18} />,
  card: <CreditCard size={18} />,
  cod: <Banknote size={18} />,
};

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const order = useOrderStore((s) => s.orders.find((o) => o.id === id));
  const cancelOrder = useOrderStore((s) => s.cancel);
  const addIssue = useOrderStore((s) => s.addIssue);
  const addMany = useCartStore((s) => s.addMany);
  const reduce = useReducedMotion();

  const [cancelOpen, setCancelOpen] = useState(false);
  const [issueOpen, setIssueOpen] = useState(false);

  if (!order) {
    return <Navigate to="/orders" replace />;
  }

  const placedDate = useMemo(() => new Date(order.placedAt), [order.placedAt]);
  const isCancelled = order.status === 'cancelled';
  const canCancel = ['confirmed', 'rx_review'].includes(order.status);
  const canReport = !['cancelled'].includes(order.status);

  const handleReorder = () => {
    const incoming = order.items
      .map((it) => {
        const fresh = findMedicine(it.id);
        if (!fresh) return null;
        return {
          id: fresh.id,
          name: fresh.brand,
          price: fresh.sellingPrice,
          requiresPrescription: fresh.requiresPrescription,
          qty: it.qty,
        };
      })
      .filter(Boolean);

    if (incoming.length === 0) {
      toast.error('Items are no longer available');
      return;
    }
    addMany(incoming);
    const skipped = order.items.length - incoming.length;
    toast.success(
      skipped > 0
        ? `Added ${incoming.length} ${incoming.length === 1 ? 'item' : 'items'} (${skipped} unavailable)`
        : `Added ${incoming.length} ${incoming.length === 1 ? 'item' : 'items'} to cart`
    );
    navigate('/cart');
  };

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

        <div className="mt-6 flex flex-wrap gap-3">
          <Button leftIcon={<Repeat size={18} />} onClick={handleReorder}>
            Reorder these items
          </Button>
          <Link to={`/orders/${order.id}/invoice`}>
            <Button variant="secondary" leftIcon={<FileText size={18} />}>
              View invoice
            </Button>
          </Link>
          {canCancel && (
            <Button
              variant="ghost"
              leftIcon={<XCircle size={18} />}
              onClick={() => setCancelOpen(true)}
            >
              Cancel order
            </Button>
          )}
          {canReport && (
            <Button
              variant="ghost"
              leftIcon={<Flag size={18} />}
              onClick={() => setIssueOpen(true)}
            >
              Report issue
            </Button>
          )}
        </div>

        {isCancelled && order.cancellationReason && (
          <p className="mt-4 text-caption text-text-secondary">
            <strong className="text-danger font-semibold">Cancelled:</strong>{' '}
            {order.cancellationReason}
          </p>
        )}
      </m.section>

      <CancelOrderModal
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onConfirm={(reason) => {
          cancelOrder(order.id, reason);
          toast('Order cancelled. Refund initiates within 24 hours.');
          setCancelOpen(false);
        }}
      />
      <ReportIssueModal
        open={issueOpen}
        onClose={() => setIssueOpen(false)}
        onSubmit={(issue) => {
          addIssue(order.id, issue);
          toast.success('Issue reported. Support will reach out within 24 hours.');
          setIssueOpen(false);
        }}
      />

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

const CANCEL_REASONS = [
  'Ordered by mistake',
  'Found a better price',
  'Need to change items',
  'Delivery is too slow',
  'Other',
];

function CancelOrderModal({ open, onClose, onConfirm }) {
  const [reason, setReason] = useState('Ordered by mistake');
  const [other, setOther] = useState('');

  const handleConfirm = () => {
    const finalReason = reason === 'Other' ? other.trim() || 'Other' : reason;
    onConfirm(finalReason);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Cancel this order?"
      subtitle="Refund initiates within 24 hours of cancellation."
      size="md"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Keep order
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={reason === 'Other' && !other.trim()}
            className="bg-danger hover:bg-danger/90 text-white"
          >
            Cancel order
          </Button>
        </div>
      }
    >
      <p className="text-label uppercase text-text-tertiary mb-2">Reason</p>
      <div className="space-y-1.5">
        {CANCEL_REASONS.map((r) => (
          <label
            key={r}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-bg-muted cursor-pointer"
          >
            <input
              type="radio"
              name="cancel-reason"
              value={r}
              checked={reason === r}
              onChange={() => setReason(r)}
              className="h-4 w-4 text-primary"
            />
            <span className="text-body text-text-primary">{r}</span>
          </label>
        ))}
      </div>
      {reason === 'Other' && (
        <textarea
          value={other}
          onChange={(e) => setOther(e.target.value)}
          rows={3}
          maxLength={250}
          placeholder="Tell us briefly why"
          className="mt-3 w-full px-4 py-2.5 rounded-xl bg-bg-page border border-border-subtle hover:border-border-strong focus:border-primary text-text-primary outline-none transition-colors"
        />
      )}
    </Modal>
  );
}

const ISSUE_TYPES = [
  'Damaged or expired item',
  'Wrong item delivered',
  'Missing item from order',
  'Quality issue',
  'Other',
];

function ReportIssueModal({ open, onClose, onSubmit }) {
  const [type, setType] = useState(ISSUE_TYPES[0]);
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState([]);

  const handleAddPhoto = (files) => {
    const arr = Array.from(files || []);
    if (!arr.length) return;
    if (photos.length + arr.length > 3) {
      toast.error('Up to 3 photos');
      return;
    }
    const valid = arr.filter((f) => {
      if (!f.type.startsWith('image/')) {
        toast.error(`${f.name}: only images`);
        return false;
      }
      if (f.size > 5 * 1024 * 1024) {
        toast.error(`${f.name}: must be 5 MB or smaller`);
        return false;
      }
      return true;
    });
    setPhotos((cur) => [...cur, ...valid]);
  };

  const handleSubmit = () => {
    if (description.trim().length < 10) {
      toast.error('Please describe the issue (min 10 characters)');
      return;
    }
    onSubmit({
      type,
      description: description.trim(),
      photoCount: photos.length,
    });
    setType(ISSUE_TYPES[0]);
    setDescription('');
    setPhotos([]);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Report an issue"
      subtitle="Describe what went wrong — our team replies within 24 hours."
      size="lg"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={description.trim().length < 10}>
            Submit
          </Button>
        </div>
      }
    >
      <p className="text-label uppercase text-text-tertiary mb-2">Issue type</p>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {ISSUE_TYPES.map((t) => {
          const active = type === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={
                active
                  ? 'px-3 h-9 rounded-full text-caption font-semibold bg-primary text-white border border-primary'
                  : 'px-3 h-9 rounded-full text-caption font-semibold bg-bg-surface text-text-secondary border border-border-subtle hover:border-border-strong hover:text-text-primary transition-colors'
              }
            >
              {t}
            </button>
          );
        })}
      </div>

      <label
        htmlFor="issue-desc"
        className="block text-label uppercase text-text-tertiary mb-1.5"
      >
        Description
      </label>
      <textarea
        id="issue-desc"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
        maxLength={500}
        placeholder="What happened? When did you notice the issue?"
        className="w-full px-4 py-3 rounded-xl bg-bg-page border border-border-subtle hover:border-border-strong focus:border-primary text-text-primary outline-none transition-colors"
      />
      <p className="mt-1 text-caption text-text-tertiary text-right tabular">
        {description.length} / 500
      </p>

      <p className="mt-4 text-label uppercase text-text-tertiary mb-2">Photos (optional)</p>
      <div className="grid grid-cols-3 gap-2">
        {photos.map((p, i) => (
          <div
            key={i}
            className="relative aspect-square rounded-xl overflow-hidden bg-bg-image border border-border-subtle"
          >
            <img
              src={URL.createObjectURL(p)}
              alt=""
              className="h-full w-full object-cover"
              onLoad={(e) => URL.revokeObjectURL(e.target.src)}
            />
            <button
              type="button"
              onClick={() => setPhotos((cur) => cur.filter((_, j) => j !== i))}
              aria-label="Remove photo"
              className="absolute top-1 right-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-bg-surface/95 text-text-primary shadow-card hover:bg-danger hover:text-white"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        {photos.length < 3 && (
          <label className="aspect-square rounded-xl border-2 border-dashed border-border-subtle hover:border-primary text-text-tertiary hover:text-primary flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer">
            <ImageIcon size={20} />
            <span className="text-caption">Add</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                handleAddPhoto(e.target.files);
                e.target.value = '';
              }}
              className="hidden"
            />
          </label>
        )}
      </div>
    </Modal>
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
