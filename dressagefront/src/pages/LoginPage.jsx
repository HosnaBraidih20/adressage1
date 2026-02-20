import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import Keycloak from 'keycloak-js';

const KeycloakContext = createContext(null);

export const KeycloakProvider = ({ children }) => {
  const [keycloak, setKeycloak] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isRun = useRef(false);

  useEffect(() => {
    if (isRun.current) return;
    isRun.current = true;

    const initKeycloak = async () => {
      try {
        const keycloakInstance = new Keycloak({
          url: 'http://localhost:8080',
          realm: 'MyStoreRealm',
          clientId: 'my-frontend-app',
        });

        // onLoad: 'login-required' FORCE l'affichage de l'interface Keycloak
        const authenticated = await keycloakInstance.init({
          onLoad: 'login-required', 
          checkLoginIframe: false,
          pkceMethod: 'S256',
        });

        setKeycloak(keycloakInstance);
        setIsAuthenticated(authenticated);

        if (authenticated) {
          const userInfo = await keycloakInstance.loadUserInfo();
          setUser({
            username: keycloakInstance.tokenParsed?.preferred_username,
            token: keycloakInstance.token,
            roles: keycloakInstance.tokenParsed?.realm_access?.roles || []
          });
          // Stockage global temporaire pour l'intercepteur API
          window._keycloakToken = keycloakInstance.token;
        }

        setIsInitialized(true);
        setLoading(false);
      } catch (err) {
        console.error('❌ Échec Keycloak:', err);
        setLoading(false);
      }
    };

    initKeycloak();
  }, []);

  const login = () => keycloak?.login();
  const logout = () => keycloak?.logout({ redirectUri: window.location.origin });

  return (
    <KeycloakContext.Provider value={{ keycloak, isInitialized, isAuthenticated, user, loading, login, logout }}>
      {(!isInitialized && loading) ? <div>Chargement du système d'authentification...</div> : children}
    </KeycloakContext.Provider>
  );
};

export const useKeycloak = () => useContext(KeycloakContext);