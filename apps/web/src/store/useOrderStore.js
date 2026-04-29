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
        cancel: (id, reason) =>
          set(
            (s) => ({
              orders: s.orders.map((o) =>
                o.id === id
                  ? {
                      ...o,
                      status: 'cancelled',
                      cancelledAt: new Date().toISOString(),
                      cancellationReason: reason ?? null,
                    }
                  : o
              ),
            }),
            false,
            'order/cancel'
          ),
        addIssue: (id, issue) =>
          set(
            (s) => ({
              orders: s.orders.map((o) =>
                o.id === id
                  ? {
                      ...o,
                      issues: [
                        ...(o.issues || []),
                        { ...issue, createdAt: new Date().toISOString() },
                      ],
                    }
                  : o
              ),
            }),
            false,
            'order/addIssue'
          ),
        clear: () => set({ orders: [] }, false, 'order/clear'),

        // Status helpers
        canCancel: (status) =>
          ['confirmed', 'rx_review'].includes(status),
      }),
      { name: 'med:orders' }
    ),
    { name: 'orders', enabled: import.meta.env.DEV }
  )
);
