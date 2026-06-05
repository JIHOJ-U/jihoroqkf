import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiArrowRight, HiArrowLeft } from 'react-icons/hi';
import { getImageUrl } from '../api';
import { useLanguage } from '../contexts/LanguageContext';
import './FeaturedCarousel.css';

const AUTOPLAY_MS = 5500;

function FeaturedCarousel({ items }) {
  const { lang } = useLanguage();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setIndex((i) => (i + 1) % items.length), [items.length]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + items.length) % items.length), [items.length]);

  // Autoplay — pause on hover / when tab hidden
  useEffect(() => {
    if (paused || items.length <= 1) return undefined;
    const id = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, next, items.length]);

  useEffect(() => {
    const onVis = () => setPaused(document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  if (!items || items.length === 0) return null;
  const current = items[index];

  const labels = lang === 'ko'
    ? { tag: 'FEATURED', view: '자세히 보기', prev: '이전', next: '다음' }
    : { tag: 'FEATURED', view: 'View case', prev: 'Previous', next: 'Next' };

  return (
    <div
      className="fc-wrap"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="fc-stage">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            className="fc-slide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Link to={`/portfolio/${current.id}`} className="fc-slide-link">
              {current.thumbnail ? (
                <img
                  className={`fc-image ${current.thumbnailFit === 'contain' ? 'fc-image--contain' : ''}`}
                  src={getImageUrl(current.thumbnail)}
                  alt={current.title}
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="fc-image fc-image--empty" />
              )}
              <div className="fc-overlay" />
              <div className="fc-content">
                <span className="fc-tag" translate="no">{labels.tag}</span>
                <h3 className="fc-title">{current.title}</h3>
                {current.client && <p className="fc-client">{current.client}</p>}
                <div className="fc-tags">
                  {(current.techStack || []).slice(0, 4).map((tech, i) => (
                    <span key={i} className="fc-tech">{tech}</span>
                  ))}
                </div>
                <span className="fc-cta">{labels.view} <HiArrowRight /></span>
              </div>
            </Link>
          </motion.div>
        </AnimatePresence>

        {items.length > 1 && (
          <>
            <button type="button" className="fc-nav fc-nav--prev" onClick={prev} aria-label={labels.prev}>
              <HiArrowLeft />
            </button>
            <button type="button" className="fc-nav fc-nav--next" onClick={next} aria-label={labels.next}>
              <HiArrowRight />
            </button>
          </>
        )}
      </div>

      {items.length > 1 && (
        <div className="fc-dots" role="tablist">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`fc-dot ${i === index ? 'is-active' : ''}`}
              onClick={() => setIndex(i)}
              role="tab"
              aria-selected={i === index}
              aria-label={`${i + 1} / ${items.length}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default FeaturedCarousel;
