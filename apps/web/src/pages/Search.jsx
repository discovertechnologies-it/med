import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { m } from 'framer-motion';
import { SearchX, Upload } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import FilterChip from '@/components/FilterChip';
import MedicineCard from '@/components/MedicineCard';
import Button from '@/components/Button';
import { useDebounce } from '@/hooks/useDebounce';
import { categories, searchMedicines } from '@/data/mockCatalog';
import { staggerContainer, fadeUp } from '@/motion/variants';

export default function Search() {
  const [params, setParams] = useSearchParams();

  const initialQ = params.get('q') ?? '';
  const initialCategory = params.get('category');
  const initialRx = params.get('rx');
  const initialGeneric = params.get('generic');

  const [q, setQ] = useState(initialQ);
  const [category, setCategory] = useState(initialCategory);
  const [rx, setRx] = useState(initialRx);
  const [generic, setGeneric] = useState(initialGeneric);

  const debouncedQ = useDebounce(q, 200);

  // Keep URL in sync (shareable searches).
  useEffect(() => {
    const next = new URLSearchParams();
    if (debouncedQ) next.set('q', debouncedQ);
    if (category) next.set('category', category);
    if (rx) next.set('rx', rx);
    if (generic) next.set('generic', generic);
    setParams(next, { replace: true });
  }, [debouncedQ, category, rx, generic, setParams]);

  const results = useMemo(
    () => searchMedicines({ q: debouncedQ, category, rx, generic }),
    [debouncedQ, category, rx, generic]
  );

  const toggle = (current, value, setter) => setter(current === value ? null : value);

  const activeFilterCount = [category, rx, generic].filter(Boolean).length;

  return (
    <main className="mx-auto max-w-screen-xl px-4 md:px-6 lg:px-8 py-6 md:py-10">
      <div className="max-w-2xl">
        <SearchBar value={q} onChange={setQ} autoFocus />
      </div>

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
        <FilterChip active={generic === 'brand'} onClick={() => toggle(generic, 'brand', setGeneric)}>
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

        {(activeFilterCount > 0 || q) && (
          <button
            type="button"
            onClick={() => {
              setQ('');
              setCategory(null);
              setRx(null);
              setGeneric(null);
            }}
            className="text-caption font-semibold text-primary hover:text-primary-hover ml-1"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Results header */}
      <div className="mt-6 md:mt-8 flex items-baseline justify-between gap-3">
        <p className="text-body text-text-secondary">
          {results.length} {results.length === 1 ? 'result' : 'results'}
          {debouncedQ ? (
            <>
              {' '}for <span className="text-text-primary font-semibold">&ldquo;{debouncedQ}&rdquo;</span>
            </>
          ) : null}
        </p>
      </div>

      {results.length === 0 ? (
        <EmptyState />
      ) : (
        <m.div
          key={`${debouncedQ}|${category}|${rx}|${generic}`}
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
