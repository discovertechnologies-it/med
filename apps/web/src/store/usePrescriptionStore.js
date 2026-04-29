import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'clarification'

export const usePrescriptionStore = create(
  devtools(
    persist(
      (set, get) => ({
        prescriptions: [],
        add: (rx) => set((s) => ({ prescriptions: [rx, ...s.prescriptions] }), false, 'rx/add'),
        remove: (id) =>
          set(
            (s) => ({ prescriptions: s.prescriptions.filter((r) => r.id !== id) }),
            false,
            'rx/remove'
          ),
        updateStatus: (id, status, reason) =>
          set(
            (s) => ({
              prescriptions: s.prescriptions.map((r) =>
                r.id === id ? { ...r, status, rejectionReason: reason } : r
              ),
            }),
            false,
            'rx/updateStatus'
          ),
        clear: () => set({ prescriptions: [] }, false, 'rx/clear'),
      }),
      { name: 'med:prescriptions' }
    ),
    { name: 'prescriptions', enabled: import.meta.env.DEV }
  )
);
