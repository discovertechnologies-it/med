import { useMemo, useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ThumbsUp, ShieldCheck, Pencil, X, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';
import Button from './Button';
import Badge from './Badge';
import StarRating from './StarRating';
import InteractiveStars from './InteractiveStars';
import { getReviews, ratingSummary } from '@/data/mockReviews';
import { useAuthStore, selectIsAuthenticated } from '@/store/useAuthStore';
import { fadeUp, staggerContainer } from '@/motion/variants';
import { springs } from '@/motion/transitions';

const FLAGGED_PHRASES = [
  /cured my/i,
  /diagnosed with/i,
  /better than (?:my )?doctor/i,
  /replaces? (?:a |the )?doctor/i,
];

export default function ReviewsSection({ medicine }) {
  const initial = useMemo(() => getReviews(medicine.id), [medicine.id]);
  const [reviews, setReviews] = useState(initial);
  const [writing, setWriting] = useState(false);
  const summary = useMemo(() => ratingSummary(reviews), [reviews]);

  const isAuthed = useAuthStore(selectIsAuthenticated);
  const user = useAuthStore((s) => s.user);

  const onSubmit = (review) => {
    setReviews((prev) => [review, ...prev]);
    setWriting(false);
    toast.success('Review submitted');
  };

  const onHelpful = (id) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, helpful: (r.helpful || 0) + 1 } : r))
    );
  };

  return (
    <section className="mt-10 md:mt-14">
      <div className="flex items-end justify-between gap-3 mb-5">
        <div>
          <h2 className="text-h2 md:text-h2-lg text-text-primary">Reviews</h2>
          <p className="mt-1 text-body text-text-secondary">
            Honest experiences from verified buyers.
          </p>
        </div>
        {!writing && (
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Pencil size={16} />}
            onClick={() => {
              if (!isAuthed) {
                toast('Sign in to write a review');
                return;
              }
              setWriting(true);
            }}
          >
            Write a review
          </Button>
        )}
      </div>

      <AnimatePresence initial={false}>
        {writing && (
          <m.div
            key="form"
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={springs.snappy}
            className="mb-5"
          >
            <ReviewForm
              userName={user?.name || 'Anonymous'}
              onCancel={() => setWriting(false)}
              onSubmit={onSubmit}
            />
          </m.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 lg:order-1 order-2">
          <SummaryCard summary={summary} />
        </div>

        <div className="lg:col-span-8 lg:order-2 order-1">
          {reviews.length === 0 ? (
            <EmptyReviews />
          ) : (
            <m.ul
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="space-y-3"
            >
              <AnimatePresence initial={false}>
                {reviews.map((r) => (
                  <m.li
                    key={r.id}
                    layout
                    variants={fadeUp}
                    exit={{ opacity: 0, x: -8, transition: { duration: 0.18 } }}
                  >
                    <ReviewCard review={r} onHelpful={() => onHelpful(r.id)} />
                  </m.li>
                ))}
              </AnimatePresence>
            </m.ul>
          )}
        </div>
      </div>
    </section>
  );
}

