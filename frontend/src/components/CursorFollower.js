import React, { useEffect, useRef, useState } from 'react';
import './CursorFollower.css';

const TRAIL_LENGTH = 12;
const TRAIL_COLORS = ['#6366f1', '#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd'];

function CursorFollower() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const trailRefs = useRef([]);
  const [clicking, setClicking] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    const trail = Array(TRAIL_LENGTH).fill(0).map(() => ({ x: 0, y: 0 }));

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dot) {
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
      }
    };

    const handleMouseDown = () => setClicking(true);
    const handleMouseUp = () => setClicking(false);

    const handleMouseOver = (e) => {
      const target = e.target;
      if (target.closest('a, button, .work-card, .portfolio-card, .service-card, .skill-item, .value-card, input, textarea, select, label[class*="upload"], .type-option, .filter-tab')) {
        setHovering(true);
      } else {
        setHovering(false);
      }
    };

    // Smooth follow + trail
    const animate = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      if (ring) {
        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';
      }

      // Update trail (each follows the previous with delay)
      trail[0].x += (mouseX - trail[0].x) * 0.4;
      trail[0].y += (mouseY - trail[0].y) * 0.4;
      for (let i = 1; i < TRAIL_LENGTH; i++) {
        trail[i].x += (trail[i - 1].x - trail[i].x) * 0.4;
        trail[i].y += (trail[i - 1].y - trail[i].y) * 0.4;
      }
      trail.forEach((p, i) => {
        const el = trailRefs.current[i];
        if (el) {
          el.style.left = p.x + 'px';
          el.style.top = p.y + 'px';
        }
      });

      requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseOver);
    animate();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      {/* Trail particles */}
      {Array.from({ length: TRAIL_LENGTH }).map((_, i) => (
        <div
          key={i}
          ref={el => trailRefs.current[i] = el}
          className="cursor-trail"
          style={{
            background: TRAIL_COLORS[i % TRAIL_COLORS.length],
            opacity: (1 - i / TRAIL_LENGTH) * 0.45,
            width: `${Math.max(2, 8 - i * 0.5)}px`,
            height: `${Math.max(2, 8 - i * 0.5)}px`,
            zIndex: 99990 - i,
          }}
        />
      ))}
      <div ref={dotRef} className={`cursor-dot ${clicking ? 'clicking' : ''}`} />
      <div ref={ringRef} className={`cursor-ring ${hovering ? 'hovering' : ''} ${clicking ? 'clicking' : ''}`} />
    </>
  );
}

export default CursorFollower;
