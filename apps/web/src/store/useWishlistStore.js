import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export const useWishlistStore = create(
  devtools(
    persist(
      (set, get) => ({
        ids: [],
        toggle: (id) =>
          set(
            (s) => ({
              ids: s.ids.includes(id) ? s.ids.filter((x) => x !== id) : [id, ...s.ids],
            }),
            false,
            'wishlist/toggle'
          ),
        has: (id) => get().ids.includes(id),
        clear: () => set({ ids: [] }, false, 'wishlist/clear'),
      }),
      { name: 'med:wishlist' }
    ),
    { name: 'wishlist', enabled: import.meta.env.DEV }
  )
);

export const selectIsInWishlist = (id) => (s) => s.ids.includes(id);
