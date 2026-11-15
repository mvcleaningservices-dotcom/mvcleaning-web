import { useCallback, useEffect, useState } from 'react';
import { X, Phone, Navigation } from 'lucide-react';
import { api, type BookingTracking } from '../../api';
import { OsmMap, type MapMarker } from './OsmMap';
import '../../styles/tracking.css';

const REFRESH_MS = 15_000;

function minutesAgo(iso: string) {
  const m = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  return m === 0 ? 'just now' : m === 1 ? '1 min ago' : `${m} min ago`;
}

/**
 * "Track your professional" on the website (client V2 5.3, OpenStreetMap) —
 * same as the app: home + professional on the map, distance, last update,
 * refreshes every 15 s, and the helpline when the admin has set one.
 */
export function TrackingModal({ bookingId, onClose }: { bookingId: string; onClose: () => void }) {
  const [data, setData] = useState<BookingTracking | null>(null);
  const [error, setError] = useState('');
  const [helpline, setHelpline] = useState('');

  const load = useCallback(() => {
    api.bookingTracking(bookingId)
      .then((d) => { setData(d); setError(''); })
      .catch((e) => setError((e as Error).message || 'Couldn’t load tracking'));
  }, [bookingId]);

  useEffect(() => {
    load();
    api.contentConfig().then((c) => setHelpline(c.helplineNumber)).catch(() => {});
    const iv = setInterval(load, REFRESH_MS);
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => { clearInterval(iv); window.removeEventListener('keydown', onKey); };
  }, [load, onClose]);

  const markers: MapMarker[] = [];
  if (data?.home) markers.push({ lat: data.home.lat, lng: data.home.lng, label: 'Your home', kind: 'home' });
  for (const p of data?.partners ?? []) markers.push({ lat: p.lat, lng: p.lng, label: p.name, kind: 'partner' });
  const names = data?.assignedNames.length ? data.assignedNames.join(', ') : 'Your professional';

  return (
    <div className="trk-overlay" onClick={onClose}>
      <div className="trk-box" role="dialog" aria-modal="true" aria-label="Track your professional" onClick={(e) => e.stopPropagation()}>
        <div className="trk-head">
          <div>
            <h2>Track your professional</h2>
            {data && <span className="trk-sub">{data.orderNumber}</span>}
          </div>
          <button className="trk-close" onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>

        {!data && !error ? (
          <div className="trk-msg">Loading…</div>
        ) : (
          <>
            {markers.length > 0 ? <OsmMap markers={markers} /> : <div className="trk-msg">Map not available for this booking.</div>}
            <div className="trk-info">
              {error && <p className="auth-error">{error}</p>}
              {data && !data.sharing ? (
                <p className="trk-status">
                  {data.status === 'completed' ? 'This job is complete.' : 'Live location appears here once your professional starts the job.'}
                </p>
              ) : data && data.partners.length === 0 ? (
                <p className="trk-status">{names} is on the job. Their location will appear when their app shares it.</p>
              ) : (
                data?.partners.map((p) => (
                  <div key={p.name} className="trk-partner">
                    <Navigation size={18} />
                    <div>
                      <strong>{p.name}</strong>
                      <span>{p.distanceKm != null ? `${p.distanceKm} km away · ` : ''}updated {minutesAgo(p.at)}</span>
                    </div>
                  </div>
                ))
              )}
              {helpline && (
                <a className="trk-help" href={`tel:${helpline.replace(/[^\d+]/g, '')}`}>
                  <Phone size={16} /> Emergency helpline · {helpline}
                </a>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
