import { NavLink, Outlet } from 'react-router-dom';
import { m } from 'framer-motion';
import { User, MapPin, Heart, LogOut, Repeat } from 'lucide-react';
import clsx from 'clsx';
import { useAuthStore } from '@/store/useAuthStore';
import { useProfileStore } from '@/store/useProfileStore';
import { springs } from '@/motion/transitions';

const sections = [
  { to: '/account/profile', label: 'Profile', icon: <User size={18} /> },
  { to: '/account/addresses', label: 'Addresses', icon: <MapPin size={18} /> },
  { to: '/account/wishlist', label: 'Wishlist', icon: <Heart size={18} /> },
  { to: '/account/subscriptions', label: 'Subscriptions', icon: <Repeat size={18} /> },
];

export default function AccountLayout() {
  const user = useAuthStore((s) => s.user);
  const profileName = useProfileStore((s) => s.name);
  const logout = useAuthStore((s) => s.logout);

  const displayName = profileName || user?.name || 'Friend';

  return (
    <main className="mx-auto max-w-screen-xl px-4 md:px-6 lg:px-8 py-6 md:py-10">
      <h1 className="text-h1 md:text-h1-lg text-text-primary">Hi, {displayName}</h1>
      <p className="mt-1 text-body text-text-secondary">
        Manage your profile, addresses, and saved medicines.
      </p>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* Sidebar (desktop) / pill row (mobile) */}
        <nav className="lg:col-span-3" aria-label="Account sections">
          {/* Mobile: horizontal scrollable pills */}
          <div className="lg:hidden -mx-4 px-4 overflow-x-auto">
            <div className="flex gap-2 min-w-min">
              {sections.map((s) => (
                <NavPill key={s.to} {...s} />
              ))}
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-1.5 px-4 h-10 rounded-full text-caption font-semibold text-text-secondary hover:text-danger bg-bg-surface border border-border-subtle hover:border-danger/30 transition-colors whitespace-nowrap"
              >
                <LogOut size={16} />
                Sign out
              </button>
            </div>
          </div>

          {/* Desktop: vertical nav */}
          <ul className="hidden lg:block lg:sticky lg:top-20 space-y-1">
            {sections.map((s) => (
              <li key={s.to}>
                <NavRow {...s} />
              </li>
            ))}
            <li className="pt-2 mt-2 border-t border-border-subtle">
              <button
                type="button"
                onClick={logout}
                className="w-full inline-flex items-center gap-2.5 px-3 h-11 rounded-xl text-body font-semibold text-text-secondary hover:text-danger hover:bg-danger-muted transition-colors"
              >
                <LogOut size={18} />
                Sign out
              </button>
            </li>
          </ul>
        </nav>

        <section className="lg:col-span-9">
          <Outlet />
        </section>
      </div>
    </main>
  );
}

function NavRow({ to, label, icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        clsx(
          'flex items-center gap-2.5 px-3 h-11 rounded-xl text-body font-semibold transition-colors',
          isActive
            ? 'bg-primary-muted text-primary'
            : 'text-text-secondary hover:text-text-primary hover:bg-bg-muted'
        )
      }
    >
      {icon}
      {label}
    </NavLink>
  );
}

function NavPill({ to, label, icon }) {
  return (
    <NavLink to={to} className="contents">
      {({ isActive }) => (
        <m.span
          layout
          whileTap={{ scale: 0.97 }}
          transition={springs.soft}
          className={clsx(
            'inline-flex items-center gap-1.5 px-4 h-10 rounded-full text-caption font-semibold whitespace-nowrap transition-colors',
            isActive
              ? 'bg-primary text-white'
              : 'bg-bg-surface text-text-secondary border border-border-subtle hover:border-border-strong hover:text-text-primary'
          )}
        >
          {icon}
          {label}
        </m.span>
      )}
    </NavLink>
  );
}
