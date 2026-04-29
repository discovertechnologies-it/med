import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// channels: 'inApp' | 'webPush' | 'sms' | 'email' | 'whatsapp'
// categories: 'order' | 'rx' | 'refill' | 'promo'

const defaults = {
  channels: {
    inApp: true,
    webPush: false, // opt-in
    sms: true,
    email: true,
    whatsapp: false,
  },
  categories: {
    order: { inApp: true, webPush: true, sms: true, email: true, whatsapp: false },
    rx: { inApp: true, webPush: true, sms: true, email: true, whatsapp: false },
    refill: { inApp: true, webPush: true, sms: true, email: false, whatsapp: false },
    promo: { inApp: true, webPush: false, sms: false, email: true, whatsapp: false },
  },
  quietHours: { enabled: true, start: '22:00', end: '07:00' },
};

export const useNotificationPrefsStore = create(
  devtools(
    persist(
      (set) => ({
        ...defaults,
        toggleChannel: (channel) =>
          set(
            (s) => ({ channels: { ...s.channels, [channel]: !s.channels[channel] } }),
            false,
            'prefs/toggleChannel'
          ),
        toggleCategoryChannel: (category, channel) =>
          set(
            (s) => ({
              categories: {
                ...s.categories,
                [category]: {
                  ...s.categories[category],
                  [channel]: !s.categories[category][channel],
                },
              },
            }),
            false,
            'prefs/toggleCategoryChannel'
          ),
        setQuietHours: (patch) =>
          set(
            (s) => ({ quietHours: { ...s.quietHours, ...patch } }),
            false,
            'prefs/setQuietHours'
          ),
        reset: () => set(defaults, false, 'prefs/reset'),
      }),
      { name: 'med:notification-prefs' }
    ),
    { name: 'notificationPrefs', enabled: import.meta.env.DEV }
  )
);
