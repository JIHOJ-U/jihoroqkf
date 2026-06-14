import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { bindScrollDepth } from '../utils/analytics';

/* Fires a GA4 page_view on every React Router location change.
   The base gtag.js snippet lives in public/index.html with
   send_page_view: false so SPA navigations aren't missed and aren't
   double-counted on first load. Also (re)binds the scroll-depth tracker
   per page so 25/50/75/100% milestones land in GA4 for each route. */
function Analytics() {
  const location = useLocation();

  useEffect(() => {
    // Per-route canonical — SPAs serve the same index.html for every path,
    // so a static canonical tells Google every sub-page is a duplicate of /.
    // Point canonical at the current path so each route gets indexed on its own.
    let canonical = document.getElementById('canonical-link')
      || document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      canonical.id = 'canonical-link';
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.origin + location.pathname;

    const fullPath = location.pathname + location.search + location.hash;
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path: fullPath,
        page_title: document.title,
        page_location: window.location.href,
      });
    }
    bindScrollDepth(location.pathname);
  }, [location]);

  return null;
}

export default Analytics;
