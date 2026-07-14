import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  MapPin, Sparkles, ShieldCheck, Wallet, IndianRupee, ArrowRight,
  LayoutGrid, Wrench, Bug, ChevronDown, Smartphone,
} from 'lucide-react';
import { api, type ServiceItem, type PopularService } from '../../api';
import { useAuth } from '../../auth/AuthContext';
import { ServiceCard } from '../../components/app/ServiceCard';
import { ServiceThumb } from '../../components/app/ServiceThumb';
import { CartBar } from '../../components/app/CartBar';

function greetingPrefix() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}

const CAT_ICON: Record<string, typeof Sparkles> = {
  All: LayoutGrid, Cleaning: Sparkles, Repair: Wrench, 'Pest Control': Bug,
};
const catIcon = (c: string) => CAT_ICON[c] || LayoutGrid;

const HOW_IT_WORKS = [
  { title: 'Pick a service', desc: 'Browse and add exactly what your home needs.' },
  { title: 'Choose a slot', desc: 'Select a date and time that suit your schedule.' },
  { title: 'Sit back', desc: 'A vetted professional arrives and gets it done.' },
];

// SAMPLE testimonials for layout — replace with REAL customer quotes before launch.
const TESTIMONIALS = [
  { name: 'Priya S.', area: 'Indiranagar', text: 'Booked a deep clean in two minutes. The team was punctual and thorough — my kitchen looks brand new.' },
  { name: 'Rahul M.', area: 'Koramangala', text: 'Loved that I only paid a small advance and the rest after. Professional and completely hassle-free.' },
  { name: 'Aisha K.', area: 'Whitefield', text: 'Sofa cleaning was excellent value. Booked it from my laptop in minutes — no app needed.' },
];

const FAQS = [
  { q: 'How does payment work?', a: 'You pay a small advance to confirm your booking. The balance is collected only after the service is completed — via wallet, UPI, card or cash.' },
  { q: 'Are the professionals verified?', a: 'Yes. Every professional is background-checked and trained before they take on any job.' },
  { q: 'Can I choose my time slot?', a: 'Absolutely — pick any available date and time slot at checkout that suits you.' },
  { q: 'What if I need to reschedule?', a: 'You can view and manage all your bookings any time from “My bookings” after logging in.' },
  { q: 'Which areas do you serve?', a: 'Enter your pincode on the home page to see the services available in your area.' },
];

const CATEGORY_TAGLINE: Record<string, string> = {
  Cleaning: 'Spotless homes, inside out',
  Repair: 'Reliable fixes, done right',
  'Pest Control': 'A safer, healthier home',
};

