import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// frequency: { unit: 'week' | 'month', value: number }
// status: 'active' | 'paused' | 'cancelled'

export const useSubscriptionStore = create(
  devtools(
    persist(
      (set, get) => ({
        subscriptions: [],
        create: (sub) => {
          const id = `sub_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
          set(
            (s) => ({
              subscriptions: [{ ...sub, id, status: 'active', createdAt: new Date().toISOString() }, ...s.subscriptions],
            }),
            false,
            'sub/create'
          );
          return id;
        },
        pause: (id) =>
          set(
            (s) => ({
              subscriptions: s.subscriptions.map((x) =>
                x.id === id ? { ...x, status: 'paused' } : x
              ),
            }),
            false,
            'sub/pause'
          ),
        resume: (id) =>
          set(
            (s) => ({
              subscriptions: s.subscriptions.map((x) =>
                x.id === id ? { ...x, status: 'active' } : x
              ),
            }),
            false,
            'sub/resume'
          ),
        skip: (id, days = 7) =>
          set(
            (s) => ({
              subscriptions: s.subscriptions.map((x) => {
                if (x.id !== id) return x;
                const next = new Date(x.nextRunAt);
                next.setDate(next.getDate() + days);
                return { ...x, nextRunAt: next.toISOString() };
              }),
            }),
            false,
            'sub/skip'
          ),
        cancel: (id) =>
          set(
            (s) => ({
              subscriptions: s.subscriptions.map((x) =>
                x.id === id ? { ...x, status: 'cancelled' } : x
              ),
            }),
            false,
            'sub/cancel'
          ),
        remove: (id) =>
          set(
            (s) => ({
              subscriptions: s.subscriptions.filter((x) => x.id !== id),
            }),
            false,
            'sub/remove'
          ),
      }),
      { name: 'med:subscriptions' }
    ),
    { name: 'subscriptions', enabled: import.meta.env.DEV }
  )
);