function SummaryCard({ summary }) {
  const max = Math.max(1, ...summary.dist);
  return (
    <div className="bg-bg-surface border border-border-subtle rounded-2xl shadow-card p-5 md:p-6 lg:sticky lg:top-20">
      <div className="flex items-end gap-2 tabular">
        <span className="text-display font-bold text-text-primary leading-none">
          {summary.total === 0 ? '—' : summary.avg.toFixed(1)}
        </span>
        {summary.total > 0 && (
          <span className="text-body-lg text-text-tertiary pb-1">/ 5</span>
        )}
      </div>
      <div className="mt-2">
        <StarRating value={summary.avg} size={18} />
      </div>
      <p className="mt-1 text-caption text-text-tertiary tabular">
        {summary.total} {summary.total === 1 ? 'review' : 'reviews'}
      </p>

      {summary.total > 0 && (
        <ul className="mt-5 space-y-1.5">
          {summary.dist.map((count, i) => {
            const stars = 5 - i;
            const pct = (count / max) * 100;
            return (
              <li
                key={stars}
                className="grid grid-cols-[24px_1fr_28px] items-center gap-2"
              >
                <span className="text-caption font-semibold text-text-secondary tabular">
                  {stars}★
                </span>
                <div className="h-2 bg-bg-muted rounded-full overflow-hidden">
                  <m.div
                    className="h-full bg-warning rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
                <span className="text-caption text-text-tertiary tabular text-right">{count}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function ReviewCard({ review, onHelpful }) {
  const initial = (review.author || '?').charAt(0).toUpperCase();
  return (
    <article className="bg-bg-surface border border-border-subtle rounded-2xl shadow-card p-5">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary-muted text-primary font-bold text-body shrink-0">
          {initial}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-body font-semibold text-text-primary">{review.author}</p>
            {review.verifiedBuyer && (
              <Badge variant="success" icon={<ShieldCheck size={12} />}>
                Verified buyer
              </Badge>
            )}
          </div>
          <div className="mt-1 flex items-center gap-2">
            <StarRating value={review.rating} size={14} />
            <span className="text-caption text-text-tertiary tabular">
              {format(new Date(review.createdAt), 'd MMM yyyy')}
            </span>
          </div>
          <p className="mt-2.5 text-body text-text-secondary whitespace-pre-line">{review.text}</p>
          <button
            type="button"
            onClick={onHelpful}
            className="mt-3 inline-flex items-center gap-1.5 text-caption font-semibold text-text-secondary hover:text-primary transition-colors"
          >
            <ThumbsUp size={14} />
            Helpful ({review.helpful || 0})
          </button>
        </div>
      </div>
    </article>
  );
}

function EmptyReviews() {
  return (
    <div className="bg-bg-surface border border-border-subtle rounded-2xl shadow-card p-8 text-center">
      <h3 className="text-h3 text-text-primary">No reviews yet</h3>
      <p className="mt-2 text-body text-text-secondary">
        Be the first to share your experience.
      </p>
    </div>
  );
}

function ReviewForm({ userName, onCancel, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const len = text.trim().length;
  const tooShort = len < 10;
  const tooLong = len > 500;
  const flagged = FLAGGED_PHRASES.find((re) => re.test(text));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) {
      toast.error('Pick a star rating');
      return;
    }
    if (tooShort) {
      toast.error('Review must be at least 10 characters');
      return;
    }
    if (tooLong) {
      toast.error('Review must be 500 characters or less');
      return;
    }
    if (flagged) {
      toast.error('Reviews cannot make medical claims. Please rephrase.');
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));
    onSubmit({
      id: `r_${Date.now()}`,
      author: userName,
      rating,
      text: text.trim(),
      createdAt: new Date().toISOString(),
      verifiedBuyer: true,
      helpful: 0,
    });
    setSubmitting(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-bg-surface border border-border-subtle rounded-2xl shadow-card p-5 md:p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-h3 text-text-primary">Write a review</h3>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Cancel"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-text-tertiary hover:bg-bg-muted hover:text-text-primary transition"
        >
          <X size={16} />
        </button>
      </div>

      <div className="mt-4">
        <label className="block text-label uppercase text-text-tertiary mb-2">
          Your rating
        </label>
        <InteractiveStars value={rating} onChange={setRating} />
      </div>

      <div className="mt-4">
        <label htmlFor="review-text" className="block text-label uppercase text-text-tertiary mb-1.5">
          Your review
        </label>
        <textarea
          id="review-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          maxLength={520}
          placeholder="Share what worked and what didn't. Avoid medical claims like 'cured my…'"
          className={clsx(
            'w-full px-4 py-3 rounded-xl bg-bg-page border outline-none transition-colors text-text-primary placeholder:text-text-tertiary',
            (tooLong || flagged)
              ? 'border-danger'
              : 'border-border-subtle hover:border-border-strong focus:border-primary'
          )}
        />
        <div className="mt-1.5 flex items-center justify-between gap-2">
          <span
            className={clsx(
              'text-caption',
              flagged ? 'text-danger inline-flex items-center gap-1' : 'text-text-tertiary'
            )}
          >
            {flagged && <AlertTriangle size={12} />}
            {flagged
              ? 'Avoid medical claims like "cured my…" or "diagnosed with…"'
              : 'Min 10, max 500 characters.'}
          </span>
          <span
            className={clsx(
              'text-caption tabular',
              tooLong ? 'text-danger' : 'text-text-tertiary'
            )}
          >
            {len}/500
          </span>
        </div>
      </div>

      <div className="mt-5 flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          loading={submitting}
          disabled={submitting || !rating || tooShort || tooLong || Boolean(flagged)}
        >
          {submitting ? 'Submitting' : 'Submit review'}
        </Button>
      </div>
    </form>
  );
}
