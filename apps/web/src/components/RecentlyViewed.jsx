import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import { ArrowRight, History, X } from 'lucide-react';
import Button from './Button';
import MedicineCard from './MedicineCard';
import { useRecentStore } from '@/store/useRecentStore';
import { findMedicine } from '@/data/mockCatalog';
import { staggerContainer, fadeUp } from '@/motion/variants';

export default function RecentlyViewed({ excludeId }) {
  const ids = useRecentStore((s) => s.ids);
  const clear = useRecentStore((s) => s.clear);

  const items = useMemo(() => {
    return ids
      .filter((id) => id !== excludeId)
      .map(findMedicine)
      .filter(Boolean)
      .slice(0, 6);
  }, [ids, excludeId]);

  if (items.length < 2) return null;

  return (
    <section className="mx-auto max-w-screen-xl px-4 md:px-6 lg:px-8 pb-12 md:pb-16">
      <div className="flex items-end justify-between gap-3 mb-5 md:mb-6">
        <div>
          <h2 className="inline-flex items-center gap-2 text-h2 md:text-h2-lg text-text-primary">
            <History size={22} className="text-primary" aria-hidden />
            Recently viewed
          </h2>
          <p className="mt-1 text-body text-text-secondary">
            Pick up where you left off.
          </p>
        </div>
        <button
          type="button"
          onClick={clear}
          className="inline-flex items-center gap-1 text-caption font-semibold text-text-secondary hover:text-text-primary transition-colors"
        >
          <X size={14} />
          Clear history
        </button>
      </div>

      <m.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: '-40px' }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 items-stretch"
      >
        {items.map((med) => (
          <m.div key={med.id} variants={fadeUp} className="h-full">
            <MedicineCard medicine={med} />
          </m.div>
        ))}
      </m.div>
    </section>
  );
}
