import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const MAX = 8;

export const useRecentStore = create(
  devtools(
    persist(
      (set, get) => ({
        ids: [],
        addView: (id) =>
          set(
            (s) => {
              if (!id) return s;
              const without = s.ids.filter((x) => x !== id);
              return { ids: [id, ...without].slice(0, MAX) };
            },
            false,
            'recent/addView'
          ),
        clear: () => set({ ids: [] }, false, 'recent/clear'),
      }),
      { name: 'med:recent' }
    ),
    { name: 'recent', enabled: import.meta.env.DEV }
  )
);
