import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const initial = {
  name: '',
  dob: null, // ISO date string
  gender: null, // 'male' | 'female' | 'other' | 'no_answer'
  bloodGroup: null,
  emergencyContact: null,
  family: [], // [{ id, name, age, relation, gender }]
};

export const useProfileStore = create(
  devtools(
    persist(
      (set) => ({
        ...initial,
        update: (patch) => set(patch, false, 'profile/update'),
        addFamily: (member) =>
          set(
            (s) => ({ family: [...s.family, { ...member, id: `fam_${Date.now()}` }] }),
            false,
            'profile/addFamily'
          ),
        removeFamily: (id) =>
          set(
            (s) => ({ family: s.family.filter((m) => m.id !== id) }),
            false,
            'profile/removeFamily'
          ),
        reset: () => set(initial, false, 'profile/reset'),
      }),
      { name: 'med:profile' }
    ),
    { name: 'profile', enabled: import.meta.env.DEV }
  )
);
