import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '@/components/RootLayout';
import ProtectedRoute from './ProtectedRoute';
import Skeleton from '@/components/Skeleton';

const Home = lazy(() => import('@/pages/Home'));
const Search = lazy(() => import('@/pages/Search'));
const MedicineDetail = lazy(() => import('@/pages/MedicineDetail'));
const Cart = lazy(() => import('@/pages/Cart'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const withSuspense = (node) => <Suspense fallback={<Skeleton.Page />}>{node}</Suspense>;
const protectedRoute = (node) => <ProtectedRoute>{withSuspense(node)}</ProtectedRoute>;

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: withSuspense(<Home />) },
      { path: '/search', element: withSuspense(<Search />) },
      { path: '/medicine/:id', element: withSuspense(<MedicineDetail />) },
      { path: '/cart', element: withSuspense(<Cart />) },
      // protected routes wired as their pages land
      // example: { path: '/checkout', element: protectedRoute(<Checkout />) },
      { path: '*', element: withSuspense(<NotFound />) },
    ],
  },
]);

// keep export to avoid unused-import warning when routes grow
export { protectedRoute };
