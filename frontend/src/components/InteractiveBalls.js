import React, { useEffect, useRef } from 'react';

const BALL_COLORS = [
  '#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd',
  '#f59e0b', '#06b6d4', '#10b981', '#f43f5e',
  '#3b82f6', '#ec4899'
];

function InteractiveBalls({ count = 15 }) {
  const canvasRef = useRef(null);
  const ballsRef = useRef([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const isSmallScreen = window.matchMedia('(max-width: 768px)').matches;
    const effectiveCount = isSmallScreen ? Math.max(6, Math.floor(count * 0.55)) : count;
    const radiusScale = isSmallScreen ? 0.7 : 1;

    const resize = () => {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create balls
    const balls = [];
    for (let i = 0; i < effectiveCount; i++) {
      const radius = (Math.random() * 25 + 12) * radiusScale;
      balls.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        radius,
        color: BALL_COLORS[Math.floor(Math.random() * BALL_COLORS.length)],
        opacity: Math.random() * 0.4 + 0.3,
        mass: radius,
      });
    }
    ballsRef.current = balls;

    // Pointer events (mouse + touch)
    const updatePointer = (clientX, clientY) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    };

    const handleMouseMove = (e) => updatePointer(e.clientX, e.clientY);
    const handleMouseLeave = () => { mouseRef.current = { x: -1000, y: -1000 }; };
    const handleTouch = (e) => {
      if (e.touches && e.touches[0]) {
        updatePointer(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const handleTouchEnd = () => { mouseRef.current = { x: -1000, y: -1000 }; };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('touchmove', handleTouch, { passive: true });
    canvas.addEventListener('touchstart', handleTouch, { passive: true });
    canvas.addEventListener('touchend', handleTouchEnd);

    // Throttle to ~45fps — physics still feels smooth, cuts CPU ~25%
    const FRAME_MIN = 1000 / 45;
    let lastFrameAt = 0;

    // Animation loop
    const animate = (now) => {
      if (now !== undefined && now - lastFrameAt < FRAME_MIN) {
        animRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrameAt = now || performance.now();

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mouse = mouseRef.current;

      balls.forEach((ball, i) => {
        // Mouse repulsion
        const dx = ball.x - mouse.x;
        const dy = ball.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const repelRadius = 120;

        if (dist < repelRadius && dist > 0) {
          const force = (repelRadius - dist) / repelRadius;
          const angle = Math.atan2(dy, dx);
          ball.vx += Math.cos(angle) * force * 2;
          ball.vy += Math.sin(angle) * force * 2;
        }

        // Ball-to-ball collision
        for (let j = i + 1; j < balls.length; j++) {
          const other = balls[j];
          const bx = other.x - ball.x;
          const by = other.y - ball.y;
          const bDist = Math.sqrt(bx * bx + by * by);
          const minDist = ball.radius + other.radius;

          if (bDist < minDist && bDist > 0) {
            const angle = Math.atan2(by, bx);
            const overlap = minDist - bDist;
            const pushX = Math.cos(angle) * overlap * 0.3;
            const pushY = Math.sin(angle) * overlap * 0.3;

            ball.vx -= pushX / ball.mass;
            ball.vy -= pushY / ball.mass;
            other.vx += pushX / other.mass;
            other.vy += pushY / other.mass;
          }
        }

        // Friction
        ball.vx *= 0.985;
        ball.vy *= 0.985;

        // Move
        ball.x += ball.vx;
        ball.y += ball.vy;

        // Bounce off walls
        if (ball.x - ball.radius < 0) {
          ball.x = ball.radius;
          ball.vx *= -0.7;
        }
        if (ball.x + ball.radius > canvas.width) {
          ball.x = canvas.width - ball.radius;
          ball.vx *= -0.7;
        }
        if (ball.y - ball.radius < 0) {
          ball.y = ball.radius;
          ball.vy *= -0.7;
        }
        if (ball.y + ball.radius > canvas.height) {
          ball.y = canvas.height - ball.radius;
          ball.vy *= -0.7;
        }

        // Draw ball
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.globalAlpha = ball.opacity;
        ctx.fill();

        // Highlight / glow
        const gradient = ctx.createRadialGradient(
          ball.x - ball.radius * 0.3,
          ball.y - ball.radius * 0.3,
          ball.radius * 0.1,
          ball.x,
          ball.y,
          ball.radius
        );
        gradient.addColorStop(0, 'rgba(255,255,255,0.3)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = gradient;
        ctx.globalAlpha = ball.opacity;
        ctx.fill();

        ctx.globalAlpha = 1;
      });

      animRef.current = requestAnimationFrame(animate);
    };

    let visible = true;
    const start = () => {
      if (animRef.current == null) animRef.current = requestAnimationFrame(animate);
    };
    const stop = () => {
      if (animRef.current != null) {
        cancelAnimationFrame(animRef.current);
        animRef.current = null;
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (visible) start();
    };
    document.addEventListener('visibilitychange', onVisibility);

    start();

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('touchmove', handleTouch);
      canvas.removeEventListener('touchstart', handleTouch);
      canvas.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('visibilitychange', onVisibility);
      observer.disconnect();
      stop();
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'auto',
      }}
    />
  );
}

export default InteractiveBalls;
