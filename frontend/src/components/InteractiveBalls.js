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

    const resize = () => {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create balls
    const balls = [];
    for (let i = 0; i < count; i++) {
      const radius = Math.random() * 25 + 12;
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

    // Mouse events
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Animation loop
    const animate = () => {
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

      // Draw lines between close balls
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1;
      for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
          const dx = balls[i].x - balls[j].x;
          const dy = balls[i].y - balls[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.globalAlpha = (150 - dist) / 150 * 0.15;
            ctx.beginPath();
            ctx.moveTo(balls[i].x, balls[i].y);
            ctx.lineTo(balls[j].x, balls[j].y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      if (animRef.current) cancelAnimationFrame(animRef.current);
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
