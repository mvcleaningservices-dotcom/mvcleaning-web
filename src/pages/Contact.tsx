import { api } from '../api';
import { InquiryForm } from '../components/InquiryForm';
import { Seo } from '../components/Seo';

export function Contact() {
  return (
    <>
      <Seo title="Contact Us" description="Get in touch with MV Cleaning Services." />
      <section className="block">
        <div className="container">
          <h1 className="section-title">Contact Us</h1>
          <p className="section-sub">Have a question or need help with a booking? Reach out below.</p>

          <div className="grid" style={{ gridTemplateColumns: '1fr 1.2fr', alignItems: 'start' }}>
            <div className="contact-info">
              <div>
                <strong>Phone</strong>
                <div className="muted">+91 00000 00000</div>
              </div>
              <div>
                <strong>Email</strong>
                <div className="muted">support@mvcleaningservices.example</div>
              </div>
              <div>
                <strong>Location</strong>
                <div className="muted">Bangalore, India</div>
              </div>
              <p className="muted small">
                (Placeholder contact details — to be replaced with MV Cleaning Services' actual phone,
                email, and address before launch.)
              </p>
            </div>

            <InquiryForm onSubmit={api.submitContact} />
          </div>
        </div>
      </section>
    </>
  );
}
