import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import { TrendingUp, ArrowRight } from 'lucide-react';
import MedicineCard from './MedicineCard';
import { getTrending } from '@/data/mockCatalog';
import { useRecentStore } from '@/store/useRecentStore';
import { staggerContainer, fadeUp } from '@/motion/variants';

// Render trending only when user has no recently-viewed history yet.
// When they do, RecentlyViewed takes over.
export default function TrendingMedicines() {
  const recentCount = useRecentStore((s) => s.ids.length);
  const items = useMemo(() => getTrending().slice(0, 6), []);

  if (recentCount >= 2) return null;
  if (items.length === 0) return null;

  return (
    <section className="mx-auto max-w-screen-xl px-4 md:px-6 lg:px-8 pb-12 md:pb-16">
      <div className="flex items-end justify-between gap-3 mb-5 md:mb-6">
        <div>
          <h2 className="inline-flex items-center gap-2 text-h2 md:text-h2-lg text-text-primary">
            <TrendingUp size={22} className="text-primary" aria-hidden />
            Trending today
          </h2>
          <p className="mt-1 text-body text-text-secondary">
            What people are ordering most this week.
          </p>
        </div>
        <Link
          to="/search"
          className="inline-flex items-center gap-1 text-caption font-semibold text-primary hover:text-primary-hover whitespace-nowrap"
        >
          See all
          <ArrowRight size={14} />
        </Link>
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
