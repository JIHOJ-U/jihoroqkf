import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/* Fires a GA4 page_view on every React Router location change.
   The base gtag.js snippet lives in public/index.html with
   send_page_view: false so SPA navigations aren't missed and aren't
   double-counted on first load. */
function Analytics() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', 'page_view', {
      page_path: location.pathname + location.search + location.hash,
      page_title: document.title,
      page_location: window.location.href,
    });
  }, [location]);

  return null;
}

export default Analytics;
