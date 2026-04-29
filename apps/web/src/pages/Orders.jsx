import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { m } from 'framer-motion';
import { ArrowRight, Package, ShoppingBag } from 'lucide-react';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import { useOrderStore } from '@/store/useOrderStore';
import { formatPrice } from '@/utils/formatPrice';
import { staggerContainer, fadeUp } from '@/motion/variants';
import { springs } from '@/motion/transitions';

const statusBadge = {
  rx_review: { variant: 'warning', label: 'Prescription review' },
  confirmed: { variant: 'primary', label: 'Confirmed' },
  packed: { variant: 'primary', label: 'Packed' },
  shipped: { variant: 'primary', label: 'Shipped' },
  delivered: { variant: 'success', label: 'Delivered' },
  cancelled: { variant: 'danger', label: 'Cancelled' },
};

export default function Orders() {
  const orders = useOrderStore((s) => s.orders);

  if (orders.length === 0) {
    return (
      <main className="mx-auto max-w-screen-md px-4 py-16 text-center">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary-muted text-primary">
          <Package size={26} />
        </span>
        <h1 className="mt-4 text-h1 md:text-h1-lg text-text-primary">No orders yet</h1>
        <p className="mt-2 text-body text-text-secondary">
          When you place an order, it will appear here.
        </p>
        <Link to="/search" className="inline-block mt-6">
          <Button leftIcon={<ShoppingBag size={18} />}>Start shopping</Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-screen-xl px-4 md:px-6 lg:px-8 py-6 md:py-10">
      <h1 className="text-h1 md:text-h1-lg text-text-primary">Your orders</h1>
      <p className="mt-1 text-body text-text-secondary">{orders.length} total</p>

      <m.ul
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="mt-6 space-y-3 max-w-3xl"
      >
        {orders.map((o) => {
          const badge = statusBadge[o.status] ?? { variant: 'neutral', label: o.status };
          return (
            <m.li key={o.id} variants={fadeUp}>
              <Link
                to={`/orders/${o.id}`}
                className="block bg-bg-surface border border-border-subtle hover:border-border-strong rounded-2xl shadow-card hover:shadow-pop transition p-4 md:p-5"
              >
                <m.div whileHover={{ y: -1 }} transition={springs.soft}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-caption text-text-tertiary tabular">
                        Order #{o.id} &middot; {format(new Date(o.placedAt), 'd MMM yyyy')}
                      </p>
                      <p className="mt-1 text-body font-semibold text-text-primary line-clamp-1">
                        {o.items
                          .slice(0, 2)
                          .map((i) => i.brand)
                          .join(', ')}
                        {o.items.length > 2 ? ` and ${o.items.length - 2} more` : ''}
                      </p>
                      <p className="mt-0.5 text-caption text-text-secondary line-clamp-1">
                        {o.delivery.label} &middot; {o.delivery.eta}
                      </p>
                    </div>
                    <div className="text-right tabular shrink-0">
                      <p className="text-body-lg font-semibold text-text-primary">
                        {formatPrice(o.totals.total)}
                      </p>
                      <div className="mt-1 inline-block">
                        <Badge variant={badge.variant}>{badge.label}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-end gap-1 text-caption text-primary font-semibold">
                    View details
                    <ArrowRight size={14} />
                  </div>
                </m.div>
              </Link>
            </m.li>
          );
        })}
      </m.ul>
    </main>
  );
}
