import { create } from 'zustand';

export const useCommandStore = create((set) => ({
  open: false,
  openIt: () => set({ open: true }),
  close: () => set({ open: false }),
  toggle: () => set((s) => ({ open: !s.open })),
}));
