import axios from 'axios';
import { useAuthSessionStore } from '../store/useAuthSession';


export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token de autenticación a cada solicitud
api.interceptors.request.use((config) => {
  const { token } = useAuthSessionStore.getState();

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
});

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url ?? '';
    const isAuthLoginRequest = typeof requestUrl === 'string' && requestUrl.includes('/auth/login');

    if (error.response?.status === 401 && !isAuthLoginRequest) {
      // Token expirado o inválido
      const { logout } = useAuthSessionStore.getState();
      logout();
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);
