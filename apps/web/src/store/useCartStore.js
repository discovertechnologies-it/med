import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const empty = { items: [], couponCode: null };

export const useCartStore = create(
  devtools(
    persist(
      (set, get) => ({
        ...empty,
        addItem: (medicine, qty = 1) =>
          set(
            (s) => {
              const existing = s.items.find((i) => i.id === medicine.id);
              if (existing) {
                return {
                  items: s.items.map((i) =>
                    i.id === medicine.id ? { ...i, qty: Math.min(i.qty + qty, 10) } : i
                  ),
                };
              }
              return {
                items: [
                  ...s.items,
                  {
                    id: medicine.id,
                    name: medicine.name,
                    price: medicine.price,
                    requiresPrescription: medicine.requiresPrescription,
                    qty: Math.min(qty, 10),
                  },
                ],
              };
            },
            false,
            'cart/addItem'
          ),
        removeItem: (id) =>
          set((s) => ({ items: s.items.filter((i) => i.id !== id) }), false, 'cart/removeItem'),
        updateQty: (id, qty) =>
          set(
            (s) => ({
              items: s.items.map((i) =>
                i.id === id ? { ...i, qty: Math.max(1, Math.min(qty, 10)) } : i
              ),
            }),
            false,
            'cart/updateQty'
          ),
        applyCoupon: (couponCode) => set({ couponCode }, false, 'cart/applyCoupon'),
        clear: () => set(empty, false, 'cart/clear'),
        getTotalQty: () => get().items.reduce((sum, i) => sum + i.qty, 0),
        getSubtotal: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
      }),
      { name: 'med:cart' }
    ),
    { name: 'cart', enabled: import.meta.env.DEV }
  )
);
