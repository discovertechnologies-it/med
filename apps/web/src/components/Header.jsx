import { Link, NavLink } from 'react-router-dom';
import { m } from 'framer-motion';
import { ShoppingBag, Search, User, Package } from 'lucide-react';
import clsx from 'clsx';
import Logo from './Logo';
import Button from './Button';
import { KbdHint } from './CommandPalette';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore, selectIsAuthenticated } from '@/store/useAuthStore';
import { useCommandStore } from '@/store/useCommandStore';
import { useScrolled } from '@/hooks/useScrolled';
import { springs } from '@/motion/transitions';

const navLinks = [
  { to: '/search', label: 'Search' },
  { to: '/categories', label: 'Categories' },
  { to: '/orders', label: 'Orders' },
  { to: '/help', label: 'Help' },
];

export default function Header() {
  const cartCount = useCartStore((s) => s.items.reduce((n, i) => n + i.qty, 0));
  const isAuthed = useAuthStore(selectIsAuthenticated);
  const openCmd = useCommandStore((s) => s.openIt);
  const scrolled = useScrolled(4);

  return (
    <header
      className={clsx(
        'sticky top-0 z-40 transition-colors duration-200',
        scrolled
          ? 'bg-bg-page/85 backdrop-blur-md border-b border-border-subtle'
          : 'bg-bg-page border-b border-transparent'
      )}
    >
      <div className="mx-auto max-w-screen-xl px-4 md:px-6 lg:px-8 h-14 md:h-16 flex items-center justify-between gap-4">
        <Logo />

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                clsx(
                  'px-3 h-9 inline-flex items-center rounded-full text-body font-medium transition-colors',
                  isActive
                    ? 'bg-primary-muted text-primary'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-muted'
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop command palette trigger */}
        <button
          type="button"
          onClick={openCmd}
          aria-label="Open quick search"
          className="hidden md:inline-flex items-center gap-2 h-9 pl-3 pr-2 rounded-full bg-bg-muted hover:bg-border-subtle text-text-secondary hover:text-text-primary transition-colors"
        >
          <Search size={16} />
          <span className="text-caption">Quick search</span>
          <span className="inline-flex items-center justify-center px-1.5 h-5 rounded border border-border-subtle bg-bg-surface text-text-tertiary tabular leading-none">
            <KbdHint />
          </span>
        </button>

        <div className="flex items-center gap-1 md:gap-2">
          <Link
            to="/search"
            className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-full text-text-primary hover:bg-bg-muted"
            aria-label="Search"
          >
            <Search size={20} />
          </Link>

          <Link
            to="/cart"
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-full text-text-primary hover:bg-bg-muted"
            aria-label={`Cart, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`}
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <m.span
                key={cartCount}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={springs.snappy}
                className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 inline-flex items-center justify-center rounded-full bg-accent text-white text-[11px] font-semibold tabular"
              >
                {cartCount > 99 ? '99+' : cartCount}
              </m.span>
            )}
          </Link>

          {isAuthed ? (
            <>
              <Link to="/orders" className="hidden md:inline-flex">
                <Button size="sm" variant="ghost" leftIcon={<Package size={18} />}>
                  Orders
                </Button>
              </Link>
              <Link to="/orders" className="md:hidden">
                <Button size="sm" variant="ghost" aria-label="Orders">
                  <Package size={18} />
                </Button>
              </Link>
              <Link to="/account" aria-label="Account">
                <Button size="sm" variant="ghost">
                  <User size={18} />
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/auth/login" className="hidden md:inline-flex">
                <Button size="sm" variant="ghost" leftIcon={<User size={18} />}>
                  Sign in
                </Button>
              </Link>
              <Link to="/auth/login" className="md:hidden">
                <Button size="sm" variant="ghost" aria-label="Sign in">
                  <User size={18} />
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
