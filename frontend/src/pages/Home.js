import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowRight, HiCode } from 'react-icons/hi';
import { getPortfolios, getImageUrl } from '../api';
import Marquee from '../components/Marquee';
import FloatingParticles from '../components/FloatingParticles';
import CodeRainTerminal from '../components/CodeRainTerminal';
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
  const rollingWords = t.hero.rolling;
  const [portfolios, setPortfolios] = useState([]);
  const [rollingIndex, setRollingIndex] = useState(0);
  const onSpot = useSpotlight();

  useEffect(() => {
    getPortfolios().then(res => setPortfolios(res.data.slice(0, 6))).catch(() => {});
  }, []);

  useEffect(() => {
    setRollingIndex(0);
  }, [lang]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRollingIndex(prev => (prev + 1) % rollingWords.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [rollingWords.length]);

  const techLogos = ['React', 'Node.js', 'TypeScript', 'Next.js', 'Python', 'Flutter'];

  return (
    <div className="home">
      {/* Hero - Full Screen */}
      <section className="hero-full">
        <div className="hero-full__bg" />
        <CodeRainTerminal />

        <div className="hero-full__content">
          <motion.div className="hero-full__text" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }}>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{ marginBottom: 24 }}
            >
              <AvailabilityBadge variant="chip" />
            </motion.div>
            <h1 className="hero-full__title">
              <span translate="no">Dev.Vibe</span>
              <div className="hero-roller">
                <div className="hero-roller__track" style={{ transform: `translateY(-${rollingIndex * 100}%)` }}>
                  {rollingWords.map((word, i) => (
                    <span key={i} className="hero-roller__word">{word}</span>
                  ))}
                </div>
              </div>
              {t.hero.tagline}
            </h1>
          </motion.div>

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

          {/* CTA Button removed */}
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
