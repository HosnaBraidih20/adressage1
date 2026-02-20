import axios from 'axios';

/**
 * Setup Axios interceptor for Keycloak JWT token
 * This function should be called after Keycloak is initialized
 * 
 * @param {Object} keycloak - Keycloak instance
 * @param {Function} onTokenRefresh - Callback when token is refreshed
 * @param {Function} onTokenExpired - Callback when token is expired
 */
export const setupAxiosInterceptors = (keycloak, onTokenRefresh, onTokenExpired) => {
  if (!keycloak) {
    console.warn('⚠️ Keycloak not initialized, skipping axios interceptor setup');
    return;
  }

  /**
   * Request interceptor: Add JWT token to every request
   */
  axios.interceptors.request.use(
    async (config) => {
      try {
        // Refresh token if needed (5 minutes buffer)
        await keycloak.updateToken(300);

        // Add token to Authorization header
        if (keycloak.token) {
          config.headers.Authorization = `Bearer ${keycloak.token}`;
          
          // Log request (development only)
          console.log(`📤 [REQUEST] ${config.method?.toUpperCase()} ${config.url}`);
          console.log('🔐 Authorization header set');
        }

        return config;
      } catch (err) {
        console.error('❌ Token refresh failed in request interceptor:', err);
        
        if (onTokenExpired) {
          onTokenExpired();
        }

        return Promise.reject(err);
      }
    },
    (error) => {
      console.error('❌ Request interceptor error:', error);
      return Promise.reject(error);
    }
  );

  /**
   * Response interceptor: Handle token expiration and errors
   */
  axios.interceptors.response.use(
    (response) => {
      // Log successful response (development only)
      console.log(`✅ [RESPONSE] ${response.status} ${response.config.url}`);
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      // Handle 401 Unauthorized
      if (error.response?.status === 401) {
        console.warn('⚠️ [401 UNAUTHORIZED] Token may be expired');

        try {
          // Try to refresh token
          await keycloak.updateToken(0);

          if (keycloak.token) {
            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${keycloak.token}`;
            
            if (onTokenRefresh) {
              onTokenRefresh(keycloak.token);
            }

            console.log('🔄 Retrying request with refreshed token');
            return axios(originalRequest);
          }
        } catch (refreshErr) {
          console.error('❌ Token refresh failed:', refreshErr);
          
          if (onTokenExpired) {
            onTokenExpired();
          }

          return Promise.reject(error);
        }
      }

      // Handle 403 Forbidden
      if (error.response?.status === 403) {
        console.error('❌ [403 FORBIDDEN] User does not have permission');
      }

      // Handle 404 Not Found
      if (error.response?.status === 404) {
        console.warn('⚠️ [404 NOT FOUND]', error.config.url);
      }

      // Handle 500 Server Error
      if (error.response?.status >= 500) {
        console.error('❌ [SERVER ERROR]', error.response.status, error.response.data);
      }

      // Log all errors
      console.error('❌ [API ERROR]', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        url: error.config?.url,
      });

      return Promise.reject(error);
    }
  );

  console.log('✅ Axios interceptors configured');
};

/**
 * Create Axios instance with default config
 */
export const createAxiosInstance = (baseURL = 'http://localhost:8081/api') => {
  return axios.create({
    baseURL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });
};

export default axios;
