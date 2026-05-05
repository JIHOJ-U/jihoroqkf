import React, { useEffect, useRef } from 'react';
import './FloatingParticles.css';

function FloatingParticles({ count = 20, colors = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#f59e0b', '#06b6d4'], className = '' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear existing
    container.innerHTML = '';

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';

      const size = Math.random() * 12 + 4;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const left = Math.random() * 100;
      const delay = Math.random() * 8;
      const duration = Math.random() * 10 + 8;
      const opacity = Math.random() * 0.4 + 0.1;

      particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        left: ${left}%;
        animation-delay: ${delay}s;
        animation-duration: ${duration}s;
        opacity: ${opacity};
        border-radius: ${Math.random() > 0.5 ? '50%' : '30%'};
      `;

      container.appendChild(particle);
    }
  }, [count, colors]);

  return <div ref={containerRef} className={`floating-particles ${className}`} />;
}

export default FloatingParticles;
