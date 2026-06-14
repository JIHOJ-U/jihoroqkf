import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { HiCheck } from 'react-icons/hi';
import { useLanguage } from '../contexts/LanguageContext';
import './PricingTiers.css';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

function PricingTiers() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const {
    label,
    title,
    desc,
    comparisonHeader,
    tiers,
    features,
    quantitative,
    ctaText,
    smallNote,
  } = t.pricing;

  const handleCta = (tier) => {
    navigate('/contact', { state: { prefill: tier.prefill } });
  };

  return (
    <section className="pricing-section">
      <div className="container">
        <motion.div
          className="pricing-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label">{label}</span>
          <h2 className="section-title">{title}</h2>
          {desc && <p className="pricing-desc">{desc}</p>}
        </motion.div>

        <motion.div
          className="pricing-matrix"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {/* Row 1 — Tier headers */}
          <div className="pricing-row pricing-row--header">
            <div className="pricing-cell pricing-cell--label pricing-cell--header" aria-hidden="true" />
            {tiers.map((tier) => (
              <div
                key={`head-${tier.key}`}
                className="pricing-cell pricing-cell--header"
                data-tier={tier.name}
              >
                <span className="pricing-cell__tier-name">{tier.name}</span>
                <span className="pricing-cell__tier-price">{tier.price}</span>
              </div>
            ))}
          </div>

          {/* Row 2 — Package description */}
          <div className="pricing-row pricing-row--desc">
            <div className="pricing-cell pricing-cell--label">{comparisonHeader}</div>
            {tiers.map((tier) => (
              <div
                key={`desc-${tier.key}`}
                className="pricing-cell pricing-cell--desc"
                data-tier={tier.name}
                data-label={comparisonHeader}
              >
                <span className="pricing-cell__desc-title">{tier.descTitle}</span>
                <span className="pricing-cell__desc-body">{tier.descBody}</span>
              </div>
            ))}
          </div>

          {/* Rows 3-8 — Binary features */}
          {features.map((feat) => (
            <div key={`feat-${feat.key}`} className="pricing-row pricing-row--feature">
              <div className="pricing-cell pricing-cell--label">{feat.label}</div>
              {feat.values.map((val, i) => (
                <div
                  key={`feat-${feat.key}-${i}`}
                  className={`pricing-cell ${val ? 'pricing-cell--check' : 'pricing-cell--dash'}`}
                  data-tier={tiers[i].name}
                  data-label={feat.label}
                >
                  {val ? (
                    <HiCheck aria-label="Yes" />
                  ) : (
                    <span aria-label="Not included">—</span>
                  )}
                </div>
              ))}
            </div>
          ))}

          {/* Rows 9-11 — Quantitative */}
          {quantitative.map((q) => (
            <div key={`q-${q.key}`} className="pricing-row pricing-row--quant">
              <div className="pricing-cell pricing-cell--label">{q.label}</div>
              {q.values.map((val, i) => (
                <div
                  key={`q-${q.key}-${i}`}
                  className="pricing-cell pricing-cell--value"
                  data-tier={tiers[i].name}
                  data-label={q.label}
                >
                  {val}
                </div>
              ))}
            </div>
          ))}

          {/* Row 12 — CTAs */}
          <div className="pricing-row pricing-row--cta">
            <div className="pricing-cell pricing-cell--label" aria-hidden="true" />
            {tiers.map((tier) => (
              <div key={`cta-${tier.key}`} className="pricing-cell pricing-cell--cta" data-tier={tier.name}>
                <button
                  type="button"
                  className="pricing-cta-btn"
                  onClick={() => handleCta(tier)}
                >
                  {ctaText}
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {smallNote && <p className="pricing-note">{smallNote}</p>}
      </div>
    </section>
  );
}

export default PricingTiers;
