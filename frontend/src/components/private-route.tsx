import { type JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, loading } = useAuth();

  if(loading) return <div>Loading...</div>

  return isAuthenticated ? children : <Navigate to="/" replace />;
}
