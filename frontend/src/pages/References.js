import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiSearch, HiInformationCircle, HiViewGrid, HiArrowRight } from 'react-icons/hi';
import { useLanguage } from '../contexts/LanguageContext';
import { REFERENCES, CATEGORIES } from '../data/references';
import useTypewriterPlaceholder from '../hooks/useTypewriterPlaceholder';
import './References.css';

const SEARCH_HINTS = ['홈페이지 제작', '쇼핑몰', 'AI 연동', '관리자 시스템', '예약 시스템', '병원 포털'];
const REVEAL_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#06b6d4', '#10b981', '#f59e0b', '#3b82f6', '#14b8a6'];

function References() {
  const { lang } = useLanguage();
  const [activeCat, setActiveCat] = useState('all');
  const [search, setSearch] = useState('');
  const typedPlaceholder = useTypewriterPlaceholder(SEARCH_HINTS, { prefix: '검색: ' });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const filtered = useMemo(() => {
    const byCat = activeCat === 'all'
      ? REFERENCES
      : REFERENCES.filter(r => r.cat === activeCat);
    const q = search.trim().toLowerCase();
    if (!q) return byCat;
    return byCat.filter(r => {
      const hay = [r.titleKo, r.titleEn, r.subKo, r.descKo, r.descEn].join(' ').toLowerCase();
      return hay.includes(q);
    });
  }, [activeCat, search]);

  const T = {
    label:    'DESIGN REFERENCES',
    title:    lang === 'ko' ? '디자인 예시' : 'Design References',
    sub:      lang === 'ko'
      ? `${REFERENCES.length}개의 산업별 디자인·UX 참고 자료입니다. 카드를 클릭해서 실제 화면을 둘러보세요.`
      : `${REFERENCES.length} industry references. Click any card to walk through the actual UI.`,
    notice:   lang === 'ko'
      ? <>
          <strong>참고 자료 안내</strong><br />
          여기 보이는 화면들은 디자인·UX 참고용 미공개 작업이에요. 실제 기능과 내용은 비공개로 두었습니다.
          마음에 드는 디자인을 선택하셔서 신청해 주시면, 초기 상담 시 이를 참고해서 기획과 디자인 작업이 시작됩니다.
          실제 개발 단계에서는 고객님의 <span className="ref-highlight">브랜드 정체성에 맞춘 최고의 결과물</span>로 보답드릴게요.
        </>
      : <>
          <strong>About these references</strong><br />
          The screens here are design / UX references — real functionality and content are kept private.
          Pick a design you like and reach out — we'll use it as a reference during the initial scoping call.
          The actual product will be tailored to your <span className="ref-highlight">brand identity, end to end</span>.
        </>,
    placeholder: lang === 'ko' ? '디자인 명칭이나 키워드로 검색…' : 'Search by name or keyword...',
    empty:    lang === 'ko' ? '조건에 맞는 디자인이 없습니다' : 'No designs match your filter',
    cta:      lang === 'ko' ? '자세히 보기' : 'View details',
  };

  return (
    <div className="ref-page">
      <div className="ref-container">
        <header className="ref-header">
          <motion.span
            className="ref-label"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="ref-label-dot" /> {T.label}
          </motion.span>
          <motion.h1
            className="ref-title"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {T.title}
          </motion.h1>
          <motion.p
            className="ref-sub"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {T.sub}
          </motion.p>
        </header>

        <motion.div
          className="ref-notice"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          <HiInformationCircle className="ref-notice-icon" />
          <p>{T.notice}</p>
        </motion.div>

        <div className="ref-toolbar">
          <div className="ref-tabs-wrap">
            <ul className="ref-tabs">
              {CATEGORIES.map((c) => {
                const count = c.key === 'all'
                  ? REFERENCES.length
                  : REFERENCES.filter(r => r.cat === c.key).length;
                return (
                  <li key={c.key}>
                    <button
                      type="button"
                      className={`ref-tab ${activeCat === c.key ? 'ref-tab--active' : ''}`}
                      onClick={() => setActiveCat(c.key)}
                    >
                      {c.key === 'all' && <HiViewGrid />}
                      <span>{lang === 'ko' ? c.ko : c.en}</span>
                      {c.key === 'all' && <span className="ref-tab-count">({count})</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="ref-search">
            <HiSearch className="ref-search-icon" />
            <input
              type="text"
              placeholder={lang === 'ko' ? typedPlaceholder : T.placeholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="ref-empty">
            <p>{T.empty}</p>
          </div>
        ) : (
          <ul className="ref-grid">
            {filtered.map((r, i) => {
              const catLabel = CATEGORIES.find(c => c.key === r.cat);
              return (
                <motion.li
                  key={r.slug}
                  className="ref-card"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <Link to={`/references/${r.slug}`} className="ref-card-link">
                    <div className="ref-card-img">
                      <img src={r.img} alt={lang === 'ko' ? r.titleKo : r.titleEn} loading="lazy" />
                      <span className="ref-card-overlay">{T.cta} →</span>
                      {/* color block that covers the image, then slides up to reveal */}
                      <motion.span
                        className="ref-card-curtain"
                        style={{ background: REVEAL_COLORS[i % REVEAL_COLORS.length] }}
                        initial={{ y: '0%' }}
                        whileInView={{ y: '-101%' }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.85, delay: 0.1 + (i % 3) * 0.1, ease: [0.76, 0, 0.24, 1] }}
                      />
                    </div>
                    <div className="ref-card-body">
                      <span className={`ref-card-cat ref-card-cat--${r.cat}`}>
                        {lang === 'ko' ? catLabel?.ko : catLabel?.en}
                      </span>
                      <h3 className="ref-card-title">
                        {lang === 'ko' ? r.titleKo : r.titleEn}
                        {r.subKo && lang === 'ko' && <span className="ref-card-sub"> · {r.subKo}</span>}
                      </h3>
                      <p className="ref-card-desc">{lang === 'ko' ? r.descKo : r.descEn}</p>
                      <span className="ref-card-cta">
                        {T.cta} <HiArrowRight />
                      </span>
                    </div>
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default References;
