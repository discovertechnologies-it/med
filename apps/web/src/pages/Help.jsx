import { useMemo, useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircle, Phone, Mail, SearchX, LifeBuoy } from 'lucide-react';
import clsx from 'clsx';
import SearchBar from '@/components/SearchBar';
import Button from '@/components/Button';
import { faqCategories } from '@/data/mockFaqs';
import { useDebounce } from '@/hooks/useDebounce';
import { springs, baseTransition } from '@/motion/transitions';
import { staggerContainer, fadeUp } from '@/motion/variants';

export default function Help() {
  const [query, setQuery] = useState('');
  const debounced = useDebounce(query, 200);

  const filtered = useMemo(() => {
    const q = debounced.trim().toLowerCase();
    if (!q) return faqCategories;
    return faqCategories
      .map((cat) => ({
        ...cat,
        questions: cat.questions.filter(
          (qq) =>
            qq.q.toLowerCase().includes(q) || qq.a.toLowerCase().includes(q)
        ),
      }))
      .filter((cat) => cat.questions.length > 0);
  }, [debounced]);

  const totalMatches = filtered.reduce((sum, c) => sum + c.questions.length, 0);

  return (
    <main className="mx-auto max-w-screen-xl px-4 md:px-6 lg:px-8 py-6 md:py-10">
      <div className="max-w-2xl">
        <p className="text-label uppercase text-primary">Support</p>
        <h1 className="mt-2 text-h1 md:text-h1-lg text-text-primary">How can we help?</h1>
        <p className="mt-2 text-body text-text-secondary">
          Search the knowledge base or contact our team directly.
        </p>
        <div className="mt-5">
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Search help, e.g. delivery, refund, prescription"
          />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        <section className="lg:col-span-8">
          {filtered.length === 0 ? (
            <NoMatches />
          ) : (
            <m.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="space-y-6"
            >
              {debounced && (
                <p className="text-caption text-text-secondary">
                  {totalMatches} {totalMatches === 1 ? 'answer' : 'answers'} for{' '}
                  <span className="text-text-primary font-semibold">&ldquo;{debounced}&rdquo;</span>
                </p>
              )}
              {filtered.map((cat) => (
                <m.section key={cat.slug} variants={fadeUp}>
                  <h2 className="text-h3 text-text-primary mb-3">{cat.label}</h2>
                  <div className="space-y-2">
                    {cat.questions.map((qq, i) => (
                      <FaqItem key={i} q={qq.q} a={qq.a} defaultOpen={debounced.length > 0} />
                    ))}
                  </div>
                </m.section>
              ))}
            </m.div>
          )}
        </section>

        <aside className="lg:col-span-4">
          <ContactCard />
        </aside>
      </div>
    </main>
  );
}

function FaqItem({ q, a, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <m.div
      layout
      transition={springs.snappy}
      className="bg-bg-surface border border-border-subtle rounded-xl overflow-hidden"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left hover:bg-bg-muted/50 transition-colors"
      >
        <span className="text-body font-semibold text-text-primary">{q}</span>
        <m.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={baseTransition}
          aria-hidden
          className="shrink-0 text-text-tertiary"
        >
          <ChevronDown size={18} />
        </m.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <m.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={baseTransition}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 text-body text-text-secondary border-t border-border-subtle pt-3">
              {a}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </m.div>
  );
}

function NoMatches() {
  return (
    <div className="bg-bg-surface border border-border-subtle rounded-2xl shadow-card p-8 text-center">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-bg-muted text-text-secondary">
        <SearchX size={22} />
      </span>
      <h3 className="mt-4 text-h3 text-text-primary">No answers matched</h3>
      <p className="mt-2 text-body text-text-secondary max-w-sm mx-auto">
        Reach out to our team — we typically reply within 30 minutes during work hours.
      </p>
    </div>
  );
}

function ContactCard() {
  return (
    <div className="lg:sticky lg:top-20 space-y-3">
      <div className="bg-bg-surface border border-border-subtle rounded-2xl shadow-card p-5">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary-muted text-primary">
            <LifeBuoy size={18} />
          </span>
          <h2 className="text-h3 text-text-primary">Still need help?</h2>
        </div>
        <p className="mt-2 text-caption text-text-secondary">
          Our team is online 9am to 9pm IST.
        </p>

        <ul className="mt-4 space-y-2">
          <ContactRow
            icon={<MessageCircle size={18} />}
            label="Chat with us"
            sub="Average response in 4 minutes"
            cta="Open chat"
            onClick={() => {}}
          />
          <ContactRow
            icon={<Phone size={18} />}
            label="Call support"
            sub="1800-123-4567 (toll free)"
            cta="Call"
            href="tel:18001234567"
          />
          <ContactRow
            icon={<Mail size={18} />}
            label="Email us"
            sub="hello@med.example"
            cta="Email"
            href="mailto:hello@med.example"
          />
        </ul>
      </div>
    </div>
  );
}

function ContactRow({ icon, label, sub, cta, href, onClick }) {
  const inner = (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-border-subtle hover:border-border-strong hover:bg-bg-muted/50 transition-colors">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-bg-muted text-text-primary shrink-0">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-body font-semibold text-text-primary line-clamp-1">{label}</p>
        <p className="text-caption text-text-secondary line-clamp-1">{sub}</p>
      </div>
      <span className="text-caption font-semibold text-primary shrink-0">{cta}</span>
    </div>
  );
  return (
    <li>
      {href ? (
        <a href={href} className="block">
          {inner}
        </a>
      ) : (
        <button type="button" onClick={onClick} className="w-full text-left">
          {inner}
        </button>
      )}
    </li>
  );
}
