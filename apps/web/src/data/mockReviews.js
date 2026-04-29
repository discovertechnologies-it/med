// Mock reviews keyed by medicine id. Real impl reads /medicines/:id/reviews.

const seed = {
  'dolo-650': [
    {
      id: 'r1',
      author: 'Anjali R.',
      rating: 5,
      text: 'Best for fever and headaches. Always works within 30 minutes.',
      createdAt: '2025-12-12T10:00:00Z',
      verifiedBuyer: true,
      helpful: 14,
    },
    {
      id: 'r2',
      author: 'Karan S.',
      rating: 4,
      text: 'Reliable. Have been buying this for years. Fast delivery on Med too.',
      createdAt: '2025-11-28T14:20:00Z',
      verifiedBuyer: true,
      helpful: 8,
    },
    {
      id: 'r3',
      author: 'Priya M.',
      rating: 5,
      text: 'Strong dose, kicks in quickly. Keep a strip handy.',
      createdAt: '2025-10-04T09:15:00Z',
      verifiedBuyer: true,
      helpful: 5,
    },
    {
      id: 'r4',
      author: 'Rohit K.',
      rating: 3,
      text: 'Works fine, but I prefer 500mg for kids.',
      createdAt: '2025-09-19T18:30:00Z',
      verifiedBuyer: false,
      helpful: 2,
    },
  ],
  'paracetamol-generic-650': [
    {
      id: 'r1',
      author: 'Sneha D.',
      rating: 5,
      text: 'Same composition, half the price. No difference.',
      createdAt: '2025-12-01T11:00:00Z',
      verifiedBuyer: true,
      helpful: 22,
    },
    {
      id: 'r2',
      author: 'Manish T.',
      rating: 4,
      text: 'Good generic, blister pack feels a little flimsy.',
      createdAt: '2025-11-18T08:00:00Z',
      verifiedBuyer: true,
      helpful: 6,
    },
  ],
  'pan-d': [
    {
      id: 'r1',
      author: 'Vivek B.',
      rating: 4,
      text: 'Calms acidity and bloating after heavy meals. Take before food.',
      createdAt: '2025-12-08T19:00:00Z',
      verifiedBuyer: true,
      helpful: 11,
    },
  ],
  'glycomet-500': [
    {
      id: 'r1',
      author: 'Ramya P.',
      rating: 5,
      text: 'Doctor recommended. Has helped manage my sugar levels well.',
      createdAt: '2025-12-15T07:30:00Z',
      verifiedBuyer: true,
      helpful: 19,
    },
    {
      id: 'r2',
      author: 'Suresh A.',
      rating: 4,
      text: 'Affordable. Does cause mild stomach upset on empty stomach.',
      createdAt: '2025-11-30T16:00:00Z',
      verifiedBuyer: true,
      helpful: 7,
    },
  ],
};

export function getReviews(medicineId) {
  return seed[medicineId] ?? [];
}

export function ratingSummary(reviews) {
  if (!reviews?.length) return { avg: 0, total: 0, dist: [0, 0, 0, 0, 0] };
  const dist = [0, 0, 0, 0, 0];
  let sum = 0;
  for (const r of reviews) {
    const idx = Math.max(0, Math.min(4, r.rating - 1));
    dist[idx] += 1;
    sum += r.rating;
  }
  return {
    avg: sum / reviews.length,
    total: reviews.length,
    // dist returned as [count of 5★, 4★, 3★, 2★, 1★]
    dist: [dist[4], dist[3], dist[2], dist[1], dist[0]],
  };
}
