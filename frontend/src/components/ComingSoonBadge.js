import React from 'react';
import { HiClock } from 'react-icons/hi';
import { useLanguage } from '../contexts/LanguageContext';
import './ComingSoonBadge.css';

/**
 * ComingSoonBadge — signals a feature that's built but not yet fully
 * operational (e.g. AI Preview waiting on API key). Two variants:
 *
 *   variant="chip"    — small inline pill (default). Fits inside CTA buttons,
 *                       next to nav links, or beside headings.
 *   variant="ribbon"  — corner ribbon (absolute-positioned). Overlays a card
 *                       to mark the whole thing as coming-soon.
 *   variant="notice"  — full-width banner block. For top of a page whose
 *                       primary functionality isn't ready yet.
 *
 * Copy comes from t.comingSoon so it's bilingual and edit-in-one-place.
 */
function ComingSoonBadge({ variant = 'chip', title, message, className = '' }) {
  const { t } = useLanguage();
  const cs = t.comingSoon || {};
  const label = cs.label || 'Coming Soon';
  const heading = title || cs.title;
  const body = message || cs.body;

  if (variant === 'ribbon') {
    return (
      <span className={`csb csb--ribbon ${className}`.trim()} aria-label={label}>
        <HiClock aria-hidden="true" />
        <span>{label}</span>
      </span>
    );
  }

  if (variant === 'notice') {
    return (
      <div className={`csb csb--notice ${className}`.trim()} role="status">
        <div className="csb-notice__badge">
          <HiClock aria-hidden="true" />
          <span>{label}</span>
        </div>
        {(heading || body) && (
          <div className="csb-notice__body">
            {heading && <h3 className="csb-notice__title">{heading}</h3>}
            {body && <p className="csb-notice__desc">{body}</p>}
          </div>
        )}
      </div>
    );
  }

  return (
    <span className={`csb csb--chip ${className}`.trim()}>
      <HiClock aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}

export default ComingSoonBadge;
