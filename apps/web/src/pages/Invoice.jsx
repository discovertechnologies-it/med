import { useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, Printer } from 'lucide-react';
import Button from '@/components/Button';
import { useOrderStore } from '@/store/useOrderStore';
import { formatPrice } from '@/utils/formatPrice';

export default function Invoice() {
  const { id } = useParams();
  const order = useOrderStore((s) => s.orders.find((o) => o.id === id));

  // Hide page chrome while printing
  useEffect(() => {
    const css = `
      @media print {
        body { background: white !important; }
        header, footer, nav, .print-hide { display: none !important; }
        main { padding: 0 !important; max-width: 100% !important; }
        @page { margin: 16mm; }
      }
    `;
    const el = document.createElement('style');
    el.textContent = css;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  if (!order) return <Navigate to="/orders" replace />;

  return (
    <main className="mx-auto max-w-3xl px-4 md:px-6 py-6 md:py-10">
      <div className="flex items-center justify-between print-hide mb-6">
        <Link
          to={`/orders/${order.id}`}
          className="inline-flex items-center gap-1 text-caption font-semibold text-text-secondary hover:text-text-primary"
        >
          <ArrowLeft size={14} />
          Back to order
        </Link>
        <Button leftIcon={<Printer size={18} />} onClick={() => window.print()}>
          Print or save as PDF
        </Button>
      </div>

      <article className="bg-bg-surface border border-border-subtle rounded-2xl shadow-card p-6 md:p-10 print:border-0 print:shadow-none print:p-0">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-6 border-b border-border-subtle">
          <div>
            <p className="text-label uppercase text-text-tertiary">Tax invoice</p>
            <h1 className="mt-1 text-h1 text-text-primary tabular">#{order.id}</h1>
            <p className="mt-1 text-caption text-text-secondary">
              Placed on {format(new Date(order.placedAt), 'd MMM yyyy, h:mm a')}
            </p>
          </div>
          <div className="text-right">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white mb-2">
              <Printer size={18} aria-hidden />
            </div>
            <p className="text-body font-bold text-text-primary">Med</p>
            <p className="text-caption text-text-secondary">
              Online Pharmacy
            </p>
          </div>
        </div>

        {/* Seller / Buyer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-b border-border-subtle">
          <div>
            <p className="text-label uppercase text-text-tertiary">Sold by</p>
            <p className="mt-1 text-body font-semibold text-text-primary">Med Pharmacy LLP</p>
            <p className="text-caption text-text-secondary">
              42, MG Road, Bangalore, Karnataka 560001
            </p>
            <p className="text-caption text-text-secondary tabular">GSTIN: 29ABCDE1234F1Z5</p>
            <p className="text-caption text-text-secondary tabular">DL: 20B/21B-KA-2024-001234</p>
          </div>
          <div>
            <p className="text-label uppercase text-text-tertiary">Delivered to</p>
            <p className="mt-1 text-body font-semibold text-text-primary">
              {order.address.label}
            </p>
            <p className="text-caption text-text-secondary">
              {order.address.line1}
              {order.address.line2 ? `, ${order.address.line2}` : ''}
            </p>
            <p className="text-caption text-text-secondary">
              {order.address.city}, {order.address.state} {order.address.pincode}
            </p>
          </div>
        </div>

        {/* Items table */}
        <div className="py-6 border-b border-border-subtle">
          <p className="text-label uppercase text-text-tertiary mb-3">Items</p>
          <table className="w-full text-body">
            <thead>
              <tr className="text-caption text-text-tertiary uppercase tracking-wide">
                <th className="text-left font-semibold pb-2">Description</th>
                <th className="text-right font-semibold pb-2 tabular">Qty</th>
                <th className="text-right font-semibold pb-2 tabular">Unit</th>
                <th className="text-right font-semibold pb-2 tabular">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {order.items.map((it) => (
                <tr key={it.id} className="align-top">
                  <td className="py-2.5">
                    <p className="font-semibold text-text-primary">{it.brand}</p>
                    <p className="text-caption text-text-secondary">{it.salt}</p>
                  </td>
                  <td className="py-2.5 text-right tabular">{it.qty}</td>
                  <td className="py-2.5 text-right tabular">{formatPrice(it.price)}</td>
                  <td className="py-2.5 text-right tabular font-semibold">
                    {formatPrice(it.price * it.qty)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="py-6 border-b border-border-subtle">
          <dl className="ml-auto md:max-w-xs space-y-1.5 text-body">
            <Row label="Subtotal">{formatPrice(order.totals.subtotal)}</Row>
            {order.coupon && order.totals.discount > 0 && (
              <Row label={`Coupon (${order.coupon.code})`} valueClassName="text-success">
                &minus; {formatPrice(order.totals.discount)}
              </Row>
            )}
            <Row label="Delivery">
              {order.totals.deliveryFee === 0 ? 'Free' : formatPrice(order.totals.deliveryFee)}
            </Row>
            <div className="pt-3 mt-3 border-t border-border-subtle flex items-center justify-between">
              <dt className="text-h3 text-text-primary">Total paid</dt>
              <dd className="text-h2 font-bold text-text-primary tabular">
                {formatPrice(order.totals.total)}
              </dd>
            </div>
          </dl>
          <p className="mt-2 text-caption text-text-tertiary text-right">
            All prices inclusive of GST.
          </p>
        </div>

        {/* Payment */}
        <div className="py-6">
          <p className="text-label uppercase text-text-tertiary">Payment</p>
          <p className="mt-1 text-body text-text-primary">
            {order.payment.label}
            {order.payment.id !== 'cod' && ' · Captured'}
          </p>
        </div>

        <p className="text-caption text-text-tertiary text-center pt-4 border-t border-border-subtle">
          This is a system-generated invoice. For support, contact hello@med.example.
        </p>
      </article>
    </main>
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
