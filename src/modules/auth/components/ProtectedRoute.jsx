import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/modules/auth/hooks/useAuth';

export default function ProtectedRoute({ children, allowedTypes = [] }) {
  const { user, loading, userType } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loader">
          <div></div>
          <div className="animation-delay-100"></div>
          <div className="animation-delay-200"></div>
        </div>
      </div>
    );
  }

  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If allowedTypes is empty, allow any authenticated user
  if (allowedTypes.length === 0) {
    return children;
  }

  // If user type doesn't match allowedTypes, redirect to appropriate home
  if (!allowedTypes.includes(userType)) {
    if (userType === 'admin') {
      return <Navigate to="/admin" replace />;
    } else if (userType === 'hairdresser') {
      return <Navigate to="/hairdresser" replace />;
    } else {
      return <Navigate to="/client" replace />;
    }
  }

  return children;
}