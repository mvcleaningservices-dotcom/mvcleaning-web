import { Plus, Check } from 'lucide-react';
import type { ServiceItem } from '../../api';
import { useCart } from '../../cart/CartContext';
import { useServiceDetail } from '../../detail/ServiceDetailContext';
import { ServiceThumb } from './ServiceThumb';

/** Service card: click opens the detail sheet; the Add button toggles the cart. */
export function ServiceCard({ service }: { service: ServiceItem }) {
  const { has, toggle } = useCart();
  const { open } = useServiceDetail();
  const selected = has(service.id);

  return (
    <div
      className={`svc-card${selected ? ' selected' : ''}`}
      role="button"
      tabIndex={0}
      onClick={() => open(service)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(service); } }}
    >
      <ServiceThumb service={service} />
      <div className="svc-body">
        <div className="svc-top">
          <span className="svc-name">{service.name}</span>
          {service.category && <span className="svc-cat">{service.category}</span>}
        </div>
        <p className="svc-desc">{service.description}</p>
        <div className="svc-foot">
          <div className="svc-price">from <strong>₹{service.price}</strong></div>
          <button
            type="button"
            className={`svc-add${selected ? ' added' : ''}`}
            onClick={(e) => { e.stopPropagation(); toggle(service); }}
          >
            {selected ? <><Check size={15} /> Added</> : <><Plus size={15} /> Add</>}
          </button>
        </div>
      </div>
    </div>
  );
}
