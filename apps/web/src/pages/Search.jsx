import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { m, AnimatePresence } from 'framer-motion';
import { SearchX, Upload, History, X, ArrowUpDown, Check } from 'lucide-react';
import clsx from 'clsx';
import SearchBar from '@/components/SearchBar';
import FilterChip from '@/components/FilterChip';
import MedicineCard from '@/components/MedicineCard';
import Button from '@/components/Button';
import { useDebounce } from '@/hooks/useDebounce';
import { useSearchHistoryStore } from '@/store/useSearchHistoryStore';
import { categories, searchMedicines } from '@/data/mockCatalog';
import { staggerContainer, fadeUp } from '@/motion/variants';
import { springs, baseTransition } from '@/motion/transitions';

const sortOptions = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'discount', label: 'Discount' },
];

export default function Search() {
  const [params, setParams] = useSearchParams();

  const initialQ = params.get('q') ?? '';
  const initialCategory = params.get('category');
  const initialRx = params.get('rx');
  const initialGeneric = params.get('generic');
  const initialSort = params.get('sort') ?? 'relevance';

  const [q, setQ] = useState(initialQ);
  const [category, setCategory] = useState(initialCategory);
  const [rx, setRx] = useState(initialRx);
  const [generic, setGeneric] = useState(initialGeneric);
  const [sort, setSort] = useState(initialSort);

  const debouncedQ = useDebounce(q, 200);
  const recents = useSearchHistoryStore((s) => s.recents);
  const recordSearch = useSearchHistoryStore((s) => s.record);
  const removeRecent = useSearchHistoryStore((s) => s.remove);
  const clearRecents = useSearchHistoryStore((s) => s.clear);

  // Keep URL in sync (shareable searches).
  useEffect(() => {
    const next = new URLSearchParams();
    if (debouncedQ) next.set('q', debouncedQ);
    if (category) next.set('category', category);
    if (rx) next.set('rx', rx);
    if (generic) next.set('generic', generic);
    if (sort !== 'relevance') next.set('sort', sort);
    setParams(next, { replace: true });
  }, [debouncedQ, category, rx, generic, sort, setParams]);

  // Record successful searches (>= 2 chars) — debounced via useEffect on debouncedQ.
  useEffect(() => {
    if (debouncedQ && debouncedQ.length >= 2) {
      const t = setTimeout(() => recordSearch(debouncedQ), 800);
      return () => clearTimeout(t);
    }
  }, [debouncedQ, recordSearch]);

  const results = useMemo(
    () => searchMedicines({ q: debouncedQ, category, rx, generic, sort }),
    [debouncedQ, category, rx, generic, sort]
  );

  const toggle = (current, value, setter) => setter(current === value ? null : value);
  const activeFilterCount = [category, rx, generic].filter(Boolean).length;

  const showRecents = !debouncedQ && recents.length > 0;

  return (
    <main className="mx-auto max-w-screen-xl px-4 md:px-6 lg:px-8 py-6 md:py-10">
      <div className="max-w-2xl">
        <SearchBar value={q} onChange={setQ} autoFocus />
      </div>

      {/* Recent searches */}
      <AnimatePresence initial={false}>
        {showRecents && (
          <m.div
            key="recents"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={baseTransition}
            className="mt-4 max-w-2xl"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="inline-flex items-center gap-1.5 text-label uppercase text-text-tertiary">
                <History size={12} aria-hidden />
                Recent
              </p>
              <button
                type="button"
                onClick={() => clearRecents()}
                className="text-caption font-semibold text-text-secondary hover:text-text-primary"
              >
                Clear
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {recents.map((r) => (
                <span
                  key={r}
                  className="inline-flex items-center gap-1 bg-bg-surface border border-border-subtle hover:border-border-strong rounded-full pl-3 pr-1 h-8 text-caption font-semibold text-text-primary transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setQ(r)}
                    className="line-clamp-1 max-w-[160px]"
                  >
                    {r}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeRecent(r)}
                    aria-label={`Remove ${r} from recent searches`}
                    className="inline-flex h-6 w-6 items-center justify-center rounded-full text-text-tertiary hover:bg-bg-muted hover:text-text-primary"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </m.div>
        )}
      </AnimatePresence>

      {/* Filter row */}
      <div className="mt-4 md:mt-6 flex flex-wrap items-center gap-2">
        <FilterChip active={rx === 'rx'} onClick={() => toggle(rx, 'rx', setRx)}>
          Prescription
        </FilterChip>
        <FilterChip active={rx === 'otc'} onClick={() => toggle(rx, 'otc', setRx)}>
          Over the counter
        </FilterChip>
        <FilterChip
          active={generic === 'generic'}
          onClick={() => toggle(generic, 'generic', setGeneric)}
        >
          Generic
        </FilterChip>
        <FilterChip
          active={generic === 'brand'}
          onClick={() => toggle(generic, 'brand', setGeneric)}
        >
          Branded
        </FilterChip>

        <div className="hidden md:block h-6 w-px bg-border-subtle mx-1" aria-hidden />

        {categories.map((c) => (
          <FilterChip
            key={c.slug}
            active={category === c.slug}
            onClick={() => toggle(category, c.slug, setCategory)}
          >
            {c.label}
          </FilterChip>
        ))}

        {(activeFilterCount > 0 || q || sort !== 'relevance') && (
          <button
            type="button"
            onClick={() => {
              setQ('');
              setCategory(null);
              setRx(null);
              setGeneric(null);
              setSort('relevance');
            }}
            className="text-caption font-semibold text-primary hover:text-primary-hover ml-1"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Results header + sort */}
      <div className="mt-6 md:mt-8 flex items-center justify-between gap-3">
        <p className="text-body text-text-secondary">
          {results.length} {results.length === 1 ? 'result' : 'results'}
          {debouncedQ ? (
            <>
              {' '}for{' '}
              <span className="text-text-primary font-semibold">
                &ldquo;{debouncedQ}&rdquo;
              </span>
            </>
          ) : null}
        </p>
        <SortDropdown value={sort} onChange={setSort} />
      </div>

      {results.length === 0 ? (
        <EmptyState />
      ) : (
        <m.div
          key={`${debouncedQ}|${category}|${rx}|${generic}|${sort}`}
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 items-stretch"
        >
          {results.map((med) => (
            <m.div key={med.id} variants={fadeUp} className="h-full">
              <MedicineCard medicine={med} />
            </m.div>
          ))}
        </m.div>
      )}
    </main>
  );
}

function SortDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const current = sortOptions.find((o) => o.value === value) ?? sortOptions[0];

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (!e.target.closest('[data-sort-dropdown]')) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  return (
    <div className="relative shrink-0" data-sort-dropdown>
      <m.button
        type="button"
        whileTap={{ scale: 0.97 }}
        transition={springs.soft}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={clsx(
          'inline-flex items-center gap-1.5 h-9 px-3 rounded-full text-caption font-semibold border transition-colors',
          open
            ? 'bg-primary-muted text-primary border-primary'
            : 'bg-bg-surface text-text-secondary border-border-subtle hover:border-border-strong hover:text-text-primary'
        )}
      >
        <ArrowUpDown size={14} aria-hidden />
        <span className="hidden sm:inline">Sort:</span> {current.label}
      </m.button>
      <AnimatePresence>
        {open && (
          <m.ul
            role="listbox"
            initial={{ opacity: 0, scale: 0.96, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -2 }}
            transition={springs.snappy}
            className="absolute right-0 mt-2 w-56 bg-bg-surface border border-border-subtle rounded-xl shadow-pop overflow-hidden z-20"
            style={{ transformOrigin: 'top right' }}
          >
            {sortOptions.map((o) => {
              const active = o.value === value;
              return (
                <li key={o.value} role="option" aria-selected={active}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(o.value);
                      setOpen(false);
                    }}
                    className={clsx(
                      'w-full flex items-center justify-between gap-2 px-3 py-2.5 text-body text-left transition-colors',
                      active
                        ? 'bg-primary-muted text-primary font-semibold'
                        : 'hover:bg-bg-muted text-text-primary'
                    )}
                  >
                    {o.label}
                    {active && <Check size={14} />}
                  </button>
                </li>
              );
            })}
          </m.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mt-8 md:mt-12 max-w-md mx-auto text-center bg-bg-surface border border-border-subtle rounded-2xl p-8 shadow-card">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-bg-muted text-text-secondary">
        <SearchX size={22} />
      </div>
      <h3 className="mt-4 text-h3 text-text-primary">No medicines matched</h3>
      <p className="mt-2 text-body text-text-secondary">
        Try a different brand, salt, or upload a prescription and we will find it for you.
      </p>
      <div className="mt-5 inline-block">
        <Button leftIcon={<Upload size={18} />}>Upload prescription</Button>
      </div>
    </div>
  );
}
