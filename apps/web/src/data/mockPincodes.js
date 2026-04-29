// Mock serviceability — replaced by /serviceability/:pincode in M2.

const serviceable = {
  // Bangalore
  '5600': { city: 'Bangalore', state: 'Karnataka', etaHours: 24, expressEligible: true },
  '5610': { city: 'Bangalore', state: 'Karnataka', etaHours: 36, expressEligible: false },
  // Mumbai (sample)
  '4000': { city: 'Mumbai', state: 'Maharashtra', etaHours: 36, expressEligible: false },
  '4001': { city: 'Mumbai', state: 'Maharashtra', etaHours: 48, expressEligible: false },
  // Delhi
  '1100': { city: 'Delhi', state: 'Delhi', etaHours: 48, expressEligible: false },
  // Hyderabad
  '5000': { city: 'Hyderabad', state: 'Telangana', etaHours: 36, expressEligible: false },
  // Pune
  '4110': { city: 'Pune', state: 'Maharashtra', etaHours: 36, expressEligible: false },
  // Chennai
  '6000': { city: 'Chennai', state: 'Tamil Nadu', etaHours: 48, expressEligible: false },
};

export function checkPincode(pincode) {
  if (!/^\d{6}$/.test(pincode || '')) return null;
  const prefix = pincode.slice(0, 4);
  const match = serviceable[prefix];
  if (!match) return { pincode, serviceable: false };
  return { pincode, serviceable: true, ...match };
}

export function etaLabel(hours) {
  if (!hours) return null;
  if (hours <= 2) return 'Within 2 hours';
  if (hours <= 24) return 'In 24 hours';
  if (hours <= 48) return '24 to 48 hours';
  return `~${Math.round(hours / 24)} days`;
}
