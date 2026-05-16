import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPlus } from 'react-icons/hi';
import { useLanguage } from '../contexts/LanguageContext';
import './FaqSection.css';

function FaqItem({ q, a, isOpen, onToggle, index }) {
  return (
    <motion.div
      className={`faq-item ${isOpen ? 'faq-item--open' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <button
        type="button"
        className="faq-q"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="faq-q-num">Q{String(index + 1).padStart(2, '0')}</span>
        <span className="faq-q-text">{q}</span>
        <span className="faq-q-icon"><HiPlus /></span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            className="faq-a-wrap"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="faq-a">{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function FaqSection() {
  const { t } = useLanguage();
  const { label, title, desc, items } = t.faq;
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section className="faq-section">
      <div className="container">
        <div className="faq-grid">
          <motion.div
            className="faq-head"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-label">{label}</span>
            <h2 className="faq-title">{title}</h2>
            {desc && <p className="faq-desc">{desc}</p>}
          </motion.div>

          <div className="faq-list">
            {items.map((item, i) => (
              <FaqItem
                key={i}
                index={i}
                q={item.q}
                a={item.a}
                isOpen={openIdx === i}
                onToggle={() => setOpenIdx(openIdx === i ? -1 : i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FaqSection;
