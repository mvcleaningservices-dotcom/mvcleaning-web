import { api } from '../api';
import { InquiryForm } from '../components/InquiryForm';
import { Seo } from '../components/Seo';

/**
 * Scope §5 / §8: "Become a Partner" is a simple inquiry form for now —
 * exact eligibility criteria and routing logic are TBD with the client.
 */
export function Partner() {
  return (
    <>
      <Seo title="Become a Partner" description="Partner with MV Cleaning Services." />
      <section className="block">
        <div className="container">
          <h1 className="section-title">Become a Partner</h1>
          <p className="section-sub">
            Interested in partnering with MV Cleaning Services as an individual professional or a
            business? Tell us a bit about yourself and we'll be in touch.
          </p>
          <InquiryForm
            onSubmit={api.submitPartner}
            messageLabel="Tell us about your interest"
            messagePlaceholder="What kind of partnership are you interested in?"
            submitLabel="Submit Inquiry"
          />
        </div>
      </section>
    </>
  );
}
