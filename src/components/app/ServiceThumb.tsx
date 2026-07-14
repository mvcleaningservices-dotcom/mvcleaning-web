import { useState } from 'react';
import { Sparkles, Wrench, Bug, Home, type LucideIcon } from 'lucide-react';
import type { ServiceItem, PopularService } from '../../api';
import { serviceImage } from '../../lib/serviceImage';

/**
 * A service thumbnail that never looks empty: shows the real photo when one
 * exists, otherwise a designed, category-tinted gradient tile with a large icon.
 * Shared by the card, the popular row, and the detail sheet so imagery stays
 * consistent everywhere.
 */
const CATEGORY_FALLBACK: Record<string, { cls: string; Icon: LucideIcon }> = {
  Cleaning: { cls: 'fb-cleaning', Icon: Sparkles },
  Repair: { cls: 'fb-repair', Icon: Wrench },
  'Pest Control': { cls: 'fb-pest', Icon: Bug },
};

export function ServiceThumb({
  service,
  className = 'svc-img',
  iconSize = 40,
}: {
  service: ServiceItem | PopularService;
  className?: string;
  iconSize?: number;
}) {
  const [broken, setBroken] = useState(false);
  const img = serviceImage(service);
  const fb = CATEGORY_FALLBACK[service.category || ''] ?? { cls: 'fb-default', Icon: Home };

  return (
    <div className={className}>
      {img && !broken ? (
        <img src={img} alt={service.name} loading="lazy" onError={() => setBroken(true)} />
      ) : (
        <div className={`svc-img-fallback ${fb.cls}`}>
          <fb.Icon size={iconSize} strokeWidth={1.5} />
        </div>
      )}
    </div>
  );
}
