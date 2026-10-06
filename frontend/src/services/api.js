import axios from 'axios';

// URL del backend (en producción se define con VITE_API_URL)
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({ baseURL: API_URL, headers: { 'Content-Type': 'application/json' } });

// Agrega el JWT a cada petición
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (user?.accessToken) config.headers.Authorization = `Bearer ${user.accessToken}`;
  return config;
});

// Si el token expiró o es inválido (401), cerramos la sesión automáticamente
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && !error.config.url.includes('/auth/')) {
      localStorage.removeItem('user');
      window.location.href = '/login?expirada=1';
    }
    return Promise.reject(error);
  }
);

// Extrae el mensaje de error que envía el backend
export const getErrorMessage = (error) =>
  error.response?.data?.message || (error.request ? 'No se pudo conectar con el servidor' : error.message);

export default api;
