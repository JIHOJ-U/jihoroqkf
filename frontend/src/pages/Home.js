import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowRight, HiCode, HiDeviceMobile, HiServer, HiColorSwatch } from 'react-icons/hi';
import { getPortfolios, getImageUrl } from '../api';
import Marquee from '../components/Marquee';
import FloatingParticles from '../components/FloatingParticles';
import InteractiveBalls from '../components/InteractiveBalls';
import DeviceShowcase from '../components/DeviceShowcase';
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

const rollingWords = [
  'believes creativity is always the answer',
  'builds digital solutions for your business',
  'takes development seriously',
  'turns ideas into reality',
];

function Home() {
  const [portfolios, setPortfolios] = useState([]);
  const [rollingIndex, setRollingIndex] = useState(0);

  useEffect(() => {
    getPortfolios().then(res => setPortfolios(res.data.slice(0, 6))).catch(() => {});
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setRollingIndex(prev => (prev + 1) % rollingWords.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const services = [
    { icon: <HiCode />, title: 'Web Development', desc: 'React, Next.js 등 최신 프레임워크를 활용한 반응형 웹 개발' },
    { icon: <HiDeviceMobile />, title: 'App Development', desc: 'React Native, Flutter 기반 크로스 플랫폼 모바일 앱 개발' },
    { icon: <HiServer />, title: 'Backend / API', desc: 'Node.js, Python 기반의 안정적인 서버 및 RESTful API 구축' },
    { icon: <HiColorSwatch />, title: 'UI/UX Design', desc: '사용자 중심의 직관적이고 세련된 인터페이스 설계' },
  ];

  const techLogos = [
    'React', 'Node.js', 'TypeScript', 'Next.js', 'Python', 'Flutter'
  ];

  return (
    <div className="home">
      {/* Hero - Full Screen */}
      <section className="hero-full">
        <div className="hero-full__bg" />
        <InteractiveBalls count={18} />

        <div className="hero-full__content">
          <motion.div className="hero-full__text" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }}>
            <h1 className="hero-full__title">
              Dev.Vibe
              <div className="hero-roller">
                <div className="hero-roller__track" style={{ transform: `translateY(-${rollingIndex * 100}%)` }}>
                  {rollingWords.map((word, i) => (
                    <span key={i} className="hero-roller__word">{word}</span>
                  ))}
                </div>
              </div>
              Go, For it
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
              <span className="section-label">WHO WE ARE</span>
              <h2 className="intro-title">아이디어를 현실로<br />만드는 개발 파트너</h2>
              <p className="intro-desc">
                기획부터 디자인, 개발, 배포까지 비즈니스 성장을 위한 디지털 솔루션을 원스톱으로 제공합니다.
                최신 기술 스택과 풍부한 경험을 바탕으로 높은 품질의 결과물을 합리적인 비용에 만나보세요.
              </p>
              <div className="intro-techs">
                {techLogos.map((t, i) => (
                  <motion.span key={i} className="intro-tech-badge" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.08 }}>
                    {t}
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
            <span className="section-label">SERVICES</span>
            <h2 className="section-title">제공 서비스</h2>
          </motion.div>
          <div className="services-grid">
            {services.map((service, i) => (
              <motion.div key={i} className="service-card" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}>
                <div className="service-icon-wrap">
                  <div className="service-icon">{service.icon}</div>
                </div>
                <h3>{service.title}</h3>
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
                Code with Passion
              </motion.h2>
              <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }}>
                최고의 기술로 최고의 결과물을 만듭니다
              </motion.p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Works */}
      <section className="works-section">
        <div className="container-wide">
          <motion.div className="section-header-row" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div>
              <span className="section-label">WORKS</span>
              <h2 className="section-title">최근 프로젝트</h2>
            </div>
            <Link to="/portfolio" className="view-all">
              View all <HiArrowRight className="view-all-icon" />
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
      <Marquee text="Dev.Vibe  -  LET'S WORK TOGETHER  -  PROJECT INQUIRY  -  FREE CONSULTATION  -  Dev.Vibe  -  LET'S WORK TOGETHER" speed="slow" />

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
              <h2>프로젝트를 시작할 준비가 되셨나요?</h2>
              <p>무료 상담을 통해 프로젝트 범위와 예산을 함께 논의해보세요.</p>
              <Link to="/contact" className="btn btn-dark btn-lg btn-bounce">
                무료 상담 신청 <HiArrowRight />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default Home;
