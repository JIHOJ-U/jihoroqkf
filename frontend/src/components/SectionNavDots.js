import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import './SectionNavDots.css';

/**
 * SectionNavDots — right-edge vertical section navigator (inspired by
 * fullPage.js style page indicators but implemented for our normal scroll
 * flow, no snap forced). Each dot maps to a section id on Home; the dot
 * with the section currently intersecting the viewport becomes active.
 * Click a dot → smooth scroll into that section.
 *
 * Only rendered on Home (`/`) and on ≥900px viewports — dots would clutter
 * mobile and don't make sense on other routes.
 */
function SectionNavDots() {
  const location = useLocation();
  const { t } = useLanguage();
  const [activeId, setActiveId] = useState(null);

  // Section list. Uses ids that Home.js attaches to its 6 anchor sections.
  const sections = useMemo(
    // Ordered top-to-bottom to match scroll order on Home.
    () => (t.sectionNav?.items ?? [
      { id: 'home-problems', label: 'Problems' },
      { id: 'home-hero',     label: 'Profile' },
      { id: 'home-pricing',  label: 'Pricing' },
      { id: 'home-process',  label: 'Process' },
      { id: 'home-works',    label: 'Works' },
      { id: 'home-contact',  label: 'Contact' },
    ]),
    [t.sectionNav]
  );

  useEffect(() => {
    if (location.pathname !== '/') return undefined;
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter(Boolean);
    if (els.length === 0) return undefined;

    // Track last-known intersection ratio per element and always pick the
    // one with the highest current visibility. rootMargin creates a broad
    // trigger zone (top 20% → bottom 20% of viewport) so short sections
    // still register. We keep a local map because IntersectionObserver
    // only re-fires entries that changed — we need the full picture.
    const ratios = new Map();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          ratios.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0);
        });
        let bestId = null;
        let bestRatio = 0;
        ratios.forEach((r, id) => {
          if (r > bestRatio) { bestRatio = r; bestId = id; }
        });
        if (bestId && bestRatio > 0) setActiveId(bestId);
      },
      { rootMargin: '-20% 0px -20% 0px', threshold: [0, 0.15, 0.35, 0.6, 0.85, 1] }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [location.pathname, sections]);

  if (location.pathname !== '/') return null;

  const handleClick = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <nav className="sn-dots" aria-label={t.sectionNav?.ariaLabel || 'Section navigation'}>
      <ul>
        {sections.map((s, i) => {
          const isActive = s.id === activeId;
          const num = String(i + 1).padStart(2, '0');
          return (
            <li key={s.id} className={isActive ? 'sn-item sn-item--active' : 'sn-item'}>
              <button
                type="button"
                className="sn-btn"
                onClick={() => handleClick(s.id)}
                aria-current={isActive ? 'true' : undefined}
                aria-label={`${num} ${s.label}`}
              >
                <span className="sn-num">{num}</span>
                <span className="sn-dot" aria-hidden="true" />
                <span className="sn-label">{s.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default SectionNavDots;
