import { Link } from 'react-router-dom';
import {
  Sparkles, Star, ArrowRight,
  ShieldCheck, Clock, ThumbsUp, Smartphone,
  Droplets, Wind, Sofa, Utensils, Bath, Scissors
} from 'lucide-react';
import { Seo } from '../components/Seo';

const SERVICES = [
  { icon: Droplets,  title: 'Deep Cleaning',       desc: 'Top-to-bottom clean for your entire home.', price: '₹999' },
  { icon: Bath,      title: 'Bathroom Cleaning',    desc: 'Complete sanitation for a spotless bathroom.', price: '₹299' },
  { icon: Utensils,  title: 'Kitchen Cleaning',     desc: 'Degreasing and sanitizing for a shining kitchen.', price: '₹399' },
  { icon: Sofa,      title: 'Sofa & Upholstery',    desc: 'Shampoo and vacuum cleaning, per seat.', price: '₹149/seat' },
  { icon: Wind,      title: 'Pest Control',         desc: 'Effective treatment for all common pests.', price: '₹599' },
  { icon: Scissors,  title: 'Salon at Home',        desc: 'Professional beauty services at your doorstep.', price: '₹499' },
];

const HOW_IT_WORKS = [
  { num: '1', title: 'Enter Your Pincode', desc: 'See all services available in your area instantly.' },
  { num: '2', title: 'Pick & Book',        desc: 'Choose services, pick a date and time slot that works for you.' },
  { num: '3', title: 'Pay a Small Advance', desc: 'Confirm your booking with a minimal advance — just ₹49.' },
  { num: '4', title: 'We Show Up',         desc: 'Our vetted professional arrives and delivers the service.' },
];

const TRUST = [
  { icon: ShieldCheck, title: 'Verified Professionals', desc: 'Every cleaner is background-checked and trained to our standards.' },
  { icon: Clock,       title: 'On-time, Every Time',    desc: 'We respect your schedule. Punctuality is non-negotiable.' },
  { icon: ThumbsUp,    title: 'Satisfaction Guarantee', desc: 'Not happy? We come back and make it right, no questions asked.' },
];

const TESTIMONIALS = [
  { name: 'Priya S.',    location: 'Mumbai', text: 'Booked a deep clean for my 3BHK and was absolutely blown away. The team was professional, thorough, and on time. Will definitely book again!', rating: 5 },
  { name: 'Rahul M.',    location: 'Pune',   text: 'Best kitchen cleaning service I\'ve used. They cleaned areas I didn\'t even think of. The booking process on the app is super smooth.', rating: 5 },
  { name: 'Sneha K.',    location: 'Nashik', text: 'Excellent sofa cleaning — my couch looks brand new. Very professional team, reasonably priced, and great communication throughout.', rating: 5 },
];

