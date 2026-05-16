import React, { useEffect, useRef, useState } from 'react';
import './CursorFollower.css';

const TRAIL_LENGTH = 6;
const TRAIL_COLORS = ['#6366f1', '#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd'];
const HOVER_SELECTOR = 'a, button, .work-card, .portfolio-card, .service-card, .skill-item, .value-card, input, textarea, select, .type-option, .filter-tab';

function CursorFollower() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const trailRefs = useRef([]);
  const [clicking, setClicking] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    // Skip on touch / coarse pointer devices and reduced-motion users
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (coarse || reduce) {
      setEnabled(false);
      return;
    }

    const dot = dotRef.current;
    const ring = ringRef.current;
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    const trail = Array(TRAIL_LENGTH).fill(0).map(() => ({ x: 0, y: 0 }));

    let rafId = null;
    let lastMoveAt = 0;
    let hoverTickPending = false;
    let lastHoverState = false;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      lastMoveAt = performance.now();
      if (dot) {
        dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }
      if (rafId == null) {
        rafId = requestAnimationFrame(animate);
      }

      // Throttle hover detection: only run elementFromPoint every other frame, only setState on change
      if (!hoverTickPending) {
        hoverTickPending = true;
        setTimeout(() => {
          hoverTickPending = false;
          const el = document.elementFromPoint(mouseX, mouseY);
          const next = !!(el && el.closest(HOVER_SELECTOR));
          if (next !== lastHoverState) {
            lastHoverState = next;
            setHovering(next);
          }
        }, 60);
      }
    };

    const handleMouseDown = () => setClicking(true);
    const handleMouseUp = () => setClicking(false);

    const animate = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      if (ring) {
        ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }

      trail[0].x += (mouseX - trail[0].x) * 0.4;
      trail[0].y += (mouseY - trail[0].y) * 0.4;
      for (let i = 1; i < TRAIL_LENGTH; i++) {
        trail[i].x += (trail[i - 1].x - trail[i].x) * 0.4;
        trail[i].y += (trail[i - 1].y - trail[i].y) * 0.4;
      }
      for (let i = 0; i < TRAIL_LENGTH; i++) {
        const el = trailRefs.current[i];
        if (el) {
          el.style.transform = `translate3d(${trail[i].x}px, ${trail[i].y}px, 0) translate(-50%, -50%)`;
        }
      }

      // Stop the RAF if mouse hasn't moved for 200ms and ring is essentially at rest
      const idle = performance.now() - lastMoveAt > 200;
      const settled = Math.abs(mouseX - ringX) < 0.5 && Math.abs(mouseY - ringY) < 0.5;
      if (idle && settled) {
        rafId = null;
        return;
      }
      rafId = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mousedown', handleMouseDown, { passive: true });
    document.addEventListener('mouseup', handleMouseUp, { passive: true });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      {Array.from({ length: TRAIL_LENGTH }).map((_, i) => (
        <div
          key={i}
          ref={el => (trailRefs.current[i] = el)}
          className="cursor-trail"
          style={{
            background: TRAIL_COLORS[i % TRAIL_COLORS.length],
            opacity: (1 - i / TRAIL_LENGTH) * 0.45,
            width: `${Math.max(2, 8 - i * 0.6)}px`,
            height: `${Math.max(2, 8 - i * 0.6)}px`,
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
