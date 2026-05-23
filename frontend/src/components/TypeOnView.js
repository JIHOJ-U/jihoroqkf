import React, { useEffect, useRef, useState } from 'react';
import './TypeOnView.css';

/* Types `text` character-by-character the first time it scrolls into view.
   Renders inline; reserves height so there's no layout jump. */
export default function TypeOnView({
  text = '',
  as: Tag = 'span',
  className = '',
  speed = 65,
  caret = true,
}) {
  const ref = useRef(null);
  const [started, setStarted] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setCount(text.length); return; }
    let i = 0;
    const t = setInterval(() => {
      i += 1;
      setCount(i);
      if (i >= text.length) clearInterval(t);
    }, speed);
    return () => clearInterval(t);
  }, [started, text, speed]);

  const done = count >= text.length;

  return (
    <Tag ref={ref} className={`tov ${className}`}>
      {/* invisible full text reserves layout space, no jump */}
      <span className="tov-ghost" aria-hidden="true">{text}</span>
      <span className="tov-typed">
        {started ? text.slice(0, count) : ''}
        {caret && started && (
          <span className={`tov-caret ${done ? 'tov-caret--blink' : ''}`} />
        )}
      </span>
    </Tag>
  );
}
