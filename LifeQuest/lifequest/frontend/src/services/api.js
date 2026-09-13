import axios from 'axios';

const api = axios.create({
 baseURL:
  import.meta.env.VITE_API_URL ||
  'https://lifequest-backend-olmf.onrender.com/api',
});

// Attach the JWT (if present) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('lifequest_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Centralize "session expired" handling.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('lifequest_token');
      localStorage.removeItem('lifequest_user');
    }
    return Promise.reject(error);
  }
);

export function apiErrorMessage(err, fallback = 'Something went wrong. Please try again.') {
  return err?.response?.data?.error || fallback;
}

export default api;
