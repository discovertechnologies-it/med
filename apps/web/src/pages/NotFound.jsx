import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Search, ShoppingBag, LifeBuoy, Compass } from 'lucide-react';
import Button from '@/components/Button';
import SearchBar from '@/components/SearchBar';

const popular = [
  { to: '/', label: 'Home', icon: <Home size={16} /> },
  { to: '/search', label: 'Search medicines', icon: <Search size={16} /> },
  { to: '/categories', label: 'Browse categories', icon: <Compass size={16} /> },
  { to: '/cart', label: 'Cart', icon: <ShoppingBag size={16} /> },
  { to: '/help', label: 'Help center', icon: <LifeBuoy size={16} /> },
];

export default function NotFound() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');

  return (
    <main className="mx-auto max-w-screen-md px-4 py-16 md:py-24 text-center">
      <p className="text-label uppercase text-text-secondary">404</p>
      <h1 className="mt-3 text-display text-text-primary">We could not find that page.</h1>
      <p className="mt-3 text-body-lg text-text-secondary max-w-md mx-auto">
        The link may be broken or the page may have moved. Try a search or pick a destination
        below.
      </p>

      <div className="mt-6 max-w-lg mx-auto">
        <SearchBar
          value={q}
          onChange={setQ}
          onSubmit={(value) => navigate(`/search?q=${encodeURIComponent(value)}`)}
          placeholder="Search medicines, salts, or brands"
        />
      </div>

      <ul className="mt-8 flex flex-wrap items-center justify-center gap-2">
        {popular.map((p) => (
          <li key={p.to}>
            <Link to={p.to} className="contents">
              <Button variant="secondary" size="sm" leftIcon={p.icon}>
                {p.label}
              </Button>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-10 inline-block">
        <Link to="/">
          <Button>Back to home</Button>
        </Link>
      </div>
    </main>
  );
}
