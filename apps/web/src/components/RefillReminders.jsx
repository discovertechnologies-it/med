import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { m } from 'framer-motion';
import { toast } from 'sonner';
import { differenceInDays, formatDistanceToNowStrict } from 'date-fns';
import { Bell, ShoppingBag, SkipForward, ArrowRight } from 'lucide-react';
import Button from './Button';
import ProductImage from './ProductImage';
import { useSubscriptionStore } from '@/store/useSubscriptionStore';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore, selectIsAuthenticated } from '@/store/useAuthStore';
import { findMedicine } from '@/data/mockCatalog';
import { formatPrice } from '@/utils/formatPrice';
import { staggerContainer, fadeUp } from '@/motion/variants';
import { springs } from '@/motion/transitions';

const REMINDER_WINDOW_DAYS = 7;

export default function RefillReminders() {
  const isAuthed = useAuthStore(selectIsAuthenticated);
  const subs = useSubscriptionStore((s) => s.subscriptions);
  const skip = useSubscriptionStore((s) => s.skip);
  const addMany = useCartStore((s) => s.addMany);
  const navigate = useNavigate();

  const dueSoon = useMemo(() => {
    const now = new Date();
    return subs
      .filter((s) => s.status === 'active')
      .map((s) => ({ sub: s, medicine: findMedicine(s.medicineId) }))
      .filter(({ medicine, sub }) => {
        if (!medicine) return false;
        const daysOut = differenceInDays(new Date(sub.nextRunAt), now);
        return daysOut <= REMINDER_WINDOW_DAYS;
      });
  }, [subs]);

  if (!isAuthed || dueSoon.length === 0) return null;

  const handleOrderNow = (sub, medicine) => {
    addMany([
      {
        id: medicine.id,
        name: medicine.brand,
        price: medicine.sellingPrice,
        requiresPrescription: medicine.requiresPrescription,
        qty: sub.qty,
      },
    ]);
    toast.success(`${medicine.brand} added to cart`);
    navigate('/cart');
  };

  const handleSkip = (sub, medicine) => {
    skip(sub.id, 7);
    toast(`${medicine.brand} pushed by 7 days`);
  };

  return (
    <section className="mx-auto max-w-screen-xl px-4 md:px-6 lg:px-8 pb-12 md:pb-16">
      <div className="bg-warning-muted border border-warning/15 rounded-2xl p-5 md:p-6">
        <div className="flex items-start justify-between gap-3 mb-4 md:mb-5">
          <div>
            <h2 className="inline-flex items-center gap-2 text-h2 md:text-h2-lg text-text-primary">
              <Bell size={20} className="text-warning" aria-hidden />
              Refill reminders
            </h2>
            <p className="mt-1 text-body text-text-secondary">
              {dueSoon.length} {dueSoon.length === 1 ? 'subscription' : 'subscriptions'} due in
              the next {REMINDER_WINDOW_DAYS} days.
            </p>
          </div>
          <Link
            to="/account/subscriptions"
            className="hidden sm:inline-flex items-center gap-1 text-caption font-semibold text-primary hover:text-primary-hover whitespace-nowrap"
          >
            Manage
            <ArrowRight size={14} />
          </Link>
        </div>

        <m.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
        >
          {dueSoon.slice(0, 3).map(({ sub, medicine }) => (
            <m.div key={sub.id} variants={fadeUp}>
              <ReminderCard
                sub={sub}
                medicine={medicine}
                onOrderNow={() => handleOrderNow(sub, medicine)}
                onSkip={() => handleSkip(sub, medicine)}
              />
            </m.div>
          ))}
        </m.div>
      </div>
    </section>
  );
}

function ReminderCard({ sub, medicine, onOrderNow, onSkip }) {
  const days = differenceInDays(new Date(sub.nextRunAt), new Date());
  const due = days <= 0;
  const dueLabel = due
    ? 'Due now'
    : `In ${formatDistanceToNowStrict(new Date(sub.nextRunAt))}`;

  return (
    <m.article
      whileHover={{ y: -2 }}
      transition={springs.soft}
      className="h-full bg-bg-surface border border-border-subtle rounded-xl p-4 flex flex-col"
    >
      <div className="flex items-start gap-3">
        <Link to={`/medicine/${medicine.id}`} className="shrink-0 h-14 w-14">
          <ProductImage
            medicine={medicine}
            variant="strip"
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
          <p className="mt-1 text-caption text-text-tertiary tabular">
            <span className={due ? 'text-danger font-semibold' : 'text-warning font-semibold'}>
              {dueLabel}
            </span>{' '}
            &middot; {sub.qty} × {formatPrice(medicine.sellingPrice)}
          </p>
        </div>
      </div>
      <div className="mt-auto pt-3 flex items-center gap-1.5">
        <Button size="sm" leftIcon={<ShoppingBag size={14} />} onClick={onOrderNow}>
          Order now
        </Button>
        <Button size="sm" variant="ghost" leftIcon={<SkipForward size={14} />} onClick={onSkip}>
          Skip 7 days
        </Button>
      </div>
    </m.article>
  );
}
