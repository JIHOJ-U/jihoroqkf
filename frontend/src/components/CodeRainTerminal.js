import React, { useEffect, useRef, useState } from 'react';
import './CodeRainTerminal.css';

const SCRIPT = [
  { prompt: '$', text: 'npm run build', delay: 30 },
  { line: '> dev.vibe@1.0.0 build', kind: 'dim', delay: 8 },
  { line: '> react-scripts build && echo "ready"', kind: 'dim', delay: 8 },
  { line: '', delay: 250 },
  { line: 'Creating an optimized production build...', kind: 'info', delay: 18 },
  { line: 'Compiled successfully in 2.4s', kind: 'ok', delay: 18 },
  { line: '', delay: 220 },
  { prompt: '$', text: 'git push origin main', delay: 35 },
  { line: 'Enumerating objects: 24, done.', kind: 'dim', delay: 10 },
  { line: 'Counting objects: 100% (24/24), done.', kind: 'dim', delay: 10 },
  { line: 'Writing objects: 100% (14/14), 4.21 KiB', kind: 'dim', delay: 10 },
  { line: 'To github.com/JIHOJ-U/devvibe.git', kind: 'dim', delay: 10 },
  { line: '   d2c7fdc..a1f9d3b  main -> main', kind: 'ok', delay: 10 },
  { line: '', delay: 280 },
  { prompt: '$', text: 'deploy --prod', delay: 32 },
  { line: '→ uploading to production...', kind: 'info', delay: 16 },
  { line: '✓ live at devvibe.dev', kind: 'ok', delay: 16 },
  { line: '', delay: 320 },
  { prompt: '$', text: 'ready for next project', delay: 38 },
];

function CodeRainTerminal() {
  const [rendered, setRendered] = useState([]);
  const [typing, setTyping] = useState({ scriptIdx: 0, charIdx: 0, active: false });
  const timeoutRef = useRef(null);
  const containerRef = useRef(null);
  const wrapRef = useRef(null);
  const [inView, setInView] = useState(true);

  // Pause the whole typing loop (and its per-char re-renders) when the hero
  // terminal is scrolled out of view — saves continuous work while reading the page.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return undefined;
    let alive = true;

    const tick = () => {
      if (!alive) return;
      const idx = typing.scriptIdx;
      if (idx >= SCRIPT.length) {
        // Loop after a pause
        timeoutRef.current = setTimeout(() => {
          if (!alive) return;
          setRendered([]);
          setTyping({ scriptIdx: 0, charIdx: 0, active: false });
        }, 3500);
        return;
      }
      const step = SCRIPT[idx];

      // Command line — type char by char
      if (step.prompt !== undefined) {
        if (typing.charIdx === 0) {
          setRendered(r => [...r, { kind: 'cmd', prompt: step.prompt, text: '', typing: true }]);
        }
        if (typing.charIdx < step.text.length) {
          const nextChar = step.text[typing.charIdx];
          setRendered(r => {
            const next = [...r];
            const last = next[next.length - 1];
            next[next.length - 1] = { ...last, text: last.text + nextChar };
            return next;
          });
          timeoutRef.current = setTimeout(
            () => setTyping(t => ({ ...t, charIdx: t.charIdx + 1 })),
            step.delay
          );
        } else {
          // Finished typing this command — finalize, move next
          setRendered(r => {
            const next = [...r];
            next[next.length - 1] = { ...next[next.length - 1], typing: false };
            return next;
          });
          timeoutRef.current = setTimeout(
            () => setTyping({ scriptIdx: idx + 1, charIdx: 0, active: false }),
            220
          );
        }
        return;
      }

      // Static output line — appears instantly
      setRendered(r => [...r, { kind: step.kind || 'line', text: step.line }]);
      timeoutRef.current = setTimeout(
        () => setTyping({ scriptIdx: idx + 1, charIdx: 0, active: false }),
        step.delay
      );
    };

    tick();
    return () => {
      alive = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typing.scriptIdx, typing.charIdx, inView]);

  // Auto-scroll to bottom of terminal as new lines arrive
  useEffect(() => {
    const el = containerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [rendered]);

  return (
    <div className="crt-wrap" aria-hidden="true" ref={wrapRef}>
      <div className="crt-window">
        <div className="crt-header">
          <span className="crt-dot crt-dot--red" />
          <span className="crt-dot crt-dot--yellow" />
          <span className="crt-dot crt-dot--green" />
          <span className="crt-header-title">~ dev.vibe — bash</span>
        </div>
        <div className="crt-body" ref={containerRef}>
          {rendered.map((row, i) => {
            const isLast = i === rendered.length - 1;
            if (row.kind === 'cmd') {
              return (
                <div key={i} className="crt-row crt-row--cmd">
                  <span className="crt-prompt">{row.prompt}</span>
                  <span className="crt-text">{row.text}</span>
                  {row.typing && isLast && <span className="crt-caret" />}
                </div>
              );
            }
            if (row.text === '') return <div key={i} className="crt-row crt-row--blank" />;
            return (
              <div key={i} className={`crt-row crt-row--${row.kind || 'line'}`}>
                <span className="crt-text">{row.text}</span>
              </div>
            );
          })}
          {/* Idle cursor at end */}
          {rendered.length > 0 && rendered[rendered.length - 1].kind !== 'cmd' && (
            <div className="crt-row crt-row--cmd">
              <span className="crt-prompt">$</span>
              <span className="crt-caret" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CodeRainTerminal;
