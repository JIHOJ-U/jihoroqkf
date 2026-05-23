import React, { useEffect, useState } from 'react';
import { HiArrowRight } from 'react-icons/hi';
import { useLanguage } from '../contexts/LanguageContext';
import './TerminalSuccess.css';

const COPY = {
  ko: {
    ok: '✓ 문의가 접수되었습니다.',
    note: '  보통 24시간 이내에 회신드려요. 감사합니다!',
    reset: '새 문의 작성',
  },
  en: {
    ok: '✓ Your inquiry has been received.',
    note: "  We usually reply within 24 hours. Thank you!",
    reset: 'New inquiry',
  },
};

/* Terminal-style confirmation shown after a contact form submit.
   Types out a sequence of "command → output" lines, then reveals a reset button. */
export default function TerminalSuccess({ name = '', onReset }) {
  const { lang } = useLanguage();
  const c = COPY[lang] || COPY.ko;
  const lines = [
    { type: 'cmd', text: `submit --inquiry --from "${name || 'guest'}"` },
    { type: 'out', text: '> validating fields... ok', tone: 'dim' },
    { type: 'out', text: '> sending to dev.vibe...', tone: 'dim' },
    { type: 'ok',  text: c.ok },
    { type: 'out', text: c.note, tone: 'soft' },
  ];

  const [visible, setVisible] = useState(0);   // how many lines shown
  const [showBtn, setShowBtn] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setVisible(lines.length); setShowBtn(true); return; }

    const timers = [];
    lines.forEach((_, i) => {
      timers.push(setTimeout(() => setVisible(i + 1), 350 + i * 480));
    });
    timers.push(setTimeout(() => setShowBtn(true), 350 + lines.length * 480 + 200));
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="tsx">
      <div className="tsx-window">
        <div className="tsx-bar">
          <span className="tsx-dot tsx-dot--r" />
          <span className="tsx-dot tsx-dot--y" />
          <span className="tsx-dot tsx-dot--g" />
          <span className="tsx-title">~ dev.vibe — contact</span>
        </div>
        <div className="tsx-body">
          {lines.slice(0, visible).map((l, i) => (
            <div key={i} className={`tsx-line tsx-line--${l.type} ${l.tone ? `tsx-line--${l.tone}` : ''}`}>
              {l.type === 'cmd' && <span className="tsx-prompt">$</span>}
              <span className="tsx-text">{l.text}</span>
            </div>
          ))}
          {/* live caret on the last revealed line while typing */}
          {visible < lines.length && <span className="tsx-caret" />}
        </div>
      </div>

      {showBtn && (
        <button className="tsx-reset" onClick={onReset}>
          {c.reset} <HiArrowRight />
        </button>
      )}
    </div>
  );
}
