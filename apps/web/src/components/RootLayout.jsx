import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import PageTransition from './PageTransition';
import ScrollToTop from './ScrollToTop';

export default function RootLayout() {
  const location = useLocation();
  return (
    <div className="min-h-dvh flex flex-col bg-bg-page text-text-primary">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
