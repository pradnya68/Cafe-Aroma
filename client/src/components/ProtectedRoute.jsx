import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from './Loading';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loading message="Verifying authentication..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-3xl font-display text-espresso mb-3">Admin Access Restricted</h2>
        <p className="text-ink-muted max-w-md mb-6">
          You do not have administrative privileges to view this section. Please sign in with an administrator account.
        </p>
        <Navigate to="/" replace />
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
