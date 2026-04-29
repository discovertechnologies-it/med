import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const MAX = 8;

export const useSearchHistoryStore = create(
  devtools(
    persist(
      (set) => ({
        recents: [],
        record: (q) => {
          const trimmed = q?.trim();
          if (!trimmed || trimmed.length < 2) return;
          set(
            (s) => ({
              recents: [trimmed, ...s.recents.filter((r) => r.toLowerCase() !== trimmed.toLowerCase())].slice(0, MAX),
            }),
            false,
            'search/record'
          );
        },
        remove: (q) =>
          set(
            (s) => ({ recents: s.recents.filter((r) => r !== q) }),
            false,
            'search/remove'
          ),
        clear: () => set({ recents: [] }, false, 'search/clear'),
      }),
      { name: 'med:search-history' }
    ),
    { name: 'searchHistory', enabled: import.meta.env.DEV }
  )
);
