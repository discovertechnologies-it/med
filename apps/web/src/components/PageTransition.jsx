import { m, useReducedMotion } from 'framer-motion';
import { pageTransition, reducedMotionFade } from '@/motion/variants';

export default function PageTransition({ children }) {
  const reduce = useReducedMotion();
  const variants = reduce ? reducedMotionFade : pageTransition;
  return (
    <m.div initial="initial" animate="animate" exit="exit" variants={variants}>
      {children}
    </m.div>
  );
}
