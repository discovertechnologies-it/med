// Mock catalog — replaced by real API in M2. Indian brands and salts.
// Schedule: 'OTC' | 'H' | 'H1' | 'X'

const inr = (n) => n;

export const categories = [
  { slug: 'pain-relief', label: 'Pain relief' },
  { slug: 'diabetes', label: 'Diabetes care' },
  { slug: 'heart-bp', label: 'Heart and BP' },
  { slug: 'gastric', label: 'Gastric' },
  { slug: 'antibiotics', label: 'Antibiotics' },
  { slug: 'allergy', label: 'Allergy' },
  { slug: 'vitamins', label: 'Vitamins' },
  { slug: 'skin-care', label: 'Skin care' },
];

export const medicines = [
  {
    id: 'dolo-650',
    brand: 'Dolo 650',
    salt: 'Paracetamol 650 mg',
    manufacturer: 'Micro Labs',
    packSize: 'Strip of 15 tablets',
    mrp: inr(34),
    sellingPrice: inr(31),
    requiresPrescription: false,
    schedule: 'OTC',
    category: 'pain-relief',
    inStock: true,
    isGeneric: false,
    description:
      'Dolo 650 is a paracetamol-based analgesic and antipyretic used to relieve mild to moderate pain and reduce fever.',
    uses: ['Mild to moderate pain', 'Fever', 'Headache', 'Body ache', 'Toothache'],
    sideEffects: ['Nausea', 'Stomach upset (rare)', 'Allergic skin reactions (rare)'],
    storage: 'Store below 25 °C in a dry place. Keep away from direct sunlight.',
    alternatives: ['paracetamol-generic-650', 'crocin-650', 'calpol-650'],
  },
  {
    id: 'paracetamol-generic-650',
    brand: 'Paracetamol 650',
    salt: 'Paracetamol 650 mg',
    manufacturer: 'Cipla',
    packSize: 'Strip of 15 tablets',
    mrp: inr(28),
    sellingPrice: inr(14),
    requiresPrescription: false,
    schedule: 'OTC',
    category: 'pain-relief',
    inStock: true,
    isGeneric: true,
    description:
      'Generic paracetamol — same composition as branded options at a significantly lower price.',
    uses: ['Mild to moderate pain', 'Fever'],
    sideEffects: ['Nausea (rare)', 'Allergic skin reactions (rare)'],
    storage: 'Store below 25 °C in a dry place.',
    alternatives: ['dolo-650', 'crocin-650'],
  },
  {
    id: 'crocin-650',
    brand: 'Crocin Advance',
    salt: 'Paracetamol 500 mg',
    manufacturer: 'GSK',
    packSize: 'Strip of 15 tablets',
    mrp: inr(32),
    sellingPrice: inr(30),
    requiresPrescription: false,
    schedule: 'OTC',
    category: 'pain-relief',
    inStock: true,
    isGeneric: false,
    description: 'Fast-acting paracetamol for pain and fever.',
    uses: ['Headache', 'Fever', 'Mild pain'],
    sideEffects: ['Rare allergic reactions'],
    storage: 'Below 25 °C, dry place.',
    alternatives: ['dolo-650', 'calpol-650'],
  },
  {
    id: 'calpol-650',
    brand: 'Calpol 650',
    salt: 'Paracetamol 650 mg',
    manufacturer: 'GSK',
    packSize: 'Strip of 15 tablets',
    mrp: inr(36),
    sellingPrice: inr(33),
    requiresPrescription: false,
    schedule: 'OTC',
    category: 'pain-relief',
    inStock: true,
    isGeneric: false,
    description: 'Paracetamol formulation for pain and fever.',
    uses: ['Pain', 'Fever'],
    sideEffects: ['Rare nausea'],
    storage: 'Below 25 °C.',
    alternatives: ['dolo-650', 'crocin-650', 'paracetamol-generic-650'],
  },
  {
    id: 'combiflam',
    brand: 'Combiflam',
    salt: 'Ibuprofen 400 mg + Paracetamol 325 mg',
    manufacturer: 'Sanofi',
    packSize: 'Strip of 20 tablets',
    mrp: inr(56),
    sellingPrice: inr(52),
    requiresPrescription: false,
    schedule: 'OTC',
    category: 'pain-relief',
    inStock: true,
    isGeneric: false,
    description: 'Combination of ibuprofen and paracetamol for moderate pain and inflammation.',
    uses: ['Body pain', 'Joint pain', 'Menstrual cramps'],
    sideEffects: ['Stomach irritation', 'Nausea'],
    storage: 'Cool dry place.',
    alternatives: [],
  },
  {
    id: 'pan-d',
    brand: 'Pan-D',
    salt: 'Pantoprazole 40 mg + Domperidone 30 mg',
    manufacturer: 'Alkem',
    packSize: 'Strip of 15 capsules',
    mrp: inr(165),
    sellingPrice: inr(148),
    requiresPrescription: true,
    schedule: 'H',
    category: 'gastric',
    inStock: true,
    isGeneric: false,
    description: 'Combination for acid reflux and indigestion.',
    uses: ['GERD', 'Acidity', 'Bloating'],
    sideEffects: ['Headache', 'Diarrhea'],
    storage: 'Below 25 °C.',
    alternatives: ['pantop-d-generic'],
  },
  {
    id: 'pantop-d-generic',
    brand: 'Pantop-D',
    salt: 'Pantoprazole 40 mg + Domperidone 30 mg',
    manufacturer: 'Aristo',
    packSize: 'Strip of 15 capsules',
    mrp: inr(120),
    sellingPrice: inr(72),
    requiresPrescription: true,
    schedule: 'H',
    category: 'gastric',
    inStock: true,
    isGeneric: true,
    description: 'Generic alternative for pantoprazole + domperidone combination.',
    uses: ['GERD', 'Acidity'],
    sideEffects: ['Headache (rare)'],
    storage: 'Below 25 °C.',
    alternatives: ['pan-d'],
  },
  {
    id: 'augmentin-625',
    brand: 'Augmentin 625 Duo',
    salt: 'Amoxicillin 500 mg + Clavulanic acid 125 mg',
    manufacturer: 'GSK',
    packSize: 'Strip of 10 tablets',
    mrp: inr(280),
    sellingPrice: inr(252),
    requiresPrescription: true,
    schedule: 'H',
    category: 'antibiotics',
    inStock: true,
    isGeneric: false,
    description: 'Broad-spectrum antibiotic for bacterial infections.',
    uses: ['Respiratory tract infections', 'Skin infections', 'UTI'],
    sideEffects: ['Diarrhea', 'Nausea', 'Skin rash'],
    storage: 'Below 25 °C.',
    alternatives: [],
  },
  {
    id: 'telma-40',
    brand: 'Telma 40',
    salt: 'Telmisartan 40 mg',
    manufacturer: 'Glenmark',
    packSize: 'Strip of 15 tablets',
    mrp: inr(168),
    sellingPrice: inr(152),
    requiresPrescription: true,
    schedule: 'H',
    category: 'heart-bp',
    inStock: true,
    isGeneric: false,
    description: 'Used to treat high blood pressure.',
    uses: ['Hypertension'],
    sideEffects: ['Dizziness', 'Back pain'],
    storage: 'Below 25 °C.',
    alternatives: ['telmisartan-generic'],
  },
  {
    id: 'telmisartan-generic',
    brand: 'Telmisartan 40',
    salt: 'Telmisartan 40 mg',
    manufacturer: 'Cipla',
    packSize: 'Strip of 15 tablets',
    mrp: inr(120),
    sellingPrice: inr(48),
    requiresPrescription: true,
    schedule: 'H',
    category: 'heart-bp',
    inStock: true,
    isGeneric: true,
    description: 'Generic telmisartan — same composition as branded options.',
    uses: ['Hypertension'],
    sideEffects: ['Dizziness (rare)'],
    storage: 'Below 25 °C.',
    alternatives: ['telma-40'],
  },
  {
    id: 'glycomet-500',
    brand: 'Glycomet 500',
    salt: 'Metformin 500 mg',
    manufacturer: 'USV',
    packSize: 'Strip of 20 tablets',
    mrp: inr(28),
    sellingPrice: inr(25),
    requiresPrescription: true,
    schedule: 'H',
    category: 'diabetes',
    inStock: true,
    isGeneric: false,
    description: 'Used to treat type 2 diabetes mellitus.',
    uses: ['Type 2 diabetes'],
    sideEffects: ['Nausea', 'Stomach upset'],
    storage: 'Below 25 °C.',
    alternatives: [],
  },
  {
    id: 'amlong-5',
    brand: 'Amlong 5',
    salt: 'Amlodipine 5 mg',
    manufacturer: 'Micro Labs',
    packSize: 'Strip of 15 tablets',
    mrp: inr(72),
    sellingPrice: inr(64),
    requiresPrescription: true,
    schedule: 'H',
    category: 'heart-bp',
    inStock: true,
    isGeneric: false,
    description: 'Calcium channel blocker for high blood pressure.',
    uses: ['Hypertension', 'Angina'],
    sideEffects: ['Ankle swelling', 'Headache'],
    storage: 'Below 25 °C.',
    alternatives: [],
  },
  {
    id: 'cetirizine-10',
    brand: 'Cetirizine 10',
    salt: 'Cetirizine 10 mg',
    manufacturer: 'Cipla',
    packSize: 'Strip of 10 tablets',
    mrp: inr(22),
    sellingPrice: inr(11),
    requiresPrescription: false,
    schedule: 'OTC',
    category: 'allergy',
    inStock: true,
    isGeneric: true,
    description: 'Antihistamine for allergic reactions.',
    uses: ['Allergic rhinitis', 'Hives', 'Itchy eyes'],
    sideEffects: ['Drowsiness'],
    storage: 'Below 25 °C.',
    alternatives: [],
  },
  {
    id: 'vitamin-d3-60k',
    brand: 'Uprise D3 60K',
    salt: 'Cholecalciferol 60000 IU',
    manufacturer: 'Alkem',
    packSize: 'Pack of 4 sachets',
    mrp: inr(85),
    sellingPrice: inr(78),
    requiresPrescription: false,
    schedule: 'OTC',
    category: 'vitamins',
    inStock: true,
    isGeneric: false,
    description: 'Vitamin D3 supplement for deficiency.',
    uses: ['Vitamin D deficiency', 'Bone health'],
    sideEffects: ['Rare hypercalcemia at high doses'],
    storage: 'Cool dry place.',
    alternatives: [],
  },
  {
    id: 'becosules',
    brand: 'Becosules',
    salt: 'B-complex vitamins',
    manufacturer: 'Pfizer',
    packSize: 'Strip of 20 capsules',
    mrp: inr(48),
    sellingPrice: inr(44),
    requiresPrescription: false,
    schedule: 'OTC',
    category: 'vitamins',
    inStock: true,
    isGeneric: false,
    description: 'B-complex vitamin supplement.',
    uses: ['B-vitamin deficiency', 'Energy support'],
    sideEffects: ['Rarely yellow urine (vitamin B2)'],
    storage: 'Below 25 °C.',
    alternatives: [],
  },
];