/** Booking discovery — the homepage. */
export function AppHome() {
  const { profile, pincode, setPincode } = useAuth();

  const [changing, setChanging] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [savingPin, setSavingPin] = useState(false);

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [popular, setPopular] = useState<PopularService[]>([]);
  const [activeCat, setActiveCat] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const [searchParams] = useSearchParams();
  const search = (searchParams.get('q') || '').trim();
  const servicesRef = useRef<HTMLDivElement>(null);

  const fetchServices = useCallback(async (pin: string, q: string) => {
    setLoading(true);
    setError(false);
    try {
      setServices(await api.listAvailableServices(pin, q));
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPopular = useCallback(async (pin: string) => {
    try { setPopular(await api.listPopular(pin)); } catch { /* hide */ }
  }, []);

  useEffect(() => {
    if (!pincode) { setLoading(false); return; }
    fetchServices(pincode, search);
    if (!search) fetchPopular(pincode);
  }, [pincode, search, fetchServices, fetchPopular]);

  const savePincode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pinInput)) return setPinError('Enter a 6-digit pincode.');
    setPinError('');
    setSavingPin(true);
    try {
      setPincode(pinInput);
      await api.updateProfile({ pincode: pinInput }).catch(() => {});
      setChanging(false);
    } finally {
      setSavingPin(false);
    }
  };

  const grouped = useMemo(() => {
    const map = new Map<string, ServiceItem[]>();
    for (const s of services) {
      const key = s.category || 'Other';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(s);
    }
    return Array.from(map.entries());
  }, [services]);

  /* ── Pincode gate ── */
  if (!pincode || changing) {
    return (
      <div className="pin-gate">
        <div className="pin-icon"><MapPin size={26} /></div>
        <h1 className="pin-title">Where do you need service?</h1>
        <p className="pin-sub">Enter your area pincode to see what's available.</p>
        <form className="pin-form" onSubmit={savePincode}>
          <input className="auth-input" inputMode="numeric" placeholder="6-digit pincode" maxLength={6}
            value={pinInput} onChange={(e) => setPinInput(e.target.value.replace(/\D/g, '').slice(0, 6))} autoFocus />
          {pinError && <p className="auth-error">{pinError}</p>}
          <button className="btn-primary auth-submit" type="submit" disabled={savingPin || pinInput.length < 6}>
            {savingPin ? 'Loading…' : 'Find services'}
          </button>
          {changing && <button type="button" className="auth-link" onClick={() => setChanging(false)}>Cancel</button>}
        </form>
      </div>
    );
  }

  const categories = ['All', ...Array.from(new Set(services.map((s) => s.category).filter(Boolean) as string[]))];
  const isSearching = search !== '';
  const gridServices = isSearching ? services : activeCat !== 'All' ? services.filter((s) => s.category === activeCat) : services;
  const showRich = !isSearching && activeCat === 'All';
  const name = profile?.name?.split(' ')[0];

  return (
    <>
      <div className="disc-head">
        <div className="disc-loc">
          <MapPin size={14} /> Serving {pincode}
          <button className="disc-change" onClick={() => { setPinInput(pincode); setChanging(true); }}>Change</button>
        </div>
        <h1 className="disc-greeting">{name ? `${greetingPrefix()}, ${name} 👋` : 'What can we help you with?'}</h1>
      </div>

      {showRich && (
        <section className="home-hero">
          <div className="home-hero-text">
            <h2>Sparkling homes, booked in minutes</h2>
            <p>Vetted professionals at your door. Pay a small advance now — settle the rest only after the job's done.</p>
            <button className="btn-hero" onClick={() => servicesRef.current?.scrollIntoView({ behavior: 'smooth' })}>
              Explore services <ArrowRight size={18} />
            </button>
            <div className="home-hero-badges">
              <span><ShieldCheck size={15} /> Vetted professionals</span>
              <span><Wallet size={15} /> Pay after service</span>
              <span><IndianRupee size={15} /> Transparent pricing</span>
            </div>
          </div>
          <div className="home-hero-img"><img src="/images/hero.png" alt="Professional home cleaning" loading="lazy" /></div>
        </section>
      )}

      {/* Category filter pills — icons + scroll for scale */}
      {categories.length > 1 && (
        <div className="disc-cats" role="tablist">
          {categories.map((c) => {
            const Icon = catIcon(c);
            return (
              <button key={c} className={`disc-cat${activeCat === c ? ' active' : ''}`} onClick={() => setActiveCat(c)}>
                <Icon size={15} /> {c}
              </button>
            );
          })}
        </div>
      )}

      <div ref={servicesRef} />

      {loading ? (
        <div className="svc-grid">{[0, 1, 2, 3].map((i) => <div key={i} className="svc-card skeleton" style={{ height: 240 }} />)}</div>
      ) : error ? (
        <div className="app-placeholder">
          <h1>Couldn't load services</h1>
          <p>Check your connection and try again.</p>
          <button className="btn-secondary" style={{ marginTop: 12 }} onClick={() => fetchServices(pincode, search)}>Retry</button>
        </div>
      ) : services.length === 0 ? (
        <div className="app-placeholder">
          <h1>{isSearching ? 'No matching services' : 'No services here yet'}</h1>
          <p>{isSearching ? 'Try a different search term.' : 'We don’t serve this area yet — try changing your pincode.'}</p>
        </div>
      ) : !showRich ? (
        <section className="disc-section">
          <h2 className="disc-h2">{isSearching ? `Results for “${search}”` : activeCat}</h2>
          <div className="svc-grid">{gridServices.map((s) => <ServiceCard key={s.id} service={s} />)}</div>
        </section>
      ) : (
        <>
          {/* Most popular — only when there's genuine density */}
          {popular.length >= 2 && (
            <section className="disc-section">
              <div className="disc-section-head"><Sparkles size={18} /><h2>Most popular</h2></div>
              <div className="pop-row">
                {popular.map((s) => (
                  <div key={s.id} className="pop-card">
                    <ServiceThumb service={s} className="pop-img" iconSize={32} />
                    <div className="pop-body">
                      <span className="svc-name">{s.name}</span>
                      <div className="svc-foot"><div className="svc-price">from <strong>₹{s.price}</strong></div></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Category-grouped sections — clean header (no duplicate photo, no redundant count) */}
          {grouped.map(([cat, list]) => {
            const Icon = catIcon(cat);
            return (
              <section key={cat} className="cat-section">
                <div className="cat-head">
                  <div className="cat-head-icon"><Icon size={20} /></div>
                  <div>
                    <span className="cat-kicker">{cat}</span>
                    <h2>{CATEGORY_TAGLINE[cat] || `${cat} services`}</h2>
                  </div>
                </div>
                <div className="svc-grid">{list.map((s) => <ServiceCard key={s.id} service={s} />)}</div>
              </section>
            );
          })}

          {/* How it works — unified numbered badges + connectors */}
          <section className="home-strip">
            <h2 className="strip-title">How it works</h2>
            <div className="strip-grid">
              {HOW_IT_WORKS.map((s, i) => (
                <div key={s.title} className="strip-card">
                  <div className="strip-badge">{i + 1}</div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Testimonials — avatar + prominent neighborhood (SAMPLE) */}
          <section className="home-strip">
            <h2 className="strip-title">Loved by homeowners</h2>
            <div className="tst-grid">
              {TESTIMONIALS.map((t) => (
                <div key={t.name} className="tst-card">
                  <div className="tst-head">
                    <div className="tst-avatar">{t.name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2)}</div>
                    <div>
                      <strong className="tst-name">{t.name}</strong>
                      <span className="tst-area"><MapPin size={12} /> {t.area}</span>
                    </div>
                  </div>
                  <p className="tst-text">“{t.text}”</p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ — new, useful content (not a USP restatement) */}
          <section className="home-strip">
            <h2 className="strip-title">Frequently asked questions</h2>
            <div className="faq-list">
              {FAQS.map((f, i) => (
                <div key={f.q} className={`faq-item${openFaq === i ? ' open' : ''}`}>
                  <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span>{f.q}</span><ChevronDown size={18} />
                  </button>
                  {openFaq === i && <p className="faq-a">{f.a}</p>}
                </div>
              ))}
            </div>
          </section>

          {/* Get the app */}
          <section className="app-banner">
            <div className="app-banner-text">
              <Smartphone size={28} />
              <div>
                <h2>Prefer the app?</h2>
                <p>Book on the go, track your service, and manage your wallet — on Android & iOS.</p>
              </div>
            </div>
            <div className="app-banner-btns">
              <a href="#" className="app-store-pill">App Store</a>
              <a href="#" className="app-store-pill">Google Play</a>
            </div>
          </section>
        </>
      )}

      <CartBar />
    </>
  );
}
