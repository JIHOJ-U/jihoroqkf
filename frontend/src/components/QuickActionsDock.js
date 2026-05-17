import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineCalculator, HiOutlineChatAlt2, HiOutlineArrowUp } from 'react-icons/hi';
import { useLanguage } from '../contexts/LanguageContext';
import './QuickActionsDock.css';

function QuickActionsDock() {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
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

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className={`qdock ${mounted ? 'qdock--in' : ''}`} aria-label="Quick actions">
      <Link to="/contact" className="qdock-btn" style={{ '--i': 0 }}>
        <span className="qdock-icon"><HiOutlineCalculator /></span>
        <span className="qdock-label">{labels.quote}</span>
      </Link>

      <Link to="/contact" className="qdock-btn" style={{ '--i': 1 }}>
        <span className="qdock-icon"><HiOutlineChatAlt2 /></span>
        <span className="qdock-label">{labels.chat}</span>
      </Link>

      <button
        type="button"
        onClick={scrollTop}
        className={`qdock-btn ${scrolled ? 'qdock-btn--visible' : 'qdock-btn--hidden'}`}
        style={{ '--i': 2 }}
        aria-label={labels.top}
      >
        <span className="qdock-icon"><HiOutlineArrowUp /></span>
        <span className="qdock-label">{labels.top}</span>
      </button>
    </div>
  );
}

export default QuickActionsDock;
