import React from 'react';
import { motion } from 'framer-motion';
import {
  HiShieldCheck, HiCreditCard, HiLightningBolt,
  HiSparkles, HiCloudUpload, HiChartBar,
  HiSearch, HiBell, HiTrendingUp,
} from 'react-icons/hi';
import { useLanguage } from '../contexts/LanguageContext';
import CountUp from './CountUp';
import TypeOnView from './TypeOnView';
import './CapabilitiesSection.css';

const ICONS = {
  auth:     <HiShieldCheck />,
  payment:  <HiCreditCard />,
  realtime: <HiLightningBolt />,
  ai:       <HiSparkles />,
  file:     <HiCloudUpload />,
  chart:    <HiChartBar />,
  search:   <HiSearch />,
  push:     <HiBell />,
  seo:      <HiTrendingUp />,
};

function CapabilitiesSection() {
  const { t, lang } = useLanguage();
  const { label, title, desc, items } = t.capabilities;

  const stats = lang === 'ko'
    ? [
        { end: 9,   suffix: '+', label: '구현 가능 기능' },
        { end: 100, suffix: '%', label: '풀스택 단독 진행' },
        { end: 24,  suffix: 'h', label: '평균 응답 시간' },
        { end: 4.9, suffix: '',  label: '평균 만족도', decimals: 1 },
      ]
    : [
        { end: 9,   suffix: '+', label: 'Buildable features' },
        { end: 100, suffix: '%', label: 'Full-stack solo' },
        { end: 24,  suffix: 'h', label: 'Avg. response' },
        { end: 4.9, suffix: '',  label: 'Avg. rating', decimals: 1 },
      ];

  return (
    <section className="caps-section">
      <div className="caps-bg-mark" aria-hidden="true">{'</>'}</div>

      <div className="container-wide">
        <motion.div
          className="caps-head"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          <span className="caps-label">
            <span className="caps-label-dot" />
            <TypeOnView text={label} speed={55} />
          </span>
          <h2 className="caps-title">
            {title.split('\n').map((line, i, arr) => (
              <React.Fragment key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </React.Fragment>
            ))}
          </h2>
          {desc && <p className="caps-desc">{desc}</p>}
        </motion.div>

        <ul className="caps-grid">
          {items.map((item, i) => (
            <motion.li
              key={item.key}
              className="caps-card"
              data-cap={item.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 0.55,
                delay: (i % 3) * 0.08 + Math.floor(i / 3) * 0.05,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <div className="caps-card-icon">{ICONS[item.key]}</div>
              <h3 className="caps-card-title">{item.title}</h3>
              <p className="caps-card-desc">{item.desc}</p>
              <ul className="caps-card-tags">
                {item.tags.map((tag, ti) => (
                  <li key={ti} className="caps-card-tag">{tag}</li>
                ))}
              </ul>
            </motion.li>
          ))}
        </ul>

        <div className="caps-stats">
          {stats.map((s, i) => (
            <div key={i} className="caps-stat">
              <span className="caps-stat-value">
                <CountUp end={s.end} suffix={s.suffix} decimals={s.decimals || 0} />
              </span>
              <span className="caps-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CapabilitiesSection;
