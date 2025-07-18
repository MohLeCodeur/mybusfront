// src/api/index.js
import axios from 'axios';

// ====================================================================
// CORRECTION : On force l'URL de base du backend
// ====================================================================
const baseURL = 'https://mybusbackkelly.onrender.com/api';

const api = axios.create({
  baseURL: baseURL,
});
// ====================================================================

console.log('Instance Axios créée avec la baseURL :', api.defaults.baseURL);

// Intercepteur pour ajouter le token JWT à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;