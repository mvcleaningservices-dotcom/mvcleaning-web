import { Seo } from '../components/Seo';

/** Standard terms-of-service boilerplate matching this build's actual booking/payment
 * flow. Flag for legal review before real launch. */
export function Terms() {
  return (
    <>
      <Seo title="Terms & Conditions" description="Service agreement terms for MV Cleaning Services." />
      <section className="block">
        <div className="container legal">
          <h1>Terms & Conditions</h1>
          <p className="muted small">Last updated: {new Date().toLocaleDateString()}</p>

          <h2>1. Booking & Advance Payment</h2>
          <p>
            To confirm a booking, you may be required to pay an advance amount, shown at the time of
            booking. This amount is set by MV Cleaning Services and may vary or be waived at our
            discretion.
          </p>

          <h2>2. Service Delivery</h2>
          <p>
            Our service professionals will visit at the scheduled date and time to deliver the
            booked service. Availability is subject to service and area coverage at the time of
            booking.
          </p>

          <h2>3. Final Payment</h2>
          <p>
            The remaining balance after the advance is payable upon completion of the service, via
            your MV Wallet balance, or in cash to the professional — split however is convenient.
          </p>

          <h2>4. Wallet Balance</h2>
          <p>
            Wallet top-ups are non-refundable to external payment methods but may be used toward any
            future booking. Wallet balances do not expire.
          </p>

          <h2>5. Cancellations</h2>
          <p>
            You may cancel a booking by contacting our support team. Refund of any advance paid is at
            the discretion of MV Cleaning Services, depending on the timing of the cancellation.
          </p>

          <h2>6. Liability</h2>
          <p>
            MV Cleaning Services engages professional service providers and takes reasonable care in
            their assignment. Any service-quality concerns should be reported promptly via our{' '}
            <a href="/contact">Contact Us</a> page so we can address them.
          </p>

          <h2>7. Changes to These Terms</h2>
          <p>
            We may update these terms from time to time. Continued use of the app after changes are
            posted constitutes acceptance of the revised terms.
          </p>
        </div>
      </section>
    </>
  );
}
