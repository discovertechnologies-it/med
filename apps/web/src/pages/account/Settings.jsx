import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  LogOut,
  ShieldOff,
  Trash2,
  Download,
  Smartphone,
} from 'lucide-react';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useProfileStore } from '@/store/useProfileStore';
import { useAddressStore } from '@/store/useAddressStore';
import { useOrderStore } from '@/store/useOrderStore';
import { useSubscriptionStore } from '@/store/useSubscriptionStore';
import { usePrescriptionStore } from '@/store/usePrescriptionStore';
import { useRecentStore } from '@/store/useRecentStore';
import { useSearchHistoryStore } from '@/store/useSearchHistoryStore';

export default function Settings() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  const [logoutAllOpen, setLogoutAllOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleLogoutAll = () => {
    // Mock — in production, server invalidates all refresh tokens.
    logout();
    toast.success('Signed out from all devices');
    navigate('/');
  };

  const handleExportData = () => {
    const dump = {
      exportedAt: new Date().toISOString(),
      user: useAuthStore.getState().user,
      profile: {
        name: useProfileStore.getState().name,
        dob: useProfileStore.getState().dob,
        gender: useProfileStore.getState().gender,
        bloodGroup: useProfileStore.getState().bloodGroup,
        family: useProfileStore.getState().family,
      },
      addresses: useAddressStore.getState().addresses,
      orders: useOrderStore.getState().orders,
      subscriptions: useSubscriptionStore.getState().subscriptions,
      prescriptions: usePrescriptionStore.getState().prescriptions.map((rx) => ({
        ...rx,
        files: rx.files.map((f) => ({ name: f.name, type: f.type, size: f.size })),
      })),
      wishlist: useWishlistStore.getState().ids,
      recentSearches: useSearchHistoryStore.getState().recents,
      recentlyViewed: useRecentStore.getState().ids,
    };

    const blob = new Blob([JSON.stringify(dump, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `med-data-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Data exported');
  };

  const handleDeleteAccount = () => {
    // Mock — clear all stores
    [
      useCartStore,
      useWishlistStore,
      useProfileStore,
      useAddressStore,
      useOrderStore,
      useSubscriptionStore,
      usePrescriptionStore,
      useRecentStore,
      useSearchHistoryStore,
    ].forEach((store) => {
      try {
        store.getState().clear?.();
        store.getState().reset?.();
      } catch {
        /* noop */
      }
    });
    logout();
    toast.success(
      'Account deletion requested. Data will be anonymised after 30 days.',
      { duration: 6000 }
    );
    navigate('/');
  };

  return (
    <div className="space-y-6">
      {/* Sessions */}
      <section className="bg-bg-surface border border-border-subtle rounded-2xl shadow-card p-5 md:p-6">
        <h2 className="text-h2 text-text-primary">Sessions</h2>
        <p className="text-caption text-text-secondary mt-0.5">
          Signed in as <span className="text-text-primary font-semibold">+91 {user?.mobile}</span>
        </p>
        <ul className="mt-5 space-y-2">
          <li className="flex items-center gap-3 rounded-xl bg-bg-page border border-border-subtle p-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-success-muted text-success shrink-0">
              <Smartphone size={16} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-body font-semibold text-text-primary">This device</p>
              <p className="text-caption text-text-secondary">Active now</p>
            </div>
          </li>
        </ul>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button variant="secondary" leftIcon={<LogOut size={16} />} onClick={() => {
            logout();
            toast('Signed out');
            navigate('/');
          }}>
            Sign out
          </Button>
          <Button
            variant="ghost"
            leftIcon={<ShieldOff size={16} />}
            onClick={() => setLogoutAllOpen(true)}
          >
            Sign out everywhere
          </Button>
        </div>
      </section>

      {/* Privacy / data */}
      <section className="bg-bg-surface border border-border-subtle rounded-2xl shadow-card p-5 md:p-6">
        <h2 className="text-h2 text-text-primary">Privacy</h2>
        <p className="text-caption text-text-secondary mt-0.5">
          Your rights under the DPDP Act 2023.
        </p>
        <div className="mt-5 space-y-3">
          <DataRow
            title="Export your data"
            sub="Download all data we store for you, in JSON."
            cta={
              <Button variant="secondary" size="sm" leftIcon={<Download size={16} />} onClick={handleExportData}>
                Export
              </Button>
            }
          />
          <DataRow
            title="Delete account"
            sub="Soft-delete with 30-day grace period. Order history is anonymised, not removed."
            danger
            cta={
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Trash2 size={16} />}
                onClick={() => setDeleteOpen(true)}
                className="text-danger hover:bg-danger-muted"
              >
                Delete
              </Button>
            }
          />
        </div>
      </section>

      <Modal
        open={logoutAllOpen}
        onClose={() => setLogoutAllOpen(false)}
        title="Sign out from all devices?"
        subtitle="You will need to sign in again on every device."
        size="sm"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setLogoutAllOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleLogoutAll}>Sign out everywhere</Button>
          </div>
        }
      >
        <p className="text-body text-text-secondary">
          We will end your session on this and any other browser or app you have signed in with.
        </p>
      </Modal>

      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete your account?"
        subtitle="This action requires a 30-day cool-off."
        size="md"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setDeleteOpen(false)}>
              Keep account
            </Button>
            <Button
              onClick={handleDeleteAccount}
              className="bg-danger hover:bg-danger/90 text-white"
            >
              Confirm deletion
            </Button>
          </div>
        }
      >
        <ul className="space-y-2 text-body text-text-secondary">
          <li>&middot; Your profile, addresses, wishlist, and family members are removed.</li>
          <li>&middot; Order history is retained but anonymised, per regulatory rules.</li>
          <li>&middot; You can sign back in within 30 days to restore the account.</li>
          <li>&middot; After 30 days, deletion is permanent.</li>
        </ul>
      </Modal>
    </div>
  );
}

function DataRow({ title, sub, cta, danger = false }) {
  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-xl border p-3 ${
        danger ? 'border-danger/20 bg-danger-muted/30' : 'border-border-subtle bg-bg-page'
      }`}
    >
      <div className="min-w-0 flex-1">
        <p className={`text-body font-semibold ${danger ? 'text-danger' : 'text-text-primary'}`}>
          {title}
        </p>
        <p className="text-caption text-text-secondary">{sub}</p>
      </div>
      {cta}
    </div>
  );
}
