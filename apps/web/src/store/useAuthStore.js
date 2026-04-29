import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// MOCK ONLY — locked rule §10 says refresh in httpOnly cookie + access token in memory.
// We persist for demo continuity; swap to cookie + memory when real auth lands in M2.

const initial = {
  user: null,
  accessToken: null,
};

export const useAuthStore = create(
  devtools(
    persist(
      (set) => ({
        ...initial,
        setAccessToken: (accessToken) => set({ accessToken }, false, 'auth/setAccessToken'),
        login: (user, accessToken) => set({ user, accessToken }, false, 'auth/login'),
        logout: () => set(initial, false, 'auth/logout'),
        hydrate: (user) => set({ user }, false, 'auth/hydrate'),
      }),
      { name: 'med:auth' }
    ),
    { name: 'auth', enabled: import.meta.env.DEV }
  )
);

export const selectIsAuthenticated = (s) => Boolean(s.accessToken);
export const selectUserName = (s) => s.user?.name ?? null;
