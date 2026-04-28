import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const initial = {
  user: null,
  accessToken: null,
};

export const useAuthStore = create(
  devtools(
    (set) => ({
      ...initial,
      setAccessToken: (accessToken) => set({ accessToken }, false, 'auth/setAccessToken'),
      login: (user, accessToken) => set({ user, accessToken }, false, 'auth/login'),
      logout: () => set(initial, false, 'auth/logout'),
      hydrate: (user) => set({ user }, false, 'auth/hydrate'),
    }),
    { name: 'auth', enabled: import.meta.env.DEV }
  )
);

export const selectIsAuthenticated = (s) => Boolean(s.accessToken);
