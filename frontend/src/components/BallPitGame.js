import React, { useEffect, useRef, useState } from 'react';

const BALL_COLORS = [
  '#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd',
  '#f59e0b', '#06b6d4', '#10b981', '#f43f5e',
  '#3b82f6', '#ec4899', '#14b8a6', '#f97316'
];

function BallPitGame({ width = 800, height = 350 }) {
  const canvasRef = useRef(null);
  const ballsRef = useRef([]);
  const holesRef = useRef([]);
  const mouseRef = useRef({ x: -1000, y: -1000, down: false });
  const scoreRef = useRef(0);
  const [score, setScore] = useState(0);
  const [particles, setParticles] = useState([]);
  const particlesRef = useRef([]);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const cw = canvas.parentElement.offsetWidth;
    const ch = height;
    canvas.width = cw;
    canvas.height = ch;

    // Create holes (pockets)
    const holeRadius = 22;
    const holes = [
      { x: holeRadius + 20, y: holeRadius + 20 },
      { x: cw - holeRadius - 20, y: holeRadius + 20 },
      { x: holeRadius + 20, y: ch - holeRadius - 20 },
      { x: cw - holeRadius - 20, y: ch - holeRadius - 20 },
      { x: cw / 2, y: holeRadius + 10 },
      { x: cw / 2, y: ch - holeRadius - 10 },
    ];
    holesRef.current = holes;

    // Create balls
    const createBall = () => {
      const radius = Math.random() * 10 + 10;
      return {
        x: Math.random() * (cw - 100) + 50,
        y: Math.random() * (ch - 100) + 50,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius,
        color: BALL_COLORS[Math.floor(Math.random() * BALL_COLORS.length)],
        mass: radius,
        alive: true,
        sinking: false,
        sinkTimer: 0,
      };
    };

    const balls = [];
    for (let i = 0; i < 20; i++) {
      balls.push(createBall());
    }
    ballsRef.current = balls;
    scoreRef.current = 0;

    // Mouse
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };
    const handleMouseDown = () => { mouseRef.current.down = true; };
    const handleMouseUp = () => { mouseRef.current.down = false; };
    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000, down: false };
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Spawn new balls periodically
    const spawnInterval = setInterval(() => {
      const alive = ballsRef.current.filter(b => b.alive && !b.sinking);
      if (alive.length < 12) {
        ballsRef.current.push(createBall());
      }
    }, 2000);

    // Explosion particles
    const spawnExplosion = (x, y, color) => {
      const parts = [];
      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 * i) / 8;
        parts.push({
          x, y,
          vx: Math.cos(angle) * (Math.random() * 3 + 2),
          vy: Math.sin(angle) * (Math.random() * 3 + 2),
          radius: Math.random() * 4 + 2,
          color,
          life: 1,
        });
      }
      particlesRef.current = [...particlesRef.current, ...parts];
    };

    const animate = () => {
      ctx.clearRect(0, 0, cw, ch);
      const mouse = mouseRef.current;

      // Draw holes
      holes.forEach(hole => {
        // Outer ring
        ctx.beginPath();
        ctx.arc(hole.x, hole.y, holeRadius + 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        ctx.fill();
        // Inner hole
        ctx.beginPath();
        ctx.arc(hole.x, hole.y, holeRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fill();
        // Inner gradient
        const hg = ctx.createRadialGradient(hole.x, hole.y, 0, hole.x, hole.y, holeRadius);
        hg.addColorStop(0, 'rgba(0,0,0,0.8)');
        hg.addColorStop(1, 'rgba(0,0,0,0.3)');
        ctx.fillStyle = hg;
        ctx.fill();
      });

      // Update & draw balls
      ballsRef.current.forEach((ball, i) => {
        if (!ball.alive) return;

        // Sinking animation
        if (ball.sinking) {
          ball.sinkTimer += 0.05;
          ball.radius *= 0.92;
          if (ball.radius < 1) {
            ball.alive = false;
            scoreRef.current += 10;
            setScore(scoreRef.current);
            spawnExplosion(ball.x, ball.y, ball.color);
          }
          // Draw sinking ball
          ctx.beginPath();
          ctx.arc(ball.x, ball.y, Math.max(ball.radius, 0.5), 0, Math.PI * 2);
          ctx.fillStyle = ball.color;
          ctx.globalAlpha = 1 - ball.sinkTimer;
          ctx.fill();
          ctx.globalAlpha = 1;
          return;
        }

        // Mouse push force
        const dx = ball.x - mouse.x;
        const dy = ball.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const pushRadius = mouse.down ? 160 : 100;
        const pushForce = mouse.down ? 4 : 2;

        if (dist < pushRadius && dist > 0) {
          const force = (pushRadius - dist) / pushRadius;
          const angle = Math.atan2(dy, dx);
          ball.vx += Math.cos(angle) * force * pushForce;
          ball.vy += Math.sin(angle) * force * pushForce;
        }

        // Ball collision
        for (let j = i + 1; j < ballsRef.current.length; j++) {
          const other = ballsRef.current[j];
          if (!other.alive || other.sinking) continue;
          const bx = other.x - ball.x;
          const by = other.y - ball.y;
          const bDist = Math.sqrt(bx * bx + by * by);
          const minDist = ball.radius + other.radius;
          if (bDist < minDist && bDist > 0) {
            const angle = Math.atan2(by, bx);
            const overlap = minDist - bDist;
            ball.vx -= Math.cos(angle) * overlap * 0.15;
            ball.vy -= Math.sin(angle) * overlap * 0.15;
            other.vx += Math.cos(angle) * overlap * 0.15;
            other.vy += Math.sin(angle) * overlap * 0.15;
          }
        }

        // Check hole collision
        holes.forEach(hole => {
          const hx = ball.x - hole.x;
          const hy = ball.y - hole.y;
          const hDist = Math.sqrt(hx * hx + hy * hy);
          if (hDist < holeRadius - 2) {
            ball.sinking = true;
            ball.vx = 0;
            ball.vy = 0;
          } else if (hDist < holeRadius + ball.radius) {
            // Gravity toward hole
            const pullForce = 0.3;
            ball.vx -= (hx / hDist) * pullForce;
            ball.vy -= (hy / hDist) * pullForce;
          }
        });

        // Friction
        ball.vx *= 0.98;
        ball.vy *= 0.98;

        // Move
        ball.x += ball.vx;
        ball.y += ball.vy;

        // Walls
        if (ball.x - ball.radius < 0) { ball.x = ball.radius; ball.vx *= -0.6; }
        if (ball.x + ball.radius > cw) { ball.x = cw - ball.radius; ball.vx *= -0.6; }
        if (ball.y - ball.radius < 0) { ball.y = ball.radius; ball.vy *= -0.6; }
        if (ball.y + ball.radius > ch) { ball.y = ch - ball.radius; ball.vy *= -0.6; }

        // Draw
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.globalAlpha = 0.85;
        ctx.fill();

        // Highlight
        const g = ctx.createRadialGradient(
          ball.x - ball.radius * 0.3, ball.y - ball.radius * 0.3, ball.radius * 0.05,
          ball.x, ball.y, ball.radius
        );
        g.addColorStop(0, 'rgba(255,255,255,0.45)');
        g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Draw & update explosion particles
      particlesRef.current = particlesRef.current.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.03;
        p.vx *= 0.96;
        p.vy *= 0.96;
        if (p.life <= 0) return false;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * p.life, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.fill();
        ctx.globalAlpha = 1;
        return true;
      });

      // Clean dead balls
      ballsRef.current = ballsRef.current.filter(b => b.alive);

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      const newW = canvas.parentElement.offsetWidth;
      canvas.width = newW;
      holesRef.current = [
        { x: holeRadius + 20, y: holeRadius + 20 },
        { x: newW - holeRadius - 20, y: holeRadius + 20 },
        { x: holeRadius + 20, y: ch - holeRadius - 20 },
        { x: newW - holeRadius - 20, y: ch - holeRadius - 20 },
        { x: newW / 2, y: holeRadius + 10 },
        { x: newW / 2, y: ch - holeRadius - 10 },
      ];
    };
    window.addEventListener('resize', handleResize);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      clearInterval(spawnInterval);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [height]);

  return (
    <div style={{ position: 'relative', width: '100%', height: `${height}px` }}>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '12px',
          cursor: 'none',
        }}
      />
      {score > 0 && (
        <div style={{
          position: 'absolute',
          top: 16,
          right: 24,
          fontSize: '0.82rem',
          fontWeight: 700,
          color: '#6366f1',
          background: 'rgba(255,255,255,0.9)',
          padding: '6px 16px',
          borderRadius: '20px',
          zIndex: 5,
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(99,102,241,0.2)',
          pointerEvents: 'none',
        }}>
          Score: {score}
        </div>
      )}
      <div style={{
        position: 'absolute',
        bottom: 12,
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '0.72rem',
        color: 'rgba(99,102,241,0.5)',
        fontWeight: 600,
        letterSpacing: '1px',
        pointerEvents: 'none',
        zIndex: 5,
      }}>
        DRAG TO PUSH BALLS INTO HOLES
      </div>
    </div>
  );
}

export default BallPitGame;
