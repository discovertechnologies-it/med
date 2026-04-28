import { Link } from 'react-router-dom';
import Logo from './Logo';

const columns = [
  {
    title: 'Shop',
    links: [
      { to: '/search', label: 'Search medicines' },
      { to: '/categories', label: 'Browse categories' },
      { to: '/prescriptions', label: 'Upload prescription' },
    ],
  },
  {
    title: 'Account',
    links: [
      { to: '/orders', label: 'My orders' },
      { to: '/subscriptions', label: 'Subscriptions' },
      { to: '/account', label: 'Profile' },
    ],
  },
  {
    title: 'Company',
    links: [
      { to: '/help', label: 'Help center' },
      { to: '/about', label: 'About' },
      { to: '/contact', label: 'Contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { to: '/legal/privacy', label: 'Privacy' },
      { to: '/legal/terms', label: 'Terms' },
      { to: '/legal/refund', label: 'Refund policy' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-16 md:mt-24 border-t border-border-subtle bg-bg-surface">
      <div className="mx-auto max-w-screen-xl px-4 md:px-6 lg:px-8 py-10 md:py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-6">
          <div className="col-span-2 md:col-span-1">
            <Logo />
            <p className="mt-3 text-caption text-text-secondary max-w-xs">
              Pharmacist-reviewed medicines, delivered safely.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-label uppercase text-text-tertiary">{col.title}</p>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="text-body text-text-secondary hover:text-text-primary"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 pt-6 border-t border-border-subtle flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p className="text-caption text-text-tertiary">
            Pharmacist on record: Reg. No. ABC-12345 &middot; Drugs and Cosmetics Act compliant
          </p>
          <p className="text-caption text-text-tertiary">
            &copy; {new Date().getFullYear()} Med. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
