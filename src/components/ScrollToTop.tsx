import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Resets scroll to the top on navigation.
 *
 * React Router does not do this by default: it swaps the route's component but
 * leaves the window where it was. So scrolling to the bottom of the homepage and
 * tapping a footer link opened the next page already scrolled into its middle.
 *
 * `behavior: 'auto'` (not smooth) — a new page should already be at the top when
 * it appears, not visibly race there.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}
