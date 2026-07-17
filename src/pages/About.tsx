import { ShieldCheck, Leaf, Clock, Star, Users, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Seo } from '../components/Seo';
import { Reveal } from '../components/ScrollReveal';
import { AnimatedCounter } from '../components/AnimatedCounter';

const VALUES = [
  { icon: ShieldCheck, title: 'Trust & Safety',    desc: 'Every professional is background-verified. Your home is safe with us.' },
  { icon: Leaf,        title: 'Eco-Friendly',      desc: 'We use green, biodegradable cleaning products — safe for kids and pets.' },
  { icon: Clock,       title: 'On-time Promise',   desc: 'Punctuality is non-negotiable. We respect your time, always.' },
  { icon: Star,        title: 'Quality First',     desc: 'We don\'t consider the job done until you are completely satisfied.' },
  { icon: Users,       title: 'Team Training',     desc: 'Rigorous training ensures consistent, professional results every time.' },
  { icon: Heart,       title: 'Customer Love',     desc: 'Hundreds of happy homes — your trust is our biggest achievement.' },
];

/**
 * Public-facing business stats.
 *
 * ⚠️ UNVERIFIED CLAIMS — these are the client's figures and must be confirmed by
 * them before launch. Do not add a stat here that the product cannot substantiate.
 *
 * An "Average Rating" stat was removed deliberately: there is no ratings/reviews
 * system anywhere in the platform, so any star figure would be invented — and
 * unlike a placeholder phone number, it can never be filled in with real data.
 * If ratings are wanted here, the reviews backend has to exist first.
 */
const STATS = [
  { value: 500, suffix: '+', label: 'Happy Homes' },
  { value: 50, suffix: '+', label: 'Professionals' },
  { value: 3, suffix: '', label: 'Cities' },
];

export function About() {
  return (
    <>
      <Seo title="About Us — MV Cleaning Services" description="Learn about MV Cleaning Services — our mission, values, and commitment to professional, trustworthy home cleaning." image="/images/about-team.webp" />

      <section className="page-hero" style={{ background: 'linear-gradient(135deg, var(--color-slate-900) 0%, var(--color-slate-800) 100%)', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-50%', left: '-20%', width: '100%', height: '200%', background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 60%)', zIndex: 0 }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>About MV Cleaning Services</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)' }}>Bringing professional home cleaning to every household — one trusted booking at a time.</p>
        </div>
      </section>

      {/* Stats bar */}
      <div className="hero-trust-bar" style={{ margin: '0 auto', boxShadow: 'var(--shadow-md)' }}>
        <div className="container" style={{ justifyContent: 'center', gap: 'var(--space-8)', flexWrap: 'wrap' }}>
          {STATS.map(s => (
            <div key={s.label} className="trust-bar-item" style={{ flexDirection: 'column', gap: 2, textAlign: 'center' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px, 4vw, 24px)', fontWeight: 800, color: 'var(--color-primary-600)' }}>
                <AnimatedCounter end={s.value} suffix={s.suffix} />
              </span>
              <span style={{ fontSize: 12, fontWeight: 500 }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mission */}
      <section className="section">
        <div className="container">
          <div className="about-hero">
            <Reveal>
              <div>
                <div className="section-overline">Our Mission</div>
                <h2 className="section-title" style={{ textAlign: 'left', marginBottom: 16 }}>Making clean homes accessible to everyone</h2>
                <p style={{ fontSize: 17, lineHeight: 1.8, color: 'var(--color-text-secondary)', marginBottom: 20 }}>
                  MV Cleaning Services was built on a simple belief: every home deserves to be clean, and every family deserves a trustworthy professional to help. We make professional home cleaning simple, affordable, and reliable.
                </p>
                <p style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--color-text-secondary)' }}>
                  From a single deep clean to regular maintenance, our vetted professionals bring the right tools, skills, and care to every home they visit.
                </p>
              </div>
            </Reveal>
            <Reveal delay={150}>
              <div className="about-img" style={{ boxShadow: 'var(--shadow-xl)' }}>
                <img src="/images/about-team.webp" alt="MV Cleaning Services professional team" loading="lazy" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          <Reveal>
            <div className="section-header" style={{ textAlign: 'center' }}>
              <div className="section-overline">How we started</div>
              <h2 className="section-title">Our Story</h2>
            </div>
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-icon" />
                <div className="timeline-content">
                  <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>The Beginning</h3>
                  <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>It started with a simple frustration: finding a reliable, professional, and punctual cleaner was nearly impossible. We set out to change that by building a platform rooted in trust and quality.</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-icon" />
                <div className="timeline-content">
                  <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Growing the Network</h3>
                  <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>We rigorously trained our first batch of 10 professionals. Word of mouth spread, and soon we were serving hundreds of homes across Mumbai, ensuring every professional met our strict background and quality checks.</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-icon" />
                <div className="timeline-content">
                  <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Today</h3>
                  <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>Today, MV Cleaning is a trusted name in multiple cities. Our app makes booking seamless, but our core promise remains the same: treating your home with the care and respect it deserves.</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="section" style={{ background: 'var(--color-slate-50)' }}>
        <div className="container">
          <Reveal>
            <div className="section-header">
              <div className="section-overline">What we stand for</div>
              <h2 className="section-title">Our Core Values</h2>
            </div>
          </Reveal>
          <div className="values-grid">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 80}>
                <div className="value-card">
                  <div className="value-icon-wrap">
                    <v.icon size={24} aria-hidden="true" />
                  </div>
                  <h3>{v.title}</h3>
                  <p>{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ textAlign: 'center', background: 'var(--color-slate-50)', marginTop: 40, borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <Reveal>
            <h2 className="section-title">Ready to experience the difference?</h2>
            <p className="section-sub" style={{ marginBottom: 32 }}>Book your first cleaning and see why hundreds of homes trust MV Cleaning.</p>
            <Link to="/services" className="btn-primary" style={{ fontSize: 16, padding: '14px 28px' }}>
              Explore Services →
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
