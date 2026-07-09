import { useEffect, useState } from 'react';
import { Droplets, Bath, Utensils, Sofa, Wind, Scissors, Bug, Home, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Seo } from '../components/Seo';
import { api } from '../api';

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  'deep': Droplets, 'bathroom': Bath, 'kitchen': Utensils,
  'sofa': Sofa, 'pest': Bug, 'salon': Scissors, 'wind': Wind,
};

const getCategoryIcon = (name: string): React.ElementType => {
  const lower = name.toLowerCase();
  for (const [key, Icon] of Object.entries(CATEGORY_ICONS)) {
    if (lower.includes(key)) return Icon;
  }
  return Home;
};

interface Service { id: string; name: string; description: string; price: number; }

export function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.listServices().then(setServices).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Seo
        title="Our Services — Professional Home Cleaning"
        description="Explore all MV Cleaning Services: deep cleaning, bathroom, kitchen, sofa, pest control, and salon at home. Transparent pricing. Book instantly."
      />

      <section className="page-hero" aria-label="Services hero">
        <div className="container">
          <div className="section-overline" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', marginBottom: 16, display: 'inline-block' }}>
            What we offer
          </div>
          <h1>Our Cleaning Services</h1>
          <p>Transparent pricing, professional results. Book any service in minutes.</p>
        </div>
      </section>

      <section className="section" aria-labelledby="all-services-heading">
        <div className="container">
          <h2 id="all-services-heading" className="section-title" style={{ textAlign: 'center', marginBottom: 40 }}>All Services</h2>
          {loading ? (
            <div className="grid-auto">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="skeleton" style={{ height: 200, borderRadius: 'var(--radius-xl)' }} />
              ))}
            </div>
          ) : services.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--color-text-muted)' }}>
              <Sparkles size={40} style={{ margin: '0 auto 16px', opacity: 0.4 }} />
              <p>Services coming soon. Check back shortly!</p>
            </div>
          ) : (
            <div className="grid-auto">
              {services.map(s => {
                const Icon = getCategoryIcon(s.name);
                return (
                  <article key={s.id} className="service-card">
                    <div className="service-icon" aria-hidden="true"><Icon size={26} /></div>
                    <div>
                      <h3>{s.name}</h3>
                      <p style={{ marginTop: 6 }}>{s.description}</p>
                    </div>
                    <div className="service-price">₹{s.price} <span>per session</span></div>
                  </article>
                );
              })}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: 48, padding: '40px', background: 'var(--color-primary-50)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-primary-100)' }}>
            <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Ready to book?</h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24 }}>Download the app or contact us to get started in minutes.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/contact" className="btn-primary">
                <Sparkles size={16} aria-hidden="true" /> Book Now
              </Link>
              <Link to="/faq" className="btn-secondary">
                Have questions? <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
