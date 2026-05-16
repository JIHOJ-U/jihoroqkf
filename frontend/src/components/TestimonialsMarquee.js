import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import './TestimonialsMarquee.css';

const GRADIENTS = [
  'linear-gradient(135deg, #6366f1, #8b5cf6)',
  'linear-gradient(135deg, #ec4899, #f43f5e)',
  'linear-gradient(135deg, #f59e0b, #ef4444)',
  'linear-gradient(135deg, #10b981, #06b6d4)',
  'linear-gradient(135deg, #8b5cf6, #ec4899)',
  'linear-gradient(135deg, #06b6d4, #3b82f6)',
];

const TAG_COLORS = {
  web: { bg: 'rgba(99, 102, 241, 0.12)', fg: '#6366f1' },
  app: { bg: 'rgba(236, 72, 153, 0.12)', fg: '#ec4899' },
  api: { bg: 'rgba(16, 185, 129, 0.12)', fg: '#10b981' },
  ux:  { bg: 'rgba(245, 158, 11, 0.12)', fg: '#f59e0b' },
};

function Card({ item, idx }) {
  const grad = GRADIENTS[idx % GRADIENTS.length];
  const color = TAG_COLORS[item.tagKey] || TAG_COLORS.web;
  return (
    <div className="tm-card">
      <div className="tm-card-quote-mark" aria-hidden="true">"</div>
      <p className="tm-card-body">{item.body}</p>
      <div className="tm-card-foot">
        <div className="tm-card-avatar" style={{ background: grad }}>
          {item.initial}
        </div>
        <div className="tm-card-meta">
          <div className="tm-card-client">{item.client}</div>
          <span className="tm-card-tag" style={{ background: color.bg, color: color.fg }}>
            {item.tag}
          </span>
        </div>
      </div>
    </div>
  );
}

function Row({ items, direction, speed }) {
  // Duplicate items twice so the loop is seamless
  const looped = [...items, ...items];
  return (
    <div className="tm-row" data-direction={direction}>
      <div className="tm-row-track" style={{ animationDuration: `${speed}s` }}>
        {looped.map((item, i) => (
          <Card key={`${direction}-${i}`} item={item} idx={i} />
        ))}
      </div>
    </div>
  );
}

function TestimonialsMarquee() {
  const { t } = useLanguage();
  const { label, title, desc, items } = t.testimonials;

  const mid = Math.ceil(items.length / 2);
  const top = items.slice(0, mid);
  const bottom = items.slice(mid);

  return (
    <section className="tm-section">
      <div className="container-wide">
        <motion.div
          className="tm-head"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label">{label}</span>
          <h2 className="section-title">{title}</h2>
          {desc && <p className="tm-head-desc">{desc}</p>}
        </motion.div>
      </div>

      <div className="tm-rows">
        <Row items={top} direction="left" speed={42} />
        <Row items={bottom} direction="right" speed={48} />
      </div>
    </section>
  );
}

export default TestimonialsMarquee;
