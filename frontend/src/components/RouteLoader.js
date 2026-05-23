import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './RouteLoader.css';

/* Branded, terminal-flavored loading screen shown via <Suspense> while a
   route's code chunk loads. White background, centered logo, a fake build
   log (typed command + live % + step status), a progress bar that fills
   left → right, and a subtle CRT scanline overlay. Appears only when a page
   actually needs to load. */

const STEPS = [
  { at: 0,   label: 'resolving dependencies' },
  { at: 35,  label: 'compiling modules' },
  { at: 72,  label: 'optimizing chunks' },
  { at: 100, label: 'ready' },
];

const DURATION = 800;   // ms for the bar/counter to reach 100%
const TYPE_SPEED = 42;  // ms per typed character

function RouteLoader() {
  const location = useLocation();
  const path = location.pathname === '/' ? '/' : location.pathname;
  const fullCmd = `load ${path}`;

  const [pct, setPct] = useState(0);
  const [typed, setTyped] = useState('');
  const raf = useRef(0);

  const reduced = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // progress bar + counter
  useEffect(() => {
    if (reduced) { setPct(100); return; }
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / DURATION);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setPct(Math.round(eased * 100));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [reduced]);

  // typewriter for the command
  useEffect(() => {
    if (reduced) { setTyped(fullCmd); return; }
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTyped(fullCmd.slice(0, i));
      if (i >= fullCmd.length) clearInterval(id);
    }, TYPE_SPEED);
    return () => clearInterval(id);
  }, [fullCmd, reduced]);

  const done = pct >= 100;
  const typingDone = typed.length >= fullCmd.length;
  const step = STEPS.slice().reverse().find((s) => pct >= s.at) || STEPS[0];

  return (
    <div className="route-loader" role="status" aria-label="Loading">
      <div className="route-loader__scanlines" aria-hidden="true" />
      <div className="route-loader__scanbar" aria-hidden="true" />

      <div className="route-loader__inner">
        <img
          src="/devvibelogo.jpg"
          alt="Dev.Vibe"
          className="route-loader__logo"
          draggable="false"
        />

        <div className="route-loader__term">
          <span className="route-loader__prompt">~/dev.vibe</span>
          <span className="route-loader__sep">$</span>
          <span className="route-loader__cmd">{typed}</span>
          <span className={`route-loader__caret ${typingDone ? 'is-blinking' : ''}`} />
        </div>

        <div className="route-loader__progress">
          <div className="route-loader__bar">
            <span className="route-loader__fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="route-loader__pct">{pct}%</span>
        </div>

        <div className={`route-loader__status ${done ? 'is-done' : ''}`}>
          <span className="route-loader__status-mark">{done ? '✓' : '›'}</span>
          <span className="route-loader__status-text">{step.label}</span>
          {!done && (
            <span className="route-loader__dots"><i /><i /><i /></span>
          )}
        </div>
      </div>
    </div>
  );
}

export default RouteLoader;
