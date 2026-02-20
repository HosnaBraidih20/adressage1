import React from 'react';
import { useKeycloak } from '../../context/KeycloakContext';
import Swal from 'sweetalert2';

/**
 * Login Button Component
 */
export const LoginButton = ({ className = '', onClick }) => {
  const { login, isAuthenticated } = useKeycloak();

  if (isAuthenticated) {
    return null;
  }

  const handleLogin = async () => {
    try {
      if (onClick) onClick();
      await login();
    } catch (error) {
      console.error('Login failed:', error);
      Swal.fire('Error', 'Login failed: ' + error.message, 'error');
    }
  };

  return (
    <button
      onClick={handleLogin}
      className={`px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition ${className}`}
    >
      🔐 Login with Keycloak
    </button>
  );
};

export default LoginButton;
