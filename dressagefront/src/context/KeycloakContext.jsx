import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import Keycloak from 'keycloak-js';

const KeycloakContext = createContext(null);

export const KeycloakProvider = ({ children }) => {
  const [keycloak, setKeycloak] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Utilisation d'une ref pour éviter la double initialisation en React 18 (Strict Mode)
  const isRun = useRef(false);

  /**
   * Initialisation de Keycloak
   */
  useEffect(() => {
    if (isRun.current) return;
    isRun.current = true;

    const initKeycloak = async () => {
      try {
        setLoading(true);

        const keycloakInstance = new Keycloak({
          url: 'http://localhost:8080',
          realm: 'MyStoreRealm',
          clientId: 'my-frontend-app',
        });

        const authenticated = await keycloakInstance.init({
          onLoad: 'login-required',
          silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
          pkceMethod: 'S256',
          checkLoginIframe: false,
          enableLogging: true
        });

        setKeycloak(keycloakInstance);
        setIsAuthenticated(authenticated);

        if (authenticated) {
          try {
            const userInfo = await keycloakInstance.loadUserInfo();
            setUser({
              username: keycloakInstance.tokenParsed?.preferred_username,
              email: userInfo?.email,
              name: userInfo?.name,
              roles: keycloakInstance.tokenParsed?.realm_access?.roles || [],
              token: keycloakInstance.token,
            });
          } catch (userErr) {
            console.warn('⚠️ Échec chargement user info, utilisation du token:', userErr);
            setUser({
              username: keycloakInstance.tokenParsed?.preferred_username,
              token: keycloakInstance.token,
            });
          }
        }

        setIsInitialized(true);
        setLoading(false);
      } catch (err) {
        console.error('❌ Erreur Keycloak:', err);
        setError('Impossible de se connecter au serveur d’authentification');
        setLoading(false);
      }
    };

    initKeycloak();
  }, []);

  /**
   * Rafraîchir le token (Utile avant chaque appel API)
   */
  const refreshToken = useCallback(async (minValidity = 30) => {
    if (!keycloak) return null;
    try {
      const refreshed = await keycloak.updateToken(minValidity);
      if (refreshed) {
        setUser(prev => ({ ...prev, token: keycloak.token }));
      }
      return keycloak.token;
    } catch (err) {
      console.error('❌ Session expirée');
      logout();
      return null;
    }
  }, [keycloak]);

  const login = useCallback((redirectUri) => {
    keycloak?.login({ redirectUri: redirectUri || window.location.origin + '/register' });
  }, [keycloak]);

  const logout = useCallback(() => {
    keycloak?.logout({ redirectUri: window.location.origin });
  }, [keycloak]);

  const hasRole = useCallback((role) => {
    return keycloak?.hasRealmRole(role) || false;
  }, [keycloak]);

  const value = {
    keycloak,
    isInitialized,
    isAuthenticated,
    user,
    loading,
    error,
    login,
    logout,
    hasRole,
    refreshToken,
    token: keycloak?.token
  };

  return (
    <KeycloakContext.Provider value={value}>
      {!isInitialized ? (
        // Show loading screen UNTIL Keycloak is fully initialized and user is authenticated
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: '#f3f4f6'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '48px',
              height: '48px',
              border: '4px solid #e5e7eb',
              borderTop: '4px solid #4f46e5',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }} />
            <p style={{ color: '#6b7280', fontSize: '14px', fontWeight: '500' }}>
              Chargement de l'authentification...
            </p>
            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        </div>
      ) : isAuthenticated ? (
        // Only render children if user is authenticated
        children
      ) : (
        // If isInitialized but not authenticated, show error (shouldn't happen with login-required)
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: '#fef2f2'
        }}>
          <div style={{ textAlign: 'center', color: '#991b1b' }}>
            <p style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
              ❌ Authentification requise
            </p>
            <p style={{ fontSize: '14px', color: '#dc2626' }}>
              {error || 'Veuillez vous connecter via Keycloak'}
            </p>
          </div>
        </div>
      )}
    </KeycloakContext.Provider>
  );
};

export const useKeycloak = () => {
  const context = useContext(KeycloakContext);
  if (!context) throw new Error('useKeycloak doit être utilisé dans KeycloakProvider');
  return context;
};