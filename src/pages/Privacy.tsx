import { Seo } from '../components/Seo';

/**
 * Standard privacy-policy boilerplate for a booking platform. Covers the
 * data actually collected by this build (mobile number, address, pincode,
 * wallet/payment records via Razorpay). Flag for legal review before real
 * launch — not a substitute for counsel, but a reasonable, accurate draft.
 */
export function Privacy() {
  return (
    <>
      <Seo title="Privacy Policy" description="How MV Cleaning Services collects, uses, and protects your data." />
      <section className="block">
        <div className="container legal">
          <h1>Privacy Policy</h1>
          <p className="muted small">Last updated: {new Date().toLocaleDateString()}</p>

          <h2>Information We Collect</h2>
          <p>
            When you use the MV Cleaning Services app, we collect your mobile number (for OTP login),
            name and address (if you provide them), your pincode (to show services in your area),
            booking and order details, and wallet transaction records.
          </p>

          <h2>How We Use Your Information</h2>
          <p>
            We use this information to process your bookings, assign service professionals, manage
            your wallet balance, communicate with you about your orders, and improve our services.
          </p>

          <h2>Payment Information</h2>
          <p>
            Payments are processed securely through Razorpay. We do not store your card, UPI, or
            banking details on our servers — this is handled directly by our payment partner.
          </p>

          <h2>Data Sharing</h2>
          <p>
            We share your name, address, and contact number with the service professional assigned to
            your booking, solely for the purpose of delivering the service. We do not sell your
            personal data to third parties.
          </p>

          <h2>Data Retention</h2>
          <p>
            We retain your account and order history for as long as your account remains active, and
            as required to comply with legal and accounting obligations.
          </p>

          <h2>Your Rights</h2>
          <p>
            You can update your profile information (name, address, pincode) at any time from within
            the app. To request deletion of your account or data, contact us via the{' '}
            <a href="/contact">Contact Us</a> page.
          </p>

          <h2>Contact Us</h2>
          <p>
            For any privacy-related questions, please reach out through our{' '}
            <a href="/contact">Contact Us</a> page.
          </p>
        </div>
      </section>
    </>
  );
}
