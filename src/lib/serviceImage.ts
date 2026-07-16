/**
 * Resolve a service's image for the web:
 *   1. admin-set `imageUrl` (remote) if present,
 *   2. else a bundled image in `public/images/` matched by keyword in the name,
 *   3. else '' (the ServiceCard renders a branded fallback tile).
 * Mirrors the mobile app's name-matched imagery, using the web public assets.
 */
const KEYWORD_IMAGES: [string, string][] = [
  ['kitchen', '/images/service-kitchen.webp'],
  ['bathroom', '/images/service-bathroom.webp'],
  ['deep', '/images/service-deepclean.webp'],
  ['sofa', '/images/service-sofa.webp'],
  ['carpet', '/images/service-carpet.webp'],
  ['window', '/images/service-window.webp'],
  ['pest', '/images/service-pest.webp'],
  ['salon', '/images/service-salon.webp'],
  ['plumb', '/images/service-plumbing.webp'],
];

export function serviceImage(service: { name: string; imageUrl?: string }): string {
  if (service.imageUrl) return service.imageUrl;
  const n = service.name.toLowerCase();
  for (const [key, img] of KEYWORD_IMAGES) {
    if (n.includes(key)) return img;
  }
  return '';
}
