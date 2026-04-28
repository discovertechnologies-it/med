import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './PageTransition';

export default function RootLayout() {
  const location = useLocation();
  return (
    <div className="min-h-dvh bg-bg-page text-text-primary">
      <AnimatePresence mode="wait" initial={false}>
        <PageTransition key={location.pathname}>
          <Outlet />
        </PageTransition>
      </AnimatePresence>
    </div>
  );
}
