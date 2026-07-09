import { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles, Phone, Mail, MapPin, Share2, MessageCircle, Heart } from 'lucide-react';

const NAV_LINKS = [
  { to: '/',        label: 'Home',     end: true },
  { to: '/services',label: 'Services' },
  { to: '/about',   label: 'About' },
  { to: '/blog',    label: 'Blog' },
  { to: '/faq',     label: 'FAQ' },
  { to: '/contact', label: 'Contact' },
];

const FOOTER_LINKS = {
  company: [
    { to: '/about',   label: 'About Us' },
    { to: '/services',label: 'Services' },
    { to: '/blog',    label: 'Blog' },
    { to: '/faq',     label: 'FAQ' },
  ],
  support: [
    { to: '/contact', label: 'Contact Us' },
    { to: '/partner', label: 'Become a Partner' },
    { to: '/privacy', label: 'Privacy Policy' },
    { to: '/terms',   label: 'Terms & Conditions' },
  ],
};

export function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Close mobile nav on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  // Header scroll shadow
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div className="site">
      {/* ── Header ── */}
      <header className={`site-header ${scrolled ? 'scrolled' : ''}`} role="banner">
        <div className="container header-inner">
          {/* Logo */}
          <Link to="/" className="logo" aria-label="MV Cleaning Services — home">
            <div className="logo-mark" aria-hidden="true">MV</div>
            <div className="logo-text">MV <span>Cleaning</span></div>
          </Link>

          {/* Desktop nav */}
          <nav className="main-nav" role="navigation" aria-label="Main navigation">
            {NAV_LINKS.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop CTA */}
          <Link to="/contact" className="header-cta">
            <Sparkles size={15} aria-hidden="true" />
            Book Now
          </Link>

          {/* Mobile hamburger */}
          <button
            className="nav-toggle"
            onClick={() => setMobileOpen(v => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile nav */}
        <nav id="mobile-nav" className={`mobile-nav ${mobileOpen ? 'open' : ''}`} role="navigation" aria-label="Mobile navigation">
          {NAV_LINKS.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              {l.label}
            </NavLink>
          ))}
          <Link to="/contact" className="btn-submit" style={{ marginTop: 8 }}>Book Now</Link>
        </nav>
      </header>

      {/* ── Page content ── */}
      <main id="main-content">
        <Outlet />
      </main>

      {/* ── Footer ── */}
      <footer className="site-footer" role="contentinfo">
        <div className="container">
          <div className="footer-main">
            {/* Brand column */}
            <div className="footer-brand">
              <div className="footer-brand-logo">
                <div className="logo-mark" aria-hidden="true">MV</div>
                <span className="footer-brand-name">MV Cleaning</span>
              </div>
              <p className="footer-tagline">
                Professional home cleaning, booked in a few taps. Trusted by hundreds of happy homes.
              </p>
              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                {[Share2, MessageCircle, Heart].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    aria-label={['Share', 'Message', 'Like'][i]}
                    style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)', transition: 'background 150ms, color 150ms' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.15)'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'; }}
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            {/* Company */}
            <div className="footer-col">
              <h4>Company</h4>
              <div className="footer-links">
                {FOOTER_LINKS.company.map(l => <Link key={l.to} to={l.to}>{l.label}</Link>)}
              </div>
            </div>

            {/* Support */}
            <div className="footer-col">
              <h4>Support</h4>
              <div className="footer-links">
                {FOOTER_LINKS.support.map(l => <Link key={l.to} to={l.to}>{l.label}</Link>)}
              </div>
            </div>

            {/* Contact */}
            <div className="footer-col">
              <h4>Contact</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { icon: Phone, text: '[Phone — placeholder]' },
                  { icon: Mail,  text: '[Email — placeholder]' },
                  { icon: MapPin,text: '[City — placeholder]' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'rgba(255,255,255,0.55)' }}>
                    <Icon size={14} style={{ flexShrink: 0 }} />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} MV Cleaning Services. All rights reserved.</span>
            <div style={{ display: 'flex', gap: 16 }}>
              <Link to="/privacy" style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, textDecoration: 'none' }}>Privacy</Link>
              <Link to="/terms"   style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, textDecoration: 'none' }}>Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
