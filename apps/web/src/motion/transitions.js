// Locked motion tokens. Do not invent new durations or easings here —
// import the named token instead and compose them.

export const durations = {
  fast: 0.15,
  base: 0.25,
  slow: 0.4,
};

export const easings = {
  // smooth ease-out — premium default for non-spring transitions
  out: [0.22, 1, 0.36, 1],
  // ease-in-out — for symmetric transitions (rare)
  inOut: [0.65, 0, 0.35, 1],
};

export const springs = {
  // resting interactions: button press, card lift
  soft: { type: 'spring', stiffness: 300, damping: 30, mass: 0.6 },
  // snappier — for layout transitions (tabs, accordion)
  snappy: { type: 'spring', stiffness: 420, damping: 32, mass: 0.5 },
  // for drag-to-dismiss bottom sheets
  drag: { type: 'spring', stiffness: 250, damping: 28 },
};

export const baseTransition = {
  duration: durations.base,
  ease: easings.out,
};

export const fastTransition = {
  duration: durations.fast,
  ease: easings.out,
};

export const slowTransition = {
  duration: durations.slow,
  ease: easings.out,
};
