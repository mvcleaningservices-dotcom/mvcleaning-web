import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { Seo } from '../components/Seo';
import { api } from '../api';

export function Contact() {
  // `website` is the honeypot — the name must match the backend DTO's whitelisted
  // field, or the strict API rejects the submission ("property hp should not exist").
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', website: '' });
  const [status, setStatus] = useState<'idle' | 'busy' | 'done' | 'error'>('idle');
  const [errMsg, setErrMsg] = useState('');

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.website) return; // honeypot
    setStatus('busy'); setErrMsg('');
    try {
      await api.submitInquiry({ ...form, type: 'contact' });
      setStatus('done');
    } catch (err) {
      setErrMsg((err as Error).message || 'Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  return (
    <>
      <Seo title="Contact Us" description="Get in touch with MV Cleaning Services. We're here to help with bookings, queries, and feedback." image="/images/hero.webp" />

      <section className="page-hero">
        <div className="container">
          <h1>Contact Us</h1>
          <p>We're here to help. Reach out and we'll respond promptly.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contact-layout">
            {/* Form */}
            <div className="contact-form-wrap">
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Send a Message</h2>
              {status === 'done' ? (
                <div className="form-success">
                  <CheckCircle size={20} aria-hidden="true" />
                  <div>
                    <div style={{ fontWeight: 700 }}>Message sent!</div>
                    <div style={{ fontSize: 13, marginTop: 2 }}>We'll get back to you within 24 hours.</div>
                  </div>
                </div>
              ) : (
                <form className="form-stack" onSubmit={submit} noValidate>
                  {/* Honeypot */}
                  <div className="hp-field" aria-hidden="true">
                    <input tabIndex={-1} autoComplete="off" value={form.website} onChange={e => set('website', e.target.value)} />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor="contact-name">Name <span style={{ color: 'var(--color-error)' }}>*</span></label>
                      <input id="contact-name" className="form-input" placeholder="Your name" value={form.name} onChange={e => set('name', e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="contact-phone">Phone</label>
                      <input id="contact-phone" className="form-input" type="tel" placeholder="10-digit number" value={form.phone} onChange={e => set('phone', e.target.value)} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-email">Email <span style={{ color: 'var(--color-error)' }}>*</span></label>
                    <input id="contact-email" className="form-input" type="email" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} required />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-message">Message <span style={{ color: 'var(--color-error)' }}>*</span></label>
                    <textarea id="contact-message" className="form-textarea" placeholder="How can we help you?" value={form.message} onChange={e => set('message', e.target.value)} required />
                  </div>

                  {status === 'error' && (
                    <div className="form-error"><span>{errMsg}</span></div>
                  )}

                  <button className="btn-submit" type="submit" disabled={status === 'busy'}>
                    <Send size={16} aria-hidden="true" />
                    {status === 'busy' ? 'Sending…' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>

            {/* Info */}
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Get in Touch</h2>
              <div className="contact-info">
                {[
                  { icon: Phone, label: 'Phone', value: '+91 99999 99999' },
                  { icon: Mail,  label: 'Email', value: 'hello@mvcleaning.in' },
                  { icon: MapPin,label: 'Address', value: 'Mumbai, Maharashtra' },
                  { icon: Clock, label: 'Hours',  value: 'Mon–Sat, 8 AM – 8 PM' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="contact-info-item">
                    <div className="contact-info-icon" aria-hidden="true"><Icon size={20} /></div>
                    <div>
                      <div className="contact-info-label">{label}</div>
                      <div className="contact-info-value">{value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 40, padding: 24, background: 'var(--color-primary-50)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-primary-100)' }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: 'var(--color-primary-700)' }}>Want to partner with us?</h3>
                <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>Are you a cleaning professional? Join our network and grow your business.</p>
                <a href="/partner" className="btn-primary" style={{ fontSize: 14, padding: '10px 18px', display: 'inline-flex', textDecoration: 'none' }}>Learn more →</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
