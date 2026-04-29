import { Bell, Smartphone, Mail, MessageCircle, Globe } from 'lucide-react';
import Toggle from '@/components/Toggle';
import { useNotificationPrefsStore } from '@/store/useNotificationPrefsStore';

const channels = [
  { id: 'inApp', label: 'In-app', icon: <Bell size={16} />, sub: 'Toast and badge alerts in this browser' },
  { id: 'webPush', label: 'Web Push', icon: <Globe size={16} />, sub: 'Browser notifications, even when tab is closed' },
  { id: 'sms', label: 'SMS', icon: <Smartphone size={16} />, sub: 'Text messages for time-critical alerts' },
  { id: 'email', label: 'Email', icon: <Mail size={16} />, sub: 'Order confirmations and receipts' },
  { id: 'whatsapp', label: 'WhatsApp', icon: <MessageCircle size={16} />, sub: 'Order updates via WhatsApp Business' },
];

const categories = [
  {
    id: 'order',
    label: 'Order updates',
    sub: 'Confirmation, packed, shipped, delivered',
  },
  {
    id: 'rx',
    label: 'Prescription review',
    sub: 'Approval, rejection, clarification requests',
  },
  {
    id: 'refill',
    label: 'Refill reminders',
    sub: 'Subscriptions and chronic medication refills',
  },
  {
    id: 'promo',
    label: 'Offers and tips',
    sub: 'Discount codes, new arrivals, health tips',
  },
];

export default function Notifications() {
  const channelsOn = useNotificationPrefsStore((s) => s.channels);
  const cats = useNotificationPrefsStore((s) => s.categories);
  const quiet = useNotificationPrefsStore((s) => s.quietHours);
  const toggleChannel = useNotificationPrefsStore((s) => s.toggleChannel);
  const toggleCatChannel = useNotificationPrefsStore((s) => s.toggleCategoryChannel);
  const setQuietHours = useNotificationPrefsStore((s) => s.setQuietHours);

  return (
    <div className="space-y-6">
      {/* Channels */}
      <section className="bg-bg-surface border border-border-subtle rounded-2xl shadow-card p-5 md:p-6">
        <h2 className="text-h2 text-text-primary">Channels</h2>
        <p className="text-caption text-text-secondary mt-0.5">
          Turn off a channel to silence all notifications on it.
        </p>
        <ul className="mt-5 space-y-3">
          {channels.map((c) => (
            <li
              key={c.id}
              className="flex items-center gap-3 rounded-xl bg-bg-page border border-border-subtle p-3"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary-muted text-primary shrink-0">
                {c.icon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-body font-semibold text-text-primary">{c.label}</p>
                <p className="text-caption text-text-secondary">{c.sub}</p>
              </div>
              <Toggle
                checked={channelsOn[c.id]}
                onChange={() => toggleChannel(c.id)}
                label={`${c.label} channel`}
              />
            </li>
          ))}
        </ul>
      </section>

      {/* Per-category matrix */}
      <section className="bg-bg-surface border border-border-subtle rounded-2xl shadow-card p-5 md:p-6">
        <h2 className="text-h2 text-text-primary">By topic</h2>
        <p className="text-caption text-text-secondary mt-0.5">
          Fine-tune which notifications you receive for each topic.
        </p>

        <div className="mt-5 space-y-3">
          {categories.map((cat) => (
            <div key={cat.id} className="rounded-xl border border-border-subtle p-4 bg-bg-page">
              <div className="mb-3">
                <p className="text-body font-semibold text-text-primary">{cat.label}</p>
                <p className="text-caption text-text-secondary">{cat.sub}</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {channels.map((c) => {
                  const channelOn = channelsOn[c.id];
                  const checked = cats[cat.id][c.id] && channelOn;
                  return (
                    <label
                      key={c.id}
                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg ${
                        channelOn
                          ? 'bg-bg-surface border border-border-subtle'
                          : 'bg-bg-muted border border-border-subtle opacity-60'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={!channelOn}
                        onChange={() => toggleCatChannel(cat.id, c.id)}
                        className="h-4 w-4 rounded text-primary"
                      />
                      <span className="text-caption text-text-primary">{c.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quiet hours */}
      <section className="bg-bg-surface border border-border-subtle rounded-2xl shadow-card p-5 md:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-h2 text-text-primary">Quiet hours</h2>
            <p className="text-caption text-text-secondary mt-0.5">
              Pause non-critical alerts overnight.
            </p>
          </div>
          <Toggle
            checked={quiet.enabled}
            onChange={(on) => setQuietHours({ enabled: on })}
            label="Enable quiet hours"
          />
        </div>
        {quiet.enabled && (
          <div className="mt-4 grid grid-cols-2 gap-3 max-w-sm">
            <div>
              <label htmlFor="qh-start" className="block text-label uppercase text-text-tertiary mb-1.5">
                From
              </label>
              <input
                id="qh-start"
                type="time"
                value={quiet.start}
                onChange={(e) => setQuietHours({ start: e.target.value })}
                className="w-full h-11 px-4 rounded-full bg-bg-page border border-border-subtle hover:border-border-strong focus:border-primary text-text-primary tabular outline-none"
              />
            </div>
            <div>
              <label htmlFor="qh-end" className="block text-label uppercase text-text-tertiary mb-1.5">
                Until
              </label>
              <input
                id="qh-end"
                type="time"
                value={quiet.end}
                onChange={(e) => setQuietHours({ end: e.target.value })}
                className="w-full h-11 px-4 rounded-full bg-bg-page border border-border-subtle hover:border-border-strong focus:border-primary text-text-primary tabular outline-none"
              />
            </div>
          </div>
        )}
        <p className="mt-3 text-caption text-text-tertiary">
          Order delivery and prescription updates always come through, regardless of quiet hours.
        </p>
      </section>
    </div>
  );
}
