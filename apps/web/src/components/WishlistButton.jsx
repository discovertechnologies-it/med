import { m, useReducedMotion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import clsx from 'clsx';
import { useWishlistStore } from '@/store/useWishlistStore';
import { springs } from '@/motion/transitions';

export default function WishlistButton({
  medicineId,
  medicineName,
  size = 'md',
  variant = 'overlay',
  className,
}) {
  const reduce = useReducedMotion();
  const isSaved = useWishlistStore((s) => s.ids.includes(medicineId));
  const toggle = useWishlistStore((s) => s.toggle);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(medicineId);
    if (!isSaved) {
      toast.success(`${medicineName} saved to wishlist`);
    } else {
      toast(`Removed from wishlist`);
    }
  };

  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-9 w-9',
    lg: 'h-11 w-11',
  };

  const overlayBase =
    'rounded-full bg-bg-surface/90 backdrop-blur-sm shadow-card hover:bg-bg-surface';
  const inlineBase =
    'rounded-full border border-border-subtle hover:border-border-strong bg-bg-surface';

  return (
    <m.button
      type="button"
      onClick={handleClick}
      whileTap={reduce ? undefined : { scale: 0.85 }}
      animate={isSaved && !reduce ? { scale: [1, 1.18, 1] } : {}}
      transition={springs.snappy}
      aria-pressed={isSaved}
      aria-label={isSaved ? `Remove ${medicineName} from wishlist` : `Save ${medicineName} to wishlist`}
      className={clsx(
        'inline-flex items-center justify-center transition-colors',
        sizes[size],
        variant === 'overlay' ? overlayBase : inlineBase,
        isSaved ? 'text-danger' : 'text-text-secondary hover:text-text-primary',
        className
      )}
    >
      <Heart
        size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16}
        fill={isSaved ? 'currentColor' : 'none'}
        strokeWidth={isSaved ? 0 : 1.75}
      />
    </m.button>
  );
}
