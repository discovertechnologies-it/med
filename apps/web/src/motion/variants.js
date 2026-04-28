// Locked Framer Motion variant library.
// Components consume named variants — never inline magic numbers.

import { baseTransition, fastTransition, springs } from './transitions';

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: baseTransition },
  exit: { opacity: 0, transition: fastTransition },
};

export const fadeUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: baseTransition },
  exit: { opacity: 0, y: -4, transition: fastTransition },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1, transition: springs.snappy },
  exit: { opacity: 0, scale: 0.98, transition: fastTransition },
};

export const slideUp = {
  initial: { y: '100%' },
  animate: { y: 0, transition: springs.drag },
  exit: { y: '100%', transition: { duration: 0.2 } },
};

export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.02,
    },
  },
};

// Default page transition — fade + 8px lift
export const pageTransition = fadeUp;

// Reduced-motion fallback — opacity only, no transform
export const reducedMotionFade = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

// Tap interaction for primary CTAs — small scale press
export const tapScale = { scale: 0.97 };

// Hover interaction (desktop only — gate with hover-capable check)
export const hoverScale = { scale: 1.02 };

// Form error shake
export const errorShake = {
  x: [0, -5, 5, -4, 4, 0],
  transition: { duration: 0.3 },
};
