import React from 'react';
import { motion } from 'framer-motion';
import {
  HiShieldCheck, HiCreditCard, HiLightningBolt,
  HiSparkles, HiCloudUpload, HiChartBar,
  HiSearch, HiBell, HiTrendingUp,
} from 'react-icons/hi';
import { useLanguage } from '../contexts/LanguageContext';
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
  const { t } = useLanguage();
  const { label, title, desc, items } = t.capabilities;

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
            <span className="caps-label-dot" />{label}
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
      </div>
    </section>
  );
}

export default CapabilitiesSection;
