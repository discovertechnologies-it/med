import { forwardRef } from 'react';
import { m, useReducedMotion } from 'framer-motion';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';
import { springs } from '@/motion/transitions';

const variants = {
  primary:
    'bg-primary text-white hover:bg-primary-hover disabled:bg-text-tertiary disabled:cursor-not-allowed',
  secondary:
    'bg-bg-surface text-text-primary border border-border-strong hover:bg-bg-muted disabled:text-text-tertiary disabled:cursor-not-allowed',
  ghost:
    'bg-transparent text-primary hover:bg-primary-muted disabled:text-text-tertiary disabled:cursor-not-allowed',
};

const sizes = {
  sm: 'h-9 px-3 text-body',
  md: 'h-11 px-5 text-body-lg',
  lg: 'h-12 px-6 text-body-lg',
};

const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    fullWidth = false,
    className,
    type = 'button',
    leftIcon,
    rightIcon,
    ...rest
  },
  ref
) {
  const reduce = useReducedMotion();
  const isDisabled = disabled || loading;

  return (
    <m.button
      ref={ref}
      type={type}
      disabled={isDisabled}
      whileTap={reduce || isDisabled ? undefined : { scale: 0.97 }}
      transition={springs.soft}
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-full font-semibold',
        'select-none transition-colors',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      {...rest}
    >
      {loading ? (
        <Loader2 size={18} className="animate-spin" aria-hidden />
      ) : (
        leftIcon && <span aria-hidden>{leftIcon}</span>
      )}
      <span>{children}</span>
      {!loading && rightIcon && <span aria-hidden>{rightIcon}</span>}
    </m.button>
  );
});

export default Button;
