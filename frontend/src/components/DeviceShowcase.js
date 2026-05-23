import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import './DeviceShowcase.css';

const COPY = {
  ko: {
    label: 'MULTI-PLATFORM',
    title: ['하나의 코드로', '모든 기기에 닿다'],
    desc: '웹부터 모바일까지, 같은 품질의 경험을 일관되게 전달합니다.',
  },
  en: {
    label: 'MULTI-PLATFORM',
    title: ['One codebase,', 'every device'],
    desc: 'From web to mobile — one consistent, high-quality experience.',
  },
};

function DeviceShowcase() {
  const { lang } = useLanguage();
  const c = COPY[lang] || COPY.ko;

  return (
    <section className="devices-section">
      <div className="devices-bg-grid" />

      <div className="container-wide">
        <motion.div
          className="devices-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="section-label">{c.label}</span>
          <h2 className="section-title">{c.title[0]}<br />{c.title[1]}</h2>
          <p className="devices-desc">
            {c.desc}
          </p>
        </motion.div>

        <motion.div
          className="devices-stage"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Laptop */}
          <div className="device-laptop">
            <div className="device-laptop__screen">
              <div className="device-laptop__bezel">
                <div className="device-laptop__camera" />
              </div>
              <div className="device-laptop__display">
                <div className="laptop-window">
                  <div className="laptop-window__bar">
                    <div className="laptop-window__lights">
                      <span /><span /><span />
                    </div>
                    <div className="laptop-window__url">
                      <span className="laptop-window__lock">●</span>
                      dev.vibe / projects
                    </div>
                    <span />
                  </div>
                  <div className="laptop-window__body">
                    <img
                      src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80"
                      alt="code editor"
                    />
                    <div className="laptop-window__overlay" />
                  </div>
                </div>
              </div>
            </div>
            <div className="device-laptop__base">
              <div className="device-laptop__notch" />
            </div>
            <div className="device-laptop__shadow" />
          </div>

          {/* Phone (overlapping) */}
          <div className="device-phone">
            <div className="device-phone__frame">
              <div className="device-phone__notch" />
              <div className="device-phone__side device-phone__side--vol-up" />
              <div className="device-phone__side device-phone__side--vol-down" />
              <div className="device-phone__side device-phone__side--power" />
              <div className="device-phone__screen">
                <div className="phone-statusbar">
                  <span className="phone-statusbar__time">9:41</span>
                  <div className="phone-statusbar__icons">
                    <span className="phone-statusbar__signal">
                      <i /><i /><i /><i />
                    </span>
                    <span className="phone-statusbar__battery" />
                  </div>
                </div>
                <div className="phone-app">
                  <div className="phone-app__brand">
                    <span className="phone-app__logo">◆</span>
                    <span className="phone-app__name">Dev.Vibe</span>
                    <span className="phone-app__live">● live</span>
                  </div>
                  <div className="phone-app__terminal">
                    <div className="phone-line">
                      <span className="phone-line__prompt">$</span>
                      <span className="phone-line__cmd">deploy --prod</span>
                    </div>
                    <div className="phone-line phone-line--ok">
                      <span>✓</span> build complete <span className="phone-line__dim">·  2.1s</span>
                    </div>
                    <div className="phone-line phone-line--ok">
                      <span>✓</span> tests passed <span className="phone-line__dim">·  24/24</span>
                    </div>
                    <div className="phone-line phone-line--info">
                      <span>→</span> uploading bundle
                    </div>
                    <div className="phone-line phone-line--ok">
                      <span>✓</span> live <span className="phone-line__dim">·  2.3s</span>
                    </div>
                    <div className="phone-line phone-line--cursor">
                      <span className="phone-line__prompt">$</span>
                      <span className="phone-cursor" />
                    </div>
                  </div>
                  <div className="phone-app__metrics">
                    <div className="phone-metric">
                      <span className="phone-metric__label">UPTIME</span>
                      <span className="phone-metric__value">99.98%</span>
                    </div>
                    <div className="phone-metric">
                      <span className="phone-metric__label">LCP</span>
                      <span className="phone-metric__value">1.2s</span>
                    </div>
                    <div className="phone-metric">
                      <span className="phone-metric__label">CLS</span>
                      <span className="phone-metric__value">0.02</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="device-phone__shadow" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default DeviceShowcase;
