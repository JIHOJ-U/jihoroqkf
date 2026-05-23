import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './IntroLoader.css';

const TAG = { ko: '홈페이지 제작 전문', en: 'Web Development Studio' };
const SESSION_KEY = 'devvibe_intro_seen';

const CMD = 'npm run dev';
const TYPE_SPEED = 50;   // ms per typed char
const LINE_DELAY = 180;  // ms between boot log lines

// Fake boot log — pure dev flavor, English reads naturally in a console.
const BOOT_LINES = [
  { kind: 'head', text: 'Dev.Vibe', detail: 'v1.0.0' },
  { kind: 'ok',   text: 'dependencies resolved' },
  { kind: 'ok',   text: 'modules compiled', detail: '324 ms' },
  { kind: 'ok',   text: 'assets optimized' },
  { kind: 'ok',   text: 'ready', detail: 'http://localhost:3000' },
];

function IntroLoader() {
  const { lang } = useLanguage();
  const [show, setShow] = useState(false);
  const [typed, setTyped] = useState('');     // command chars typed so far
  const [lines, setLines] = useState(0);      // boot log lines revealed
  const [brand, setBrand] = useState(false);  // brand reveal
  const [exiting, setExiting] = useState(false);
  const started = useRef(false);              // guards React StrictMode double-invoke

  useEffect(() => {
    if (started.current) return;              // run the sequence exactly once
    started.current = true;

    let seen = false;
    try { seen = sessionStorage.getItem(SESSION_KEY) === '1'; } catch (e) {}
    if (seen) return;

    try { sessionStorage.setItem(SESSION_KEY, '1'); } catch (e) {}
    setShow(true);
    document.body.style.overflow = 'hidden';

    const finish = () => {
      setShow(false);
      document.body.style.overflow = '';
    };

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce) {
      setTyped(CMD);
      setLines(BOOT_LINES.length);
      setBrand(true);
      setTimeout(() => setExiting(true), 900);
      setTimeout(finish, 1300);
      return;
    }

    // 1) type the command
    let i = 0;
    const typer = setInterval(() => {
      i += 1;
      setTyped(CMD.slice(0, i));
      if (i >= CMD.length) clearInterval(typer);
    }, TYPE_SPEED);

    const cmdDone = CMD.length * TYPE_SPEED;       // ~550ms
    const linesStart = cmdDone + 220;

    // 2) reveal boot log lines one by one
    BOOT_LINES.forEach((_, idx) => {
      setTimeout(() => setLines(idx + 1), linesStart + idx * LINE_DELAY);
    });

    const linesDone = linesStart + BOOT_LINES.length * LINE_DELAY;

    // 3) brand reveal → exit → unmount
    setTimeout(() => setBrand(true), linesDone + 150);
    setTimeout(() => setExiting(true), linesDone + 1200);
    setTimeout(finish, linesDone + 2050);

    // No timer cleanup: this overlay lives at the app root, plays once, and
    // removes itself. Clearing would break StrictMode dev runs.
  }, []);

  if (!show) return null;

  const typingDone = typed.length >= CMD.length;

  return (
    <div className={`intro ${exiting ? 'intro--exit' : ''}`} aria-hidden="true">
      <div className="intro-scanlines" />
      <div className="intro-scanbar" />

      <div className="intro-inner">
        <div className="intro-term">
          <div className="intro-term__bar">
            <span className="intro-term__dot intro-term__dot--r" />
            <span className="intro-term__dot intro-term__dot--y" />
            <span className="intro-term__dot intro-term__dot--g" />
            <span className="intro-term__title">visitor@dev.vibe — zsh</span>
          </div>

          <div className="intro-term__body">
            {/* command line */}
            <div className="intro-line intro-line--cmd">
              <span className="intro-term__prompt">$</span>
              <span className="intro-term__cmd">{typed}</span>
              <span className={`intro-caret ${typingDone ? 'intro-caret--blink' : ''}`} />
            </div>

            {/* boot log */}
            {BOOT_LINES.slice(0, lines).map((l, idx) => (
              <div key={idx} className={`intro-line intro-line--${l.kind}`}>
                <span className="intro-line__mark">{l.kind === 'head' ? '▲' : '✓'}</span>
                <span className="intro-line__text">{l.text}</span>
                {l.detail && <span className="intro-line__detail">{l.detail}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* brand reveal */}
        <div className={`intro-brand ${brand ? 'intro-brand--in' : ''}`}>
          <h1 className="intro-logo" translate="no">Dev<span className="intro-dot">.</span>Vibe</h1>
          <p className="intro-tag">{TAG[lang] || TAG.ko}</p>
        </div>
      </div>
    </div>
  );
}

export default IntroLoader;
