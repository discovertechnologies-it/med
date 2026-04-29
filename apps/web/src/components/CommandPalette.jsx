import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { m, AnimatePresence, useReducedMotion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Search,
  X,
  Home,
  Pill,
  ShoppingBag,
  Package,
  User,
  Heart,
  MapPin,
  Repeat,
  LifeBuoy,
  Upload,
  CornerDownLeft,
  ArrowUp,
  ArrowDown,
  LogOut,
  LogIn,
  ListTree,
  ShieldAlert,
} from 'lucide-react';
import clsx from 'clsx';
import ProductImage from './ProductImage';
import Badge from './Badge';
import { useCommandStore } from '@/store/useCommandStore';
import { useAuthStore, selectIsAuthenticated } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import { useDebounce } from '@/hooks/useDebounce';
import { isMac } from '@/hooks/useKeyboardShortcut';
import { searchMedicines } from '@/data/mockCatalog';
import { springs, baseTransition } from '@/motion/transitions';
import { formatPrice } from '@/utils/formatPrice';

const pages = [
  { id: 'p_home', label: 'Home', sub: 'Browse everything', icon: <Home size={18} />, to: '/' },
  { id: 'p_search', label: 'Search medicines', sub: 'Find by salt or brand', icon: <Search size={18} />, to: '/search' },
  { id: 'p_categories', label: 'Categories', sub: 'Browse by need', icon: <ListTree size={18} />, to: '/categories' },
  { id: 'p_cart', label: 'Cart', sub: 'Items ready to checkout', icon: <ShoppingBag size={18} />, to: '/cart' },
  { id: 'p_help', label: 'Help center', sub: 'FAQs and contact', icon: <LifeBuoy size={18} />, to: '/help' },
];

const protectedPages = [
  { id: 'p_orders', label: 'Orders', sub: 'Past and active orders', icon: <Package size={18} />, to: '/orders' },
  {
    id: 'p_prescriptions',
    label: 'Prescriptions',
    sub: 'Upload or manage Rx',
    icon: <ShieldAlert size={18} />,
    to: '/prescriptions',
  },
  { id: 'p_profile', label: 'Profile', sub: 'Personal details', icon: <User size={18} />, to: '/account/profile' },
  { id: 'p_addresses', label: 'Addresses', sub: 'Saved delivery addresses', icon: <MapPin size={18} />, to: '/account/addresses' },
  { id: 'p_wishlist', label: 'Wishlist', sub: 'Saved for later', icon: <Heart size={18} />, to: '/account/wishlist' },
  {
    id: 'p_subscriptions',
    label: 'Subscriptions',
    sub: 'Auto-deliver chronic medicines',
    icon: <Repeat size={18} />,
    to: '/account/subscriptions',
  },
];

