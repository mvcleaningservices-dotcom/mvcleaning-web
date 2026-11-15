import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

/**
 * OpenStreetMap map with pins (client V2 — free, no API key). Red = home,
 * blue = professional. OSM's rules require the credit line in the corner.
 */
const TILE_URL =
  (import.meta.env.VITE_MAP_TILE_URL as string | undefined) ||
  'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors';

export interface MapMarker {
  lat: number;
  lng: number;
  label: string;
  kind: 'home' | 'partner';
}

function pinIcon(kind: MapMarker['kind']) {
  const color = kind === 'home' ? '#dc2626' : '#0050b3';
  return L.divIcon({
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    html: `<div style="width:28px;height:28px;border-radius:50% 50% 50% 0;background:${color};transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.4)"></div>`,
  });
}

export function OsmMap({ markers, height = 320 }: { markers: MapMarker[]; height?: number }) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const layer = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!el.current || map.current) return;
    map.current = L.map(el.current).setView([12.9716, 77.5946], 12);
    L.tileLayer(TILE_URL, { maxZoom: 19, attribution: ATTRIBUTION }).addTo(map.current);
    layer.current = L.layerGroup().addTo(map.current);
    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Redraw only when the pins actually move (the array is rebuilt each render).
  const sig = JSON.stringify(markers);
  useEffect(() => {
    const m = map.current;
    const g = layer.current;
    if (!m || !g) return;
    const list = JSON.parse(sig) as MapMarker[];
    g.clearLayers();
    for (const mk of list) {
      L.marker([mk.lat, mk.lng], { icon: pinIcon(mk.kind), title: mk.label })
        .bindTooltip(mk.label, { permanent: true, direction: 'top', offset: [0, -26] })
        .addTo(g);
    }
    if (list.length === 1) m.setView([list[0].lat, list[0].lng], 15);
    else if (list.length > 1) {
      m.fitBounds(L.latLngBounds(list.map((x) => [x.lat, x.lng] as [number, number])), { padding: [50, 50], maxZoom: 16 });
    }
  }, [sig]);

  return <div ref={el} style={{ height, width: '100%', borderRadius: 12, overflow: 'hidden', zIndex: 0 }} />;
}
