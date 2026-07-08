import { Seo } from '../components/Seo';

/**
 * Placeholder copy — scope §8 notes final content for About/Blog/static
 * pages will be supplied by the client before launch. Structure and tone
 * are ready; swap in the client's real story, mission statement, and values.
 */
export function About() {
  return (
    <>
      <Seo title="About Us" description="Learn about MV Cleaning Services — our mission and values." />
      <section className="block">
        <div className="container legal">
          <h1>About MV Cleaning Services</h1>
          <p>
            MV Cleaning Services connects homeowners with verified, professional cleaning experts —
            making it simple to book trusted help for your home in just a few taps.
          </p>

          <h2>Our Mission</h2>
          <p>
            We believe a clean home shouldn't be a hassle to arrange. Our mission is to make
            professional home cleaning accessible, reliable, and transparent — from browsing
            services to the final payment.
          </p>

          <h2>Our Values</h2>
          <p>
            <strong>Reliability</strong> — every booking is confirmed and tracked, so you always
            know what to expect.
            <br />
            <strong>Transparency</strong> — clear pricing, flexible payment, and no hidden fees.
            <br />
            <strong>Quality</strong> — we work with skilled, vetted professionals to deliver a
            consistently great experience.
          </p>
        </div>
      </section>
    </>
  );
}
