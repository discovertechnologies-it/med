import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import {
  Pill,
  Droplet,
  Heart,
  Stethoscope,
  Sparkles,
  Flower2,
  ShieldPlus,
  Soup,
} from 'lucide-react';
import { categories, medicines } from '@/data/mockCatalog';
import { staggerContainer, fadeUp } from '@/motion/variants';
import { springs } from '@/motion/transitions';

const iconBySlug = {
  'pain-relief': <Pill size={22} />,
  diabetes: <Droplet size={22} />,
  'heart-bp': <Heart size={22} />,
  gastric: <Soup size={22} />,
  antibiotics: <ShieldPlus size={22} />,
  allergy: <Sparkles size={22} />,
  vitamins: <Sparkles size={22} />,
  'skin-care': <Flower2 size={22} />,
  devices: <Stethoscope size={22} />,
};

export default function Categories() {
  return (
    <main className="mx-auto max-w-screen-xl px-4 md:px-6 lg:px-8 py-6 md:py-10">
      <h1 className="text-h1 md:text-h1-lg text-text-primary">Browse by category</h1>
      <p className="mt-1 text-body text-text-secondary">
        Find medicines grouped by what they treat.
      </p>

      <m.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="mt-6 md:mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4"
      >
        {categories.map((c) => {
          const count = medicines.filter((m) => m.category === c.slug).length;
          const icon = iconBySlug[c.slug] || <Pill size={22} />;
          return (
            <m.div key={c.slug} variants={fadeUp}>
              <Link to={`/search?category=${c.slug}`} className="block h-full">
                <m.div
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  transition={springs.soft}
                  className="h-full bg-bg-surface border border-border-subtle hover:border-border-strong rounded-2xl shadow-card hover:shadow-pop p-5 md:p-6 transition"
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-muted text-primary">
                    {icon}
                  </span>
                  <h2 className="mt-4 text-h3 text-text-primary">{c.label}</h2>
                  <p className="mt-1 text-caption text-text-tertiary tabular">
                    {count} {count === 1 ? 'medicine' : 'medicines'}
                  </p>
                </m.div>
              </Link>
            </m.div>
          );
        })}
      </m.div>
    </main>
  );
}
