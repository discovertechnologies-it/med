import { m } from 'framer-motion';
import { toast } from 'sonner';
import { ShieldCheck, Pill, Truck } from 'lucide-react';
import Button from '@/components/Button';
import { staggerContainer, fadeUp } from '@/motion/variants';

const features = [
  {
    icon: <ShieldCheck size={24} />,
    title: 'Verified prescriptions',
    body: 'Every prescription is reviewed by a licensed pharmacist before dispatch.',
  },
  {
    icon: <Pill size={24} />,
    title: 'Cheaper generics',
    body: 'Save 30 to 80 percent by switching to verified generic alternatives.',
  },
  {
    icon: <Truck size={24} />,
    title: 'Fast delivery',
    body: 'Standard delivery within 24 to 48 hours across serviceable pincodes.',
  },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-screen-xl px-4 py-8 md:px-6 md:py-14 lg:px-8 lg:py-20">
      <section className="max-w-2xl">
        <p className="text-label uppercase text-primary">Pharmacy, online</p>
        <h1 className="mt-3 text-display md:text-display-lg text-text-primary">
          Medicines you trust, delivered to your door.
        </h1>
        <p className="mt-4 text-body-lg text-text-secondary">
          Search by salt or brand, upload your prescription once, and get refills on schedule.
          Pharmacist-reviewed. No surprises.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Button onClick={() => toast.success('Welcome to Med')}>Start a search</Button>
          <Button variant="secondary" onClick={() => toast('Sign up coming soon')}>
            Create account
          </Button>
        </div>
      </section>

      <m.section
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
      >
        {features.map((f) => (
          <m.div
            key={f.title}
            variants={fadeUp}
            className="bg-bg-surface border border-border-subtle rounded-2xl p-5 md:p-6 shadow-card"
          >
            <div className="inline-flex items-center justify-center h-11 w-11 rounded-full bg-primary-muted text-primary">
              {f.icon}
            </div>
            <h3 className="mt-4 text-h3 text-text-primary">{f.title}</h3>
            <p className="mt-2 text-body text-text-secondary">{f.body}</p>
          </m.div>
        ))}
      </m.section>
    </main>
  );
}
