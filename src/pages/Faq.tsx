import { Seo } from '../components/Seo';

const FAQS = [
  {
    q: 'How do I book a service?',
    a: 'Download the MV Cleaning Services app, log in with your mobile number, enter your pincode, and choose from the services available in your area.',
  },
  {
    q: 'Why do I need to pay an advance?',
    a: 'A small advance confirms your booking slot and helps us schedule our professionals efficiently. The amount is shown before you confirm, and in some cases may be waived.',
  },
  {
    q: 'How do I pay the remaining balance?',
    a: 'After the service is delivered, you can pay the remaining balance using your MV Wallet balance, and any remainder in cash to the professional — split however is convenient for you.',
  },
  {
    q: 'What is the MV Wallet?',
    a: 'The wallet lets you top up a balance in advance and use it to pay for future bookings, in full or in part, instead of paying online or in cash each time.',
  },
  {
    q: 'Can I reschedule or cancel a booking?',
    a: 'Yes — reach out via the Contact page or in-app support, and our team will help you reschedule or cancel your booking.',
  },
  {
    q: 'What if I\'m not happy with the service?',
    a: 'Let us know through the Contact page as soon as possible. Our support team will look into it and make it right.',
  },
];

export function Faq() {
  return (
    <>
      <Seo title="FAQ" description="Frequently asked questions about booking, payment, wallet, and service delivery." />
      <section className="block">
        <div className="container">
          <h1 className="section-title">Frequently Asked Questions</h1>
          <div style={{ maxWidth: 720 }}>
            {FAQS.map((f) => (
              <div key={f.q} className="faq-item">
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
