import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import PageTransition from './PageTransition';
import ScrollToTop from './ScrollToTop';
import MobileNav from './MobileNav';

const NO_BOTTOM_NAV_PADDING = ['/medicine/', '/auth/'];
const NO_BOTTOM_NAV_PADDING_EXACT = new Set(['/cart', '/checkout']);

function bottomNavVisible(pathname) {
  if (NO_BOTTOM_NAV_PADDING_EXACT.has(pathname)) return false;
  return !NO_BOTTOM_NAV_PADDING.some((p) => pathname.startsWith(p));
}

export default function RootLayout() {
  const location = useLocation();
  const padBottom = bottomNavVisible(location.pathname);

  return (
    <div className="min-h-dvh flex flex-col bg-bg-page text-text-primary">
      <ScrollToTop />
      <Header />
      <main className={padBottom ? 'flex-1 pb-20 md:pb-0' : 'flex-1'}>
        <AnimatePresence mode="wait" initial={false}>
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
