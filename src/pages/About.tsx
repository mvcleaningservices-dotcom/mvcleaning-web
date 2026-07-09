import { ShieldCheck, Leaf, Clock, Star, Users, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Seo } from '../components/Seo';

const VALUES = [
  { icon: ShieldCheck, title: 'Trust & Safety',    desc: 'Every professional is background-verified. Your home is safe with us.' },
  { icon: Leaf,        title: 'Eco-Friendly',      desc: 'We use green, biodegradable cleaning products — safe for kids and pets.' },
  { icon: Clock,       title: 'On-time Promise',   desc: 'Punctuality is non-negotiable. We respect your time, always.' },
  { icon: Star,        title: 'Quality First',     desc: 'We don\'t consider the job done until you are completely satisfied.' },
  { icon: Users,       title: 'Team Training',     desc: 'Rigorous training ensures consistent, professional results every time.' },
  { icon: Heart,       title: 'Customer Love',     desc: 'Hundreds of happy homes — your trust is our biggest achievement.' },
];

export function About() {
  return (
    <>
      <Seo title="About Us — MV Cleaning Services" description="Learn about MV Cleaning Services — our mission, values, and commitment to professional, trustworthy home cleaning." />

      <section className="page-hero">
        <div className="container">
          <h1>About MV Cleaning Services</h1>
          <p>Bringing professional home cleaning to every household — one trusted booking at a time.</p>
        </div>
      </section>

      {/* Mission */}
      <section className="section">
        <div className="container">
          <div className="about-hero">
            <div>
              <div className="section-overline">Our Mission</div>
              <h2 className="section-title" style={{ textAlign: 'left', marginBottom: 16 }}>Making clean homes accessible to everyone</h2>
              <p style={{ fontSize: 17, lineHeight: 1.8, color: 'var(--color-text-secondary)', marginBottom: 20 }}>
                MV Cleaning Services was built on a simple belief: every home deserves to be clean, and every family deserves a trustworthy professional to help. We make professional home cleaning simple, affordable, and reliable.
              </p>
              <p style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--color-text-secondary)' }}>
                From a single deep clean to regular maintenance, our vetted professionals bring the right tools, skills, and care to every home they visit.
              </p>
              <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 16, fontStyle: 'italic' }}>
                ⚠️ This is placeholder copy. The client's real story will replace this before launch.
              </p>
            </div>
            <div className="about-img">
              <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--color-primary-50), var(--color-primary-200))', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 320 }}>
                <div style={{ textAlign: 'center', color: 'var(--color-primary-600)' }}>
                  <Heart size={64} style={{ margin: '0 auto 16px', opacity: 0.5 }} aria-hidden="true" />
                  <p style={{ fontSize: 14, opacity: 0.6 }}>About image placeholder</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section" style={{ background: 'var(--color-slate-50)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-overline">What we stand for</div>
            <h2 className="section-title">Our Core Values</h2>
          </div>
          <div className="values-grid">
            {VALUES.map(v => (
              <div key={v.title} className="value-card">
                <v.icon size={24} aria-hidden="true" />
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ textAlign: 'center' }}>
        <div className="container">
          <h2 className="section-title">Ready to experience the difference?</h2>
          <p className="section-sub" style={{ marginBottom: 32 }}>Book your first cleaning and see why hundreds of homes trust MV Cleaning.</p>
          <Link to="/services" className="btn-primary" style={{ fontSize: 16, padding: '14px 28px' }}>
            Explore Services →
          </Link>
        </div>
      </section>
    </>
  );
}
