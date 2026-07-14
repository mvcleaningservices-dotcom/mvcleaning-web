import { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { MapPin, ShoppingCart, User, Search, Sparkles } from 'lucide-react';

const InstaIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>;
const FbIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>;
import { useAuth } from '../auth/AuthContext';
import { CartProvider, useCart } from '../cart/CartContext';
import { ServiceDetailProvider } from '../detail/ServiceDetailContext';
import { ServiceDetailSheet } from './app/ServiceDetailSheet';
import { WhatsAppButton } from './WhatsAppButton';
import '../styles/app.css';

/**
 * The single shell for the whole consumer site (Urban-Company style): the site
 * *is* the product. Header = logo · location · search · cart · login/account.
 * Footer = company/legal links. WhatsApp FAB always visible.
 */
function StoreShell() {
  const { isAuthed, pincode } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  const [q, setQ] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Scroll listener — add backdrop shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const runSearch = (v: string) => {
    setQ(v);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(
      () => navigate(v.trim() ? `/?q=${encodeURIComponent(v.trim())}` : '/'),
      300
    );
  };

  return (
    <div className="store">
      {/* ── Header ── */}
      <header className={`store-header${scrolled ? ' scrolled' : ''}`}>
        <div className="store-header-inner">
          {/* Logo */}
          <Link to="/" className="app-logo" aria-label="MV Cleaning Home" style={{ display: 'block', height: 34 }}>
            <img src="/images/logo.jpeg" alt="MV Cleaning Services" style={{ height: 34, filter: 'invert(1)', mixBlendMode: 'multiply' }} />
          </Link>

          {/* Location pill */}
          <button className="store-loc" onClick={() => navigate('/')} title="Change your area">
            <MapPin size={14} />
            <span>{pincode ? pincode : 'Select area'}</span>
          </button>

          {/* Search */}
          <form
            className="store-search"
            onSubmit={(e) => {
              e.preventDefault();
              navigate(q.trim() ? `/?q=${encodeURIComponent(q.trim())}` : '/');
            }}
          >
            <Search size={16} />
            <input
              value={q}
              onChange={(e) => runSearch(e.target.value)}
              placeholder="Search 'deep cleaning', 'plumber'…"
              aria-label="Search services"
            />
          </form>

          {/* Right actions */}
          <div className="store-header-right">
            <Link to="/checkout" className="store-cart" aria-label={`Cart (${count} items)`}>
              <ShoppingCart size={22} />
              {count > 0 && <span className="store-cart-badge">{count}</span>}
            </Link>
            {isAuthed ? (
              <Link to="/account" className="store-account" aria-label="My account">
                <User size={22} />
              </Link>
            ) : (
              <Link to="/login" className="btn-primary store-login">Log in</Link>
            )}
          </div>
        </div>
      </header>

      {/* ── Page content ── */}
      <main className="store-main">
        <Outlet />
      </main>

      {/* ── Service detail sheet (global, above all content) ── */}
      <ServiceDetailSheet />

      {/* ── WhatsApp FAB ── */}
      <WhatsAppButton phone="919999999999" />

      {/* ── Footer (dark, Urban Company–style) ── */}
      <footer className="store-footer">
        <div className="store-footer-inner">
          {/* Brand column */}
          <div className="store-footer-brand">
            <div className="app-logo" style={{ display: 'inline-flex', marginBottom: 12 }}>
              <img src="/images/logo.jpeg" alt="MV Cleaning Services" style={{ height: 34, mixBlendMode: 'screen' }} />
            </div>
            <p>Professional home cleaning & repair services. Vetted experts, transparent pricing, and a satisfaction guarantee.</p>
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'background 0.15s, color 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.16)'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'; }}
                aria-label="Instagram">
                <InstaIcon />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'background 0.15s, color 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.16)'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'; }}
                aria-label="Facebook">
                <FbIcon />
              </a>
            </div>
          </div>

          {/* Services column */}
          <div className="store-footer-col">
            <h4>Services</h4>
            <nav className="store-footer-links">
              <Link to="/">Book a Service</Link>
              <Link to="/services">All Services</Link>
              <Link to="/partner">Become a Partner</Link>
              <Link to="/blog">Cleaning Tips</Link>
            </nav>
          </div>

          {/* Company column */}
          <div className="store-footer-col">
            <h4>Company</h4>
            <nav className="store-footer-links">
              <Link to="/about">About Us</Link>
              <Link to="/faq">FAQ</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/refunds">Cancellation & Refunds</Link>
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="store-footer-copy">
          <span>© {year} MV Cleaning Services. All rights reserved.</span>
          <span>Made with ♥ in India</span>
        </div>
      </footer>
    </div>
  );
}

export function StoreLayout() {
  return (
    <CartProvider>
      <ServiceDetailProvider>
        <StoreShell />
      </ServiceDetailProvider>
    </CartProvider>
  );
}