export function findMedicine(id) {
  return medicines.find((m) => m.id === id) || null;
}

// Hand-picked best-sellers for cold-start recommendations.
const trendingIds = [
  'dolo-650',
  'cetirizine-10',
  'pan-d',
  'glycomet-500',
  'becosules',
  'combiflam',
];

export function getTrending() {
  return trendingIds.map(findMedicine).filter(Boolean);
}

export function searchMedicines({
  q = '',
  category = null,
  rx = null,
  generic = null,
  sort = 'relevance',
} = {}) {
  const ql = q.trim().toLowerCase();
  const filtered = medicines.filter((m) => {
    if (ql) {
      const haystack = `${m.brand} ${m.salt} ${m.manufacturer}`.toLowerCase();
      if (!haystack.includes(ql)) return false;
    }
    if (category && m.category !== category) return false;
    if (rx === 'rx' && !m.requiresPrescription) return false;
    if (rx === 'otc' && m.requiresPrescription) return false;
    if (generic === 'generic' && !m.isGeneric) return false;
    if (generic === 'brand' && m.isGeneric) return false;
    return true;
  });
  return sortMedicines(filtered, sort);
}

export function sortMedicines(list, sort) {
  const arr = [...list];
  if (sort === 'price-asc') arr.sort((a, b) => a.sellingPrice - b.sellingPrice);
  else if (sort === 'price-desc') arr.sort((a, b) => b.sellingPrice - a.sellingPrice);
  else if (sort === 'discount') {
    arr.sort((a, b) => {
      const da = a.mrp > 0 ? (a.mrp - a.sellingPrice) / a.mrp : 0;
      const db = b.mrp > 0 ? (b.mrp - b.sellingPrice) / b.mrp : 0;
      return db - da;
    });
  }
  // 'relevance' is the catalog's natural order
  return arr;
}