export default function CommandPalette() {
  const open = useCommandStore((s) => s.open);
  const close = useCommandStore((s) => s.close);
  const isAuthed = useAuthStore(selectIsAuthenticated);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const reduce = useReducedMotion();

  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const debouncedQuery = useDebounce(query, 100);

  // Reset state when opened
  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      // Focus input after enter animation lands
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [open]);

  const results = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    const allPages = isAuthed ? [...pages, ...protectedPages] : pages;

    const groups = [];

    // Quick actions only when relevant
    const actions = [];
    if (isAuthed) {
      actions.push({
        id: 'a_logout',
        label: 'Sign out',
        sub: 'End this session',
        icon: <LogOut size={18} />,
        run: () => {
          logout();
          toast('Signed out');
        },
      });
      actions.push({
        id: 'a_upload_rx',
        label: 'Upload prescription',
        sub: 'Open the Rx uploader',
        icon: <Upload size={18} />,
        run: () => navigate('/prescriptions'),
      });
    } else {
      actions.push({
        id: 'a_login',
        label: 'Sign in',
        sub: 'Use mobile + OTP',
        icon: <LogIn size={18} />,
        run: () => navigate('/auth/login'),
      });
    }

    if (!q) {
      groups.push({ id: 'pages', heading: 'Jump to', items: allPages });
      groups.push({ id: 'actions', heading: 'Quick actions', items: actions });
      return groups;
    }

    // Medicines
    const meds = searchMedicines({ q }).slice(0, 6).map((m) => ({
      id: `m_${m.id}`,
      kind: 'medicine',
      medicine: m,
      label: m.brand,
      sub: `${m.salt} · ${formatPrice(m.sellingPrice)}`,
      to: `/medicine/${m.id}`,
    }));
    if (meds.length) groups.push({ id: 'medicines', heading: 'Medicines', items: meds });

    // Pages match by label or sub
    const pageMatches = allPages.filter(
      (p) => p.label.toLowerCase().includes(q) || p.sub.toLowerCase().includes(q)
    );
    if (pageMatches.length)
      groups.push({ id: 'pages', heading: 'Jump to', items: pageMatches });

    const actionMatches = actions.filter(
      (a) => a.label.toLowerCase().includes(q) || a.sub.toLowerCase().includes(q)
    );
    if (actionMatches.length)
      groups.push({ id: 'actions', heading: 'Quick actions', items: actionMatches });

    return groups;
  }, [debouncedQuery, isAuthed, logout, navigate]);

  const flat = useMemo(() => results.flatMap((g) => g.items), [results]);

  // Reset selection when results shrink
  useEffect(() => {
    if (activeIndex >= flat.length) setActiveIndex(0);
  }, [flat.length, activeIndex]);

  const runItem = useCallback(
    (item) => {
      if (!item) return;
      if (item.run) item.run();
      else if (item.to) navigate(item.to);
      close();
    },
    [navigate, close]
  );

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (flat.length ? (i + 1) % flat.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (flat.length ? (i - 1 + flat.length) % flat.length : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      runItem(flat[activeIndex]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      close();
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.querySelector(`[data-cmd-index="${activeIndex}"]`);
    if (el) el.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  return (
    <AnimatePresence>
      {open && (
        <m.div
          key="cmd-root"
          className="fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
          aria-label="Quick navigation"
        >
          {/* Backdrop */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={baseTransition}
            onClick={close}
            className="absolute inset-0 bg-text-primary/40 backdrop-blur-sm"
            aria-hidden
          />

          {/* Dialog */}
          <m.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: 4 }}
            transition={springs.snappy}
            className="absolute inset-x-3 top-16 md:left-1/2 md:right-auto md:-translate-x-1/2 md:top-24 md:w-full md:max-w-xl"
          >
            <div className="bg-bg-surface rounded-2xl shadow-pop border border-border-subtle overflow-hidden">
              {/* Input */}
              <div className="flex items-center gap-2 px-4 h-14 border-b border-border-subtle">
                <Search size={18} className="text-text-tertiary shrink-0" aria-hidden />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActiveIndex(0);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Search medicines, jump to a page, or take an action"
                  autoComplete="off"
                  spellCheck={false}
                  className="flex-1 bg-transparent outline-none text-body text-text-primary placeholder:text-text-tertiary"
                  aria-label="Command palette search"
                />
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close"
                  className="shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-full text-text-tertiary hover:text-text-primary hover:bg-bg-muted"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Results */}
              <div
                ref={listRef}
                className="max-h-[60vh] overflow-y-auto overflow-x-hidden py-2 scrollbar-subtle"
                role="listbox"
                aria-label="Results"
              >
                {flat.length === 0 ? (
                  <p className="text-center text-body text-text-tertiary py-10 px-4">
                    Nothing matches &ldquo;{debouncedQuery}&rdquo;.
                  </p>
                ) : (
                  results.map((group) => (
                    <ResultGroup key={group.id} heading={group.heading}>
                      {group.items.map((item) => {
                        const flatIdx = flat.indexOf(item);
                        return (
                          <ResultRow
                            key={item.id}
                            item={item}
                            active={flatIdx === activeIndex}
                            index={flatIdx}
                            onMouseEnter={() => setActiveIndex(flatIdx)}
                            onClick={() => runItem(item)}
                          />
                        );
                      })}
                    </ResultGroup>
                  ))
                )}
              </div>

              {/* Footer hints */}
              <div className="flex items-center justify-between gap-3 px-4 h-10 border-t border-border-subtle text-caption text-text-tertiary">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Hint kbd={<ArrowUp size={12} />}>Move</Hint>
                  <Hint kbd={<ArrowDown size={12} />}>Move</Hint>
                  <Hint kbd={<CornerDownLeft size={12} />}>Open</Hint>
                </div>
                <Hint label="Esc">Close</Hint>
              </div>
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}

function ResultGroup({ heading, children }) {
  return (
    <div className="mb-1 px-2">
      <p className="px-1 pt-2 pb-1 text-label uppercase text-text-tertiary">{heading}</p>
      <ul>{children}</ul>
    </div>
  );
}

function ResultRow({ item, active, index, onMouseEnter, onClick }) {
  const isMedicine = item.kind === 'medicine';
  return (
    <li role="option" aria-selected={active}>
      <button
        type="button"
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        data-cmd-index={index}
        className={clsx(
          'w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors',
          active ? 'bg-primary-muted text-text-primary' : 'hover:bg-bg-muted'
        )}
      >
        <span className="shrink-0">
          {isMedicine ? (
            <span className="block h-9 w-9 rounded-lg overflow-hidden border border-border-subtle">
              <ProductImage
                medicine={item.medicine}
                variant="front"
                size="sm"
                withGuides={false}
                rounded=""
              />
            </span>
          ) : (
            <span
              className={clsx(
                'inline-flex h-9 w-9 items-center justify-center rounded-lg',
                active ? 'bg-bg-surface text-primary' : 'bg-bg-muted text-text-secondary'
              )}
            >
              {item.icon}
            </span>
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-body font-semibold text-text-primary line-clamp-1">
            {item.label}
          </span>
          <span className="block text-caption text-text-secondary line-clamp-1">{item.sub}</span>
        </span>
        {isMedicine && item.medicine.requiresPrescription && (
          <Badge variant="warning">Rx</Badge>
        )}
        {active && (
          <CornerDownLeft size={14} className="shrink-0 text-text-tertiary" aria-hidden />
        )}
      </button>
    </li>
  );
}

function Hint({ kbd, label, children }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <kbd className="inline-flex items-center justify-center min-w-5 h-5 px-1 rounded border border-border-subtle bg-bg-muted text-text-secondary text-[10px] font-semibold">
        {kbd ?? label}
      </kbd>
      {children}
    </span>
  );
}

export function KbdHint() {
  return isMac ? (
    <span className="inline-flex items-center gap-0.5">
      <kbd className="text-[11px] font-semibold">⌘</kbd>
      <kbd className="text-[11px] font-semibold">K</kbd>
    </span>
  ) : (
    <span className="inline-flex items-center gap-0.5">
      <kbd className="text-[11px] font-semibold">Ctrl</kbd>
      <kbd className="text-[11px] font-semibold">K</kbd>
    </span>
  );
}
