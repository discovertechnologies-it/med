// Deterministic tint pairs from the locked palette. Same id always picks the same tint.
const tints = [
  { bg: 'bg-primary-muted', fg: 'text-primary' },
  { bg: 'bg-accent-muted', fg: 'text-accent' },
  { bg: 'bg-success-muted', fg: 'text-success' },
  { bg: 'bg-warning-muted', fg: 'text-warning' },
];

export function tintFor(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 1000;
  return tints[h % tints.length];
}

export const VARIANTS = ['front', 'pill', 'strip'];
