export const faqCategories = [
  {
    slug: 'orders',
    label: 'Orders',
    questions: [
      {
        q: 'How long does delivery take?',
        a: 'Standard delivery lands in 24 to 48 hours across serviceable pincodes. Express delivery, where available, arrives within 2 hours of order confirmation.',
      },
      {
        q: 'Can I cancel an order after placing it?',
        a: 'You can cancel any order before it moves to "Packed". Once shipped, you will need to use the return flow if applicable.',
      },
      {
        q: 'How do I track my order?',
        a: 'Open Orders from your account or from the email confirmation. You will see live status updates and an estimated delivery time.',
      },
    ],
  },
  {
    slug: 'prescriptions',
    label: 'Prescriptions',
    questions: [
      {
        q: 'Which medicines need a prescription?',
        a: 'Anything classified Schedule H, H1, or X under the Drugs and Cosmetics Act. Each product page shows a prescription badge if it applies.',
      },
      {
        q: 'How do I upload a prescription?',
        a: 'Go to Prescriptions in your account, drag in a photo or PDF, and submit. A licensed pharmacist reviews each within 30 minutes during work hours.',
      },
      {
        q: 'Can I reuse the same prescription?',
        a: 'Yes — within 6 months of the issue date. Pick it from your prescription locker at checkout.',
      },
      {
        q: 'What if my prescription is rejected?',
        a: 'You will receive a notification with the reason. The order is auto-cancelled and refunded within 24 hours. You can upload a new prescription to retry.',
      },
    ],
  },
  {
    slug: 'payments',
    label: 'Payments and refunds',
    questions: [
      {
        q: 'Which payment methods do you accept?',
        a: 'UPI, all major credit and debit cards (Visa, Mastercard, Rupay), and cash on delivery on orders below ₹5,000.',
      },
      {
        q: 'How long do refunds take?',
        a: 'Refunds initiate within 24 hours of approval. Bank credits typically reflect in 5 to 7 business days.',
      },
      {
        q: 'Are my payments secure?',
        a: 'All payments go through PCI-DSS compliant gateways with end-to-end encryption. We never store card details on our servers.',
      },
    ],
  },
  {
    slug: 'returns',
    label: 'Returns',
    questions: [
      {
        q: 'What can I return?',
        a: 'Damaged, expired, or wrong items within 7 days of delivery. Prescription medicines once the seal is broken cannot be returned per regulatory rules.',
      },
      {
        q: 'How do I report an issue?',
        a: 'Open the order, tap "Report an issue", and add photos of the problem. Our team responds within 24 hours.',
      },
    ],
  },
  {
    slug: 'account',
    label: 'Account',
    questions: [
      {
        q: 'Can I add family members to my account?',
        a: 'Yes — up to 5 dependents. Tag any order to a specific member so refill reminders are personalised.',
      },
      {
        q: 'How do I delete my account?',
        a: 'Account deletion is available under Profile. Data is anonymised after a 30-day grace period, in line with the DPDP Act.',
      },
      {
        q: 'Do you save my prescription images?',
        a: 'Yes, securely. Images are encrypted at rest and only visible to licensed pharmacists who review your orders. Required retention is 2 years for Schedule H1 items.',
      },
    ],
  },
];
