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
import BuildLog from '../components/BuildLog';
import { useAchievement, ACHIEVEMENTS } from '../contexts/AchievementContext';
import { useLanguage } from '../contexts/LanguageContext';
import './About.css';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }
  })
};

const PROFILE_IMAGES = ['/jiho.jpg', '/jiho2.jpg'];

const COPY = {
  ko: {
    aboutMe: 'ABOUT ME',
    titlePre: '안녕하세요,', titleAccent: '풀스택 개발자', titlePost: '입니다',
    heroDesc: '사용자 경험을 최우선으로 생각하며, 비즈니스 가치를 극대화하는 개발을 추구합니다. 기획부터 배포까지, 프로젝트의 모든 단계를 함께합니다.',
    stats: [
      { num: '50+', label: '프로젝트' },
      { num: '3+', label: '경력 (년)' },
      { num: '99%', label: '만족도' },
    ],
    addPhoto: '사진 추가', prev: '이전', next: '다음',
    photoAlt: (n) => `프로필 ${n}`, photoDot: (n) => `사진 ${n}`,
    skillsTitle: '기술 스택', skillsDesc: '프론트엔드부터 백엔드, 모바일, DevOps까지 폭넓은 기술력',
    activityTitle: '개발 활동', activityDesc: '실제 개발 활동과 기술 글을 통해 꾸준히 성장하고 있습니다.',
    trophyTitle: '트로피 룸', trophyPre: '사이트를 탐색하며 발견한 이스터에그들. ', trophyPost: ' 달성',
    locked: '잠금 해제하려면 탐색해보세요',
    valuesTitle: '핵심 가치',
    valueDescs: [
      '최신 기술 트렌드를 반영한 최적의 기술 스택을 제안합니다.',
      '일정과 품질을 철저히 관리하며 프로젝트를 완수합니다.',
      '투명한 진행 상황 공유와 적극적인 커뮤니케이션을 합니다.',
    ],
    processTitle: '작업 프로세스', processDesc: '상담부터 배포까지, 검증된 4단계 파이프라인',
    exploreTitle: '명령어로 둘러보세요', exploreDescPre: '직접 입력하거나 칩을 클릭해 Dev.Vibe를 탐색해보세요. ', exploreDescPost: ' 부터 시작.',
    ctaTitle: '함께 일해보실까요?', ctaDesc: '프로젝트에 대해 이야기해주세요. 최적의 솔루션을 제안해드립니다.', ctaBtn: '프로젝트 문의하기',
  },
  en: {
    aboutMe: 'ABOUT ME',
    titlePre: "Hi, I'm a", titleAccent: 'Full-Stack Developer', titlePost: '',
    heroDesc: 'I put user experience first and build to maximize business value. From planning to deployment, I\'m with you at every stage of the project.',
    stats: [
      { num: '50+', label: 'Projects' },
      { num: '3+', label: 'Years exp.' },
      { num: '99%', label: 'Satisfaction' },
    ],
    addPhoto: 'Add photo', prev: 'Previous', next: 'Next',
    photoAlt: (n) => `Profile ${n}`, photoDot: (n) => `Photo ${n}`,
    skillsTitle: 'Tech Stack', skillsDesc: 'Broad expertise from frontend to backend, mobile, and DevOps',
    activityTitle: 'Developer Activity', activityDesc: 'Growing steadily through real development work and technical writing.',
    trophyTitle: 'Trophy Room', trophyPre: 'Easter eggs found while exploring the site. ', trophyPost: ' unlocked',
    locked: 'Keep exploring to unlock',
    valuesTitle: 'Core Values',
    valueDescs: [
      'I propose the optimal tech stack that reflects the latest trends.',
      'I rigorously manage schedule and quality to see projects through.',
      'I share transparent progress and communicate proactively.',
    ],
    processTitle: 'Work Process', processDesc: 'A proven 4-step pipeline from consultation to deployment',
    exploreTitle: 'Explore by command', exploreDescPre: 'Type a command or click a chip to explore Dev.Vibe. Start with ', exploreDescPost: '.',
    ctaTitle: 'Shall we work together?', ctaDesc: 'Tell us about your project and we\'ll propose the best solution.', ctaBtn: 'Start a project inquiry',
  },
};

