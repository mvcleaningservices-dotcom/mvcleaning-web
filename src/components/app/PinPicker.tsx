import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, LocateFixed, Search, X } from 'lucide-react';
import { api } from '../../api';

/**
 * "Mark your home on the map" at checkout (client V2, OpenStreetMap — free,
 * no API key). Optional: helps the partner find the house. Search a place,
 * use the device location, or tap/drag the pin. OSM's credit line must stay.
 */
const TILE_URL =
  (import.meta.env.VITE_MAP_TILE_URL as string | undefined) ||
  'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors';
const BENGALURU: [number, number] = [12.9716, 77.5946];

export interface Pin {
  lat: number;
  lng: number;
}

const pinIcon = L.divIcon({
  className: '',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  html: '<div style="width:30px;height:30px;border-radius:50% 50% 50% 0;background:#dc2626;transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.4)"></div>',
});

export function PinPicker({
  value,
  onChange,
  pincode,
}: {
  value: Pin | null;
  onChange: (p: Pin | null) => void;
  /** Used to centre the map on the customer's area when it first opens. */
  pincode: string;
}) {
  const [open, setOpen] = useState(!!value);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ lat: number; lng: number; label: string }[]>([]);
  const [msg, setMsg] = useState('');
  const [searching, setSearching] = useState(false);
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const marker = useRef<L.Marker | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const placePin = (lat: number, lng: number, zoom?: number) => {
    const m = map.current;
    if (!m) return;
    if (!marker.current) {
      marker.current = L.marker([lat, lng], { icon: pinIcon, draggable: true, title: 'Your home' }).addTo(m);
      marker.current.on('dragend', () => {
        const p = marker.current!.getLatLng();
        onChangeRef.current({ lat: p.lat, lng: p.lng });
      });
    } else {
      marker.current.setLatLng([lat, lng]);
    }
    m.setView([lat, lng], zoom ?? Math.max(m.getZoom(), 16));
    onChangeRef.current({ lat, lng });
  };

  // Create the map when the panel opens.
  useEffect(() => {
    if (!open || !el.current || map.current) return;
    const m = L.map(el.current).setView(value ? [value.lat, value.lng] : BENGALURU, value ? 17 : 12);
    L.tileLayer(TILE_URL, { maxZoom: 19, attribution: ATTRIBUTION }).addTo(m);
    m.on('click', (e: L.LeafletMouseEvent) => placePin(e.latlng.lat, e.latlng.lng));
    map.current = m;
    if (value) placePin(value.lat, value.lng, 17);
    else if (/^\d{6}$/.test(pincode)) {
      // Start near their area so the pin is a short drag away.
      api.geoSearch(`${pincode}, India`)
        .then((r) => { if (r[0] && !marker.current) m.setView([r[0].lat, r[0].lng], 15); })
        .catch(() => {});
    }
    return () => {
      m.remove();
      map.current = null;
      marker.current = null;
    };
    // Only on open; value/pincode changes are handled by placePin.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const search = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (query.trim().length < 3) return setMsg('Type at least 3 letters — e.g. a landmark or area.');
    setMsg('');
    setSearching(true);
    try {
      const r = await api.geoSearch(query.trim());
      setResults(r);
      if (r.length === 0) setMsg('Nothing found. Try a nearby landmark or area, then drag the pin.');
      else if (r.length === 1) { placePin(r[0].lat, r[0].lng, 17); setResults([]); }
    } catch {
      setMsg('Search is unavailable right now — tap the map to place the pin.');
    } finally {
      setSearching(false);
    }
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) return setMsg('Your browser can’t share its location — tap the map instead.');
    setMsg('Finding you…');
    navigator.geolocation.getCurrentPosition(
      (pos) => { setMsg(''); placePin(pos.coords.latitude, pos.coords.longitude, 17); },
      () => setMsg('Location permission was refused — search or tap the map instead.'),
      { enableHighAccuracy: true, timeout: 10_000 },
    );
  };

  const clear = () => {
    marker.current?.remove();
    marker.current = null;
    onChange(null);
  };

  if (!open) {
    return (
      <button type="button" className="btn-secondary" style={{ marginTop: 12, width: '100%' }} onClick={() => setOpen(true)}>
        <MapPin size={16} /> Mark your home on the map <span style={{ fontWeight: 400, opacity: 0.75 }}>(optional)</span>
      </button>
    );
  }

  return (
    <div style={{ marginTop: 12 }}>
      <p className="auth-label" style={{ marginBottom: 6 }}>Mark your home on the map <span style={{ fontWeight: 400, opacity: 0.7 }}>(optional — helps the professional find you)</span></p>
      <form onSubmit={search} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <input
          className="auth-input"
          style={{ flex: 1 }}
          placeholder="Search a landmark, apartment or area"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search the map"
        />
        <button type="submit" className="btn-secondary" disabled={searching} aria-label="Search">
          <Search size={16} />
        </button>
      </form>
      {results.length > 1 && (
        <ul style={{ listStyle: 'none', margin: '0 0 8px', padding: 0, border: '1px solid var(--color-border, #e2e8f0)', borderRadius: 8 }}>
          {results.map((r) => (
            <li key={`${r.lat},${r.lng}`}>
              <button
                type="button"
                onClick={() => { placePin(r.lat, r.lng, 17); setResults([]); }}
                style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 10px', background: 'none', border: 0, borderBottom: '1px solid var(--color-border, #e2e8f0)', cursor: 'pointer', fontSize: 13 }}
              >
                {r.label}
              </button>
            </li>
          ))}
        </ul>
      )}
      <div ref={el} style={{ height: 260, borderRadius: 10, overflow: 'hidden', zIndex: 0, border: '1px solid var(--color-border, #e2e8f0)' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, gap: 8, flexWrap: 'wrap' }}>
        <button type="button" className="auth-link" onClick={useMyLocation}>
          <LocateFixed size={14} style={{ verticalAlign: '-2px' }} /> Use my current location
        </button>
        {value && (
          <button type="button" className="auth-link" onClick={clear}>
            <X size={14} style={{ verticalAlign: '-2px' }} /> Remove pin
          </button>
        )}
      </div>
      <p style={{ fontSize: 12, color: 'var(--color-text-secondary, #64748b)', marginTop: 4 }}>
        {msg || (value ? 'Pin placed ✓ — drag it if it’s not exactly on your home.' : 'Tap the map (or search) to drop the pin on your home.')}
      </p>
    </div>
  );
}
