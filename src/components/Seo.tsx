import { useEffect } from 'react';

/**
 * Sets the page <title> and meta description per-page (scope §5 "SEO-friendly").
 * Deliberately dependency-free (no react-helmet) — a Vite SPA doesn't need a
 * full head-management library for eight static pages.
 */
export function Seo({ title, description }: { title: string; description: string }) {
  useEffect(() => {
    document.title = `${title} | MV Cleaning Services`;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', description);
  }, [title, description]);

  return null;
}
