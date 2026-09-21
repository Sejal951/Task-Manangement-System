import axios from 'axios';
import { loadSession, clearSession } from '../utils/tokenStorage';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api',
});

api.interceptors.request.use((config) => {
  const session = loadSession();
  if (session?.token) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      error.friendlyMessage = 'Network error — please check your connection and try again.';
    } else {
      const { status, data } = error.response;
      error.friendlyMessage = data?.message || 'Something went wrong.';
      if (status === 401) {
        clearSession();
        window.dispatchEvent(new CustomEvent('auth:session-expired'));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
