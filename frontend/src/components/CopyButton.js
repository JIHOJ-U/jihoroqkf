import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiClipboard, HiCheck } from 'react-icons/hi';
import { useLanguage } from '../contexts/LanguageContext';
import './CopyButton.css';

const COPY = {
  ko: { copy: '복사', copied: '복사됨!' },
  en: { copy: 'Copy', copied: 'Copied!' },
};

function CopyButton({ value, label = '', size = 'sm', className = '' }) {
  const { lang } = useLanguage();
  const c = COPY[lang] || COPY.ko;
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = value;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <button
      type="button"
      className={`copy-btn copy-btn--${size} ${className}`}
      onClick={handleCopy}
      title={c.copy}
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.span
            key="copied"
            className="copy-btn__icon copy-btn__icon--success"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <HiCheck />
          </motion.span>
        ) : (
          <motion.span
            key="default"
            className="copy-btn__icon"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <HiClipboard />
          </motion.span>
        )}
      </AnimatePresence>
      {label && <span className="copy-btn__label">{copied ? c.copied : label}</span>}
    </button>
  );
}

export default CopyButton;