function About() {
  const { lang } = useLanguage();
  const c = COPY[lang] || COPY.ko;
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
      desc: c.valueDescs[0],
      tags: ['React 18', 'TypeScript', 'Node 20', 'AWS'],
      calibration: 96,
    },
    {
      title: 'COMMITMENT',
      desc: c.valueDescs[1],
      tags: ['On-time', 'CI/CD', 'Code Review', 'QA'],
      calibration: 99,
    },
    {
      title: 'DIALOGUE',
      desc: c.valueDescs[2],
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
              <span className="section-label">{c.aboutMe}</span>
              <h1 className="about-title">
                {c.titlePre}<br /><span className="accent-text">{c.titleAccent}</span>{c.titlePost}
              </h1>
              <p className="about-desc">
                {c.heroDesc}
              </p>
              <div className="about-stats">
                {c.stats.map((s, i) => (
                  <div className="about-stat" key={i}>
                    <span className="about-stat-num">{s.num}</span>
                    <span className="about-stat-label">{s.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div className="about-hero-photo" variants={fadeUp} initial="hidden" animate="visible" custom={2}>
              <div className="photo-frame">
                <div className="photo-slider">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={slideIndex}
                      src={allImages[slideIndex]}
                      alt={c.photoAlt(slideIndex + 1)}
                      className="photo-img"
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                    />
                  </AnimatePresence>

                  {allImages.length > 1 && (
                    <>
                      <button type="button" className="photo-nav photo-nav--prev" onClick={goPrev} aria-label={c.prev}>
                        <HiChevronLeft />
                      </button>
                      <button type="button" className="photo-nav photo-nav--next" onClick={goNext} aria-label={c.next}>
                        <HiChevronRight />
                      </button>

                      <div className="photo-dots">
                        {allImages.map((_, i) => (
                          <button
                            key={i}
                            type="button"
                            className={`photo-dot ${i === slideIndex ? 'active' : ''}`}
                            onClick={() => setSlideIndex(i)}
                            aria-label={c.photoDot(i + 1)}
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
                  <HiUpload /> {c.addPhoto}
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
            <h2 className="section-title">{c.skillsTitle}</h2>
            <p className="section-desc">{c.skillsDesc}</p>
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
            <h2 className="section-title">{c.activityTitle}</h2>
            <p className="section-desc">{c.activityDesc}</p>
          </motion.div>
          <GithubPanel />
          <BlogPanel />
        </div>
      </section>

      {/* Build Log — recent changes feed (CLI-styled) */}
      <BuildLog />

      {/* Achievements */}
      <section className="achievements-section">
        <div className="container">
          <motion.div className="section-header" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="section-label">ACHIEVEMENTS</span>
            <h2 className="section-title">{c.trophyTitle}</h2>
            <p className="section-desc">
              {c.trophyPre}
              <strong style={{ color: '#6366f1' }}>{unlockedCount} / {totalCount}</strong>{c.trophyPost}
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
                  <p>{isUnlocked ? ach.desc[lang] : c.locked}</p>
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
            <h2 className="section-title">{c.valuesTitle}</h2>
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
            <h2 className="section-title">{c.processTitle}</h2>
            <p className="section-desc">{c.processDesc}</p>
          </motion.div>
          <ProcessPipeline />
        </div>
      </section>

      {/* CTA with Interactive Terminal */}
      <section className="about-cta">
        <div className="container">
          <motion.div className="section-header" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="section-label">$ EXPLORE</span>
            <h2 className="section-title">{c.exploreTitle}</h2>
            <p className="section-desc">{c.exploreDescPre}<code>help</code>{c.exploreDescPost}</p>
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <DevTerminal />
          </motion.div>

          <motion.div className="cta-bottom" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h3>{c.ctaTitle}</h3>
            <p>{c.ctaDesc}</p>
            <Link to="/contact" className="btn btn-dark btn-lg">
              {c.ctaBtn} <HiArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default About;
