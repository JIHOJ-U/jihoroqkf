import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { HiArrowRight, HiCode } from 'react-icons/hi';
import { getPortfolios, getImageUrl } from '../api';
import Marquee from '../components/Marquee';
import DeviceShowcase from '../components/DeviceShowcase';
import ProcessSection from '../components/ProcessSection';
import TestimonialsMarquee from '../components/TestimonialsMarquee';
import FaqSection from '../components/FaqSection';
import TrustSection from '../components/TrustSection';
import MetricsStrip from '../components/MetricsStrip';
import AvailabilityBadge from '../components/AvailabilityBadge';
import BlurImage from '../components/BlurImage';
import useSpotlight from '../hooks/useSpotlight';
import RevealImage from '../components/RevealImage';
import InquiryCTA from '../components/InquiryCTA';
import PricingTiers from '../components/PricingTiers';
import { useLanguage } from '../contexts/LanguageContext';
import './Home.css';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }
  })
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1, scale: 1,
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

function Home() {
  const { t, lang } = useLanguage();
  const [portfolios, setPortfolios] = useState([]);
  const [activeTabKey, setActiveTabKey] = useState('profile');
  const onSpot = useSpotlight();
  const prefersReducedMotion = useReducedMotion();
  const heroCard = t.hero.heroCard;
  const activeFile = heroCard.files.find((f) => f.key === activeTabKey) || heroCard.files[0];

  // Open the CommandPalette by dispatching the same shortcut it listens for.
  // CommandPalette handler: (e.metaKey || e.ctrlKey) && e.key === 'k' → toggles open.
  const openPalette = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }));
  };

  useEffect(() => {
    getPortfolios().then(res => setPortfolios(res.data.slice(0, 6))).catch(() => {});
  }, []);

  const techLogos = ['React', 'Node.js', 'TypeScript', 'Next.js', 'Python', 'Flutter'];

  // Lightweight syntax highlighter for the editor card lines.
  // Splits each line into (head, trailing //comment) then tokenizes the head into
  // strings ("..."), TS keywords, identifiers used as property keys, and punctuation.
  const KEYWORDS = new Set(['export', 'const', 'let', 'var', 'function', 'return', 'import', 'from', 'as', 'true', 'false', 'null']);
  const renderTokens = (code) => {
    if (!code) return null;
    const commentIdx = code.indexOf('//');
    const head = commentIdx >= 0 ? code.slice(0, commentIdx) : code;
    const tail = commentIdx >= 0 ? code.slice(commentIdx) : '';
    const out = [];
    let buf = '';
    const flushPunct = (key) => {
      if (buf) { out.push(<span key={`p${key}`} className="tok-punct">{buf}</span>); buf = ''; }
    };
    let i = 0;
    while (i < head.length) {
      const ch = head[i];
      if (ch === '"') {
        flushPunct(i);
        const end = head.indexOf('"', i + 1);
        const stop = end === -1 ? head.length : end + 1;
        out.push(<span key={`s${i}`} className="tok-string">{head.slice(i, stop)}</span>);
        i = stop;
        continue;
      }
      if (/[A-Za-z_$]/.test(ch)) {
        flushPunct(i);
        let j = i + 1;
        while (j < head.length && /[A-Za-z0-9_$]/.test(head[j])) j++;
        const word = head.slice(i, j);
        if (KEYWORDS.has(word)) {
          out.push(<span key={`k${i}`} className="tok-keyword">{word}</span>);
        } else if (head[j] === ':') {
          out.push(<span key={`prop${i}`} className="tok-prop">{word}</span>);
        } else {
          out.push(<span key={`id${i}`} className="tok-punct">{word}</span>);
        }
        i = j;
        continue;
      }
      buf += ch;
      i++;
    }
    flushPunct('end');
    if (tail) out.push(<span key="cmt" className="tok-comment">{tail}</span>);
    return out;
  };

  const lineVariants = {
    hidden: { opacity: 0, clipPath: 'inset(0 100% 0 0)' },
    visible: (idx) => ({
      opacity: 1,
      clipPath: 'inset(0 0 0 0)',
      transition: { duration: 0.32, delay: idx * 0.09, ease: [0.25, 0.46, 0.45, 0.94] },
    }),
  };

  const cardFade = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
  };

  return (
    <div className="home">
      {/* Hero - IDE editor card */}
      <section
        className="hero-full"
        aria-label={heroCard.ariaLabel}
      >
        <div className="hero-full__bg" />

        {/* Visually-hidden semantic H1 for SEO / screen readers */}
        <h1 className="sr-only">
          {lang === 'ko'
            ? 'DEVIBE — 프리랜서 풀스택 개발자, 이번 달 1건 접수 가능'
            : 'DEVIBE — Full-Stack Dev Partner, 1 slot this month'}
        </h1>

        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          <AvailabilityBadge variant="chip" />
        </motion.div>

        <motion.figure
          className="hero-card"
          aria-labelledby="hero-card-title"
          variants={cardFade}
          initial="hidden"
          animate="visible"
        >
          <div className="hero-card__bar hero-card__header">
            <div className="hero-card__dots" aria-hidden="true">
              <span className="hero-card__dot hero-card__dot--red" />
              <span className="hero-card__dot hero-card__dot--yellow" />
              <span className="hero-card__dot hero-card__dot--green" />
            </div>
            <figcaption id="hero-card-title" className="hero-card__title">
              {activeFile.name} — {heroCard.headerBar}
            </figcaption>
          </div>

          <aside className="hero-card__sidebar" aria-hidden="true">
            <div className="hero-card__sidebar-label">{heroCard.sidebar.explorerLabel}</div>
            <div className="hero-card__sidebar-project">
              <span className="hero-card__sidebar-chev">▾</span>
              <span>{heroCard.sidebar.projectLabel}</span>
            </div>
            {heroCard.sidebar.folders.map((folder) => (
              <div key={folder.name} className="hero-card__sidebar-folder">
                <div className="hero-card__sidebar-folder-name">
                  <span className="hero-card__sidebar-icon">📁</span>
                  <span>{folder.name}/</span>
                </div>
                {folder.files.map((fileName) => {
                  const matchedFile = heroCard.files.find((f) => f.name === fileName);
                  const clickable = folder.name === 'src' && matchedFile;
                  const isActive = clickable && matchedFile.key === activeTabKey;
                  return (
                    <div
                      key={fileName}
                      className={
                        'hero-card__sidebar-file' +
                        (isActive ? ' hero-card__sidebar-file--active' : '') +
                        (clickable ? '' : ' hero-card__sidebar-file--static')
                      }
                      onClick={clickable ? () => setActiveTabKey(matchedFile.key) : undefined}
                      role={clickable ? 'button' : undefined}
                      tabIndex={clickable ? 0 : undefined}
                      onKeyDown={
                        clickable
                          ? (e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setActiveTabKey(matchedFile.key);
                              }
                            }
                          : undefined
                      }
                    >
                      <span className="hero-card__sidebar-icon">📄</span>
                      <span>{fileName}</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </aside>

          <div className="hero-card__tabs" role="tablist" aria-label="Editor file tabs">
            {heroCard.files.map((file) => {
              const isActive = file.key === activeTabKey;
              return (
                <button
                  key={file.key}
                  role="tab"
                  type="button"
                  aria-selected={isActive}
                  className={'hero-card__tab' + (isActive ? ' hero-card__tab--active' : '')}
                  onClick={() => setActiveTabKey(file.key)}
                >
                  <span className="hero-card__tab-icon" aria-hidden="true">▤</span>
                  <span>{file.name}</span>
                </button>
              );
            })}
          </div>

          <div className="hero-card__body" aria-hidden="true">
            <div className="hero-card__gutter">
              {activeFile.lines.map((_, idx) => (
                <div key={idx} className="hero-card__line-num">{idx + 1}</div>
              ))}
            </div>
            <div className="hero-card__code">
              {activeFile.lines.map((line, idx) => (
                <motion.span
                  key={`${activeFile.key}-${idx}`}
                  className={`hero-card__line hero-card__line--${line.kind}`}
                  custom={idx}
                  variants={lineVariants}
                  initial={prefersReducedMotion ? 'visible' : 'hidden'}
                  animate="visible"
                >
                  {line.kind === 'spacer' || !line.code
                    ? ' '
                    : renderTokens(line.code)}
                  {idx === activeFile.lines.length - 1 && (
                    <span className="hero-card__caret" aria-hidden="true" />
                  )}
                </motion.span>
              ))}
            </div>
          </div>

          <div className="hero-card__statusbar" aria-hidden="true">
            <div className="hero-card__status-left">
              <span className="hero-card__status-item hero-card__status-item--branch">
                <span className="hero-card__status-glyph">⎇</span>
                {heroCard.statusBar.branch}
              </span>
              <span className="hero-card__status-divider" />
              <span className="hero-card__status-item">
                <span className="hero-card__status-dot hero-card__status-dot--err" />
                {heroCard.statusBar.errors}
              </span>
              <span className="hero-card__status-item">
                <span className="hero-card__status-glyph">⚠</span>
                {heroCard.statusBar.warnings}
              </span>
              <span className="hero-card__status-divider" />
              <span className="hero-card__status-item hero-card__status-item--sync">↻</span>
            </div>
            <div className="hero-card__status-right">
              <span className="hero-card__status-item">
                Ln {activeFile.lines.length}, Col 3
              </span>
              <span className="hero-card__status-divider" />
              <button
                type="button"
                className="hero-card__palette-hint"
                onClick={openPalette}
                title={heroCard.statusBar.paletteTooltip}
                aria-label={heroCard.statusBar.paletteTooltip}
              >
                {heroCard.statusBar.paletteHint}
              </button>
              <span className="hero-card__status-divider" />
              <span className="hero-card__status-item hero-card__status-item--lang">
                {activeFile.lang}
              </span>
              <span className="hero-card__status-divider hero-card__status-divider--enc" />
              <span className="hero-card__status-item hero-card__status-item--enc">
                {heroCard.statusBar.encoding}
              </span>
              <span className="hero-card__status-divider" />
              <span className="hero-card__status-item hero-card__status-item--live">
                <span className="hero-card__status-dot hero-card__status-dot--live" />
                {heroCard.statusBar.liveLabel}
              </span>
            </div>
          </div>
        </motion.figure>

        <div className="hero-card__cta hero-ctas">
          <Link
            to="/contact"
            className="hero-cta hero-cta--primary"
            aria-label={lang === 'ko' ? '상담 시작하기 - 문의 페이지로 이동' : 'Start a project - go to contact page'}
          >
            {heroCard.primaryCta}
          </Link>
          <Link to="/portfolio" className="hero-cta hero-cta--secondary">
            {heroCard.secondaryCta}
          </Link>
        </div>

        {/* Circular scroll indicator */}
        <div className="scroll-circle">
          <svg className="scroll-circle__svg" viewBox="0 0 100 100">
            <defs>
              <path id="circlePath" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
            </defs>
            <text className="scroll-circle__text">
              <textPath href="#circlePath">
                SCROLL DOWN - SCROLL DOWN - SCROLL DOWN -&nbsp;
              </textPath>
            </text>
          </svg>
          <div className="scroll-circle__arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </div>
        </div>
      </section>

      {/* Curtain wrapper — content slides UP over the sticky hero */}
      <div className="home-curtain">

      {/* Pricing tiers — Standard / Deluxe / Premium */}
      <PricingTiers />

      {/* Intro Section with image */}
      <section className="intro-section">
        <div className="container-wide">
          <div className="intro-grid">
            <motion.div className="intro-left" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <span className="section-label">{t.intro.label}</span>
              <h2 className="intro-title">
                {t.intro.title.split('\n').map((line, i, arr) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < arr.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </h2>
              <p className="intro-desc">{t.intro.desc}</p>
              <div className="intro-techs">
                {techLogos.map((tech, i) => (
                  <motion.span key={i} className="intro-tech-badge" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.08 }}>
                    {tech}
                  </motion.span>
                ))}
              </div>
            </motion.div>
            <motion.div className="intro-right" variants={scaleIn} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <div className="intro-image-stack">
                <div className="intro-img intro-img--1">
                  <RevealImage
                    src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80"
                    alt="circuit board macro"
                    direction="left"
                  />
                </div>
                <div className="intro-img intro-img--2">
                  <RevealImage
                    src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=80"
                    alt="pcb detail"
                    direction="right"
                    delay={0.15}
                  />
                </div>
                <div className="intro-img-deco" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Device Showcase */}
      <DeviceShowcase />

      {/* Why Full-Stack */}
      <section className="why-section">
        <div className="why-bg-decor" aria-hidden="true">
          <span className="why-symbol why-symbol--1">{'</>'}</span>
          <span className="why-symbol why-symbol--2">{'{ }'}</span>
          <span className="why-symbol why-symbol--3">{'<! -- -->'}</span>
        </div>
        <div className="container-wide">
          <motion.div className="section-header why-header" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="section-label">{t.why.label}</span>
            <h2 className="section-title">{t.why.title}</h2>
            <p className="why-desc">
              {t.why.desc1}<br />
              <strong>{t.why.desc2}</strong>
            </p>
          </motion.div>

          {/* Comparison Table */}
          <motion.div className="compare-table" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <div className="compare-header">
              <div className="compare-cell compare-cell--head" />
              <div className="compare-cell compare-cell--head compare-cell--builder">
                <span className="compare-tag compare-tag--gray">{lang === 'ko' ? '빌더 서비스' : 'Builder Service'}</span>
                <h3>{lang === 'ko' ? '아임웹 / Wix' : "I'mWeb / Wix"}</h3>
              </div>
              <div className="compare-cell compare-cell--head compare-cell--custom">
                <span className="compare-tag compare-tag--brand" translate="no">Dev.Vibe</span>
                <h3>{lang === 'ko' ? '풀스택 개발' : 'Full-Stack Dev'}</h3>
                <span className="compare-recommended">RECOMMENDED</span>
              </div>
            </div>

            {(lang === 'ko' ? [
              { feature: '디자인 자유도', builder: '템플릿 기반, 제한적', custom: '완전한 커스터마이징 가능', win: 'custom' },
              { feature: '월 구독료', builder: '월 25,000원 ~ 50,000원', custom: '도메인/호스팅만 (연 5만원~)', win: 'custom' },
              { feature: '확장성', builder: '플랫폼 종속, 마이그레이션 어려움', custom: '소스코드 소유, 자유로운 확장', win: 'custom' },
              { feature: 'SEO 최적화', builder: '기본 수준, 깊은 제어 불가', custom: 'SSR / 메타 / 스키마 완전 제어', win: 'custom' },
              { feature: '성능 (속도)', builder: '공용 인프라, 무거운 빌더 코드', custom: '최적화된 코드, CDN 직접 설정', win: 'custom' },
              { feature: '복잡한 기능', builder: '플러그인 한계 / 외부 연동 제한', custom: '결제·CRM·API 자유롭게 통합', win: 'custom' },
              { feature: '데이터 소유권', builder: '플랫폼 보관 (이전 어려움)', custom: '본인 DB 완전 소유', win: 'custom' },
              { feature: '초기 제작 속도', builder: '빠름 (드래그앤드롭)', custom: '설계 단계 필요', win: 'builder' },
            ] : [
              { feature: 'Design Freedom', builder: 'Template-based, limited', custom: 'Fully customizable', win: 'custom' },
              { feature: 'Monthly Fee', builder: '$20 ~ $40 / month', custom: 'Domain/hosting only (~$50/yr)', win: 'custom' },
              { feature: 'Scalability', builder: 'Platform-locked, hard to migrate', custom: 'Source-owned, freely extensible', win: 'custom' },
              { feature: 'SEO Control', builder: 'Basic, limited deep control', custom: 'Full SSR / Meta / Schema control', win: 'custom' },
              { feature: 'Performance', builder: 'Shared infra, heavy builder code', custom: 'Optimized code, custom CDN', win: 'custom' },
              { feature: 'Complex Features', builder: 'Plugin limits / 3rd-party blocks', custom: 'Free integration: PG, CRM, API', win: 'custom' },
              { feature: 'Data Ownership', builder: 'Platform-stored (hard to export)', custom: 'You own the database', win: 'custom' },
              { feature: 'Time to Launch', builder: 'Fast (drag-and-drop)', custom: 'Requires design phase', win: 'builder' },
            ]).map((row, i) => (
              <motion.div
                key={i}
                className="compare-row"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
              >
                <div className="compare-cell compare-cell--feature">{row.feature}</div>
                <div className={`compare-cell ${row.win === 'builder' ? 'compare-cell--winner' : ''}`}>
                  <span className={row.win === 'builder' ? 'compare-mark compare-mark--good' : 'compare-mark compare-mark--bad'}>
                    {row.win === 'builder' ? '✓' : '✕'}
                  </span>
                  <span className="compare-text">{row.builder}</span>
                </div>
                <div className={`compare-cell ${row.win === 'custom' ? 'compare-cell--winner' : ''}`}>
                  <span className={row.win === 'custom' ? 'compare-mark compare-mark--good' : 'compare-mark compare-mark--bad'}>
                    {row.win === 'custom' ? '✓' : '✕'}
                  </span>
                  <span className="compare-text">{row.custom}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Benefits Cards */}
          <div className="why-benefits">
            <div className="why-benefits-header">
              <span className="section-label">{t.why.benefitsLabel}</span>
              <h3>{t.why.benefitsTitle}</h3>
            </div>
            <div className="why-cards">
              {(lang === 'ko' ? [
                { num: '01', title: '소스코드 완전 소유', highlight: '플랫폼에서 자유롭게', desc: '제작된 코드를 직접 소유하여, 플랫폼 종속 없이 언제든 이전·운영할 수 있습니다.' },
                { num: '02', title: '무한한 기능 확장', highlight: '필요한 기능 무엇이든', desc: 'PG 결제, CRM, ERP, 자체 API 등 어떤 외부 시스템이든 자유롭게 통합 가능합니다.' },
                { num: '03', title: '운영 비용 절감', highlight: '월 구독료 0원', desc: '도메인·호스팅 비용만 발생하여, 장기 운영 시 빌더 대비 수백만원 이상 절감됩니다.' },
                { num: '04', title: '브랜드 정체성 확립', highlight: '오직 당신만의 사이트', desc: '템플릿 한계 없이 비즈니스에 최적화된 고유한 디자인과 사용자 경험을 구현합니다.' },
              ] : [
                { num: '01', title: 'Full Code Ownership', highlight: 'Free from any platform', desc: 'You own the source code — migrate, run, scale anytime without lock-in.' },
                { num: '02', title: 'Unlimited Extensibility', highlight: 'Any feature, anytime', desc: 'Integrate PG, CRM, ERP, custom APIs — any external system without limits.' },
                { num: '03', title: 'Lower Operating Cost', highlight: 'Zero monthly subscription', desc: 'Only domain & hosting fees — saves millions over years compared to builders.' },
                { num: '04', title: 'True Brand Identity', highlight: 'Uniquely yours', desc: 'No template limits — custom design and UX optimized for your business.' },
              ]).map((c, i) => (
                <motion.div
                  key={i}
                  className="why-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <span className="why-card-num">{c.num}</span>
                  <h4>{c.title}</h4>
                  <span className="why-card-highlight">{c.highlight}</span>
                  <p>{c.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process — how we work */}
      <ProcessSection />

      {/* Dark mini-strip — light→dark→light rhythm + at-a-glance trust signal */}
      <MetricsStrip />

      {/* Testimonials — keep hidden until we have real client quotes */}
      {/* <TestimonialsMarquee /> */}

      {/* Works */}
      <section className="works-section">
        <div className="container-wide">
          <motion.div className="section-header-row" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div>
              <span className="section-label">{t.works.label}</span>
              <h2 className="section-title">{t.works.title}</h2>
            </div>
            <Link to="/portfolio" className="view-all">
              {t.works.viewAll} <HiArrowRight className="view-all-icon" />
            </Link>
          </motion.div>

          {portfolios.length > 0 ? (
            <div className="works-grid">
              {portfolios.map((item, i) => (
                <motion.div key={item.id} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i % 2}>
                  <Link
                    to={`/portfolio/${item.id}`}
                    className="work-card"
                    data-spotlight=""
                    onMouseMove={onSpot}
                  >
                    <div className="work-image">
                      {item.thumbnail ? (
                        <BlurImage
                          src={getImageUrl(item.thumbnail)}
                          alt={item.title}
                          imgClassName={item.thumbnailFit === 'contain' ? 'work-thumb--contain' : ''}
                        />
                      ) : (
                        <div className="work-placeholder"><HiCode /></div>
                      )}
                      <div className="work-dimmed" />
                      <div className="work-tag-box">
                        <span className="work-tag-text">
                          {item.techStack.length > 0 ? item.techStack.join(', ') : item.category}
                        </span>
                      </div>
                    </div>
                    <div className="work-meta">
                      <span className="work-client">{item.client || item.category}</span>
                      <h3 className="work-name">{item.title}</h3>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="works-empty">
              <div className="works-empty-img">
                <img src="https://images.unsplash.com/photo-1597733336794-12d05021d510?w=500&q=80" alt="microchip" />
              </div>
              <h3>{lang === 'ko' ? '아직 등록된 프로젝트가 없습니다' : 'No projects registered yet'}</h3>
              <p>{lang === 'ko' ? '첫 번째 포트폴리오를 등록해보세요.' : 'Add your first portfolio.'}</p>
              <Link to="/portfolio/new" className="btn btn-dark">{lang === 'ko' ? '포트폴리오 등록' : 'Add portfolio'}</Link>
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      <FaqSection />

      {/* Trust / guarantees — reassurance band before final CTA */}
      <TrustSection />

      {/* Marquee 2 */}
      <Marquee text="Dev.Vibe  -  LET'S WORK TOGETHER  -  PROJECT INQUIRY  -  FREE CONSULTATION  -  Dev.Vibe  -  LET'S WORK TOGETHER" speed="slow" noTranslate />

      </div>{/* end .home-curtain */}

      {/* CTA — vertical word slider, full-bleed */}
      <InquiryCTA />
    </div>
  );
}

export default Home;
