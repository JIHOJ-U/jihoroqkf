import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { bindScrollDepth } from '../utils/analytics';
import { routeMeta } from '../data/routeMeta';

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

    // Per-route SEO meta — resolve a routeMeta entry by exact path,
    // then by known dynamic patterns, finally falling back to default.
    // This must run BEFORE gtag below so page_view reports the fresh title.
    const path = location.pathname;
    let entry = routeMeta[path];
    // Admin edit pattern must be checked BEFORE the public /portfolio/:id
    // detail pattern (both match /portfolio/edit/<id> at the regex level).
    if (!entry && /^\/portfolio\/edit\/[^/]+$/.test(path)) entry = routeMeta['/portfolio/edit/:id'];
    if (!entry && /^\/portfolio\/[^/]+$/.test(path)) entry = routeMeta['/portfolio/:id'];
    if (!entry && /^\/blog\/[^/]+$/.test(path)) entry = routeMeta['/blog/:slug'];
    if (!entry && /^\/references\/[^/]+$/.test(path)) entry = routeMeta['/references/:slug'];
    if (!entry) entry = routeMeta.default;

    document.title = entry.title;

    const setMeta = (selector, attr, value) => {
      let tag = document.head.querySelector(selector);
      if (!tag) {
        tag = document.createElement('meta');
        // selector looks like 'meta[name="x"]' or 'meta[property="x"]'.
        const match = selector.match(/\[(name|property)="([^"]+)"\]/);
        if (match) tag.setAttribute(match[1], match[2]);
        document.head.appendChild(tag);
      }
      tag.setAttribute(attr, value);
    };

    const ogUrl = window.location.origin + location.pathname;
    setMeta('meta[name="description"]', 'content', entry.description);
    setMeta('meta[property="og:title"]', 'content', entry.ogTitle);
    setMeta('meta[property="og:description"]', 'content', entry.ogDescription);
    setMeta('meta[property="og:url"]', 'content', ogUrl);
    setMeta('meta[name="twitter:title"]', 'content', entry.ogTitle);
    setMeta('meta[name="twitter:description"]', 'content', entry.ogDescription);

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
