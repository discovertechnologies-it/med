import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '@/components/RootLayout';
import ProtectedRoute from './ProtectedRoute';
import Skeleton from '@/components/Skeleton';

const Home = lazy(() => import('@/pages/Home'));
const Search = lazy(() => import('@/pages/Search'));
const Categories = lazy(() => import('@/pages/Categories'));
const MedicineDetail = lazy(() => import('@/pages/MedicineDetail'));
const Cart = lazy(() => import('@/pages/Cart'));
const Login = lazy(() => import('@/pages/auth/Login'));
const Checkout = lazy(() => import('@/pages/Checkout'));
const Orders = lazy(() => import('@/pages/Orders'));
const OrderDetail = lazy(() => import('@/pages/OrderDetail'));
const Prescriptions = lazy(() => import('@/pages/Prescriptions'));
const AccountLayout = lazy(() => import('@/pages/account/AccountLayout'));
const Profile = lazy(() => import('@/pages/account/Profile'));
const Addresses = lazy(() => import('@/pages/account/Addresses'));
const Wishlist = lazy(() => import('@/pages/account/Wishlist'));
const Subscriptions = lazy(() => import('@/pages/account/Subscriptions'));
const Notifications = lazy(() => import('@/pages/account/Notifications'));
const Settings = lazy(() => import('@/pages/account/Settings'));
const Help = lazy(() => import('@/pages/Help'));
const Invoice = lazy(() => import('@/pages/Invoice'));
const LegalLayout = lazy(() => import('@/pages/legal/LegalLayout'));
const Privacy = lazy(() => import('@/pages/legal/Privacy'));
const Terms = lazy(() => import('@/pages/legal/Terms'));
const Refund = lazy(() => import('@/pages/legal/Refund'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const withSuspense = (node) => <Suspense fallback={<Skeleton.Page />}>{node}</Suspense>;
const protectedRoute = (node) => <ProtectedRoute>{withSuspense(node)}</ProtectedRoute>;

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: withSuspense(<Home />) },
      { path: '/search', element: withSuspense(<Search />) },
      { path: '/categories', element: withSuspense(<Categories />) },
      { path: '/medicine/:id', element: withSuspense(<MedicineDetail />) },
      { path: '/cart', element: withSuspense(<Cart />) },
      { path: '/auth/login', element: withSuspense(<Login />) },
      { path: '/checkout', element: protectedRoute(<Checkout />) },
      { path: '/orders', element: protectedRoute(<Orders />) },
      { path: '/orders/:id', element: protectedRoute(<OrderDetail />) },
      { path: '/orders/:id/invoice', element: protectedRoute(<Invoice />) },
      { path: '/prescriptions', element: protectedRoute(<Prescriptions />) },
      { path: '/help', element: withSuspense(<Help />) },
      {
        path: '/account',
        element: <ProtectedRoute>{withSuspense(<AccountLayout />)}</ProtectedRoute>,
        children: [
          { index: true, element: withSuspense(<Profile />) },
          { path: 'profile', element: withSuspense(<Profile />) },
          { path: 'addresses', element: withSuspense(<Addresses />) },
          { path: 'wishlist', element: withSuspense(<Wishlist />) },
          { path: 'subscriptions', element: withSuspense(<Subscriptions />) },
          { path: 'notifications', element: withSuspense(<Notifications />) },
          { path: 'settings', element: withSuspense(<Settings />) },
        ],
      },
      {
        path: '/legal',
        element: withSuspense(<LegalLayout />),
        children: [
          { index: true, element: withSuspense(<Privacy />) },
          { path: 'privacy', element: withSuspense(<Privacy />) },
          { path: 'terms', element: withSuspense(<Terms />) },
          { path: 'refund', element: withSuspense(<Refund />) },
        ],
      },
      { path: '*', element: withSuspense(<NotFound />) },
    ],
  },
]);

// keep export to avoid unused-import warning when routes grow
export { protectedRoute };
