import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowRight, HiCode, HiDeviceMobile, HiServer, HiColorSwatch } from 'react-icons/hi';
import { getPortfolios, getImageUrl } from '../api';
import Marquee from '../components/Marquee';
import FloatingParticles from '../components/FloatingParticles';
import InteractiveBalls from '../components/InteractiveBalls';
import Hero3D from '../components/Hero3D';
import DeviceShowcase from '../components/DeviceShowcase';
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

  const serviceIcons = [<HiCode />, <HiDeviceMobile />, <HiServer />, <HiColorSwatch />];
  const services = t.services.list.map((s, i) => ({ ...s, icon: serviceIcons[i] }));

  const techLogos = ['React', 'Node.js', 'TypeScript', 'Next.js', 'Python', 'Flutter'];

  return (
    <div className="home">
      {/* Hero - Full Screen */}
      <section className="hero-full">
        <div className="hero-full__bg" />
        <Hero3D />
        <InteractiveBalls count={18} />

        <div className="hero-full__content">
          <motion.div className="hero-full__text" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }}>
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

      {/* Marquee */}
      <Marquee />

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
                  <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80" alt="circuit board macro" />
                </div>
                <div className="intro-img intro-img--2">
                  <img src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=80" alt="pcb detail" />
                </div>
                <div className="intro-img-deco" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="services-section">
        <div className="services-accent">
          <img src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=900&q=80" alt="" aria-hidden="true" />
        </div>
        <div className="container-wide">
          <motion.div className="section-header" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="section-label">{t.services.label}</span>
            <h2 className="section-title">{t.services.title}</h2>
          </motion.div>
          <div className="services-grid">
            {services.map((service, i) => (
              <motion.div key={i} className="service-card" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}>
                <div className="service-icon-wrap">
                  <div className="service-icon">{service.icon}</div>
                </div>
                <h3 className="service-title-en">{service.title}</h3>
                {service.titleKo && <span className="service-title-ko">{service.titleKo}</span>}
                <p>{service.desc}</p>
                <div className="service-shine" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Device Showcase */}
      <DeviceShowcase />

      {/* Featured Image Banner */}
      <section className="banner-section">
        <motion.div className="banner-inner" variants={scaleIn} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <img src="https://images.unsplash.com/photo-1591488320449-011701bb6704?w=1600&q=80" alt="hardware macro" />
          <div className="banner-overlay">
            <FloatingParticles count={10} colors={['#ffffff', '#c4b5fd', '#a78bfa']} />
            <div className="banner-text">
              <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
                {t.banner.title}
              </motion.h2>
              <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }}>
                {t.banner.desc}
              </motion.p>
            </div>
          </div>
        </motion.div>
      </section>

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
                  <Link to={`/portfolio/${item.id}`} className="work-card">
                    <div className="work-image">
                      {item.thumbnail ? (
                        <img src={getImageUrl(item.thumbnail)} alt={item.title} />
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
              <h3>아직 등록된 프로젝트가 없습니다</h3>
              <p>첫 번째 포트폴리오를 등록해보세요.</p>
              <Link to="/portfolio/new" className="btn btn-dark">포트폴리오 등록</Link>
            </div>
          )}
        </div>
      </section>

      {/* Marquee 2 */}
      <Marquee text="Dev.Vibe  -  LET'S WORK TOGETHER  -  PROJECT INQUIRY  -  FREE CONSULTATION  -  Dev.Vibe  -  LET'S WORK TOGETHER" speed="slow" noTranslate />

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <motion.div className="cta-box" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="cta-bg-image">
              <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1400&q=80" alt="" aria-hidden="true" />
            </div>
            <FloatingParticles count={15} colors={['#6366f1', '#8b5cf6', '#c4b5fd', '#e0e7ff']} />
            <div className="cta-inner">
              <span className="cta-label">LET'S WORK TOGETHER</span>
              <h2>{t.cta.title}</h2>
              <p><strong>{t.cta.desc1}</strong>{t.cta.desc2}</p>
              <Link to="/contact" className="btn btn-dark btn-lg btn-bounce">
                {t.cta.btn} <HiArrowRight />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default Home;
