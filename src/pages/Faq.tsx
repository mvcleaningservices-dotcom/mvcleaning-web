import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Seo } from '../components/Seo';
import { StructuredData } from '../components/StructuredData';
import { Reveal } from '../components/ScrollReveal';

const FAQS = [
  { q: 'What areas do you currently serve?', a: 'We operate across select pincodes in Bengaluru. Enter your pincode on our website to see available services in your area. We\'re expanding rapidly!' },
  { q: 'How do I book a service?', a: 'Visit the MV Cleaning website, enter your pincode, browse services, pick a date and time, pay a small advance, and you\'re confirmed. It takes under 2 minutes.' },
  { q: 'How much does it cost?', a: 'Pricing varies by service. You can see all prices on our Services page. Most services start from ₹149. There are no hidden charges.' },
  { q: 'What is the advance payment?', a: 'A small advance (typically ₹49) is collected at booking to confirm your slot. The remaining balance is paid after service completion — via wallet, UPI, or cash.' },
  { q: 'Can I pay from my wallet?', a: 'Yes! Top up your wallet anytime and use it to pay advances or final balances. The wallet is fully digital and instant.' },
  { q: 'Are your cleaners background-checked?', a: 'Absolutely. Every professional in our network goes through a thorough background and identity verification process before joining.' },
  { q: 'What if I\'m not satisfied with the service?', a: 'Your satisfaction is our guarantee. If you\'re not happy, contact us within 24 hours and we\'ll arrange a redo at no extra charge.' },
  { q: 'Can I reschedule or cancel?', a: 'Yes, you can contact our support team to reschedule or cancel. Please give us at least 2 hours\' notice before the scheduled time.' },
  { q: 'Do I need to provide cleaning supplies?', a: 'No! Our professionals bring all necessary equipment and eco-friendly cleaning supplies. Just let us in.' },
  { q: 'How do I track my booking?', a: 'Log in to the MV Cleaning website and go to My Bookings. You\'ll see your order status, assigned worker name, and payment details in real time.' },
];

/** FAQPage structured data for Google rich results */
const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(faq => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.a,
    },
  })),
};

export function Faq() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const toggle = (i: number) => setOpenIdx(p => p === i ? null : i);

  return (
    <>
      <Seo title="FAQ — Frequently Asked Questions" description="Find answers to common questions about MV Cleaning Services — booking, pricing, payments, and more." />
      <StructuredData data={FAQ_SCHEMA} />

      <section className="page-hero">
        <div className="container">
          <h1>Frequently Asked Questions</h1>
          <p>Everything you need to know before booking your first clean.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="faq-list" role="list">
            {FAQS.map((faq, i) => (
              <Reveal key={i} delay={i * 50}>
                <div className={`faq-item ${openIdx === i ? 'open' : ''}`} role="listitem">
                  <button
                    className="faq-question"
                    onClick={() => toggle(i)}
                    aria-expanded={openIdx === i}
                    aria-controls={`faq-answer-${i}`}
                    id={`faq-question-${i}`}
                  >
                    {faq.q}
                    <ChevronDown size={20} aria-hidden="true" />
                  </button>
                  <div
                    className="faq-answer"
                    id={`faq-answer-${i}`}
                    role="region"
                    aria-labelledby={`faq-question-${i}`}
                  >
                    <div className="faq-answer-inner">{faq.a}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div style={{ textAlign: 'center', marginTop: 56 }}>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: 16 }}>Still have questions?</p>
              <a href="/contact" className="btn-primary" style={{ display: 'inline-flex', textDecoration: 'none' }}>
                Contact Us →
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
