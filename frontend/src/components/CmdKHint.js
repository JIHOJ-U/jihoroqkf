import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import './CmdKHint.css';

const COPY = {
  ko: { hint: '로 빠른 이동', close: '닫기' },
  en: { hint: 'for quick navigation', close: 'Close' },
};

function CmdKHint() {
  const { lang } = useLanguage();
  const c = COPY[lang] || COPY.ko;
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem('devvibe_cmdk_seen');
    if (seen) return;

    const timer = setTimeout(() => setVisible(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setVisible(false);
    setDismissed(true);
    localStorage.setItem('devvibe_cmdk_seen', '1');
  };

  // Hide after Cmd+K used
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') dismiss();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="cmdk-hint"
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          <span className="cmdk-hint-icon">💡</span>
          <span className="cmdk-hint-text">
            <kbd>Ctrl</kbd>+<kbd>K</kbd> {c.hint}
          </span>
          <button className="cmdk-hint-close" onClick={dismiss} aria-label={c.close}>×</button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default CmdKHint;
