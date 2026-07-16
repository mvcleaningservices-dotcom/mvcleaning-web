import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Canonical origin for this site.
 *
 * Hardcoded rather than read from window.location because the apex
 * (mvcleaningservices.in) permanently redirects to www — so both hostnames can
 * be reached, and a canonical derived from the current URL would tell Google
 * that BOTH are canonical, which is the duplicate-content problem it's meant to
 * solve. Vercel preview URLs would poison it the same way.
 */
const CANONICAL_ORIGIN = 'https://www.mvcleaningservices.in';

/**
 * Sets the page <title>, meta description, canonical URL, and Open Graph tags
 * per-page. Dependency-free — a Vite SPA doesn't need react-helmet for this.
 */
export function Seo({
  title,
  description,
  image,
}: {
  title: string;
  description: string;
  image?: string;
}) {
  const location = useLocation();

  useEffect(() => {
    const fullTitle = `${title} | MV Cleaning Services`;
    document.title = fullTitle;

    const canonicalUrl = CANONICAL_ORIGIN + location.pathname;

    const setMeta = (attr: string, key: string, value: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', value);
    };

    // Canonical — points at the www origin regardless of how we were reached.
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    setMeta('name', 'description', description);

    // Open Graph
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', canonicalUrl);
    if (image) setMeta('property', 'og:image', image);

    // Twitter
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);
    if (image) setMeta('name', 'twitter:image', image);
  }, [title, description, image, location.pathname]);

  return null;
}
