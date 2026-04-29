import { NavLink, Outlet } from 'react-router-dom';
import clsx from 'clsx';

const sections = [
  { to: '/legal/privacy', label: 'Privacy' },
  { to: '/legal/terms', label: 'Terms' },
  { to: '/legal/refund', label: 'Refund policy' },
];

export default function LegalLayout() {
  return (
    <main className="mx-auto max-w-screen-xl px-4 md:px-6 lg:px-8 py-6 md:py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        <nav className="lg:col-span-3" aria-label="Legal sections">
          <div className="lg:hidden -mx-4 px-4 overflow-x-auto">
            <div className="flex gap-2 min-w-min">
              {sections.map((s) => (
                <NavLink
                  key={s.to}
                  to={s.to}
                  className={({ isActive }) =>
                    clsx(
                      'inline-flex items-center px-4 h-10 rounded-full text-caption font-semibold whitespace-nowrap transition-colors',
                      isActive
                        ? 'bg-primary text-white'
                        : 'bg-bg-surface text-text-secondary border border-border-subtle hover:border-border-strong hover:text-text-primary'
                    )
                  }
                >
                  {s.label}
                </NavLink>
              ))}
            </div>
          </div>
          <ul className="hidden lg:block lg:sticky lg:top-20 space-y-1">
            {sections.map((s) => (
              <li key={s.to}>
                <NavLink
                  to={s.to}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center gap-2.5 px-3 h-11 rounded-xl text-body font-semibold transition-colors',
                      isActive
                        ? 'bg-primary-muted text-primary'
                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-muted'
                    )
                  }
                >
                  {s.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <article className="lg:col-span-9 bg-bg-surface border border-border-subtle rounded-2xl shadow-card p-5 md:p-8 prose-content">
          <Outlet />
        </article>
      </div>
    </main>
  );
}
