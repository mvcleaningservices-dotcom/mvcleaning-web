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
 */
export function ServiceDetailSheet() {
  const { service, close } = useServiceDetail();
  const { has, toggle } = useCart();
  const navigate = useNavigate();

  if (!service) return null;
  const selected = has(service.id);

  return (
    <div className="sheet-overlay" onClick={close}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <button className="sheet-close" onClick={close} aria-label="Close"><X size={20} /></button>

        <ServiceThumb service={service} className="sheet-img" iconSize={56} />

        <div className="sheet-body">
          <div className="sheet-top">
            <h2>{service.name}</h2>
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
