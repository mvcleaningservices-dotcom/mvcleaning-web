import { useEffect, useState } from 'react';
import { api, type PublicService } from '../api';
import { Seo } from '../components/Seo';

export function Services() {
  const [services, setServices] = useState<PublicService[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.listServices().then(setServices).catch((e) => setError(e.message));
  }, []);

  return (
    <>
      <Seo
        title="Services"
        description="Browse all home cleaning services offered by MV Cleaning Services, with pricing."
      />
      <section className="block">
        <div className="container">
          <h1 className="section-title">Our Services</h1>
          <p className="section-sub">
            Download the MV Cleaning Services app and enter your pincode to see what's available in
            your area.
          </p>
          {error && <p className="form-error">{error}</p>}
          {!error && services.length === 0 && <p className="muted">Loading services…</p>}
          <div className="grid">
            {services.map((s) => (
              <div key={s.id} className="card">
                <h3>{s.name}</h3>
                <p>{s.description}</p>
                <div className="price">₹{s.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
