import { useEffect, useMemo, useState } from 'react';
import { Droplets, Bath, Utensils, Sofa, Wind, Scissors, Bug, Home, Sparkles, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Seo } from '../components/Seo';
import { Reveal } from '../components/ScrollReveal';
import { StructuredData } from '../components/StructuredData';
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
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.listServices()
      .then((live) => setServices(live))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  /**
   * Structured data for Google rich results — built from the LIVE catalog only.
   * It must never be generated from placeholder data: whatever is emitted here
   * is what Google publishes as our prices, so a stale constant would advertise
   * prices we don't charge. No services loaded → emit no schema.
   */
  const serviceSchema = useMemo(
    () =>
      services.length > 0
        ? {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            itemListElement: services.map((s, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              item: {
                '@type': 'Service',
                name: s.name,
                description: s.description,
                offers: {
                  '@type': 'Offer',
                  price: s.price,
                  priceCurrency: 'INR',
                },
              },
            })),
          }
        : null,
    [services],
  );

  return (
    <>
      <Seo
        title="Our Services — Professional Home Cleaning"
        description="Explore all MV Cleaning Services: deep cleaning, bathroom, kitchen, sofa, pest control, and salon at home. Transparent pricing. Book instantly."
      />
      {serviceSchema && <StructuredData data={serviceSchema} />}

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
          <Reveal>
            <h2 id="all-services-heading" className="section-title" style={{ textAlign: 'center', marginBottom: 40 }}>All Services</h2>
          </Reveal>
          {loading ? (
            <div className="grid-auto">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="skeleton" style={{ height: 280, borderRadius: 'var(--radius-xl)' }} />
              ))}
            </div>
          ) : error ? (
            <div className="card" style={{ padding: 'var(--space-12)', textAlign: 'center' }}>
              <h3 className="text-h3 text-primary" style={{ marginBottom: 'var(--space-2)' }}>
                Couldn't load our services
              </h3>
              <p className="text-secondary" style={{ marginBottom: 'var(--space-6)' }}>
                Something went wrong on our side. Please try again in a moment.
              </p>
              <button className="btn-secondary" onClick={() => window.location.reload()}>Retry</button>
            </div>
          ) : services.length === 0 ? (
            <div className="card" style={{ padding: 'var(--space-12)', textAlign: 'center' }}>
              <h3 className="text-h3 text-primary" style={{ marginBottom: 'var(--space-2)' }}>
                No services listed yet
              </h3>
              <p className="text-secondary">Please check back shortly.</p>
            </div>
          ) : (
            <div className="grid-auto">
              {services.map((s, i) => {
                const Icon = getCategoryIcon(s.name);
                // Explicitly check for matching substrings to ensure images load
                const lowerName = s.name.toLowerCase();
                let image = '';
                if (lowerName.includes('deep')) image = '/images/service-deepclean.webp';
                else if (lowerName.includes('bathroom')) image = '/images/service-bathroom.webp';
                else if (lowerName.includes('kitchen')) image = '/images/service-kitchen.webp';
                else if (lowerName.includes('sofa')) image = '/images/service-sofa.webp';
                else if (lowerName.includes('carpet')) image = '/images/service-carpet.webp';
                else if (lowerName.includes('window')) image = '/images/service-window.webp';
                else if (lowerName.includes('pest')) image = '/images/service-pest.webp';
                else if (lowerName.includes('salon')) image = '/images/service-salon.webp';
                else if (lowerName.includes('plumb')) image = '/images/service-plumbing.webp';

                return (
                  <Reveal key={s.id} delay={i * 80}>
                    <article className="service-card" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                      {image ? (
                        <div className="service-card-image">
                          <img src={image} alt={s.name} loading="lazy" />
                        </div>
                      ) : (
                        <div className="service-card-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-primary-50)' }}>
                          <Icon size={48} style={{ color: 'var(--color-primary-300)' }} />
                        </div>
                      )}
                      <div className="service-card-body">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div className="service-icon" aria-hidden="true"><Icon size={22} /></div>
                          <h3>{s.name}</h3>
                        </div>
                        <p>{s.description}</p>
                        <div className="service-price">₹{s.price} <span>onwards</span></div>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          )}

          {/* Pricing table — rendered from the LIVE catalog. A "Transparent
              Pricing" table must never be hardcoded: it sits directly below the
              service cards, so any drift shows two different prices for the same
              service on one screen. */}
          {!loading && !error && services.length > 0 && (
            <Reveal>
              <div style={{ marginTop: 64 }}>
                <h2 className="section-title" style={{ textAlign: 'center', marginBottom: 8 }}>Transparent Pricing</h2>
                <p className="section-sub" style={{ textAlign: 'center', marginBottom: 32 }}>No hidden charges. What you see is what you pay.</p>
                <div style={{ overflowX: 'auto' }}>
                  <table className="pricing-table">
                    <thead>
                      <tr>
                        <th>Service</th>
                        <th>What's Included</th>
                        <th>Starting Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {services.map((s) => (
                        <tr key={s.id}>
                          <td><strong>{s.name}</strong></td>
                          <td>{s.description}</td>
                          <td className="price-cell">₹{s.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Reveal>
          )}

          <Reveal>
            <div style={{ textAlign: 'center', marginTop: 48, padding: '40px', background: 'var(--color-primary-50)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-primary-100)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Ready to book?</h3>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24 }}>Book online in minutes — pick a service, choose a time, and we'll send a verified professional to your door.</p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={() => navigate('/')} className="btn-primary" style={{ border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                  <Sparkles size={16} aria-hidden="true" /> Book Now
                </button>
                <Link to="/faq" className="btn-secondary">
                  Have questions? <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

    </>
  );
}
