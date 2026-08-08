import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import './StarterProducts.css';

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.45, delay: i * 0.07, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

function StarterProducts() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const block = t.starterProducts;
  if (!block) return null;

  const handleCta = (item) => {
    navigate('/contact', { state: { prefill: item.prefill } });
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
          {block.list.map((item, i) => (
            <motion.article
              key={item.name}
              className="stprod-card"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              custom={i + 1}
            >
              <span className="stprod-card__tag">{block.tagLabel}</span>
              <h3 className="stprod-card__name">{item.name}</h3>
              <p className="stprod-card__body">{item.body}</p>
              <div className="stprod-card__foot">
                <div className="stprod-card__price-block">
                  {item.listPrice && (
                    <span className="stprod-card__list-price">{item.listPrice}</span>
                  )}
                  <span className="stprod-card__price">{item.price}</span>
                </div>
                <button
                  type="button"
                  className="stprod-card__cta"
                  onClick={() => handleCta(item)}
                >
                  {item.cta}
                </button>
              </div>
            </motion.article>
          ))}
        </div>

        <p className="stprod__bridge">{block.bridge}</p>
      </div>
    </section>
  );
}

export default StarterProducts;
