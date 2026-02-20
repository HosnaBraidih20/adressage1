import React, { useState, useEffect, useRef } from 'react';
import { useKeycloak } from '../../context/KeycloakContext';
import * as api from '../../services/api';

/**
 * User Info Component
 * Displays current user information from token and Keycloak
 * Renders only after authentication is complete
 */
export const UserInfo = () => {
  const { user, isAuthenticated, isInitialized, loading: authLoading } = useKeycloak();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Prevent double fetch in React StrictMode
  const isFetchRun = useRef(false);

  useEffect(() => {
    // Only load when Keycloak is fully initialized and user is authenticated
    if (!isInitialized || !isAuthenticated || authLoading) {
      return;
    }

    // Prevent double fetch
    if (isFetchRun.current) {
      return;
    }
    isFetchRun.current = true;

    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('📤 Fetching user details from API...');
        
        // Use the API instance with interceptor (has JWT token attached automatically)
        const response = await api.API.get('/auth/me');
        setUserDetails(response.data);
        console.log('✅ User details loaded');
      } catch (err) {
        console.error('❌ Failed to fetch user details:', err);
        setError('Could not load user details');
        // Don't fail completely, component can still show basic info from token
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [isInitialized, isAuthenticated, authLoading]);

  if (!isInitialized || !isAuthenticated) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">👤 User Information</h2>

      {loading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-4">
          <p className="text-red-600 text-sm">⚠️ {error}</p>
        </div>
      )}

      <div className="space-y-4">
        {/* Basic Info from Token */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Username</p>
            <p className="text-lg font-semibold text-gray-900">{user?.username || 'N/A'}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Email</p>
            <p className="text-lg font-semibold text-gray-900">{user?.email || 'N/A'}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Full Name</p>
            <p className="text-lg font-semibold text-gray-900">{user?.name || 'N/A'}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Authenticated</p>
            <p className="text-lg font-semibold">
              <span className="text-green-600">🟢 Yes</span>
            </p>
          </div>
        </div>

        {/* Roles from Token */}
        {user?.roles && user.roles.length > 0 && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-600 font-semibold mb-2">🔐 Roles</p>
            <div className="flex flex-wrap gap-2">
              {user.roles.map((role) => (
                <span
                  key={role}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Server-side User Details */}
        {userDetails?.roles && (
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <p className="text-sm text-purple-600 font-semibold mb-2">📊 Server Details</p>
            <div className="flex flex-wrap gap-2">
              {userDetails.roles.map((role) => (
                <span
                  key={role}
                  className="px-3 py-1 bg-purple-600 text-white text-sm rounded-full"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Token Info */}
        {user?.token && (
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-700 font-semibold mb-2">🔑 Token Info</p>
            <div className="text-xs text-yellow-600 space-y-1">
              <p>
                <strong>Token Length:</strong> {user.token?.length || 0} characters
              </p>
              <p>
                <strong>Token Preview:</strong>{' '}
                {user.token ? `${user.token.substring(0, 20)}...${user.token.substring(user.token.length - 20)}` : 'N/A'}
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-4">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            disabled={loading}
          >
            🔄 Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
