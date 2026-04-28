import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Reset scroll on every navigation. SPA default is to keep scroll position,
// which is wrong when moving between unrelated pages (search list -> PDP).
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}
