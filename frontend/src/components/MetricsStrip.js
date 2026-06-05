import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import CountUp from './CountUp';
import './MetricsStrip.css';

const COPY = {
  ko: {
    label: '// AT_A_GLANCE',
    items: [
      { end: 12, suffix: '+', label: '진행 프로젝트', tone: 'tech' },
      { end: 100, suffix: '%', label: '풀스택 단독 진행', tone: 'highlight' },
      { end: 24, suffix: 'h', label: '평일 응답 보장', tone: 'trust' },
      { end: 4.9, suffix: '', decimals: 1, label: '평균 만족도', tone: 'interactive' },
    ],
  },
  en: {
    label: '// AT_A_GLANCE',
    items: [
      { end: 12, suffix: '+', label: 'Projects shipped', tone: 'tech' },
      { end: 100, suffix: '%', label: 'Full-stack solo', tone: 'highlight' },
      { end: 24, suffix: 'h', label: 'Weekday SLA', tone: 'trust' },
      { end: 4.9, suffix: '', decimals: 1, label: 'Avg. rating', tone: 'interactive' },
    ],
  },
};

function MetricsStrip() {
  const { lang } = useLanguage();
  const c = COPY[lang] || COPY.ko;

  return (
    <section className="mstrip">
      <div className="mstrip-grid-bg" aria-hidden="true" />
      <div className="container-wide mstrip-inner">
        <motion.span
          className="mstrip-label"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          translate="no"
        >
          {c.label}
        </motion.span>

        <div className="mstrip-items">
          {c.items.map((it, i) => (
            <motion.div
              key={i}
              className={`mstrip-item mstrip-item--${it.tone}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 + i * 0.08 }}
            >
              <span className="mstrip-value">
                <CountUp end={it.end} suffix={it.suffix} decimals={it.decimals || 0} />
              </span>
              <span className="mstrip-label-text">{it.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default MetricsStrip;
