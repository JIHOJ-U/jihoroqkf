import React, { useEffect, useRef, useState } from 'react';
import { useAchievement } from '../contexts/AchievementContext';
import './KonamiCode.css';

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

function KonamiCode() {
  const [active, setActive] = useState(false);
  const buffer = useRef([]);
  const { unlock } = useAchievement();
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (!e.key || typeof e.key !== 'string') return;
      const key = e.key.startsWith('Arrow') ? e.key : e.key.toLowerCase();
      buffer.current.push(key);
      if (buffer.current.length > KONAMI.length) buffer.current.shift();

      const isMatch = buffer.current.length === KONAMI.length &&
        buffer.current.every((k, i) => k === KONAMI[i]);

      if (isMatch && !active) {
        setActive(true);
        unlock('KONAMI');
        buffer.current = [];
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [active]);

  // Matrix rain animation
  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ$#!@%&*()<>{}[]/\\|=+-_:;,.?*なのにあいうえおをんカキクケコ'.split('');
    const fontSize = 16;
    const cols = Math.floor(canvas.width / fontSize);
    const drops = Array(cols).fill(0).map(() => Math.random() * -100);

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px 'Courier New', monospace`;

      drops.forEach((y, i) => {
        const ch = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;

        // Leading character bright
        ctx.fillStyle = '#a7f3d0';
        ctx.fillText(ch, x, y * fontSize);

        // Trail darker
        ctx.fillStyle = '#10b981';
        ctx.fillText(ch, x, (y - 1) * fontSize);

        if (y * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        } else {
          drops[i] = y + 1;
        }
      });

      animRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [active]);

  if (!active) return null;

  return (
    <div className="konami-overlay">
      <canvas ref={canvasRef} className="konami-canvas" />
      <div className="konami-message">
        <div className="konami-title">YOU FOUND IT!</div>
        <div className="konami-sub">↑ ↑ ↓ ↓ ← → ← → B A</div>
        <div className="konami-text"><span className="prompt">$</span> <span className="typed">unlock_secret_mode</span></div>
        <div className="konami-text"><span className="dim">→ Loading matrix protocol...</span></div>
        <div className="konami-text"><span className="dim">→ Welcome, fellow developer 👋</span></div>
        <div className="konami-text"><span className="dim">→ Connection established to Dev.Vibe</span></div>
        <button className="konami-exit" onClick={() => setActive(false)}>EXIT MATRIX</button>
      </div>
    </div>
  );
}

export default KonamiCode;
