/**
 * Resolve a service's image for the web:
 *   1. admin-set `imageUrl` (remote) if present,
 *   2. else a bundled image in `public/images/` matched by keyword in the name,
 *   3. else '' (the ServiceCard renders a branded fallback tile).
 * Mirrors the mobile app's name-matched imagery, using the web public assets.
 */
const KEYWORD_IMAGES: [string, string][] = [
  ['kitchen', '/images/service-kitchen.png'],
  ['bathroom', '/images/service-bathroom.png'],
  ['deep', '/images/service-deepclean.png'],
  ['sofa', '/images/service-sofa.png'],
  ['carpet', '/images/service-carpet.png'],
  ['window', '/images/service-window.png'],
  ['pest', '/images/service-pest.png'],
  ['salon', '/images/service-salon.png'],
  ['plumb', '/images/service-plumbing.png'],
];

export function serviceImage(service: { name: string; imageUrl?: string }): string {
  if (service.imageUrl) return service.imageUrl;
  const n = service.name.toLowerCase();
  for (const [key, img] of KEYWORD_IMAGES) {
    if (n.includes(key)) return img;
  }
  return '';
}
