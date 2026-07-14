import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Sets the page <title>, meta description, and Open Graph tags per-page.
 * Dependency-free — a Vite SPA doesn't need react-helmet for static pages.
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

    const setMeta = (attr: string, key: string, value: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', value);
    };

    setMeta('name', 'description', description);

    // Open Graph
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', window.location.origin + location.pathname);
    if (image) setMeta('property', 'og:image', image);

    // Twitter
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);
    if (image) setMeta('name', 'twitter:image', image);
  }, [title, description, image, location.pathname]);

  return null;
}
