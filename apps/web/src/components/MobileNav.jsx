import { NavLink, useLocation } from 'react-router-dom';
import { m } from 'framer-motion';
import { Home, Search, ShoppingBag, Package, User } from 'lucide-react';
import clsx from 'clsx';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore, selectIsAuthenticated } from '@/store/useAuthStore';
import { springs } from '@/motion/transitions';

// Hidden on these routes — pages that already own the bottom edge with a sticky CTA.
const HIDDEN_PREFIXES = ['/medicine/', '/auth/'];
const HIDDEN_EXACT = new Set(['/cart', '/checkout']);

function isHidden(pathname) {
  if (HIDDEN_EXACT.has(pathname)) return true;
  return HIDDEN_PREFIXES.some((p) => pathname.startsWith(p));
}

export default function MobileNav() {
  const { pathname } = useLocation();
  const cartCount = useCartStore((s) => s.items.reduce((n, i) => n + i.qty, 0));
  const isAuthed = useAuthStore(selectIsAuthenticated);

  if (isHidden(pathname)) return null;

  const items = [
    { to: '/', label: 'Home', icon: Home, end: true },
    { to: '/search', label: 'Search', icon: Search },
    { to: '/cart', label: 'Cart', icon: ShoppingBag, badge: cartCount },
    {
      to: isAuthed ? '/orders' : '/auth/login?next=/orders',
      label: 'Orders',
      icon: Package,
      match: '/orders',
    },
    {
      to: isAuthed ? '/account' : '/auth/login?next=/account',
      label: 'Account',
      icon: User,
      match: '/account',
    },
  ];

  return (
    <nav
      className="md:hidden fixed inset-x-0 bottom-0 z-30 bg-bg-surface/95 backdrop-blur-md border-t border-border-subtle pb-[env(safe-area-inset-bottom)]"
      aria-label="Primary"
    >
      <ul className="grid grid-cols-5 h-16">
        {items.map((it) => (
          <li key={it.label} className="flex">
            <NavLink
              to={it.to}
              end={it.end}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 outline-none"
            >
              {({ isActive }) => {
                const active =
                  isActive || (it.match ? pathname.startsWith(it.match) : false);
                return (
                  <NavItem
                    icon={<it.icon size={22} />}
                    label={it.label}
                    active={active}
                    badge={it.badge}
                  />
                );
              }}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function NavItem({ icon, label, active, badge }) {
  return (
    <m.span
      whileTap={{ scale: 0.92 }}
      transition={springs.snappy}
      className={clsx(
        'inline-flex flex-col items-center justify-center gap-0.5 relative',
        'px-1 min-w-[44px] min-h-[44px]'
      )}
    >
      <span
        className={clsx(
          'inline-flex items-center justify-center transition-colors',
          active ? 'text-primary' : 'text-text-tertiary'
        )}
      >
        {icon}
        {badge > 0 && (
          <m.span
            key={badge}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={springs.snappy}
            className="absolute -top-1 right-2 min-w-4 h-4 px-1 inline-flex items-center justify-center rounded-full bg-accent text-white text-[10px] font-bold tabular"
          >
            {badge > 99 ? '99+' : badge}
          </m.span>
        )}
      </span>
      <span
        className={clsx(
          'text-[11px] font-semibold transition-colors leading-none',
          active ? 'text-primary' : 'text-text-tertiary'
        )}
      >
        {label}
      </span>
      {active && (
        <m.span
          layoutId="mobile-nav-active"
          transition={springs.snappy}
          className="absolute -top-px h-0.5 w-8 bg-primary rounded-full"
          aria-hidden
        />
      )}
    </m.span>
  );
}
