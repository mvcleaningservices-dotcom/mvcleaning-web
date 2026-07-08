import { Link } from 'react-router-dom';
import { Seo } from '../components/Seo';

const HIGHLIGHTS = [
  { title: 'Deep Cleaning', desc: 'A thorough top-to-bottom clean for your entire home.' },
  { title: 'Bathroom Cleaning', desc: 'Complete sanitation for a spotless, hygienic bathroom.' },
  { title: 'Kitchen Cleaning', desc: 'Degreasing and sanitizing so your kitchen shines.' },
  { title: 'Sofa & Upholstery', desc: 'Shampoo and vacuum cleaning, per seat.' },
];

export function Home() {
  return (
    <>
      <Seo
        title="Home"
        description="Book trusted, professional home cleaning services in a few taps with MV Cleaning Services."
      />

      <section className="hero">
        <div className="container">
          <h1>Professional home cleaning, booked in a few taps</h1>
          <p>
            Reliable, verified cleaning professionals for your home — deep cleaning, bathrooms,
            kitchens, and more. Book online, pay a small advance, and we handle the rest.
          </p>
          <Link to="/services" className="cta">
            Explore Services
          </Link>
        </div>
      </section>

      <section className="block">
        <div className="container">
          <h2 className="section-title">Popular Services</h2>
          <p className="section-sub">A quick look at what our customers book most.</p>
          <div className="grid">
            {HIGHLIGHTS.map((h) => (
              <div key={h.title} className="card">
                <h3>{h.title}</h3>
                <p>{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="block alt">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="grid">
            <div className="card">
              <h3>1. Enter Your Pincode</h3>
              <p>See the services available in your area.</p>
            </div>
            <div className="card">
              <h3>2. Book & Pay Advance</h3>
              <p>Pick a date and time, and confirm with a small advance payment.</p>
            </div>
            <div className="card">
              <h3>3. We Show Up</h3>
              <p>Our professional arrives and delivers the service.</p>
            </div>
            <div className="card">
              <h3>4. Pay the Balance</h3>
              <p>Settle the rest via wallet, UPI, or cash — whatever's easiest.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
