// Mock coupon catalog — replaced by API in M2.
// type: 'flat' | 'percent' | 'freedel'

export const coupons = [
  {
    code: 'FLAT100',
    type: 'flat',
    value: 100,
    minOrder: 500,
    label: 'Flat ₹100 off on orders over ₹500',
  },
  {
    code: 'WELCOME10',
    type: 'percent',
    value: 10,
    maxDiscount: 150,
    minOrder: 0,
    label: '10% off your first order, up to ₹150',
  },
  {
    code: 'FREEDEL',
    type: 'freedel',
    minOrder: 0,
    label: 'Free delivery on any order',
  },
];

export function findCoupon(code) {
  if (!code) return null;
  return coupons.find((c) => c.code === code.toUpperCase()) || null;
}

export function applyCouponToTotals(coupon, subtotal) {
  let discount = 0;
  let freeDelivery = false;

  if (!coupon) return { discount, freeDelivery, error: null };
  if (subtotal < (coupon.minOrder || 0)) {
    return {
      discount: 0,
      freeDelivery: false,
      error: `Minimum order ₹${coupon.minOrder} required`,
    };
  }

  if (coupon.type === 'flat') {
    discount = Math.min(coupon.value, subtotal);
  } else if (coupon.type === 'percent') {
    discount = Math.min(
      Math.round((subtotal * coupon.value) / 100),
      coupon.maxDiscount ?? Infinity
    );
  } else if (coupon.type === 'freedel') {
    freeDelivery = true;
  }
  return { discount, freeDelivery, error: null };
}
