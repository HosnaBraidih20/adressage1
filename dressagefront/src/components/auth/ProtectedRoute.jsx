import React from 'react';
import { Navigate } from 'react-router-dom';
import { useKeycloak } from '../../context/KeycloakContext';

/**
 * Protected Route Component
 * Redirects to login if user is not authenticated
 */
export const ProtectedRoute = ({ 
  children, 
  requiredRoles = [], 
  fallback = <Navigate to="/login" replace /> 
}) => {
  const { isAuthenticated, loading, hasRole, isAdmin } = useKeycloak();

  // Show loading indicator while initializing
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-6"></div>
          <p className="text-gray-700 font-semibold">Verifying authentication...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait while we verify your credentials</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.warn('🔐 Access Denied: User not authenticated');
    console.log('ℹ️ Redirecting to login...');
    return fallback;
  }

  // Check role-based access
  if (requiredRoles && requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some(role => hasRole(role));

    if (!hasRequiredRole) {
      console.warn('🚫 Access Denied: User does not have required role(s):', requiredRoles);
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md">
            <h1 className="text-4xl font-bold text-red-600 mb-4">🚫 Access Denied</h1>
            <p className="text-gray-600 mb-6">You do not have permission to access this page</p>
            <p className="text-sm text-gray-500 mb-6">Required roles: <span className="font-mono font-bold">{requiredRoles.join(', ')}</span></p>
            <a href="/login" className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition">
              Back to Home
            </a>
          </div>
        </div>
      );
    }
  }

  // User is authenticated and authorized
  console.log('✅ User authenticated and authorized');
  return children;
};

/**
 * Admin Only Route Component
 */
export const AdminRoute = ({ children, fallback = <Navigate to="/" replace /> }) => {
  const { loading, isAdmin } = useKeycloak();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAdmin()) {
    console.warn('❌ User is not admin');
    return fallback;
  }

  return children;
};

export default ProtectedRoute;
