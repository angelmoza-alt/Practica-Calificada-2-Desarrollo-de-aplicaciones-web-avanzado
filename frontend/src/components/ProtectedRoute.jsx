import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Protege rutas: exige sesión y, opcionalmente, ciertos roles
export default function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (roles && !roles.some((r) => user.roles.includes(r))) return <Navigate to="/no-autorizado" replace />;
  return children;
}
