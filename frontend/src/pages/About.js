import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiArrowRight, HiUpload } from 'react-icons/hi';
import { FaReact, FaNodeJs, FaPython, FaDocker, FaAws, FaFigma, FaVuejs, FaGitAlt, FaHtml5, FaCss3Alt, FaJava, FaNpm } from 'react-icons/fa';
import { SiTypescript, SiNextdotjs, SiMongodb, SiPostgresql, SiFlutter, SiTailwindcss, SiRedis, SiGraphql, SiFirebase, SiVercel, SiJavascript, SiMysql, SiSwift, SiKotlin, SiGo } from 'react-icons/si';
import FloatingParticles from '../components/FloatingParticles';
import BallPitGame from '../components/BallPitGame';
import './About.css';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }
  })
};

function About() {
  const [profileImage, setProfileImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setProfileImage(event.target.result);
      reader.readAsDataURL(file);
    }
  };

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
    { emoji: '01', title: '전문성', desc: '최신 기술 트렌드를 반영한 최적의 기술 스택을 제안합니다.' },
    { emoji: '02', title: '책임감', desc: '일정과 품질을 철저히 관리하며 프로젝트를 완수합니다.' },
    { emoji: '03', title: '소통', desc: '투명한 진행 상황 공유와 적극적인 커뮤니케이션을 합니다.' },
  ];

  const process = [
    { num: '01', title: '상담 & 기획', desc: '프로젝트 목표와 요구사항을 분석하고 최적의 솔루션을 제안합니다.' },
    { num: '02', title: '설계 & 디자인', desc: 'UI/UX 와이어프레임과 프로토타입을 제작하여 시각적 방향을 확정합니다.' },
    { num: '03', title: '개발', desc: '최신 기술 스택으로 안정적이고 확장 가능한 코드를 작성합니다.' },
    { num: '04', title: '테스트 & 배포', desc: '철저한 QA 테스트 후 서비스를 배포하고 유지보수를 지원합니다.' },
  ];

  return (
    <div className="about-page">
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
                {profileImage ? (
                  <img src={profileImage} alt="프로필" className="photo-img" />
                ) : (
                  <div className="photo-placeholder">
                    <label className="photo-upload-label">
                      <HiUpload className="photo-upload-icon" />
                      <span>프로필 사진 등록</span>
                      <span className="photo-upload-hint">클릭하여 업로드</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
                    </label>
                  </div>
                )}
                {profileImage && (
                  <label className="photo-change">
                    사진 변경
                    <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
                  </label>
                )}
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
            <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80" alt="code" />
            <div className="about-banner-overlay">
              <span>Clean Code</span>
            </div>
          </motion.div>
          <motion.div className="about-banner-item" initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
            <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80" alt="workspace" />
            <div className="about-banner-overlay">
              <span>Dev Setup</span>
            </div>
          </motion.div>
          <motion.div className="about-banner-item" initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
            <img src="https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=600&q=80" alt="monitor code" />
            <div className="about-banner-overlay">
              <span>Build & Deploy</span>
            </div>
          </motion.div>
          <motion.div className="about-banner-item" initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }}>
            <img src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80" alt="programming" />
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

      {/* Values */}
      <section className="values-section">
        <div className="container">
          <motion.div className="section-header" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="section-label">VALUES</span>
            <h2 className="section-title">핵심 가치</h2>
          </motion.div>
          <div className="values-grid">
            {values.map((val, i) => (
              <motion.div key={i} className="value-card" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}>
                <span className="value-num">{val.emoji}</span>
                <h3>{val.title}</h3>
                <p>{val.desc}</p>
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
          </motion.div>
          <div className="about-process-grid">
            {process.map((item, i) => (
              <motion.div key={i} className="about-process-card" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}>
                <span className="about-process-num">{item.num}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA with Ball Pit Game */}
      <section className="about-cta">
        <div className="container">
          <motion.div className="section-header" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="section-label">LET'S PLAY</span>
            <h2 className="section-title">공을 구멍에 넣어보세요!</h2>
            <p className="section-desc">마우스로 공을 밀어서 구멍에 넣어보세요. 클릭하면 더 세게!</p>
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="game-wrapper">
              <BallPitGame height={380} />
            </div>
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
