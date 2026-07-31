import { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, ClipboardList, Wallet as WalletIcon } from 'lucide-react';

const InstaIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>;
const FbIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>;
import { useAuth } from '../auth/AuthContext';
import { CartProvider, useCart } from '../cart/CartContext';
import { ServiceDetailProvider } from '../detail/ServiceDetailContext';
import { ServiceDetailSheet } from './app/ServiceDetailSheet';
import { ScrollToTop } from './ScrollToTop';
import '../styles/app.css';

/**
 * The single shell for the whole consumer site (Urban-Company style): the site
 * *is* the product. Header = logo · location · search · cart · login/account.
 * Footer = company/legal links. WhatsApp FAB always visible.
 */
function StoreShell() {
  const { isAuthed } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  const [q, setQ] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // A dropdown that only closes via its own trigger is a trap: close on outside
  // click and on Escape, which is what users reflexively try.
  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);
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
      {/* Router doesn't reset scroll between routes — without this, a footer link
          tapped from the bottom of a long page opens the next page mid-scroll. */}
      <ScrollToTop />

      {/* Visible only on keyboard focus. Lets keyboard/screen-reader users jump
          past the header (logo, location, search, cart, login) on every page. */}
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {/* ── Header ── */}
      <header className={`store-header${scrolled ? ' scrolled' : ''}`}>
        <div className="store-header-inner">
          {/* Logo */}
          <Link to="/" className="app-logo" aria-label="MV Cleaning Home" style={{ display: 'block', height: 39 }}>
            {/* Colour mark on a baked-in white plate. The logo's text and roof
                outlines are BLACK, so on a white header they read fine — but
                browser "force dark" modes (Opera Night mode, Samsung Internet,
                Chrome Auto Dark) darken the header while leaving <img> pixels
                untouched, making the black artwork disappear. `color-scheme:
                light only` does NOT stop them. The plate is part of the image,
                and no force-dark mode repaints image pixels, so the mark stays
                legible everywhere. On the white header the plate is invisible.
                Height is 39 (not 34) so the padding doesn't shrink the mark. */}
            <img src="/images/logo_plate.webp" alt="MV Cleaning Services" style={{ height: 39 }} />
          </Link>


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
              /* Account menu. The person icon used to link straight to /account,
                 which left /bookings and /wallet with no route into them at all —
                 mobile has them as bottom tabs; web had nothing. */
              <div className="account-menu" ref={menuRef}>
                <button
                  className="store-account"
                  aria-label="My account"
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen((v) => !v)}
                >
                  <User size={22} />
                </button>
                {menuOpen && (
                  <div className="account-dropdown" role="menu">
                    <Link to="/bookings" role="menuitem" onClick={() => setMenuOpen(false)}>
                      <ClipboardList size={16} /> My bookings
                    </Link>
                    <Link to="/wallet" role="menuitem" onClick={() => setMenuOpen(false)}>
                      <WalletIcon size={16} /> Wallet
                    </Link>
                    <Link to="/account" role="menuitem" onClick={() => setMenuOpen(false)}>
                      <User size={16} /> Account
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-primary store-login">Log in</Link>
            )}
          </div>
        </div>
      </header>

      {/* ── Page content ── */}
      <main className="store-main" id="main-content" tabIndex={-1}>
        <Outlet />
      </main>

      {/* ── Service detail sheet (global, above all content) ── */}
      <ServiceDetailSheet />

      {/* ── Footer (dark, Urban Company–style) ── */}
      <footer className="store-footer">
        <div className="store-footer-inner">
          {/* Brand column */}
          <div className="store-footer-brand">
            <div className="app-logo" style={{ display: 'inline-flex', marginBottom: 12 }}>
              {/* White knockout on the dark footer. This previously used the
                  colour logo with mixBlendMode:'screen' to fake transparency
                  against slate-900 — a real knockout makes the hack unnecessary. */}
              <img src="/images/logo_white.webp" alt="MV Cleaning Services" style={{ height: 34 }} />
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
