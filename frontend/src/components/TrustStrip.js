import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import CountUp from './CountUp';
import './TrustStrip.css';

const COPY = {
  ko: {
    metrics: [
      { end: 50, suffix: '+', label: '프로젝트 완수' },
      { end: 95, suffix: '+', label: 'Lighthouse 점수' },
      { end: 99, suffix: '%', label: '클라이언트 만족도' },
      { end: 24, suffix: 'h', label: '평균 응답 시간' },
    ],
  },
  en: {
    metrics: [
      { end: 50, suffix: '+', label: 'Projects shipped' },
      { end: 95, suffix: '+', label: 'Lighthouse score' },
      { end: 99, suffix: '%', label: 'Client satisfaction' },
      { end: 24, suffix: 'h', label: 'Avg. response time' },
    ],
  },
};

function TrustStrip() {
  const { lang } = useLanguage();
  const t = COPY[lang] || COPY.ko;

  return (
    <motion.section
      className="trust-strip-section"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="container-wide">
        <div className="trust-strip-grid">
          {t.metrics.map((m, i) => (
            <motion.div
              key={i}
              className="trust-metric"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.08 + i * 0.1 }}
            >
              <span className="trust-metric__num">
                <CountUp
                  end={m.end}
                  suffix={m.suffix}
                  decimals={m.decimals || 0}
                  duration={1600}
                />
              </span>
              <span className="trust-metric__label">{m.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

export default TrustStrip;