// Hand-curated "frequently bought together" pairings — replaced by collaborative filtering in M4.
const fbtPairs = {
  'dolo-650': ['cetirizine-10', 'becosules'],
  'paracetamol-generic-650': ['cetirizine-10', 'becosules'],
  'crocin-650': ['cetirizine-10', 'pan-d'],
  'calpol-650': ['cetirizine-10'],
  'combiflam': ['pan-d', 'becosules'],
  'pan-d': ['dolo-650'],
  'pantop-d-generic': ['dolo-650'],
  'augmentin-625': ['pan-d', 'becosules'],
  'telma-40': ['glycomet-500'],
  'telmisartan-generic': ['glycomet-500'],
  'glycomet-500': ['amlong-5', 'vitamin-d3-60k'],
  'amlong-5': ['telma-40'],
  'cetirizine-10': ['vitamin-d3-60k'],
  'vitamin-d3-60k': ['becosules'],
  'becosules': ['vitamin-d3-60k'],
};

export function frequentlyBoughtFor(medicine) {
  if (!medicine) return [];
  const ids = fbtPairs[medicine.id] ?? [];
  return ids.map(findMedicine).filter(Boolean);
}

export function alternativesFor(medicine) {
  if (!medicine) return [];
  // explicit alternatives + same salt across brands
  const explicit = (medicine.alternatives || [])
    .map(findMedicine)
    .filter(Boolean);
  const sameSalt = medicines.filter(
    (m) => m.id !== medicine.id && m.salt === medicine.salt
  );
  const seen = new Set();
  return [...explicit, ...sameSalt]
    .filter((m) => {
      if (seen.has(m.id)) return false;
      seen.add(m.id);
      return true;
    })
    .sort((a, b) => a.sellingPrice - b.sellingPrice);
}
