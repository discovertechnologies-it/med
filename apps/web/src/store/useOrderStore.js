import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// In-memory order log (mock). Real impl reads from /orders.

export const useOrderStore = create(
  devtools(
    persist(
      (set, get) => ({
        orders: [],
        place: (order) =>
          set((s) => ({ orders: [order, ...s.orders] }), false, 'order/place'),
        getById: (id) => get().orders.find((o) => o.id === id) || null,
        clear: () => set({ orders: [] }, false, 'order/clear'),
      }),
      { name: 'med:orders' }
    ),
    { name: 'orders', enabled: import.meta.env.DEV }
  )
);
