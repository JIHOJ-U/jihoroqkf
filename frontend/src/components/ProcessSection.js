import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import TypeOnView from './TypeOnView';
import './ProcessSection.css';

function ProcessSection() {
  const { t } = useLanguage();
  const { label, headline, desc, steps } = t.process;

  return (
    <section className="proc-section">
      <div className="proc-bg-mark" aria-hidden="true">PROCESS</div>

      <div className="container-wide">
        <div className="proc-head">
          <motion.span
            className="proc-label"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6 }}
          >
            <span className="proc-label-dot" />
            <TypeOnView text={label} speed={55} />
          </motion.span>

          <motion.h2
            className="proc-headline"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {headline.split('\n').map((line, i, arr) => (
              <React.Fragment key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </React.Fragment>
            ))}
          </motion.h2>

          <motion.p
            className="proc-desc"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {desc}
          </motion.p>
        </div>

        <ol className="proc-list">
          {steps.map((step, i) => (
            <motion.li
              key={step.num}
              className="proc-step"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="proc-step-num">{step.num}</div>
              <div className="proc-step-body">
                <div className="proc-step-tag">{step.tag}</div>
                <h3 className="proc-step-title">{step.title}</h3>
                <p className="proc-step-desc">{step.desc}</p>
              </div>
              <div className="proc-step-rule" aria-hidden="true" />
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default ProcessSection;
