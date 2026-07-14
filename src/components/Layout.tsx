import { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles, Phone, Mail, MapPin } from 'lucide-react';
import { WhatsAppButton } from './WhatsAppButton';
import { AppDownloadModal } from './AppDownloadModal';
import { StructuredData, LOCAL_BUSINESS_SCHEMA } from './StructuredData';

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

const SOCIAL_LINKS = [
  { 
    label: 'Instagram', 
    href: '#',
    svg: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
  },
  { 
    label: 'Facebook', 
    href: '#',
    svg: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
  },
  { 
    label: 'Twitter', 
    href: '#',
    svg: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
  },
];

export function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const location = useLocation();

  // Close mobile nav on route change & scroll to top
  useEffect(() => {
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  // Header scroll shadow
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div className="site">
      {/* Global structured data */}
      <StructuredData data={LOCAL_BUSINESS_SCHEMA} />

      {/* ── Header ── */}
      <header className={`site-header ${scrolled ? 'scrolled' : ''}`} role="banner">
        <div className="container header-inner">
          {/* Logo */}
          <Link to="/" className="logo" aria-label="MV Cleaning Services — home" style={{ display: 'block', height: 38 }}>
            <img src="/images/logo.jpeg" alt="MV Cleaning Services" style={{ height: 38, filter: 'invert(1)', mixBlendMode: 'multiply' }} />
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
          <button className="header-cta" onClick={() => setModalOpen(true)} style={{ background: 'var(--color-primary-600)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>
            <Sparkles size={15} aria-hidden="true" />
            Book Now
          </button>

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
          <button className="btn-submit" onClick={() => { setModalOpen(true); setMobileOpen(false); }} style={{ marginTop: 8 }}>Book Now</button>
        </nav>
      </header>

      {/* ── Page content ── */}
      <main id="main-content">
        <Outlet />
      </main>

      {/* ── Modals & Globals ── */}
      <AppDownloadModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      <WhatsAppButton />

      {/* ── Footer ── */}
      <footer className="site-footer" role="contentinfo">
        <div className="container">
          <div className="footer-main">
            {/* Brand column */}
            <div className="footer-brand">
              <div className="footer-brand-logo" style={{ display: 'block', height: 38 }}>
                <img src="/images/logo.jpeg" alt="MV Cleaning Services" style={{ height: 38, mixBlendMode: 'screen' }} />
              </div>
              <p className="footer-tagline">
                Professional home cleaning, booked in a few taps. Trusted by hundreds of happy homes.
              </p>
              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                {SOCIAL_LINKS.map(({ label, href, svg }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="footer-social-link"
                  >
                    {svg}
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
                  { icon: Phone, text: 'Coming soon' },
                  { icon: Mail,  text: 'hello@mvcleaning.in' },
                  { icon: MapPin,text: 'Mumbai, Maharashtra' },
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
