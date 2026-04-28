import { useNavigate } from 'react-router-dom';
import { m } from 'framer-motion';
import { toast } from 'sonner';
import {
  ShieldCheck,
  Pill,
  Truck,
  Search,
  ArrowRight,
  Heart,
  Droplet,
  Sparkles,
  Flower2,
  Stethoscope,
  CheckCircle2,
  Upload,
  PackageCheck,
} from 'lucide-react';
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
  { slug: 'diabetes', label: 'Diabetes care', count: '128 items', icon: <Droplet size={20} /> },
  { slug: 'heart-bp', label: 'Heart and BP', count: '94 items', icon: <Heart size={20} /> },
  { slug: 'pain-relief', label: 'Pain relief', count: '76 items', icon: <Pill size={20} /> },
  { slug: 'vitamins', label: 'Vitamins', count: '212 items', icon: <Sparkles size={20} /> },
  { slug: 'skin-care', label: 'Skin care', count: '143 items', icon: <Flower2 size={20} /> },
  { slug: 'devices', label: 'Devices', count: '38 items', icon: <Stethoscope size={20} /> },
];

const howItWorks = [
  {
    icon: <Search size={22} />,
    step: '01',
    title: 'Search or upload',
    body: 'Find by salt, brand, or drop in a prescription photo. Autocomplete handles typos.',
  },
  {
    icon: <ShieldCheck size={22} />,
    step: '02',
    title: 'Pharmacist verifies',
    body: 'A licensed pharmacist reviews your prescription within 30 minutes during work hours.',
  },
  {
    icon: <PackageCheck size={22} />,
    step: '03',
    title: 'Delivered to your door',
    body: 'Track in real time. Pay via UPI, card, or cash on delivery. Refills are automatic.',
  },
];

const trustItems = ['Pharmacist on record', 'COD available', '7-day return on damage'];

export default function Home() {
  const navigate = useNavigate();
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-screen-xl px-4 md:px-6 lg:px-8 pt-8 pb-12 md:pt-14 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-6">
            <p className="text-label uppercase text-primary">Online pharmacy</p>
            <h1 className="mt-3 text-display md:text-display-lg text-text-primary">
              Medicines you trust, delivered to your door.
            </h1>
            <p className="mt-4 text-body-lg text-text-secondary max-w-xl">
              Search by salt or brand, upload your prescription once, and get refills on schedule.
              Pharmacist-reviewed. No surprises.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button leftIcon={<Search size={18} />} onClick={() => navigate('/search')}>
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

            <ul className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-caption text-text-secondary">
              {trustItems.map((t) => (
                <li key={t} className="inline-flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-success" aria-hidden />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
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
      <section className="mx-auto max-w-screen-xl px-4 md:px-6 lg:px-8 pb-12 md:pb-16">
        <div className="flex items-end justify-between gap-4 mb-5 md:mb-6">
          <div>
            <h2 className="text-h2 md:text-h2-lg text-text-primary">Shop by category</h2>
            <p className="mt-1 text-body text-text-secondary">
              Curated by what people order most often.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            rightIcon={<ArrowRight size={16} />}
            onClick={() => navigate('/search')}
          >
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
              key={c.slug}
              variants={fadeUp}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={springs.soft}
              type="button"
              onClick={() => navigate(`/search?category=${c.slug}`)}
              className="text-left bg-bg-surface border border-border-subtle rounded-xl p-4 hover:border-border-strong hover:shadow-card transition"
            >
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-muted text-primary">
                {c.icon}
              </div>
              <p className="mt-3 text-body font-semibold text-text-primary">{c.label}</p>
              <p className="text-caption text-text-tertiary tabular">{c.count}</p>
            </m.button>
          ))}
        </m.div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-screen-xl px-4 md:px-6 lg:px-8 pb-16 md:pb-24">
        <div className="bg-bg-surface border border-border-subtle rounded-2xl shadow-card p-6 md:p-10 lg:p-12">
          <div className="max-w-2xl">
            <p className="text-label uppercase text-primary">How it works</p>
            <h2 className="mt-2 text-h1 md:text-h1-lg text-text-primary">
              From search to doorstep in three steps.
            </h2>
          </div>

          <m.ol
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-50px' }}
            className="mt-8 md:mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative"
          >
            {howItWorks.map((s, idx) => (
              <m.li key={s.step} variants={fadeUp} className="relative">
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white">
                    {s.icon}
                  </div>
                  <span className="text-label uppercase text-text-tertiary tabular">{s.step}</span>
                </div>
                <h3 className="mt-4 text-h3 text-text-primary">{s.title}</h3>
                <p className="mt-2 text-body text-text-secondary">{s.body}</p>
                {idx < howItWorks.length - 1 && (
                  <span
                    aria-hidden
                    className="hidden md:block absolute top-5 left-full w-full -translate-x-1/2 h-px bg-border-subtle"
                  />
                )}
              </m.li>
            ))}
          </m.ol>

          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <Button
              leftIcon={<Upload size={18} />}
              onClick={() => toast('Prescription upload coming soon')}
            >
              Upload prescription
            </Button>
            <Button
              variant="secondary"
              rightIcon={<ArrowRight size={18} />}
              onClick={() => navigate('/search')}
            >
              Browse medicines
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
