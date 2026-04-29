import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { m, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';
import Button from '@/components/Button';
import MedicineCard from '@/components/MedicineCard';
import { useWishlistStore } from '@/store/useWishlistStore';
import { findMedicine } from '@/data/mockCatalog';
import { staggerContainer, fadeUp } from '@/motion/variants';

export default function Wishlist() {
  const ids = useWishlistStore((s) => s.ids);
  const items = useMemo(() => ids.map(findMedicine).filter(Boolean), [ids]);

  if (items.length === 0) {
    return (
      <section className="bg-bg-surface border border-border-subtle rounded-2xl shadow-card p-8 text-center">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-muted text-primary">
          <Heart size={22} />
        </span>
        <h2 className="mt-4 text-h3 text-text-primary">Your wishlist is empty</h2>
        <p className="mt-2 text-body text-text-secondary max-w-sm mx-auto">
          Tap the heart on any medicine to save it for later.
        </p>
        <div className="mt-5 inline-block">
          <Link to="/search">
            <Button leftIcon={<ShoppingBag size={18} />}>Browse medicines</Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-h2 text-text-primary">Saved for later</h2>
          <p className="text-caption text-text-secondary mt-0.5">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </p>
        </div>
      </div>

      <m.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 items-stretch"
      >
        <AnimatePresence initial={false}>
          {items.map((med) => (
            <m.div
              key={med.id}
              layout
              variants={fadeUp}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.18 } }}
              className="h-full"
            >
              <MedicineCard medicine={med} />
            </m.div>
          ))}
        </AnimatePresence>
      </m.div>
    </div>
  );
}
