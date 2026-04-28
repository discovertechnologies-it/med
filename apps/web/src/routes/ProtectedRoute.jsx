import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore, selectIsAuthenticated } from '@/store/useAuthStore';

export default function ProtectedRoute({ children }) {
  const isAuthed = useAuthStore(selectIsAuthenticated);
  const location = useLocation();
  if (!isAuthed) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/auth/login?next=${next}`} replace />;
  }
  return children;
}
