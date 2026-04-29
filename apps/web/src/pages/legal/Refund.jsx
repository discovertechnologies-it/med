export default function Refund() {
  return (
    <>
      <p className="text-label uppercase text-text-tertiary">Effective 2026-01-01</p>
      <h1 className="mt-2 text-h1 md:text-h1-lg text-text-primary">Refund and return policy</h1>

      <Section title="Returnable items">
        <p>
          You can return damaged, expired, or wrongly delivered items within 7 days of delivery.
          Take photos of the issue and submit via the order detail page.
        </p>
      </Section>
      <Section title="Non-returnable items">
        <p>
          Prescription medicines once the seal is broken cannot be returned, in line with the
          Drugs and Cosmetics Act. Cold-chain products (insulin, vaccines) are non-returnable
          unless damaged on receipt.
        </p>
      </Section>
      <Section title="Cancellations">
        <p>
          You can cancel an order any time before it moves to "Packed". Cancellations after that
          require contacting support at hello@med.example.
        </p>
      </Section>
      <Section title="Refund timelines">
        <ul>
          <li>UPI / Card / Net banking: 5 to 7 business days</li>
          <li>Cash on Delivery: refunded as store credit, or to a bank account on request</li>
          <li>Refund initiates within 24 hours of cancellation or return approval</li>
        </ul>
      </Section>
      <Section title="Prescription rejections">
        <p>
          If a pharmacist rejects your prescription, the order is auto-cancelled and refunded
          within 24 hours. You will receive a notification with the reason.
        </p>
      </Section>
      <Section title="Disputes">
        <p>
          For any dispute, write to support@med.example with your order ID and photos. Our team
          responds within 24 hours.
        </p>
      </Section>
    </>
  );
}

function Section({ title, children }) {
  return (
    <section className="mt-6">
      <h2 className="text-h3 text-text-primary">{title}</h2>
      <div className="mt-2 text-body text-text-secondary space-y-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">
        {children}
      </div>
    </section>
  );
}
