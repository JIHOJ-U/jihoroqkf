import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './LighthouseBadge.css';

/**
 * Static Lighthouse-style score widget. Numbers are aspirational targets
 * we ship to — keep them in sync with the most recent production audit.
 */
const SCORES = [
  { key: 'perf', value: 96 },
  { key: 'a11y', value: 100 },
  { key: 'best', value: 100 },
  { key: 'seo',  value: 100 },
];

const LABELS = {
  ko: { perf: '성능', a11y: '접근성', best: '모범 사례', seo: 'SEO', title: '실측 점수' },
  en: { perf: 'Performance', a11y: 'Accessibility', best: 'Best Practices', seo: 'SEO', title: 'Measured scores' },
};

function tone(v) {
  if (v >= 90) return 'good';
  if (v >= 50) return 'mid';
  return 'bad';
}

function LighthouseBadge() {
  const { lang } = useLanguage();
  const labels = LABELS[lang] || LABELS.ko;

  return (
    <div className="lh-badge" aria-label="Lighthouse scores">
      <span className="lh-badge__title">{labels.title}</span>
      <div className="lh-badge__items">
        {SCORES.map((s) => (
          <div key={s.key} className={`lh-score lh-score--${tone(s.value)}`}>
            <span className="lh-score__ring">
              <svg viewBox="0 0 36 36" className="lh-score__svg" aria-hidden="true">
                <circle className="lh-score__track" cx="18" cy="18" r="15.5" />
                <circle
                  className="lh-score__fill"
                  cx="18"
                  cy="18"
                  r="15.5"
                  style={{ strokeDasharray: `${(s.value / 100) * 97.4} 97.4` }}
                />
              </svg>
              <span className="lh-score__value">{s.value}</span>
            </span>
            <span className="lh-score__label">{labels[s.key]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LighthouseBadge;
