import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowLeft, HiHome, HiTerminal } from 'react-icons/hi';
import { useLanguage } from '../contexts/LanguageContext';
import './NotFound.css';

const COPY = {
  ko: {
    hint: '// 페이지가 존재하지 않거나 이동되었습니다.',
    home: '홈으로 가기', back: '이전 페이지', terminal: '터미널로',
    tipPre: '를 눌러 빠르게 이동할 수 있습니다.',
  },
  en: {
    hint: '// This page does not exist or has been moved.',
    home: 'Go home', back: 'Go back', terminal: 'Terminal',
    tipPre: 'to navigate quickly.',
  },
};

function NotFound() {
  const { lang } = useLanguage();
  const c = COPY[lang] || COPY.ko;
  const location = useLocation();
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 200);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const trace = [
    { fn: 'Router.match', file: 'react-router-dom/index.js', line: 247 },
    { fn: 'App.render', file: 'src/App.js', line: 28 },
    { fn: 'Routes.findMatch', file: 'react-router-dom/Routes.js', line: 102 },
    { fn: 'Visitor.navigate', file: 'src/index.js', line: 12 },
  ];

  return (
    <div className="nf-page">
      <div className="nf-container">
        <motion.div
          className="nf-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Big 404 */}
          <div className={`nf-code ${glitch ? 'glitch' : ''}`} data-text="404">
            404
          </div>

          {/* Error message */}
          <div className="nf-error">
            <span className="nf-error-type">RouteNotFoundError</span>
            <span className="nf-colon">:</span>
            <span className="nf-error-msg"> Cannot resolve path <code>"{location.pathname}"</code></span>
          </div>

          {/* Stack trace */}
          <div className="nf-stack">
            <div className="nf-stack-header">
              <span className="nf-dot nf-dot--red" />
              <span className="nf-dot nf-dot--yellow" />
              <span className="nf-dot nf-dot--green" />
              <span className="nf-stack-title">stacktrace.log</span>
            </div>
            <div className="nf-stack-body">
              <div className="nf-line">
                <span className="nf-line-num">1</span>
                <span className="nf-error-type">Error</span>
                <span>: Path not found in route table</span>
              </div>
              {trace.map((t, i) => (
                <div key={i} className="nf-line">
                  <span className="nf-line-num">{i + 2}</span>
                  <span className="nf-dim">  at </span>
                  <span className="nf-fn">{t.fn}</span>
                  <span className="nf-dim"> (</span>
                  <span className="nf-file">{t.file}</span>
                  <span className="nf-dim">:</span>
                  <span className="nf-line-no">{t.line}</span>
                  <span className="nf-dim">)</span>
                </div>
              ))}
              <div className="nf-line nf-line--hint">
                <span className="nf-line-num">→</span>
                <span className="nf-dim">{c.hint}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="nf-actions">
            <Link to="/" className="nf-btn nf-btn--primary">
              <HiHome /> {c.home}
            </Link>
            <button className="nf-btn nf-btn--ghost" onClick={() => window.history.back()}>
              <HiArrowLeft /> {c.back}
            </button>
            <Link to="/terminal" className="nf-btn nf-btn--ghost">
              <HiTerminal /> {c.terminal}
            </Link>
          </div>

          <p className="nf-tip">
            <kbd>Ctrl</kbd> + <kbd>K</kbd> {c.tipPre}
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default NotFound;
