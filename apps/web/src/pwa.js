import { registerSW } from 'virtual:pwa-register';
import { toast } from 'sonner';

export function bootstrapPwa() {
  if (typeof window === 'undefined') return;
  if (!('serviceWorker' in navigator)) return;

  const updateSW = registerSW({
    onNeedRefresh() {
      toast('New version available', {
        duration: 8000,
        action: {
          label: 'Reload',
          onClick: () => updateSW(true),
        },
      });
    },
    onOfflineReady() {
      // Quietly succeed — no need to interrupt with a toast.
    },
  });
}
