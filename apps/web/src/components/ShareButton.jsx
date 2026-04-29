import { m, useReducedMotion } from 'framer-motion';
import { Share2, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import clsx from 'clsx';
import { springs } from '@/motion/transitions';

export default function ShareButton({ title, text, path, size = 'md', className }) {
  const reduce = useReducedMotion();
  const [copied, setCopied] = useState(false);

  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-9 w-9',
    lg: 'h-11 w-11',
  };

  const url = typeof window === 'undefined' ? path : `${window.location.origin}${path}`;

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (err) {
        if (err?.name === 'AbortError') return;
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Link copied to clipboard');
      setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error('Could not copy link');
    }
  };

  return (
    <m.button
      type="button"
      onClick={handleClick}
      whileTap={reduce ? undefined : { scale: 0.92 }}
      transition={springs.snappy}
      aria-label="Share"
      className={clsx(
        'inline-flex items-center justify-center rounded-full border border-border-subtle hover:border-border-strong bg-bg-surface text-text-secondary hover:text-text-primary transition-colors',
        sizes[size],
        className
      )}
    >
      {copied ? <Check size={size === 'lg' ? 20 : 16} className="text-success" /> : <Share2 size={size === 'lg' ? 20 : 16} />}
    </m.button>
  );
}
