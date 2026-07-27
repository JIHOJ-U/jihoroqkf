import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './TrustCompliance.css';

function TrustCompliance() {
  const { t } = useLanguage();
  const block = t.trustCompliance;
  if (!block) return null;

  return (
    <section className="tcomp" aria-label={block.ariaLabel || 'Trust & compliance'}>
      <ul className="tcomp__list">
        {block.items.map((item, i) => (
          <li className="tcomp__item" key={i}>
            <span className="tcomp__icon" aria-hidden="true">{item.icon}</span>
            <div className="tcomp__body">
              <span className="tcomp__label">{item.label}</span>
              <span className="tcomp__sub">{item.sub}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default TrustCompliance;
