import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiCheck, HiArrowRight, HiSparkles } from 'react-icons/hi';
import { useLanguage } from '../contexts/LanguageContext';
import './MaintenanceTiers.css';

/**
 * MaintenanceTiers — 3-tier monthly maintenance offer.
 *
 * The animation is the point here: as the block scrolls into view, the
 * three cards slide in from alternating sides (left / bottom / right),
 * and each bullet inside a card staggers in from the left. It reads as
 * an orchestrated reveal — reinforces "this developer builds like this"
 * without being noisy. Respects prefers-reduced-motion.
 */
function MaintenanceTiers() {
  const { t } = useLanguage();
  const m = t.maintenance;
  const prefersReducedMotion = useReducedMotion();

  // Each card enters from a different direction so the three feel
  // sequenced rather than a bulk fade-in. Middle card enters from the
  // bottom so the center tier lands last, drawing the eye.
  const cardVariants = (direction) => {
    if (prefersReducedMotion) {
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.2 } },
      };
    }
    const offset =
      direction === 'left'   ? { x: -60, y: 0 } :
      direction === 'right'  ? { x:  60, y: 0 } :
                               { x:   0, y: 40 };
    return {
      hidden: { opacity: 0, ...offset },
      visible: {
        opacity: 1,
        x: 0,
        y: 0,
        transition: {
          duration: 0.55,
          ease: [0.25, 0.46, 0.45, 0.94],
          when: 'beforeChildren',
          staggerChildren: 0.08,
        },
      },
    };
  };

  const itemVariants = prefersReducedMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, x: -18 },
        visible: {
          opacity: 1,
          x: 0,
          transition: { duration: 0.36, ease: [0.25, 0.46, 0.45, 0.94] },
        },
      };

  const priceVariants = prefersReducedMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
        },
      };

  const directions = ['left', 'bottom', 'right'];

  return (
    <section className="maint-section" aria-labelledby="maint-title">
      <div className="container">
        <motion.header
          className="maint-header"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <span className="maint-eyebrow">{m.eyebrow}</span>
          <h2 id="maint-title" className="maint-title">{m.title}</h2>
          <p className="maint-desc">{m.desc}</p>
        </motion.header>

        <div className="maint-grid">
          {m.tiers.map((tier, i) => (
            <motion.article
              key={tier.key}
              className={`maint-card${tier.popular ? ' maint-card--popular' : ''}`}
              variants={cardVariants(directions[i])}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
            >
              {tier.popular && (
                <span className="maint-card__popular-badge">
                  <HiSparkles /> {m.popularBadge}
                </span>
              )}

              <header className="maint-card__head">
                <div className="maint-card__name">{tier.name}</div>
                <p className="maint-card__tagline">{tier.tagline}</p>
              </header>

              <motion.div className="maint-card__price" variants={priceVariants}>
                <span className="maint-card__amount">{tier.price}</span>
                <span className="maint-card__period">{m.priceSuffix}</span>
              </motion.div>

              <ul className="maint-card__items">
                {tier.items.map((item, j) => (
                  <motion.li
                    key={j}
                    className="maint-card__item"
                    variants={itemVariants}
                  >
                    <span className="maint-card__check" aria-hidden="true">
                      <HiCheck />
                    </span>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>

              <Link
                to="/contact"
                state={{ prefill: tier.prefill }}
                className="maint-card__cta"
              >
                {tier.name} · {m.ctaLabel} <HiArrowRight />
              </Link>
            </motion.article>
          ))}
        </div>

        <p className="maint-note">{m.note}</p>
      </div>
    </section>
  );
}

export default MaintenanceTiers;
