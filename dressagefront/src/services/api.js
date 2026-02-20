import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8081/api', 
});

/**
 * Setup axios interceptors on the API instance
 * Called from App.js after Keycloak is initialized
 * Ensures all API requests include JWT token in Authorization header
 * 
 * @param {Object} keycloak - Keycloak instance
 */
export const setupAPIInterceptors = (keycloak) => {
  if (!keycloak) {
    console.warn('⚠️ Keycloak not initialized, skipping API interceptor setup');
    return;
  }

  let isRefreshing = false;
  let failedQueue = [];

  const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
    
    isRefreshing = false;
    failedQueue = [];
  };

  /**
   * Request interceptor: Attach JWT token to every request
   */
  API.interceptors.request.use(
    async (config) => {
      try {
        // Ensure token is fresh (refresh if needed, 5-minute buffer)
        const refreshed = await keycloak.updateToken(300);
        
        if (keycloak.token) {
          config.headers.Authorization = `Bearer ${keycloak.token}`;
          console.log(`📤 [API] ${config.method?.toUpperCase()} ${config.url?.split(process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081/api')[1] || config.url}`);
        } else {
          console.warn('⚠️ No Keycloak token available for request');
        }

        return config;
      } catch (error) {
        console.error('❌ [INTERCEPTOR] Token refresh failed:', error);
        return Promise.reject(error);
      }
    },
    (error) => {
      console.error('❌ [INTERCEPTOR] Request setup error:', error);
      return Promise.reject(error);
    }
  );

  /**
   * Response interceptor: Handle errors and token refresh
   */
  API.interceptors.response.use(
    (response) => {
      console.log(`✅ [API] ${response.status} ${response.config.method?.toUpperCase()}`);
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      // Prevent infinite loop on 401 errors
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(token => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return API(originalRequest);
            })
            .catch(err => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          console.warn('⚠️ [401] Token expired, attempting refresh...');
          const refreshed = await keycloak.updateToken(0);

          if (keycloak.token) {
            originalRequest.headers.Authorization = `Bearer ${keycloak.token}`;
            processQueue(null, keycloak.token);
            console.log('🔄 Token refreshed, retrying request');
            return API(originalRequest);
          }
        } catch (refreshError) {
          console.error('❌ [401] Token refresh failed:', refreshError);
          processQueue(refreshError, null);
          return Promise.reject(error);
        }
      }

      // Handle 403 Forbidden
      if (error.response?.status === 403) {
        console.error('❌ [403] Access denied - user lacks required permissions');
      }

      // Handle network errors
      if (!error.response) {
        console.error('❌ [NETWORK] Failed to reach API:', error.message);
      }

      return Promise.reject(error);
    }
  );
};

export const getRegions = () => API.get('/regions');
export const getPachaliks = (id) => API.get(`/pachaliks/${id}`);
export const getSecteurs = (id) => API.get(`/secteurs/${id}`);
export const getProvincesByRegion = (id) => API.get(`/provinces/region/${id}`);



export const addCitoyen = (data) => API.post("/citoyens", data);


export const getQuartiersByCommune = async (idCommandement) => {
  return API.get(`/quartiers/commune/${idCommandement}`);
};

export const getSecteursByQuartier = async (idQuartier) => {
  return API.get(`/secteurs/quartier/${idQuartier}`);
};


export const getPachaliksByProvince = (id) => {
  return API.get(`/pachaliks/province/${id}`);
};
export const getCommuneByCommandement = (id) =>  {
  return API.get(`/communes/commandement/${id}`)};


export const getCommandementByPachalik =  (idPachalik) => {
  return API.get(`/commandements/pachalik/${idPachalik}`);

  }
  // api.js
export const addQuartier = (data) => API.post('/quartiers', data);
export const addSecteur = (data) => API.post('/secteurs', data);
export const addCommune = (data) => API.post('/communes', data);



export const getAuxiliaires = () => API.get("/auxiliaires");
export const addAuxiliaire = (data) => API.post("/auxiliaires", data);
export const updateAuxiliaire = (id, data) => API.put(`/auxiliaires/${id}`, data);
export const deleteAuxiliaire = (id) => API.delete(`/auxiliaires/${id}`);

// Export API instance for direct use (required for custom requests)
export { API };

export default API

