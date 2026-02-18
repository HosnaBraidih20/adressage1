import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8081/api', 
});

export const getRegions = () => API.get('/regions');
export const getPachaliks = (id) => API.get(`/pachaliks/${id}`);
export const getSecteurs = (id) => API.get(`/secteurs/${id}`);
export const getProvincesByRegion = (id) => API.get(`/provinces/region/${id}`);



export const addCitoyen = (data) => API.post("/citoyens", data);


export const getQuartiersByCommune = async (idCommandement) => {
  return axios.get(`http://localhost:8081/api/quartiers/commune/${idCommandement}`);
};

export const getSecteursByQuartier = async (idQuartier) => {
  return axios.get(`http://localhost:8081/api/secteurs/quartier/${idQuartier}`);
};


export const getPachaliksByProvince = (id) => {
  return axios.get(`http://localhost:8081/api/pachaliks/province/${id}`);
};
export const getCommuneByCommandement = (id) =>  {
  return axios.get(`http://localhost:8081/api/communes/commandement/${id}`)};


export const getCommandementByPachalik =  (idPachalik) => {
  return axios.get(`http://localhost:8081/api/commandements/pachalik/${idPachalik}`);

  }
  // api.js
export const addQuartier = (data) => API.post('/quartiers', data);
export const addSecteur = (data) => API.post('/secteurs', data);
export const addCommune = (data) => API.post('/communes', data);



export const getAuxiliaires = () => API.get("/auxiliaires");
export const addAuxiliaire = (data) => API.post("/auxiliaires", data);
export const updateAuxiliaire = (id, data) => API.put(`/auxiliaires/${id}`, data);
export const deleteAuxiliaire = (id) => API.delete(`/auxiliaires/${id}`);
export default API

