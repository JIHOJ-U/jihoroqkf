import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineCalculator, HiOutlineArrowUp } from 'react-icons/hi';
import { useLanguage } from '../contexts/LanguageContext';
import { trackCta } from '../utils/analytics';
import './QuickActionsDock.css';

function QuickActionsDock() {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [overBridge, setOverBridge] = useState(false);
  const labels = t.quickDock;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 400);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 600);
    return () => clearTimeout(timer);
  }, []);

  // The parallax typography band (.pxbridge) pans large text across the
  // full width of the screen, right under this dock's fixed position —
  // fade the dock out while that section is in view so it doesn't cover
  // the text (most visible on mobile, where the band takes up more of
  // the viewport width).
  useEffect(() => {
    const bridge = document.querySelector('.pxbridge');
    if (!bridge) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setOverBridge(entry.isIntersecting),
      { threshold: 0.15 }
    );
    observer.observe(bridge);
    return () => observer.disconnect();
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div
      className={`qdock ${mounted ? 'qdock--in' : ''} ${overBridge ? 'qdock--faded' : ''}`}
      aria-label="Quick actions"
    >
      <Link
        to="/contact"
        className="qdock-btn"
        style={{ '--i': 0 }}
        onClick={() => trackCta('quote', { source: 'quick_dock' })}
      >
        <span className="qdock-icon"><HiOutlineCalculator /></span>
        <span className="qdock-label">{labels.quote}</span>
      </Link>

      <button
        type="button"
        onClick={scrollTop}
        className={`qdock-btn ${scrolled ? 'qdock-btn--visible' : 'qdock-btn--hidden'}`}
        style={{ '--i': 1 }}
        aria-label={labels.top}
      >
        <span className="qdock-icon"><HiOutlineArrowUp /></span>
        <span className="qdock-label">{labels.top}</span>
      </button>
    </div>
  );
}

export default QuickActionsDock;
