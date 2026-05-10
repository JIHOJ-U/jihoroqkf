import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiArrowRight, HiUpload, HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { FaReact, FaNodeJs, FaPython, FaDocker, FaAws, FaFigma, FaVuejs, FaGitAlt, FaHtml5, FaCss3Alt, FaJava, FaNpm } from 'react-icons/fa';
import { SiTypescript, SiNextdotjs, SiMongodb, SiPostgresql, SiFlutter, SiTailwindcss, SiRedis, SiGraphql, SiFirebase, SiVercel, SiJavascript, SiMysql, SiSwift, SiKotlin, SiGo } from 'react-icons/si';
import FloatingParticles from '../components/FloatingParticles';
import ValueChip from '../components/ValueChip';
import ProcessPipeline from '../components/ProcessPipeline';
import DevTerminal from '../components/DevTerminal';
import GithubPanel from '../components/GithubPanel';
import BlogPanel from '../components/BlogPanel';
import { useAchievement, ACHIEVEMENTS } from '../contexts/AchievementContext';
import './About.css';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }
  })
};

const PROFILE_IMAGES = ['/jiho.jpg', '/jiho2.jpg'];

function About() {
  const [extraImages, setExtraImages] = useState([]);
  const [slideIndex, setSlideIndex] = useState(0);
  const { unlocked, totalCount, unlockedCount } = useAchievement();

  const allImages = [...PROFILE_IMAGES, ...extraImages];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setExtraImages(prev => [...prev, event.target.result]);
      reader.readAsDataURL(file);
    }
  };

  // Auto slide every 4s
  useEffect(() => {
    if (allImages.length <= 1) return;
    const timer = setInterval(() => {
      setSlideIndex(i => (i + 1) % allImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [allImages.length]);

  const goPrev = () => setSlideIndex(i => (i - 1 + allImages.length) % allImages.length);
  const goNext = () => setSlideIndex(i => (i + 1) % allImages.length);

  const skills = [
    { icon: <SiJavascript />, name: 'JavaScript', color: '#F7DF1E' },
    { icon: <SiTypescript />, name: 'TypeScript', color: '#3178C6' },
    { icon: <FaReact />, name: 'React', color: '#61DAFB' },
    { icon: <SiNextdotjs />, name: 'Next.js', color: '#000000' },
    { icon: <FaVuejs />, name: 'Vue.js', color: '#4FC08D' },
    { icon: <FaHtml5 />, name: 'HTML5', color: '#E34F26' },
    { icon: <FaCss3Alt />, name: 'CSS3', color: '#1572B6' },
    { icon: <SiTailwindcss />, name: 'Tailwind', color: '#06B6D4' },
    { icon: <FaNodeJs />, name: 'Node.js', color: '#339933' },
    { icon: <FaPython />, name: 'Python', color: '#3776AB' },
    { icon: <FaJava />, name: 'Java', color: '#ED8B00' },
    { icon: <SiGo />, name: 'Go', color: '#00ADD8' },
    { icon: <SiSwift />, name: 'Swift', color: '#FA7343' },
    { icon: <SiKotlin />, name: 'Kotlin', color: '#7F52FF' },
    { icon: <SiFlutter />, name: 'Flutter', color: '#02569B' },
    { icon: <SiMongodb />, name: 'MongoDB', color: '#47A248' },
    { icon: <SiPostgresql />, name: 'PostgreSQL', color: '#4169E1' },
    { icon: <SiMysql />, name: 'MySQL', color: '#4479A1' },
    { icon: <SiRedis />, name: 'Redis', color: '#DC382D' },
    { icon: <SiGraphql />, name: 'GraphQL', color: '#E10098' },
    { icon: <SiFirebase />, name: 'Firebase', color: '#FFCA28' },
    { icon: <FaDocker />, name: 'Docker', color: '#2496ED' },
    { icon: <FaAws />, name: 'AWS', color: '#FF9900' },
    { icon: <SiVercel />, name: 'Vercel', color: '#000000' },
    { icon: <FaGitAlt />, name: 'Git', color: '#F05032' },
    { icon: <FaNpm />, name: 'npm', color: '#CB3837' },
    { icon: <FaFigma />, name: 'Figma', color: '#F24E1E' },
  ];

  const values = [
    {
      title: 'EXPERTISE',
      desc: '최신 기술 트렌드를 반영한 최적의 기술 스택을 제안합니다.',
      tags: ['React 18', 'TypeScript', 'Node 20', 'AWS'],
      calibration: 96,
    },
    {
      title: 'COMMITMENT',
      desc: '일정과 품질을 철저히 관리하며 프로젝트를 완수합니다.',
      tags: ['On-time', 'CI/CD', 'Code Review', 'QA'],
      calibration: 99,
    },
    {
      title: 'DIALOGUE',
      desc: '투명한 진행 상황 공유와 적극적인 커뮤니케이션을 합니다.',
      tags: ['Slack', 'Notion', 'Stand-up', 'Async'],
      calibration: 94,
    },
  ];


  return (
    <div className="about-page">
      {/* Background symbols */}
      <div className="about-bg-symbols" aria-hidden="true">
        <span className="code-symbol">{'</>'}</span>
        <span className="code-symbol">{'{ }'}</span>
        <span className="code-symbol">{'=>'}</span>
        <span className="code-symbol">{'[ ]'}</span>
        <span className="code-symbol">{'< />'}</span>
        <span className="code-symbol">{'( )'}</span>
      </div>

      {/* Hero with photo */}
      <section className="about-hero">
        <div className="container">
          <div className="about-hero-grid">
            <motion.div className="about-hero-text" variants={fadeUp} initial="hidden" animate="visible" custom={0}>
              <span className="section-label">ABOUT ME</span>
              <h1 className="about-title">
                안녕하세요,<br /><span className="accent-text">풀스택 개발자</span>입니다
              </h1>
              <p className="about-desc">
                사용자 경험을 최우선으로 생각하며, 비즈니스 가치를 극대화하는
                개발을 추구합니다. 기획부터 배포까지, 프로젝트의 모든 단계를 함께합니다.
              </p>
              <div className="about-stats">
                <div className="about-stat">
                  <span className="about-stat-num">50+</span>
                  <span className="about-stat-label">프로젝트</span>
                </div>
                <div className="about-stat">
                  <span className="about-stat-num">3+</span>
                  <span className="about-stat-label">경력 (년)</span>
                </div>
                <div className="about-stat">
                  <span className="about-stat-num">99%</span>
                  <span className="about-stat-label">만족도</span>
                </div>
              </div>
            </motion.div>

            <motion.div className="about-hero-photo" variants={fadeUp} initial="hidden" animate="visible" custom={2}>
              <div className="photo-frame">
                <div className="photo-slider">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={slideIndex}
                      src={allImages[slideIndex]}
                      alt={`프로필 ${slideIndex + 1}`}
                      className="photo-img"
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                    />
                  </AnimatePresence>

                  {allImages.length > 1 && (
                    <>
                      <button type="button" className="photo-nav photo-nav--prev" onClick={goPrev} aria-label="이전">
                        <HiChevronLeft />
                      </button>
                      <button type="button" className="photo-nav photo-nav--next" onClick={goNext} aria-label="다음">
                        <HiChevronRight />
                      </button>

                      <div className="photo-dots">
                        {allImages.map((_, i) => (
                          <button
                            key={i}
                            type="button"
                            className={`photo-dot ${i === slideIndex ? 'active' : ''}`}
                            onClick={() => setSlideIndex(i)}
                            aria-label={`사진 ${i + 1}`}
                          />
                        ))}
                      </div>

                      <div className="photo-counter">
                        {String(slideIndex + 1).padStart(2, '0')} / {String(allImages.length).padStart(2, '0')}
                      </div>
                    </>
                  )}
                </div>

                <label className="photo-change">
                  <HiUpload /> 사진 추가
                  <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
                </label>

                <div className="photo-deco photo-deco--1" />
                <div className="photo-deco photo-deco--2" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Dev Image Banner */}
      <section className="about-banner">
        <div className="about-banner-grid">
          <motion.div className="about-banner-item" initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <img src="https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=700&q=80" alt="circuit traces" />
            <div className="about-banner-overlay">
              <span>Clean Code</span>
            </div>
          </motion.div>
          <motion.div className="about-banner-item" initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
            <img src="https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=700&q=80" alt="hardware components" />
            <div className="about-banner-overlay">
              <span>Dev Setup</span>
            </div>
          </motion.div>
          <motion.div className="about-banner-item" initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
            <img src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=700&q=80" alt="motherboard chipset" />
            <div className="about-banner-overlay">
              <span>Build & Deploy</span>
            </div>
          </motion.div>
          <motion.div className="about-banner-item" initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }}>
            <img src="https://images.unsplash.com/photo-1563770660941-20978e870e26?w=700&q=80" alt="ram memory module" />
            <div className="about-banner-overlay">
              <span>Problem Solving</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Skills with brand colors - FULL */}
      <section className="skills-section">
        <div className="container">
          <motion.div className="section-header" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="section-label">TECH STACK</span>
            <h2 className="section-title">기술 스택</h2>
            <p className="section-desc">프론트엔드부터 백엔드, 모바일, DevOps까지 폭넓은 기술력</p>
          </motion.div>
          <div className="skills-grid">
            {skills.map((skill, i) => (
              <motion.div key={i} className="skill-item" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.2}>
                <div className="skill-icon" style={{ color: skill.color }}>
                  {skill.icon}
                </div>
                <span className="skill-name">{skill.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* GitHub & Blog */}
      <section className="github-blog-section">
        <div className="container">
          <motion.div className="section-header" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="section-label">DEVELOPER ACTIVITY</span>
            <h2 className="section-title">개발 활동</h2>
            <p className="section-desc">실제 개발 활동과 기술 글을 통해 꾸준히 성장하고 있습니다.</p>
          </motion.div>
          <GithubPanel />
          <BlogPanel />
        </div>
      </section>

      {/* Achievements */}
      <section className="achievements-section">
        <div className="container">
          <motion.div className="section-header" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="section-label">ACHIEVEMENTS</span>
            <h2 className="section-title">트로피 룸</h2>
            <p className="section-desc">
              사이트를 탐색하며 발견한 이스터에그들. {' '}
              <strong style={{ color: '#6366f1' }}>{unlockedCount} / {totalCount}</strong> 달성
            </p>
          </motion.div>
          <div className="achievements-grid">
            {Object.values(ACHIEVEMENTS).map((ach, i) => {
              const isUnlocked = !!unlocked[ach.id];
              return (
                <motion.div
                  key={ach.id}
                  className={`ach-card ${isUnlocked ? 'ach-card--unlocked' : 'ach-card--locked'}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                >
                  <div className="ach-card-icon">{isUnlocked ? ach.icon : '🔒'}</div>
                  <strong>{isUnlocked ? ach.title : '???'}</strong>
                  <p>{isUnlocked ? ach.desc : '잠금 해제하려면 탐색해보세요'}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="values-section">
        <div className="container">
          <motion.div className="section-header" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="section-label">VALUES</span>
            <h2 className="section-title">핵심 가치</h2>
          </motion.div>
          <div className="values-grid">
            {values.map((val, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}>
                <ValueChip index={i} {...val} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="about-process-section">
        <div className="container">
          <motion.div className="section-header" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="section-label">PROCESS</span>
            <h2 className="section-title">작업 프로세스</h2>
            <p className="section-desc">상담부터 배포까지, 검증된 4단계 파이프라인</p>
          </motion.div>
          <ProcessPipeline />
        </div>
      </section>

      {/* CTA with Interactive Terminal */}
      <section className="about-cta">
        <div className="container">
          <motion.div className="section-header" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="section-label">$ EXPLORE</span>
            <h2 className="section-title">명령어로 둘러보세요</h2>
            <p className="section-desc">직접 입력하거나 칩을 클릭해 Dev.Vibe를 탐색해보세요. <code>help</code> 부터 시작.</p>
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <DevTerminal />
          </motion.div>

          <motion.div className="cta-bottom" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h3>함께 일해보실까요?</h3>
            <p>프로젝트에 대해 이야기해주세요. 최적의 솔루션을 제안해드립니다.</p>
            <Link to="/contact" className="btn btn-dark btn-lg">
              프로젝트 문의하기 <HiArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default About;
