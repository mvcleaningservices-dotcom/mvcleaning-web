import { useEffect, useState } from 'react';
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

/** Hardcoded fallback when the API is unavailable */
const FALLBACK_SERVICES = [
  { id: '1', name: 'Deep Cleaning',    description: 'Top-to-bottom clean for your entire home. Every corner, every surface.', price: 999 },
  { id: '2', name: 'Bathroom Cleaning',description: 'Complete sanitation — tiles, fixtures, mirrors, and drains.', price: 299 },
  { id: '3', name: 'Kitchen Cleaning', description: 'Degreasing, chimney cleaning, slab polishing, and sink sanitization.', price: 399 },
  { id: '4', name: 'Sofa & Upholstery',description: 'Professional shampoo and vacuum cleaning for sofas and chairs.', price: 149 },
  { id: '5', name: 'Pest Control',     description: 'Effective, safe treatment for cockroaches, ants, and bed bugs.', price: 599 },
  { id: '6', name: 'Salon at Home',    description: 'Professional haircut, facial, and beauty services at your doorstep.', price: 499 },
];

interface Service { id: string; name: string; description: string; price: number; }

/** Service structured data for Google rich results */
const SERVICE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: FALLBACK_SERVICES.map((s, i) => ({
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
};

export function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.listServices()
      .then(setServices)
      .catch(() => setServices(FALLBACK_SERVICES))
      .finally(() => setLoading(false));
  }, []);

  const displayServices = services.length > 0 ? services : FALLBACK_SERVICES;

  return (
    <>
      <Seo
        title="Our Services — Professional Home Cleaning"
        description="Explore all MV Cleaning Services: deep cleaning, bathroom, kitchen, sofa, pest control, and salon at home. Transparent pricing. Book instantly."
      />
      <StructuredData data={SERVICE_SCHEMA} />

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
          ) : (
            <div className="grid-auto">
              {displayServices.map((s, i) => {
                const Icon = getCategoryIcon(s.name);
                // Explicitly check for matching substrings to ensure images load
                const lowerName = s.name.toLowerCase();
                let image = '';
                if (lowerName.includes('deep')) image = '/images/service-deepclean.png';
                else if (lowerName.includes('bathroom')) image = '/images/service-bathroom.png';
                else if (lowerName.includes('kitchen')) image = '/images/service-kitchen.png';
                else if (lowerName.includes('sofa')) image = '/images/service-sofa.png';
                else if (lowerName.includes('carpet')) image = '/images/service-carpet.png';
                else if (lowerName.includes('window')) image = '/images/service-window.png';
                else if (lowerName.includes('pest')) image = '/images/service-pest.png';
                else if (lowerName.includes('salon')) image = '/images/service-salon.png';
                else if (lowerName.includes('plumb')) image = '/images/service-plumbing.png';

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

          {/* Pricing table */}
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
                    <tr><td><strong>Deep Cleaning</strong></td><td>Full home — floors, walls, fans, windows, dusting</td><td className="price-cell">₹999</td></tr>
                    <tr><td><strong>Bathroom Cleaning</strong></td><td>Tiles, fixtures, mirrors, drains, sanitization</td><td className="price-cell">₹299</td></tr>
                    <tr><td><strong>Kitchen Cleaning</strong></td><td>Chimney, slabs, sink, stove, degreasing</td><td className="price-cell">₹399</td></tr>
                    <tr><td><strong>Sofa & Upholstery</strong></td><td>Shampoo + vacuum, per seat pricing</td><td className="price-cell">₹149/seat</td></tr>
                    <tr><td><strong>Pest Control</strong></td><td>Cockroaches, ants, bed bugs — safe treatment</td><td className="price-cell">₹599</td></tr>
                    <tr><td><strong>Salon at Home</strong></td><td>Haircut, facial, beauty services</td><td className="price-cell">₹499</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Reveal>

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
