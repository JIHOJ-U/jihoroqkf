import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiArrowRight } from 'react-icons/hi';
import { useLanguage } from '../contexts/LanguageContext';
import './InquiryCTA.css';

function InquiryCTA() {
  const { t } = useLanguage();
  const { prefix, suffix, words, primary } = t.inquiryCTA;
  const [index, setIndex] = useState(0);
  const sectionRef = useRef(null);

  // Only rotate the word pill while the CTA is actually on screen — keeps
  // the section idle when the visitor is reading earlier sections.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;

    let id = null;
    const start = () => {
      if (id) return;
      id = setInterval(() => {
        setIndex(prev => (prev + 1) % words.length);
      }, 1800);
    };
    const stop = () => {
      if (!id) return;
      clearInterval(id);
      id = null;
    };

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0.15 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      stop();
    };
  }, [words.length]);

  return (
    <section className="iqcta" ref={sectionRef}>
      <div className="iqcta-curtain" aria-hidden="true">
        <span className="iqcta-curtain-text">CONTACT</span>
      </div>

      <div className="iqcta-inner">
        <h2 className="iqcta-headline">
          <span className="iqcta-prefix">{prefix}</span>
          <span className="iqcta-pill">
            <span
              className="iqcta-pill-track"
              style={{ transform: `translateY(-${(index * 100) / words.length}%)` }}
            >
              {words.map((w, i) => (
                <span key={i} className="iqcta-pill-word">{w}</span>
              ))}
            </span>
          </span>
          <span className="iqcta-suffix">{suffix}</span>
        </h2>

        <div className="iqcta-actions">
          <Link to="/contact" className="iqcta-btn iqcta-btn--primary">
            {primary}
            <span className="iqcta-btn-icon"><HiArrowRight /></span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default InquiryCTA;
