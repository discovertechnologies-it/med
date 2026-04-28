import axios from 'axios';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';

const baseURL = import.meta.env.VITE_API_BASE || '/api';

export const api = axios.create({
  baseURL,
  timeout: 15000,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshing = null;

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;

    if (status === 401 && !original._retry) {
      original._retry = true;
      try {
        if (!refreshing) {
          refreshing = api.post('/auth/refresh').finally(() => {
            refreshing = null;
          });
        }
        const { data } = await refreshing;
        useAuthStore.getState().setAccessToken(data.access);
        original.headers.Authorization = `Bearer ${data.access}`;
        return api(original);
      } catch {
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }
    }

    if (status >= 500) {
      toast.error('Something went wrong. Please try again.');
    }
    return Promise.reject(error);
  }
);
