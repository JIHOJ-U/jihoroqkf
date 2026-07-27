import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import './CustomerProblems.css';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

function CustomerProblems() {
  const { t } = useLanguage();
  const block = t.customerProblems;
  if (!block) return null;

  return (
    <section className="cprob" aria-label={block.headline}>
      <div className="cprob__inner">
        <motion.header
          className="cprob__head"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <span className="cprob__eyebrow">{block.eyebrow}</span>
          <h2 className="cprob__headline">{block.headline}</h2>
          <p className="cprob__caption">{block.caption}</p>
        </motion.header>

        <div className="cprob__grid">
          {block.cards.map((card, i) => (
            <motion.article
              key={card.num}
              className="cprob-card"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              custom={i + 1}
            >
              <span className="cprob-card__num">{card.num}</span>
              <h3 className="cprob-card__problem">{card.problem}</h3>
              <span className="cprob-card__rule" aria-hidden="true" />
              <p className="cprob-card__solution">
                <span className="cprob-card__arrow" aria-hidden="true">→</span>
                {card.solution}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CustomerProblems;
