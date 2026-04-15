import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import type { RootState } from '../store';

interface ProtectedRouteProps {
  allowedRoles?: string[]; // Optional: if you have different user roles
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  void allowedRoles;
  const { isAuthenticated, user, isLoading, initialized } = useSelector((state: RootState) => state.auth);

  // Show loading while checking auth status (only for auth operations, not data operations)
  if (isLoading) {
    return <div>Loading authentication...</div>;
  }

  // Don't redirect if we haven't checked for existing session yet
  // This prevents the redirect loop during initial load
  if (!initialized) {
    return <div>Loading authentication...</div>;
  }

  // Check if user is authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Optional: Role-based access control
  // if (allowedRoles && !allowedRoles.includes(user.role)) {
  //   return <Navigate to="/unauthorized" replace />; // Redirect to an unauthorized page
  // }

  return <Outlet />;
};

export default ProtectedRoute;
