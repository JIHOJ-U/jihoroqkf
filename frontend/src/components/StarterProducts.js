import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import './StarterProducts.css';

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// Orchestrated card reveal — mirrors MaintenanceTiers/CustomerProblems so
// the three "3-card" sections on Home feel like one design system.
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
        staggerChildren: 0.07,
      },
    },
  };
};

const itemVariants = (reduce) =>
  reduce
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, x: -12 },
        visible: {
          opacity: 1, x: 0,
          transition: { duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] },
        },
      };

const directions = ['left', 'bottom', 'right'];

function StarterProducts() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const block = t.starterProducts;
  const prefersReducedMotion = useReducedMotion();
  if (!block) return null;
  const item = itemVariants(prefersReducedMotion);

  const handleCta = (product) => {
    navigate('/contact', { state: { prefill: product.prefill } });
  };

  return (
    <section className="stprod" aria-label={block.headline}>
      <div className="stprod__inner">
        <motion.header
          className="stprod__head"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <span className="stprod__eyebrow">{block.eyebrow}</span>
          <h2 className="stprod__headline">{block.headline}</h2>
          <p className="stprod__caption">{block.caption}</p>
        </motion.header>

        <div className="stprod__grid">
          {block.list.map((product, i) => (
            <motion.article
              key={product.name}
              className="stprod-card"
              variants={cardVariants(directions[i], prefersReducedMotion)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <motion.span className="stprod-card__tag" variants={item}>{block.tagLabel}</motion.span>
              <motion.h3 className="stprod-card__name" variants={item}>{product.name}</motion.h3>
              <motion.p className="stprod-card__body" variants={item}>{product.body}</motion.p>
              <motion.div className="stprod-card__foot" variants={item}>
                <div className="stprod-card__price-block">
                  {product.listPrice && (
                    <span className="stprod-card__list-price">{product.listPrice}</span>
                  )}
                  <span className="stprod-card__price">{product.price}</span>
                </div>
                <button
                  type="button"
                  className="stprod-card__cta"
                  onClick={() => handleCta(product)}
                >
                  {product.cta}
                </button>
              </motion.div>
            </motion.article>
          ))}
        </div>

        <p className="stprod__bridge">{block.bridge}</p>
      </div>
    </section>
  );
}

export default StarterProducts;
