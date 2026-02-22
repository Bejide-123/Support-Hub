// src/components/AuthGuard.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { getCurrentUser } from '../features/Auth/authSlice';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'agent';
}

const AuthGuard = ({ children, requiredRole }: AuthGuardProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isLoading, initialized } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!initialized) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, initialized]);

  useEffect(() => {
    if (initialized && !isLoading) {
      if (!user) {
        // Not logged in
        navigate('/login');
      } else if (requiredRole && user.role !== requiredRole) {
        // Wrong role - redirect to appropriate dashboard
        if (user.role === 'agent') {
          navigate('/agent/dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    }
  }, [user, isLoading, initialized, navigate, requiredRole]);

  if (!initialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  if (requiredRole && user.role !== requiredRole) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
};

export default AuthGuard;