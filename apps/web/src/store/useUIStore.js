import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export const useUIStore = create(
  devtools(
    persist(
      (set) => ({
        pincode: null,
        setPincode: (pincode) => set({ pincode }, false, 'ui/setPincode'),
      }),
      { name: 'med:ui' }
    ),
    { name: 'ui', enabled: import.meta.env.DEV }
  )
);
