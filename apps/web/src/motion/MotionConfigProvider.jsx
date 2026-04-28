import { LazyMotion, MotionConfig, domAnimation } from 'framer-motion';

export default function MotionConfigProvider({ children }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
