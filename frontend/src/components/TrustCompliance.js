import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import './TrustCompliance.css';

/**
 * Trust strip — 4 compliance/contract signals in one row. Enters as an
 * orchestrated stagger from the bottom so the row lands as a coordinated
 * beat, not four independent fades. Matches the reveal system used by
 * MaintenanceTiers / CustomerProblems / StarterProducts.
 */
function TrustCompliance() {
  const { t } = useLanguage();
  const block = t.trustCompliance;
  const prefersReducedMotion = useReducedMotion();
  if (!block) return null;

  const listVariants = prefersReducedMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 1 },
        visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
      };

  const itemVariants = prefersReducedMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.2 } } }
    : {
        hidden: { opacity: 0, y: 22 },
        visible: {
          opacity: 1, y: 0,
          transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
        },
      };

  return (
    <section className="tcomp" aria-label={block.ariaLabel || 'Trust & compliance'}>
      <motion.ul
        className="tcomp__list"
        variants={listVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
      >
        {block.items.map((item, i) => (
          <motion.li className="tcomp__item" key={i} variants={itemVariants}>
            <span className="tcomp__icon" aria-hidden="true">{item.icon}</span>
            <div className="tcomp__body">
              <span className="tcomp__label">{item.label}</span>
              <span className="tcomp__sub">{item.sub}</span>
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}

export default TrustCompliance;
