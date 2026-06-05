import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import './BuildLog.css';

// Curated recent activity. Keep most-recent first. Update by hand when shipping
// — this is intentionally manual so it reads like a personal changelog, not
// auto-generated commit noise.
const ENTRIES = {
  ko: [
    { type: 'add',  text: '카드 마우스 스포트라이트 + Build Log 피드', when: '방금' },
    { type: 'add',  text: '메트릭 스트립 + Footer 코드 시그니처', when: '몇 시간 전' },
    { type: 'add',  text: 'Capabilities 카드별 시맨틱 액센트 (6색 분포)', when: '오늘' },
    { type: 'add',  text: 'Manrope 디스플레이 폰트 + 미세 그레인 텍스처', when: '오늘' },
    { type: 'add',  text: 'TrustSection 에메랄드 액센트, Pipeline 앰버화', when: '1일 전' },
    { type: 'fix',  text: '서비스 섹션 회색 배경 비침', when: '1일 전' },
    { type: 'add',  text: '채널톡 1:1 실시간 상담 연결', when: '2일 전' },
    { type: 'perf', text: '히어로 터미널 오프스크린 일시정지', when: '3일 전' },
  ],
  en: [
    { type: 'add',  text: 'Card mouse spotlight + Build Log feed', when: 'just now' },
    { type: 'add',  text: 'Metrics strip + Footer syntax signature', when: 'few hours ago' },
    { type: 'add',  text: 'Per-card semantic accents on Capabilities (6-color spread)', when: 'today' },
    { type: 'add',  text: 'Manrope display font + subtle grain texture', when: 'today' },
    { type: 'add',  text: 'TrustSection emerald, Pipeline amber active state', when: '1d ago' },
    { type: 'fix',  text: 'Services section gray bleed', when: '1d ago' },
    { type: 'add',  text: 'Channel Talk live 1:1 chat wired in', when: '2d ago' },
    { type: 'perf', text: 'Pause hero terminal off-screen', when: '3d ago' },
  ],
};

const HEAD = {
  ko: { label: '// CHANGELOG', title: '계속 다듬는 중', desc: '최근에 무엇을 손봤는지 — 사이트가 살아있다는 증거입니다.' },
  en: { label: '// CHANGELOG', title: 'Always polishing', desc: 'What changed lately — proof the site is alive.' },
};

const TYPE_META = {
  add:  { tag: 'add',  color: 'tech' },
  fix:  { tag: 'fix',  color: 'highlight' },
  perf: { tag: 'perf', color: 'trust' },
  doc:  { tag: 'doc',  color: 'interactive' },
};

function BuildLog() {
  const { lang } = useLanguage();
  const entries = ENTRIES[lang] || ENTRIES.ko;
  const head = HEAD[lang] || HEAD.ko;

  return (
    <section className="blog-section">
      <div className="container-wide">
        <motion.div
          className="blog-head"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="blog-label" translate="no">{head.label}</span>
          <h2 className="blog-title">{head.title}</h2>
          <p className="blog-desc">{head.desc}</p>
        </motion.div>

        <div className="blog-window">
          <div className="blog-window__bar">
            <span className="blog-window__dots">
              <i /><i /><i />
            </span>
            <span className="blog-window__title">~ dev.vibe / changelog.log</span>
          </div>

          <div className="blog-window__body">
            {entries.map((e, i) => {
              const meta = TYPE_META[e.type] || TYPE_META.add;
              return (
                <motion.div
                  key={i}
                  className="blog-row"
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <span className={`blog-tag blog-tag--${meta.color}`}>{meta.tag}</span>
                  <span className="blog-text">{e.text}</span>
                  <span className="blog-when">{e.when}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default BuildLog;
