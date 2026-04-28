import { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import ProductImage from './ProductImage';
import { VARIANTS } from '@/utils/tints';
import { fadeIn } from '@/motion/variants';
import { springs } from '@/motion/transitions';

export default function ProductGallery({ medicine }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative border border-border-subtle rounded-2xl overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={VARIANTS[active]}
            variants={fadeIn}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <ProductImage medicine={medicine} variant={VARIANTS[active]} />
          </m.div>
        </AnimatePresence>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 md:gap-3">
        {VARIANTS.map((v, i) => {
          const isActive = active === i;
          return (
            <m.button
              key={v}
              type="button"
              onClick={() => setActive(i)}
              whileTap={{ scale: 0.96 }}
              transition={springs.soft}
              aria-label={`View ${v} image`}
              aria-pressed={isActive}
              className={clsx(
                'rounded-xl overflow-hidden border-2 transition-colors',
                isActive
                  ? 'border-primary'
                  : 'border-border-subtle hover:border-border-strong'
              )}
            >
              <ProductImage medicine={medicine} variant={v} size="sm" withGuides={false} rounded="" />
            </m.button>
          );
        })}
      </div>
    </div>
  );
}
