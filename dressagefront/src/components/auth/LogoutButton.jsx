import React from 'react';
import { useKeycloak } from '../context/KeycloakContext';
import Swal from 'sweetalert2';

/**
 * Logout Button Component
 */
export const LogoutButton = ({ className = '', onClick }) => {
  const { logout, isAuthenticated, user } = useKeycloak();

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = async () => {
    try {
      // Show confirmation dialog
      const result = await Swal.fire({
        title: 'Logout',
        text: `Are you sure you want to logout, ${user?.name}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, logout',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#dc2626',
      });

      if (result.isConfirmed) {
        if (onClick) onClick();
        await logout();
      }
    } catch (error) {
      console.error('Logout failed:', error);
      Swal.fire('Error', 'Logout failed: ' + error.message, 'error');
    }
  };

  return (
    <button
      onClick={handleLogout}
      className={`px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition ${className}`}
    >
      🚪 Logout ({user?.name || 'User'})
    </button>
  );
};

export default LogoutButton;
