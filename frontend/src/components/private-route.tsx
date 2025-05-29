import { type JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import Loading from './ui/loading';

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, loading } = useAuth();

  if(loading) return <Loading />

  return isAuthenticated ? children : <Navigate to="/" replace />;
}
