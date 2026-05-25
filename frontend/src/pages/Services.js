import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiArrowRight, HiCheck, HiClock, HiSparkles, HiEye,
} from 'react-icons/hi';
import { useLanguage } from '../contexts/LanguageContext';
import ServiceDemo from '../components/ServiceDemos';
import './Services.css';

function Services() {
  const { t, lang } = useLanguage();
  const location = useLocation();
  // Memoize so the array reference is stable across renders — otherwise the
  // useEffect hooks below would re-run every render (react-hooks/exhaustive-deps).
  const services = useMemo(() => t.services?.list || [], [t.services]);
  const [activeKey, setActiveKey] = useState(services[0]?.key);

  // Scroll to specific service if URL has hash (#landing, #mobile, etc.)
  useEffect(() => {
    const hash = location.hash?.replace('#', '');
    if (hash && services.some(s => s.key === hash)) {
      setTimeout(() => {
        const el = document.getElementById(`svc-${hash}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActiveKey(hash);
      }, 100);
    }
  }, [location.hash, services]);

  // Update sticky tab active state on scroll
  useEffect(() => {
    const onScroll = () => {
      const sections = services.map(s => ({
        key: s.key,
        el: document.getElementById(`svc-${s.key}`),
      }));
      const viewportMid = window.innerHeight * 0.4;
      let current = activeKey;
      for (const { key, el } of sections) {
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= viewportMid && rect.bottom > viewportMid) {
          current = key;
          break;
        }
      }
      if (current !== activeKey) setActiveKey(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [services, activeKey]);

  const T = {
    label:    lang === 'ko' ? 'SERVICES' : 'SERVICES',
    intro:    lang === 'ko'
      ? '이런 결과물들을 만들어드려요. 각 서비스가 실제로 어떻게 생긴 화면인지 \'미리보기\'로 직접 확인해보세요.'
      : 'Here\'s what gets built. Use the live preview in each section to see exactly what the result looks like.',
    preview:  lang === 'ko' ? '미리보기' : 'Preview',
    previewDesc: lang === 'ko'
      ? '아래 화면은 실제로 코드로 만든 데모입니다 — 결과물 톤을 가늠하는 용도예요.'
      : 'The screen below is a real coded demo — to give you a feel for the final result.',
    included: lang === 'ko' ? '포함 사항' : 'What\'s included',
    techUsed: lang === 'ko' ? '사용 기술' : 'Tech stack',
    timeline: lang === 'ko' ? '예상 기간' : 'Timeline',
    idealFor: lang === 'ko' ? '이런 분께 좋아요' : 'Best for',
    quote:    lang === 'ko' ? '비슷한 거 만들고 싶어요' : 'I want something like this',
    samples:  lang === 'ko' ? '실제 작업 사례' : 'Real client work',
    note:     lang === 'ko'
      ? '* 정확한 견적은 무료 상담에서 범위를 함께 정한 뒤 고정가로 드려요. 디자인 톤, 페이지 수, 연동 범위에 따라 달라집니다.'
      : '* Exact quotes come after a free scoping chat. Final price depends on design tone, page count, and integration scope.',
  };

  return (
    <div className="svc-page">
      {/* === Hero === */}
      <section className="svc-hero">
        <div className="svc-container">
          <motion.span
            className="svc-hero-label"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="svc-hero-dot" />{T.label}
          </motion.span>
          <motion.h1
            className="svc-hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            services
          </motion.h1>
          <motion.p
            className="svc-hero-intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {T.intro}
          </motion.p>
        </div>
      </section>

      {/* === Sticky tab nav === */}
      <div className="svc-tabnav-wrap">
        <div className="svc-container">
          <ul className="svc-tabnav">
            {services.map((s, i) => (
              <li key={s.key}>
                <a
                  href={`#svc-${s.key}`}
                  className={`svc-tab ${activeKey === s.key ? 'svc-tab--active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById(`svc-${s.key}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    setActiveKey(s.key);
                  }}
                >
                  <span className="svc-tab-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="svc-tab-label">{lang === 'ko' ? s.titleKo : s.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* === Detail sections === */}
      <div className="svc-sections">
        {services.map((s, i) => (
          <motion.section
            key={s.key}
            id={`svc-${s.key}`}
            className="svc-detail"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="svc-container">
              <div className="svc-detail-head">
                <div className="svc-detail-num">{String(i + 1).padStart(2, '0')} <span>/ {String(services.length).padStart(2, '0')}</span></div>
                <h2 className="svc-detail-title">
                  {lang === 'ko' ? s.titleKo : s.title}
                </h2>
                <p className="svc-detail-eyebrow">{s.title}</p>
                <p className="svc-detail-tagline">{s.tagline}</p>
                <p className="svc-detail-desc">{s.desc}</p>
              </div>

              {/* Live demo preview — coded mockup */}
              <div className="svc-demo-wrap">
                <div className="svc-demo-label">
                  <HiEye /> {T.preview}
                  <span className="svc-demo-label-hint">— {T.previewDesc}</span>
                </div>
                <div className="svc-demo-frame">
                  <ServiceDemo serviceKey={s.key} />
                </div>
              </div>

              <div className="svc-detail-grid">
                {/* Left: features list */}
                <div className="svc-detail-features">
                  <h3 className="svc-detail-h3">
                    <HiCheck className="svc-detail-h3-icon" /> {T.included}
                  </h3>
                  <ul className="svc-feature-list">
                    {s.features.map((f, fi) => (
                      <li key={fi} className="svc-feature-item">
                        <span className="svc-feature-bullet" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right: meta info (no price) */}
                <aside className="svc-detail-meta">
                  <div className="svc-meta-block">
                    <h4 className="svc-meta-label"><HiClock /> {T.timeline}</h4>
                    <div className="svc-meta-value">{s.timeline}</div>
                  </div>

                  <div className="svc-meta-block">
                    <h4 className="svc-meta-label"><HiSparkles /> {T.techUsed}</h4>
                    <ul className="svc-meta-tags">
                      {s.tech.map((tg, ti) => (
                        <li key={ti} className="svc-meta-tag">{tg}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="svc-meta-block">
                    <h4 className="svc-meta-label">{T.idealFor}</h4>
                    <div className="svc-meta-text">{s.ideal}</div>
                  </div>

                  <div className="svc-meta-actions">
                    <Link to="/contact" className="svc-meta-btn svc-meta-btn--primary">
                      {T.quote} <HiArrowRight />
                    </Link>
                    <Link to={`/portfolio?category=${s.key}`} className="svc-meta-btn svc-meta-btn--ghost">
                      {T.samples}
                    </Link>
                  </div>
                </aside>
              </div>
            </div>
          </motion.section>
        ))}
      </div>

      <p className="svc-footnote">{T.note}</p>
    </div>
  );
}

export default Services;
