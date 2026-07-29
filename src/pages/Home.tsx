import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles, Star, ArrowRight,
  ShieldCheck, Clock, ThumbsUp, Smartphone,
  Droplets, Wind, Sofa, Utensils, Bath, Scissors,
  CheckCircle, MapPin
} from 'lucide-react';
import { Seo } from '../components/Seo';
import { Reveal } from '../components/ScrollReveal';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { AppDownloadModal } from '../components/AppDownloadModal';

const SERVICES = [
  { icon: Droplets,  title: 'Deep Cleaning',       desc: 'Top-to-bottom clean for your entire home.', price: '₹999', image: '/images/service-deepclean.webp' },
  { icon: Bath,      title: 'Bathroom Cleaning',    desc: 'Complete sanitation for a spotless bathroom.', price: '₹299', image: '/images/service-bathroom.webp' },
  { icon: Utensils,  title: 'Kitchen Cleaning',     desc: 'Degreasing and sanitizing for a shining kitchen.', price: '₹399', image: '/images/service-kitchen.webp' },
  { icon: Sofa,      title: 'Sofa & Upholstery',    desc: 'Shampoo and vacuum cleaning, per seat.', price: '₹149/seat', image: '/images/service-sofa.webp' },
  { icon: Wind,      title: 'Pest Control',         desc: 'Effective treatment for all common pests.', price: '₹599', image: '/images/service-pest.webp' },
  { icon: Scissors,  title: 'Salon at Home',        desc: 'Professional beauty services at your doorstep.', price: '₹499', image: '/images/service-salon.webp' },
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
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Seo
        title="Professional Home Cleaning Services — Book in Minutes"
        description="Book trusted, professional home cleaning services in a few taps with MV Cleaning Services. Deep cleaning, bathroom, kitchen, sofa, pest control and more."
        image="/images/hero.webp"
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
              bathrooms, kitchens, and more. Expert results, every single visit.
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
              <div>
                <div className="hero-stat-value"><AnimatedCounter end={500} suffix="+" /></div>
                <div className="hero-stat-label">Happy Homes</div>
              </div>
              <div>
                <div className="hero-stat-value"><AnimatedCounter end={4} suffix=".9★" /></div>
                <div className="hero-stat-label">Average Rating</div>
              </div>
              <div>
                <div className="hero-stat-value"><AnimatedCounter end={49} prefix="₹" /></div>
                <div className="hero-stat-label">Advance Only</div>
              </div>
            </div>
          </div>
          <div className="hero-image" aria-hidden="true">
            <div className="hero-img-wrap">
              <img src="/images/hero.webp" alt="Professional home cleaner at work in a modern living room" loading="eager" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust bar ── */}
      <div className="hero-trust-bar">
        <div className="container">
          <div className="trust-bar-item">
            <ShieldCheck size={16} aria-hidden="true" />
            Background Verified
          </div>
          <div className="trust-bar-item">
            <CheckCircle size={16} aria-hidden="true" />
            Satisfaction Guaranteed
          </div>
          <div className="trust-bar-item">
            <Clock size={16} aria-hidden="true" />
            On-time Promise
          </div>
          <div className="trust-bar-item">
            <MapPin size={16} aria-hidden="true" />
            Mumbai · Pune · Nashik
          </div>
        </div>
      </div>

      {/* ── Services preview ── */}
      <section className="section" aria-labelledby="services-heading">
        <div className="container">
          <Reveal>
            <div className="section-header">
              <div className="section-overline">What we offer</div>
              <h2 className="section-title" id="services-heading">Popular Services</h2>
              <p className="section-sub">From deep cleaning to pest control — we've got your home covered.</p>
            </div>
          </Reveal>
          <div className="grid-auto reveal-stagger">
            {SERVICES.map((s, i) => (
              <Reveal key={s.title} delay={i * 80}>
                <article className="service-card">
                  {s.image ? (
                    <div className="service-card-image">
                      <img src={s.image} alt={s.title} loading="lazy" />
                    </div>
                  ) : (
                    <div className="service-card-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-primary-50)' }}>
                      <s.icon size={48} style={{ color: 'var(--color-primary-300)' }} />
                    </div>
                  )}
                  <div className="service-card-body">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div className="service-icon" aria-hidden="true"><s.icon size={22} /></div>
                      <h3>{s.title}</h3>
                    </div>
                    <p>{s.desc}</p>
                    <div className="service-price">
                      {s.price} <span>onwards</span>
                    </div>
                  </div>
                </article>
              </Reveal>
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
          <Reveal>
            <div className="section-header">
              <div className="section-overline">Simple process</div>
              <h2 className="section-title" id="how-heading">How It Works</h2>
              <p className="section-sub">From booking to spotless home in 4 easy steps.</p>
            </div>
          </Reveal>
          <div className="how-steps">
            {HOW_IT_WORKS.map((s, i) => (
              <Reveal key={s.num} delay={i * 100}>
                <div className="how-step">
                  <div className="step-number" aria-hidden="true">{s.num}</div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust signals ── */}
      <section className="section" aria-labelledby="trust-heading">
        <div className="container">
          <Reveal>
            <div className="section-header">
              <div className="section-overline">Why choose us</div>
              <h2 className="section-title" id="trust-heading">Built on Trust</h2>
              <p className="section-sub">We don't just clean homes — we earn trust, one booking at a time.</p>
            </div>
          </Reveal>
          <div className="trust-grid">
            {TRUST.map((t, i) => (
              <Reveal key={t.title} delay={i * 100}>
                <div className="trust-item">
                  <div className="trust-icon" aria-hidden="true"><t.icon size={22} /></div>
                  <h3>{t.title}</h3>
                  <p>{t.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="section" style={{ background: 'var(--color-slate-50)' }} aria-labelledby="reviews-heading">
        <div className="container">
          <Reveal>
            <div className="section-header">
              <div className="section-overline">Customer love</div>
              <h2 className="section-title" id="reviews-heading">What Our Customers Say</h2>
            </div>
          </Reveal>
          <div className="grid-3">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 100}>
                <figure className="testimonial-card">
                  <div className="testimonial-stars" aria-label={`${t.rating} out of 5 stars`}>
                    {[...Array(t.rating)].map((_, j) => <Star key={j} size={16} fill="currentColor" aria-hidden="true" />)}
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
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── App Download CTA ── */}
      <section className="section" aria-labelledby="app-cta-heading">
        <div className="container">
          <Reveal>
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
                      className="app-store-btn"
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
          </Reveal>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="section" style={{ textAlign: 'center' }} aria-label="Call to action">
        <div className="container">
          <Reveal>
            <div className="section-overline">Ready to start?</div>
            <h2 className="section-title">Your clean home is one tap away</h2>
            <p className="section-sub" style={{ marginBottom: 32 }}>Join hundreds of happy customers. Book your first cleaning today.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => setModalOpen(true)} className="btn-primary" style={{ fontSize: 16, padding: '14px 28px', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                <Sparkles size={16} aria-hidden="true" /> Book Now
              </button>
              <Link to="/contact" className="btn-secondary" style={{ fontSize: 16, padding: '14px 28px' }}>
                Talk to us <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', marginTop: 20 }}>
              {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="var(--color-warning)" color="var(--color-warning)" aria-hidden="true" />)}
              <span style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginLeft: 4 }}>4.9/5 from 200+ reviews</span>
            </div>
          </Reveal>
        </div>
      </section>

      <AppDownloadModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
