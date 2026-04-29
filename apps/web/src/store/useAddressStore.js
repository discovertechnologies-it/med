import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { defaultAddresses } from '@/data/mockAddresses';

export const useAddressStore = create(
  devtools(
    persist(
      (set, get) => ({
        addresses: defaultAddresses,
        add: (a) => {
          const id = `addr_${Date.now().toString(36)}`;
          const isFirst = get().addresses.length === 0;
          const next = { ...a, id, isDefault: isFirst || Boolean(a.isDefault) };
          set(
            (s) => ({
              addresses: [
                ...(next.isDefault
                  ? s.addresses.map((x) => ({ ...x, isDefault: false }))
                  : s.addresses),
                next,
              ],
            }),
            false,
            'address/add'
          );
          return id;
        },
        update: (id, patch) =>
          set(
            (s) => ({
              addresses: s.addresses.map((a) =>
                a.id === id
                  ? { ...a, ...patch }
                  : patch.isDefault
                    ? { ...a, isDefault: false }
                    : a
              ),
            }),
            false,
            'address/update'
          ),
        remove: (id) =>
          set(
            (s) => {
              const remaining = s.addresses.filter((a) => a.id !== id);
              const wasDefault = s.addresses.find((a) => a.id === id)?.isDefault;
              if (wasDefault && remaining.length > 0) {
                remaining[0] = { ...remaining[0], isDefault: true };
              }
              return { addresses: remaining };
            },
            false,
            'address/remove'
          ),
        setDefault: (id) =>
          set(
            (s) => ({
              addresses: s.addresses.map((a) => ({ ...a, isDefault: a.id === id })),
            }),
            false,
            'address/setDefault'
          ),
      }),
      { name: 'med:addresses' }
    ),
    { name: 'addresses', enabled: import.meta.env.DEV }
  )
);

export const selectDefaultAddress = (s) =>
  s.addresses.find((a) => a.isDefault) ?? s.addresses[0] ?? null;
