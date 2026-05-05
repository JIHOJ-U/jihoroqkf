import React, { useEffect, useRef, useState } from 'react';
import './ValueChip.css';

const SCRAMBLE_CHARS = '!<>-_\\/[]{}—=+*^?#aBcDeFgHiJk0123456789';

function useScramble(target, trigger) {
  const [text, setText] = useState(target);

  useEffect(() => {
    if (!trigger) return;
    let frame = 0;
    const length = target.length;
    const intervalId = setInterval(() => {
      frame++;
      const next = target.split('').map((char, i) => {
        if (char === ' ') return ' ';
        if (frame > i * 2) return char;
        return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      }).join('');
      setText(next);
      if (frame > length * 2 + 4) {
        clearInterval(intervalId);
        setText(target);
      }
    }, 40);
    return () => clearInterval(intervalId);
  }, [target, trigger]);

  return text;
}

function ValueChip({ index, title, desc, tags = [], calibration = 95 }) {
  const cardRef = useRef(null);
  const [inView, setInView] = useState(false);
  const scrambled = useScramble(title, inView);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = (x / rect.width - 0.5) * 2;
    const py = (y / rect.height - 0.5) * 2;
    el.style.setProperty('--mouse-x', `${x}px`);
    el.style.setProperty('--mouse-y', `${y}px`);
    el.style.setProperty('--rx', `${-py * 3.5}deg`);
    el.style.setProperty('--ry', `${px * 3.5}deg`);
  };

  const handleMouseLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (calibration / 100) * circumference;

  return (
    <div
      ref={cardRef}
      className={`value-chip ${inView ? 'in-view' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="value-chip__pins value-chip__pins--left">
        {[...Array(7)].map((_, i) => <span key={i} />)}
      </div>
      <div className="value-chip__pins value-chip__pins--right">
        {[...Array(7)].map((_, i) => <span key={i} />)}
      </div>

      <div className="value-chip__spotlight" />

      <div className="value-chip__header">
        <span className="value-chip__model">IC-{String(index + 1).padStart(3, '0')}-VBE</span>
        <div className="value-chip__lights">
          <span className="value-chip__light value-chip__light--red" />
          <span className="value-chip__light value-chip__light--yellow" />
          <span className="value-chip__light value-chip__light--green" />
        </div>
      </div>

      <div className="value-chip__body">
        <span className="value-chip__index">// MODULE_{String(index + 1).padStart(2, '0')}</span>
        <h3 className="value-chip__title">{scrambled}</h3>
        <p className="value-chip__desc">{desc}</p>
      </div>

      <div className="value-chip__footer">
        <div className="value-chip__meter">
          <svg viewBox="0 0 50 50" className="value-chip__dial">
            <circle cx="25" cy="25" r={radius} className="value-chip__dial-track" />
            <circle
              cx="25" cy="25" r={radius}
              className="value-chip__dial-fill"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: inView ? dashOffset : circumference,
              }}
            />
          </svg>
          <div className="value-chip__meter-text">
            <span className="value-chip__meter-label">CAL</span>
            <span className="value-chip__meter-value">{calibration}</span>
          </div>
        </div>

        <div className="value-chip__tags">
          {tags.map((tag, i) => (
            <span key={i} className="value-chip__tag">{tag}</span>
          ))}
        </div>
      </div>

      <svg className="value-chip__trace" viewBox="0 0 300 200" preserveAspectRatio="none">
        <path d="M 0,160 L 60,160 L 75,145 L 130,145 L 145,130 L 220,130 L 235,115 L 300,115" />
        <path d="M 0,40 L 50,40 L 65,55 L 110,55" />
        <circle cx="60" cy="160" r="2.5" />
        <circle cx="130" cy="145" r="2.5" />
        <circle cx="220" cy="130" r="2.5" />
        <circle cx="50" cy="40" r="2.5" />
        <circle cx="110" cy="55" r="2.5" />
      </svg>
    </div>
  );
}

export default ValueChip;
