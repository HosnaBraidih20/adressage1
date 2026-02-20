import './App.css';
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import RegisterPage from './pages/RegisterPage';
import { KeycloakProvider, useKeycloak } from './context/KeycloakContext';
import { setupAPIInterceptors } from './services/api';
import ProtectedRoute, { AdminRoute } from './components/auth/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import UnauthorizedPage from './pages/UnauthorizedPage';

/**
 * Layout for Authenticated Users (with Header and Footer)
 */
function ProtectedLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F1F5F9] flex flex-col font-sans antialiased">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}

/**
 * Layout for Unauthenticated Users (Login page - no header/footer)
 */
function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}

/**
 * App Content Component
 * This separates the Keycloak hook usage from the provider
 */
function AppContent() {
  const { keycloak, isInitialized, loading, isAuthenticated } = useKeycloak();

  useEffect(() => {
    if (keycloak && isInitialized) {
      // Setup API interceptors after Keycloak is initialized
      // This ensures the JWT token is attached to all API requests
      setupAPIInterceptors(keycloak);
      console.log('✅ API interceptors configured with Keycloak instance');
    }
  }, [keycloak, isInitialized]);

  // Show loading screen while Keycloak is initializing
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Initializing Authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes - No Header/Footer */}
      <Route path="/login" element={<PublicLayout><KeycloakProvider /></PublicLayout>} />
      <Route path="/unauthorized" element={<PublicLayout><UnauthorizedPage /></PublicLayout>} />

      {/* Protected Routes - With Header/Footer */}
      <Route
        path="/register"
        element={
          <ProtectedLayout>
            <ProtectedRoute fallback={<Navigate to="/login" replace />}>
              <RegisterPage />
            </ProtectedRoute>
          </ProtectedLayout>
        }
      />

      {/* Admin Routes - With Header/Footer */}
      <Route
        path="/admin"
        element={
          <ProtectedLayout>
            <AdminRoute fallback={<Navigate to="/unauthorized" replace />}>
              <AdminDashboard />
            </AdminRoute>
          </ProtectedLayout>
        }
      />

      {/* Default Route - Redirect based on authentication status */}
      <Route 
        path="/" 
        element={
          isAuthenticated ? 
            <Navigate to="/register" replace /> : 
            <Navigate to="/login" replace />
        } 
      />
      
      {/* Catch-all Route - Redirect to login if authenticated status unknown */}
      <Route 
        path="*" 
        element={
          <Navigate to={isAuthenticated ? "/register" : "/login"} replace />
        } 
      />
    </Routes>
  );
}

/**
 * Main App Component
 * Wraps everything with Keycloak Provider
 */
function App() {
  return (
    <Router>
      <KeycloakProvider>
        <AppContent />
      </KeycloakProvider>
    </Router>
  );
}

export default App;
