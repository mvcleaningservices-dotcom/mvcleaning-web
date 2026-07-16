import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, ShieldCheck, Wallet, Clock } from 'lucide-react';
import { useServiceDetail } from '../../detail/ServiceDetailContext';
import { useCart } from '../../cart/CartContext';
import { ServiceThumb } from './ServiceThumb';

/**
 * Service-detail bottom sheet: image, description ("what's included"), price,
 * and Add. Opens from any service card. (Structured inclusions + duration are a
 * Tier-2 backend field; for now we show the service description + standard
 * assurances.)
 *
 * Implemented as a proper modal dialog: it is the most-used overlay in the app,
 * so it must be dismissible with Escape, must trap focus (otherwise Tab walks
 * into the page behind it), must return focus where it came from, and must stop
 * the page scrolling underneath.
 */
export function ServiceDetailSheet() {
  const { service, close } = useServiceDetail();
  const { has, toggle } = useCart();
  const navigate = useNavigate();
  const sheetRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  const isOpen = !!service;

  // Escape to close + focus trap. Registered only while open.
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== 'Tab') return;

      // Keep Tab inside the dialog.
      const focusables = sheetRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, close]);

  // Lock the background scroll while open, and restore focus to the card that
  // opened the sheet once it closes (otherwise focus is dumped at <body>).
  useEffect(() => {
    if (!isOpen) return;

    openerRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Move focus into the dialog so screen readers announce it and Escape works
    // without the user first clicking inside.
    sheetRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      openerRef.current?.focus?.();
    };
  }, [isOpen]);

  if (!service) return null;
  const selected = has(service.id);

  return (
    <div className="sheet-overlay" onClick={close}>
      <div
        className="sheet"
        onClick={(e) => e.stopPropagation()}
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
        tabIndex={-1}
      >
        <button className="sheet-close" onClick={close} aria-label="Close"><X size={20} /></button>

        <ServiceThumb service={service} className="sheet-img" iconSize={56} />

        <div className="sheet-body">
          <div className="sheet-top">
            <h2 id="sheet-title">{service.name}</h2>
            {service.category && <span className="svc-cat">{service.category}</span>}
          </div>
          <div className="sheet-price"><span>from</span> ₹{service.price}</div>

          <h3 className="sheet-h3">What's included</h3>
          <p className="sheet-desc">{service.description || 'A thorough, professional service carried out by a vetted expert.'}</p>

          <div className="sheet-assure">
            <div><ShieldCheck size={16} /> Vetted, trained professional</div>
            <div><Wallet size={16} /> Pay a small advance — balance after the job</div>
            <div><Clock size={16} /> Convenient slots, on time</div>
          </div>
        </div>

        <div className="sheet-foot">
          <div className="sheet-foot-price"><span>Total</span><strong>₹{service.price}</strong></div>
          {selected ? (
            <div className="sheet-foot-actions">
              <button className="btn-secondary" onClick={() => toggle(service)}>Remove</button>
              <button className="btn-primary" onClick={() => { close(); navigate('/checkout'); }}>Go to checkout</button>
            </div>
          ) : (
            <button className="btn-primary sheet-add" onClick={() => toggle(service)}>
              <Plus size={16} /> Add to booking
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
