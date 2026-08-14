import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import './CustomerProblems.css';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

/**
 * Orchestrated card reveal — same pattern as MaintenanceTiers so the two
 * sections feel like part of one system: card 1 slides in from the left,
 * card 2 rises from the bottom, card 3 slides in from the right. Internal
 * items (problem headline, rule, solution) stagger in after the card lands.
 */
const cardVariants = (direction, reduce) => {
  if (reduce) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.2 } },
    };
  }
  const offset =
    direction === 'left'  ? { x: -60, y: 0 } :
    direction === 'right' ? { x:  60, y: 0 } :
                            { x:   0, y: 40 };
  return {
    hidden: { opacity: 0, ...offset },
    visible: {
      opacity: 1, x: 0, y: 0,
      transition: {
        duration: 0.55,
        ease: [0.25, 0.46, 0.45, 0.94],
        when: 'beforeChildren',
        staggerChildren: 0.08,
      },
    },
  };
};

const itemVariants = (reduce) =>
  reduce
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, x: -14 },
        visible: {
          opacity: 1, x: 0,
          transition: { duration: 0.34, ease: [0.25, 0.46, 0.45, 0.94] },
        },
      };

const directions = ['left', 'bottom', 'right'];

function CustomerProblems() {
  const { t } = useLanguage();
  const block = t.customerProblems;
  const prefersReducedMotion = useReducedMotion();
  if (!block) return null;
  const item = itemVariants(prefersReducedMotion);

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
              variants={cardVariants(directions[i], prefersReducedMotion)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
            >
              <motion.span className="cprob-card__num" variants={item}>{card.num}</motion.span>
              <motion.h3 className="cprob-card__problem" variants={item}>{card.problem}</motion.h3>
              <motion.span className="cprob-card__rule" aria-hidden="true" variants={item} />
              <motion.p className="cprob-card__solution" variants={item}>
                <span className="cprob-card__arrow" aria-hidden="true">→</span>
                {card.solution}
              </motion.p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CustomerProblems;
