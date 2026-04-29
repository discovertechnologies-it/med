export default function Terms() {
  return (
    <>
      <p className="text-label uppercase text-text-tertiary">Effective 2026-01-01</p>
      <h1 className="mt-2 text-h1 md:text-h1-lg text-text-primary">Terms of service</h1>

      <Section title="Acceptance">
        <p>
          By using Med, you agree to these terms. If you do not agree, do not use the service.
        </p>
      </Section>
      <Section title="Eligibility">
        <p>
          You must be at least 18 years old or have a guardian acting on your behalf. Med ships
          only within serviceable Indian pincodes shown at checkout.
        </p>
      </Section>
      <Section title="Prescription medicines">
        <p>
          Schedule H, H1, and X medicines require a valid prescription from a licensed medical
          practitioner. We reserve the right to reject orders without a verifiable prescription.
        </p>
      </Section>
      <Section title="Pricing and taxes">
        <p>
          All prices are in INR and inclusive of GST. We may change prices without prior notice.
          The price applicable to your order is the price displayed at checkout.
        </p>
      </Section>
      <Section title="Account responsibility">
        <p>
          You are responsible for activity on your account. Keep your OTP confidential and notify
          us immediately at hello@med.example if you suspect unauthorised access.
        </p>
      </Section>
      <Section title="Limitation of liability">
        <p>
          Med is not a substitute for medical advice. Always consult your doctor. To the extent
          permitted by law, our liability is limited to the value of the affected order.
        </p>
      </Section>
      <Section title="Governing law">
        <p>
          These terms are governed by the laws of India. Disputes are subject to the exclusive
          jurisdiction of courts in Bangalore, Karnataka.
        </p>
      </Section>
    </>
  );
}

function Section({ title, children }) {
  return (
    <section className="mt-6">
      <h2 className="text-h3 text-text-primary">{title}</h2>
      <div className="mt-2 text-body text-text-secondary space-y-2">{children}</div>
    </section>
  );
}
