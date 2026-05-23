import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './ProcessPipeline.css';

const STAGES_BY_LANG = {
  ko: [
    {
      code: 'CONSULT',
      num: '01',
      title: '상담 & 기획',
      desc: '프로젝트 목표와 요구사항을 분석하고 최적의 솔루션을 제안합니다.',
      duration: '~ 2d',
      tasks: ['요구사항 분석', '범위 산정', '일정 / 견적'],
    },
    {
      code: 'DESIGN',
      num: '02',
      title: '설계 & 디자인',
      desc: 'UI/UX 와이어프레임과 프로토타입으로 시각적 방향을 확정합니다.',
      duration: '~ 4d',
      tasks: ['와이어프레임', '프로토타입', '디자인 컨펌'],
    },
    {
      code: 'BUILD',
      num: '03',
      title: '개발',
      desc: '최신 기술 스택으로 안정적이고 확장 가능한 코드를 작성합니다.',
      duration: '~ 14d',
      tasks: ['프론트 / 백엔드', '코드 리뷰', '테스트 자동화'],
    },
    {
      code: 'DEPLOY',
      num: '04',
      title: '테스트 & 배포',
      desc: '철저한 QA 테스트 후 서비스를 배포하고 유지보수를 지원합니다.',
      duration: '~ 2d',
      tasks: ['QA 테스트', '운영 배포', '인수인계'],
    },
  ],
  en: [
    {
      code: 'CONSULT',
      num: '01',
      title: 'Consult & Plan',
      desc: 'We analyze your goals and requirements, then propose the best-fit solution.',
      duration: '~ 2d',
      tasks: ['Requirements', 'Scope sizing', 'Timeline / quote'],
    },
    {
      code: 'DESIGN',
      num: '02',
      title: 'Design & UX',
      desc: 'We lock the visual direction with UI/UX wireframes and prototypes.',
      duration: '~ 4d',
      tasks: ['Wireframes', 'Prototype', 'Design sign-off'],
    },
    {
      code: 'BUILD',
      num: '03',
      title: 'Develop',
      desc: 'We write stable, scalable code on a modern tech stack.',
      duration: '~ 14d',
      tasks: ['Front / backend', 'Code review', 'Automated tests'],
    },
    {
      code: 'DEPLOY',
      num: '04',
      title: 'Test & Deploy',
      desc: 'After thorough QA, we deploy the service and support maintenance.',
      duration: '~ 2d',
      tasks: ['QA testing', 'Production deploy', 'Handoff'],
    },
  ],
};

function ProcessPipeline() {
  const { lang } = useLanguage();
  const STAGES = STAGES_BY_LANG[lang] || STAGES_BY_LANG.ko;
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          STAGES.forEach((_, i) => {
            setTimeout(() => setActiveIndex(i), 350 + i * 550);
          });
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const stageCount = STAGES.length;

  return (
    <div ref={sectionRef} className="pipeline">
      {/* Pipeline trace (horizontal SVG above all cards) */}
      <div className="pipeline__trace-wrap">
        <svg
          className="pipeline__trace"
          viewBox="0 0 1000 40"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="pipeFlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0" />
              <stop offset="50%" stopColor="#a78bfa" stopOpacity="1" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Base trace */}
          <line className="pipeline__trace-base" x1="0" y1="20" x2="1000" y2="20" />
          {/* Active progress trace */}
          <line
            className="pipeline__trace-active"
            x1="0"
            y1="20"
            x2={`${((Math.max(0, activeIndex) + 1) / stageCount) * 1000}`}
            y2="20"
          />
          {/* Junction nodes on the trace */}
          {STAGES.map((_, i) => {
            const x = ((i + 0.5) / stageCount) * 1000;
            const isOn = activeIndex >= i;
            return (
              <g key={i}>
                <circle
                  cx={x}
                  cy="20"
                  r="6"
                  className={`pipeline__node-outer ${isOn ? 'is-on' : ''}`}
                />
                <circle
                  cx={x}
                  cy="20"
                  r="3"
                  className={`pipeline__node-inner ${isOn ? 'is-on' : ''}`}
                />
              </g>
            );
          })}
          {/* Flowing data packet */}
          <circle
            r="3.5"
            className="pipeline__packet"
            cy="20"
          >
            <animateMotion
              dur="3.5s"
              repeatCount="indefinite"
              path="M 0,0 L 1000,0"
            />
          </circle>
        </svg>
      </div>

      <div className="pipeline__stages">
        {STAGES.map((stage, i) => {
          const isOn = activeIndex >= i;
          return (
            <div
              key={stage.code}
              className={`pipe-card ${isOn ? 'is-active' : ''}`}
            >
              <div className="pipe-card__connector">
                <span className="pipe-card__pulse" />
              </div>

              <div className="pipe-card__inner">
                <div className="pipe-card__header">
                  <span className="pipe-card__model">PROC-{stage.num}</span>
                  <span className={`pipe-card__status ${isOn ? 'is-on' : ''}`}>
                    <i />
                    {isOn ? 'COMPLETE' : 'QUEUED'}
                  </span>
                </div>

                <div className="pipe-card__id-row">
                  <span className="pipe-card__num">{stage.num}</span>
                  <span className="pipe-card__duration">{stage.duration}</span>
                </div>

                <h3 className="pipe-card__title">{stage.title}</h3>
                <p className="pipe-card__desc">{stage.desc}</p>

                <div className="pipe-card__tasks">
                  {stage.tasks.map((task, j) => (
                    <div key={j} className="pipe-task">
                      <span className={`pipe-task__check ${isOn ? 'is-on' : ''}`}>
                        {isOn ? '✓' : '○'}
                      </span>
                      <span className="pipe-task__label">{task}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProcessPipeline;
