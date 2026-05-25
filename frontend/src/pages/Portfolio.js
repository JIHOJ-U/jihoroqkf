import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { HiCode, HiPlus, HiSearch, HiArrowRight } from 'react-icons/hi';
import { getPortfolios, getImageUrl } from '../api';
import { useLanguage } from '../contexts/LanguageContext';
import useTypewriterPlaceholder from '../hooks/useTypewriterPlaceholder';
import './Portfolio.css';

const REVEAL_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#06b6d4', '#10b981'];
const PF_SEARCH_HINTS = ['반응형 웹', '쇼핑몰', '모바일 앱', '관리자 대시보드', 'React', 'Node.js'];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const PAGE_SIZE = 9;

function getPreviewDomain(item) {
  const url = item.projectUrl || item.demoUrl;
  if (url) {
    try {
      return new URL(url).hostname.replace(/^www\./, '');
    } catch (e) {
      /* fall through */
    }
  }
  return 'dev.vibe / works';
}

function PortfolioCard({ item, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const color = REVEAL_COLORS[index % REVEAL_COLORS.length];
  const domain = getPreviewDomain(item);

  return (
    <motion.li
      ref={ref}
      className="pf-item"
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (index % 3) * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Link to={`/portfolio/${item.id}`} className="pf-card">
        {/* Browser-chrome mockup frame */}
        <div className="pf-mockup">
          <div className="pf-mockup-bar">
            <span className="pf-mockup-dots" aria-hidden="true"><i /><i /><i /></span>
            <span className="pf-mockup-url">
              <span className="pf-mockup-lock" aria-hidden="true">●</span>
              {domain}
            </span>
            <span className="pf-mockup-spacer" aria-hidden="true" />
          </div>
          <div className="pf-thumb">
            {item.thumbnail ? (
              <img src={getImageUrl(item.thumbnail)} alt={item.title} loading="lazy" />
            ) : (
              <div className="pf-thumb-placeholder"><HiCode /></div>
            )}
            {item.category && <span className="pf-badge">{item.category}</span>}
            {/* Color block that covers image, then slides up to reveal */}
            <motion.div
              className="pf-thumb-curtain"
              style={{ background: color }}
              initial={{ y: '0%' }}
              animate={inView ? { y: '-101%' } : { y: '0%' }}
              transition={{
                duration: 0.9,
                delay: 0.15 + (index % 3) * 0.1,
                ease: [0.76, 0, 0.24, 1],
              }}
            />
          </div>
        </div>
        <h3 className="pf-card-title">{item.title}</h3>
        {item.client && <p className="pf-card-client">{item.client}</p>}
        <ul className="pf-card-tags">
          {(item.techStack && item.techStack.length > 0
            ? item.techStack.slice(0, 3)
            : [item.category]
          ).map((tag, ti) => (
            <li key={ti} className="pf-card-tag">{tag}</li>
          ))}
        </ul>
      </Link>
    </motion.li>
  );
}

function Portfolio() {
  const { lang, t } = useLanguage();
  const location = useLocation();
  const typedPlaceholder = useTypewriterPlaceholder(PF_SEARCH_HINTS, { prefix: '검색: ' });
  const [portfolios, setPortfolios] = useState([]);
  // activeKey: 'ALL' or a service key ('landing', 'mobile', etc.)
  // or a raw data-only category string (for portfolios with categories outside services)
  const [activeKey, setActiveKey] = useState('ALL');
  const [search, setSearch] = useState('');
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPortfolios()
      .then(res => setPortfolios(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Read ?category=... from URL (Footer / Home links use this)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('category');
    setActiveKey(cat ? decodeURIComponent(cat) : 'ALL');
  }, [location.search]);

  const services = t.services?.list || [];

  // Service tabs (key-based) + any extra raw categories found in data
  const tabs = useMemo(() => {
    const serviceKeys = services.map(s => s.key);
    const serviceLabels = services.flatMap(s => [s.titleKo, s.title]).filter(Boolean);
    const extraFromData = Array.from(
      new Set(
        portfolios
          .map(p => p.category)
          .filter(Boolean)
          .filter(c => !serviceLabels.includes(c))
      )
    );
    return [
      { key: 'ALL', label: lang === 'ko' ? '전체' : 'ALL' },
      ...services.map(s => ({ key: s.key, label: lang === 'ko' ? s.titleKo : s.title })),
      ...extraFromData.map(c => ({ key: c, label: c })),
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [services, portfolios, lang]);

  // Build a lookup: key → { titleKo, title } so we can match raw category strings in either language
  const keyToService = useMemo(() => {
    const map = {};
    services.forEach(s => { map[s.key] = s; });
    return map;
  }, [services]);

  const filtered = useMemo(() => {
    let byCat;
    if (activeKey === 'ALL') {
      byCat = portfolios;
    } else if (keyToService[activeKey]) {
      // Service key — match against BOTH Korean and English label so DB stays language-agnostic
      const s = keyToService[activeKey];
      byCat = portfolios.filter(p => p.category === s.titleKo || p.category === s.title);
    } else {
      // Raw category string (legacy or custom)
      byCat = portfolios.filter(p => p.category === activeKey);
    }

    const q = search.trim().toLowerCase();
    if (!q) return byCat;
    return byCat.filter(p => {
      const haystack = [p.title, p.client, p.category, ...(p.techStack || [])].join(' ').toLowerCase();
      return haystack.includes(q);
    });
  }, [portfolios, activeKey, search, keyToService]);

  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [activeKey, search]);

  const shown = filtered.slice(0, visible);
  const hasMore = filtered.length > visible;

  const T = {
    label: lang === 'ko' ? 'PORTFOLIO' : 'PORTFOLIO',
    desc: lang === 'ko'
      ? <>Dev.Vibe가 함께 합니다.<br />지금까지 진행한 프로젝트를 카테고리별로 확인해보세요.</>
      : <>We craft together.<br />Browse projects by category to see what we've built.</>,
    placeholder: lang === 'ko' ? '검색어를 입력하세요' : 'Search projects...',
    viewMore: lang === 'ko' ? 'VIEW MORE' : 'VIEW MORE',
    empty: lang === 'ko' ? '조건에 맞는 프로젝트가 없습니다' : 'No projects match your filter',
    add: lang === 'ko' ? '등록' : 'Add',
  };

  return (
    <div className="pf-page">
      <div className="pf-container">
        {/* Hero header */}
        <header className="pf-header">
          <motion.h1
            className="pf-title"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            portfolio
          </motion.h1>
          <motion.p
            className="pf-desc"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            {T.desc}
          </motion.p>
        </header>

        {/* Search */}
        <motion.div
          className="pf-search-wrap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <input
            type="text"
            className="pf-search-input"
            placeholder={lang === 'ko' ? typedPlaceholder : T.placeholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <HiSearch className="pf-search-icon" />
        </motion.div>

        {/* Category tabs */}
        <motion.div
          className="pf-tabs-scroll"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <ul className="pf-tabs">
            {tabs.map((tab) => (
              <li key={tab.key}>
                <button
                  type="button"
                  className={`pf-tab ${activeKey === tab.key ? 'pf-tab--active' : ''}`}
                  onClick={() => setActiveKey(tab.key)}
                >
                  {tab.label}
                </button>
              </li>
            ))}
            <li className="pf-tabs-spacer" />
            <li>
              <Link to="/portfolio/new" className="pf-tab pf-tab--add">
                <HiPlus /> {T.add}
              </Link>
            </li>
          </ul>
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div className="pf-grid">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="pf-skel">
                <div className="pf-skel-img" />
                <div className="pf-skel-line" />
                <div className="pf-skel-line pf-skel-line--short" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="pf-empty">
            <HiCode className="pf-empty-icon" />
            <h3>{T.empty}</h3>
          </div>
        ) : (
          <ul className="pf-grid">
            {shown.map((item, i) => (
              <PortfolioCard key={item.id} item={item} index={i} />
            ))}
          </ul>
        )}

        {/* View more */}
        {hasMore && (
          <div className="pf-more-wrap">
            <button
              type="button"
              className="pf-more-btn"
              onClick={() => setVisible(v => v + PAGE_SIZE)}
            >
              {T.viewMore}
              <span className="pf-more-arrow"><HiArrowRight /></span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Portfolio;
