import { useState } from 'react';
import { Send, CheckCircle, Briefcase, Star, Shield } from 'lucide-react';
import { Seo } from '../components/Seo';
import { api } from '../api';

export function Partner() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', hp: '' });
  const [status, setStatus] = useState<'idle' | 'busy' | 'done' | 'error'>('idle');
  const [errMsg, setErrMsg] = useState('');

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.hp) return;
    setStatus('busy'); setErrMsg('');
    try {
      await api.submitInquiry({ ...form, type: 'partner' });
      setStatus('done');
    } catch (err) {
      setErrMsg((err as Error).message || 'Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  const BENEFITS = [
    { icon: Star,    title: 'Steady Work',    desc: 'Get a regular stream of bookings without any marketing effort.' },
    { icon: Shield,  title: 'Training Support', desc: 'We train and equip you to deliver consistently great results.' },
    { icon: Briefcase, title: 'Flexible Hours', desc: 'Choose shifts that fit your schedule. You\'re in control.' },
  ];

  return (
    <>
      <Seo title="Become a Partner — Join MV Cleaning Services" description="Join the MV Cleaning Services professional network. Get steady work, training, and flexible hours as a cleaning partner." />

      <section className="page-hero">
        <div className="container">
          <h1>Become a Partner</h1>
          <p>Join our growing network of professional home cleaners and grow your income.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contact-layout">
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Why partner with us?</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {BENEFITS.map(b => (
                  <div key={b.title} className="contact-info-item">
                    <div className="contact-info-icon" aria-hidden="true"><b.icon size={20} /></div>
                    <div>
                      <div className="contact-info-label">{b.title}</div>
                      <div className="contact-info-value" style={{ fontWeight: 400, fontSize: 14, color: 'var(--color-text-secondary)', marginTop: 4, lineHeight: 1.6 }}>{b.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 32, padding: '20px 24px', background: 'var(--color-warning-bg)', borderRadius: 'var(--radius-lg)', border: '1px solid #fcd34d', fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                <strong style={{ color: '#92400e' }}>Note:</strong> Partnership eligibility requirements and onboarding process are determined by the MV Cleaning team. We'll review your application and get in touch shortly.
              </div>
            </div>

            <div className="contact-form-wrap">
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Apply to Join</h2>
              {status === 'done' ? (
                <div className="form-success">
                  <CheckCircle size={20} aria-hidden="true" />
                  <div>
                    <div style={{ fontWeight: 700 }}>Application received!</div>
                    <div style={{ fontSize: 13, marginTop: 2 }}>We'll review your details and reach out within 2 business days.</div>
                  </div>
                </div>
              ) : (
                <form className="form-stack" onSubmit={submit} noValidate>
                  <div className="hp-field" aria-hidden="true">
                    <input tabIndex={-1} autoComplete="off" value={form.hp} onChange={e => set('hp', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="partner-name">Full Name <span style={{ color: 'var(--color-error)' }}>*</span></label>
                    <input id="partner-name" className="form-input" placeholder="Your full name" value={form.name} onChange={e => set('name', e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="partner-phone">Phone <span style={{ color: 'var(--color-error)' }}>*</span></label>
                    <input id="partner-phone" className="form-input" type="tel" placeholder="10-digit mobile number" value={form.phone} onChange={e => set('phone', e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="partner-email">Email</label>
                    <input id="partner-email" className="form-input" type="email" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="partner-message">Tell us about yourself</label>
                    <textarea id="partner-message" className="form-textarea" placeholder="Your experience, area, availability…" value={form.message} onChange={e => set('message', e.target.value)} />
                  </div>
                  {status === 'error' && <div className="form-error"><span>{errMsg}</span></div>}
                  <button className="btn-submit" type="submit" disabled={status === 'busy'}>
                    <Send size={16} aria-hidden="true" />
                    {status === 'busy' ? 'Submitting…' : 'Submit Application'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
