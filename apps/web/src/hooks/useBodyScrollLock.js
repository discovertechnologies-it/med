import { useEffect } from 'react';

// Counted lock — multiple modals can call this simultaneously; the body unlocks
// only when the last consumer releases. Adds paddingRight equal to the lost
// scrollbar width so the page does not shift when overflow goes to hidden.

let lockCount = 0;
let originalPaddingRight = null;

export function useBodyScrollLock(active) {
  useEffect(() => {
    if (!active) return undefined;

    if (lockCount === 0) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      originalPaddingRight = document.body.style.paddingRight;
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
      document.body.classList.add('scroll-locked');
    }
    lockCount += 1;

    return () => {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) {
        document.body.classList.remove('scroll-locked');
        document.body.style.paddingRight = originalPaddingRight ?? '';
        originalPaddingRight = null;
      }
    };
  }, [active]);
}
