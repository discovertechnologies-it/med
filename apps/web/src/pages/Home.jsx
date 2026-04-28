import { m } from 'framer-motion';
import { toast } from 'sonner';
import { ShieldCheck, Pill, Truck, Search, ArrowRight } from 'lucide-react';
import Button from '@/components/Button';
import HeroIllustration from '@/components/HeroIllustration';
import { staggerContainer, fadeUp } from '@/motion/variants';
import { springs } from '@/motion/transitions';

const features = [
  {
    icon: <ShieldCheck size={22} />,
    title: 'Verified prescriptions',
    body: 'Every prescription is reviewed by a licensed pharmacist before dispatch.',
  },
  {
    icon: <Pill size={22} />,
    title: 'Cheaper generics',
    body: 'Save 30 to 80 percent by switching to verified generic alternatives.',
  },
  {
    icon: <Truck size={22} />,
    title: 'Fast delivery',
    body: 'Standard delivery within 24 to 48 hours across serviceable pincodes.',
  },
];

const categories = [
  { label: 'Diabetes care', count: '128 items' },
  { label: 'Heart and BP', count: '94 items' },
  { label: 'Pain relief', count: '76 items' },
  { label: 'Vitamins', count: '212 items' },
  { label: 'Skin care', count: '143 items' },
  { label: 'Devices', count: '38 items' },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-screen-xl px-4 md:px-6 lg:px-8 pt-8 pb-12 md:pt-14 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-6">
            <p className="text-label uppercase text-primary">Pharmacy, online</p>
            <h1 className="mt-3 text-display md:text-display-lg text-text-primary">
              Medicines you trust, delivered to your door.
            </h1>
            <p className="mt-4 text-body-lg text-text-secondary max-w-xl">
              Search by salt or brand, upload your prescription once, and get refills on schedule.
              Pharmacist-reviewed. No surprises.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button
                leftIcon={<Search size={18} />}
                onClick={() => toast.success('Welcome to Med')}
              >
                Start a search
              </Button>
              <Button
                variant="secondary"
                rightIcon={<ArrowRight size={18} />}
                onClick={() => toast('Sign up coming soon')}
              >
                Create account
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-caption text-text-secondary">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-success" /> Pharmacist on record
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-success" /> COD available
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-success" /> 7-day return on damage
              </span>
            </div>
          </div>

          <div className="lg:col-span-6">
            <HeroIllustration className="w-full max-w-lg mx-auto h-auto" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-screen-xl px-4 md:px-6 lg:px-8 pb-12 md:pb-16">
        <m.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
        >
          {features.map((f) => (
            <m.div
              key={f.title}
              variants={fadeUp}
              whileHover={{ y: -2 }}
              transition={springs.soft}
              className="bg-bg-surface border border-border-subtle rounded-2xl p-5 md:p-6 shadow-card hover:shadow-pop transition-shadow"
            >
              <div className="inline-flex items-center justify-center h-11 w-11 rounded-full bg-primary-muted text-primary">
                {f.icon}
              </div>
              <h3 className="mt-4 text-h3 text-text-primary">{f.title}</h3>
              <p className="mt-2 text-body text-text-secondary">{f.body}</p>
            </m.div>
          ))}
        </m.div>
      </section>

      {/* Featured categories */}
      <section className="mx-auto max-w-screen-xl px-4 md:px-6 lg:px-8 pb-16 md:pb-20">
        <div className="flex items-end justify-between gap-4 mb-5 md:mb-6">
          <div>
            <h2 className="text-h2 md:text-h2-lg text-text-primary">Shop by category</h2>
            <p className="mt-1 text-body text-text-secondary">
              Curated by what people order most often.
            </p>
          </div>
          <Button variant="ghost" size="sm" rightIcon={<ArrowRight size={16} />}>
            See all
          </Button>
        </div>

        <m.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4"
        >
          {categories.map((c) => (
            <m.button
              key={c.label}
              variants={fadeUp}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={springs.soft}
              type="button"
              className="text-left bg-bg-surface border border-border-subtle rounded-xl p-4 hover:border-border-strong hover:shadow-card transition"
            >
              <div className="h-10 w-10 rounded-full bg-bg-image" aria-hidden />
              <p className="mt-3 text-body font-semibold text-text-primary">{c.label}</p>
              <p className="text-caption text-text-tertiary tabular">{c.count}</p>
            </m.button>
          ))}
        </m.div>
      </section>
    </>
  );
}
