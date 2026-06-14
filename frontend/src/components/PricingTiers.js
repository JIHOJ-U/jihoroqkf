import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { HiCheck, HiArrowRight } from 'react-icons/hi';
import { useLanguage } from '../contexts/LanguageContext';
import useSpotlight from '../hooks/useSpotlight';
import './PricingTiers.css';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

function PricingTiers() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const onSpot = useSpotlight();

  const { label, title, desc, tiers, popular, smallNote } = t.pricing;

  const handleCta = (tier) => {
    navigate('/contact', { state: { prefill: tier.prefill } });
  };

  return (
    <section className="pricing-section">
      <div className="container-wide">
        <motion.div
          className="pricing-head"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label">{label}</span>
          <h2 className="section-title">{title}</h2>
          {desc && <p className="pricing-desc">{desc}</p>}
        </motion.div>

        <div className="pricing-grid">
          {tiers.map((tier, i) => {
            const isPopular = tier.popular === true;
            return (
              <motion.div
                key={tier.key}
                className={`pricing-card${isPopular ? ' pricing-card--popular' : ''}`}
                data-spotlight=""
                onMouseMove={onSpot}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                custom={i}
              >
                {isPopular && (
                  <span className="pricing-card__badge">{popular}</span>
                )}

                <div className="pricing-card__head">
                  <span className="pricing-card__name">{tier.name}</span>
                  <span className="pricing-card__tagline">{tier.tagline}</span>
                </div>

                <div className="pricing-card__price">{tier.price}</div>

                <div className="pricing-card__divider" />

                <ul className="pricing-card__features">
                  {tier.features.map((feat, fi) => (
                    <li key={fi} className="pricing-card__feature">
                      <HiCheck className="pricing-card__check" aria-hidden="true" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  className={`pricing-card__cta${isPopular ? ' pricing-card__cta--primary' : ' pricing-card__cta--outline'}`}
                  onClick={() => handleCta(tier)}
                >
                  <span>{tier.cta}</span>
                  <HiArrowRight aria-hidden="true" />
                </button>
              </motion.div>
            );
          })}
        </div>

        {smallNote && <p className="pricing-note">{smallNote}</p>}
      </div>
    </section>
  );
}

export default PricingTiers;