export function Home() {
  return (
    <>
      <Seo
        title="Professional Home Cleaning Services — Book in Minutes"
        description="Book trusted, professional home cleaning services in a few taps with MV Cleaning Services. Deep cleaning, bathroom, kitchen, sofa, pest control and more."
      />

      {/* ── Hero ── */}
      <section className="hero" aria-label="Hero">
        <div className="hero-bg-pattern" aria-hidden="true" />
        <div className="container hero-inner">
          <div className="hero-content">
            <div className="hero-overline">
              <Star size={12} fill="currentColor" aria-hidden="true" />
              Trusted by 500+ happy homes
            </div>
            <h1>
              Professional home cleaning,{' '}
              <span className="accent">booked in minutes</span>
            </h1>
            <p className="hero-sub">
              Reliable, vetted cleaning professionals for your home — deep cleaning,
              bathrooms, kitchens, and more. Pay a small advance and we handle the rest.
            </p>
            <div className="hero-ctas">
              <Link to="/services" className="btn-hero-primary">
                <Sparkles size={16} aria-hidden="true" />
                Explore Services
              </Link>
              <Link to="/about" className="btn-hero-secondary">
                Learn more <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
            <div className="hero-stats">
              {[['500+', 'Happy Homes'], ['4.9★', 'Average Rating'], ['₹49', 'Advance Only']].map(([val, lbl]) => (
                <div key={lbl}>
                  <div className="hero-stat-value">{val}</div>
                  <div className="hero-stat-label">{lbl}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-image" aria-hidden="true">
            <div className="hero-img-wrap">
              {/* Hero illustration — SVG placeholder (swap with generated image per §10 manifest) */}
              <svg viewBox="0 0 480 360" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
                <rect width="480" height="360" fill="#0f766e" />
                <rect x="40" y="60" width="400" height="240" rx="20" fill="#0d9488" opacity="0.6" />
                <circle cx="240" cy="150" r="70" fill="#14b8a6" opacity="0.5" />
                <rect x="100" y="200" width="280" height="80" rx="12" fill="#0f766e" opacity="0.4" />
                <text x="240" y="165" textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="18" fontFamily="Inter,sans-serif" fontWeight="700">MV Cleaning</text>
                <text x="240" y="190" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="13" fontFamily="Inter,sans-serif">Professional Home Services</text>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services preview ── */}
      <section className="section" aria-labelledby="services-heading">
        <div className="container">
          <div className="section-header">
            <div className="section-overline">What we offer</div>
            <h2 className="section-title" id="services-heading">Popular Services</h2>
            <p className="section-sub">From deep cleaning to pest control — we've got your home covered.</p>
          </div>
          <div className="grid-auto">
            {SERVICES.map(s => (
              <article key={s.title} className="service-card">
                <div className="service-icon" aria-hidden="true"><s.icon size={26} /></div>
                <div>
                  <h3>{s.title}</h3>
                  <p style={{ marginTop: 6 }}>{s.desc}</p>
                </div>
                <div className="service-price">
                  {s.price} <span>onwards</span>
                </div>
              </article>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link to="/services" className="btn-primary">
              View All Services <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="section" style={{ background: 'var(--color-slate-50)' }} aria-labelledby="how-heading">
        <div className="container">
          <div className="section-header">
            <div className="section-overline">Simple process</div>
            <h2 className="section-title" id="how-heading">How It Works</h2>
            <p className="section-sub">From booking to spotless home in 4 easy steps.</p>
          </div>
          <div className="how-steps">
            {HOW_IT_WORKS.map(s => (
              <div key={s.num} className="how-step">
                <div className="step-number" aria-hidden="true">{s.num}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust signals ── */}
      <section className="section" aria-labelledby="trust-heading">
        <div className="container">
          <div className="section-header">
            <div className="section-overline">Why choose us</div>
            <h2 className="section-title" id="trust-heading">Built on Trust</h2>
            <p className="section-sub">We don't just clean homes — we earn trust, one booking at a time.</p>
          </div>
          <div className="trust-grid">
            {TRUST.map(t => (
              <div key={t.title} className="trust-item">
                <div className="trust-icon" aria-hidden="true"><t.icon size={22} /></div>
                <h3>{t.title}</h3>
                <p>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="section" style={{ background: 'var(--color-slate-50)' }} aria-labelledby="reviews-heading">
        <div className="container">
          <div className="section-header">
            <div className="section-overline">Customer love</div>
            <h2 className="section-title" id="reviews-heading">What Our Customers Say</h2>
          </div>
          <div className="grid-3">
            {TESTIMONIALS.map(t => (
              <figure key={t.name} className="testimonial-card">
                <div className="testimonial-stars" aria-label={`${t.rating} out of 5 stars`}>
                  {[...Array(t.rating)].map((_, i) => <Star key={i} size={16} fill="currentColor" aria-hidden="true" />)}
                </div>
                <blockquote className="testimonial-text">"{t.text}"</blockquote>
                <figcaption className="testimonial-author">
                  <div className="testimonial-avatar">
                    <div style={{ width: '100%', height: '100%', background: 'var(--color-primary-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: 'var(--color-primary-700)' }}>
                      {t.name[0]}
                    </div>
                  </div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-location">{t.location}</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── App Download CTA ── */}
      <section className="section" aria-labelledby="app-cta-heading">
        <div className="container">
          <div className="app-cta-section">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <Smartphone size={20} style={{ color: 'rgba(255,255,255,.7)' }} aria-hidden="true" />
                <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,.6)' }}>Mobile App</span>
              </div>
              <h2 className="app-cta-title" id="app-cta-heading">Book on the go with our app</h2>
              <p className="app-cta-sub">Available on iOS and Android. OTP login, one-tap booking, wallet top-up, and real-time order tracking.</p>
              <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
                {[
                  { label: 'App Store', sub: 'Download on the' },
                  { label: 'Google Play', sub: 'Get it on' },
                ].map(btn => (
                  <a
                    key={btn.label}
                    href="#"
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 'var(--radius-md)', color: '#fff', textDecoration: 'none', backdropFilter: 'blur(8px)' }}
                    aria-label={`${btn.sub} ${btn.label}`}
                  >
                    <Smartphone size={22} aria-hidden="true" />
                    <div>
                      <div style={{ fontSize: 10, opacity: 0.6 }}>{btn.sub}</div>
                      <div style={{ fontSize: 15, fontWeight: 700 }}>{btn.label}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
            <div className="app-cta-image">
              <div style={{ width: 160, height: 280, background: 'rgba(255,255,255,0.12)', borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.15)' }}>
                <Smartphone size={64} style={{ color: 'rgba(255,255,255,0.5)' }} aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="section" style={{ textAlign: 'center' }} aria-label="Call to action">
        <div className="container">
          <div className="section-overline">Ready to start?</div>
          <h2 className="section-title">Your clean home is one tap away</h2>
          <p className="section-sub" style={{ marginBottom: 32 }}>Join hundreds of happy customers. Book your first cleaning today.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/services" className="btn-primary" style={{ fontSize: 16, padding: '14px 28px' }}>
              <Sparkles size={16} aria-hidden="true" /> Explore Services
            </Link>
            <Link to="/contact" className="btn-secondary" style={{ fontSize: 16, padding: '14px 28px' }}>
              Talk to us <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', marginTop: 20 }}>
            {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="var(--color-warning)" color="var(--color-warning)" aria-hidden="true" />)}
            <span style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginLeft: 4 }}>4.9/5 from 200+ reviews</span>
          </div>
        </div>
      </section>
    </>
  );
}
