import React, { useEffect, useRef } from 'react';

// Lightweight 3D-like wireframe scene (Canvas2D, no Three.js dependency)
// Renders rotating wireframe shapes (icosahedron, cube, torus knot lines)
// with mouse parallax. Designed to overlay/blend with hero gradient.

function Hero3D() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let mouseX = 0, mouseY = 0;
    let parallaxX = 0, parallaxY = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.parentElement.offsetWidth * dpr;
      canvas.height = canvas.parentElement.offsetHeight * dpr;
      canvas.style.width = canvas.parentElement.offsetWidth + 'px';
      canvas.style.height = canvas.parentElement.offsetHeight + 'px';
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left - rect.width / 2) / rect.width;
      mouseY = (e.clientY - rect.top - rect.height / 2) / rect.height;
    };
    window.addEventListener('mousemove', handleMove);

    // Generate icosahedron vertices
    const t = (1 + Math.sqrt(5)) / 2;
    const verts = [
      [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
      [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
      [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1],
    ];
    const edges = [
      [0, 11], [0, 5], [0, 1], [0, 7], [0, 10],
      [1, 5], [5, 11], [11, 10], [10, 7], [7, 1],
      [3, 9], [3, 4], [3, 2], [3, 6], [3, 8],
      [4, 9], [9, 8], [8, 6], [6, 2], [2, 4],
      [9, 5], [4, 5], [4, 11], [2, 11], [2, 10],
      [6, 10], [6, 7], [8, 7], [8, 1], [9, 1],
    ];

    // Cube
    const cubeVerts = [
      [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
      [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1],
    ];
    const cubeEdges = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7],
    ];

    let angle = 0;

    const project = (v, scale, cx, cy, rotX, rotY) => {
      let [x, y, z] = v;
      // rotate Y
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      [x, z] = [x * cosY - z * sinY, x * sinY + z * cosY];
      // rotate X
      const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
      [y, z] = [y * cosX - z * sinX, y * sinX + z * cosX];
      const persp = 4 / (4 + z);
      return [cx + x * scale * persp, cy + y * scale * persp, z];
    };

    const drawShape = (verts, edges, scale, cx, cy, rotX, rotY, color, lineWidth = 1) => {
      const projected = verts.map(v => project(v, scale, cx, cy, rotX, rotY));
      ctx.lineWidth = lineWidth;
      edges.forEach(([a, b]) => {
        const pa = projected[a], pb = projected[b];
        const avgZ = (pa[2] + pb[2]) / 2;
        const alpha = Math.max(0.15, Math.min(1, (3 - avgZ) / 4));
        ctx.strokeStyle = color.replace('ALPHA', alpha.toFixed(2));
        ctx.beginPath();
        ctx.moveTo(pa[0], pa[1]);
        ctx.lineTo(pb[0], pb[1]);
        ctx.stroke();
      });
      // Vertex dots
      projected.forEach(p => {
        const alpha = Math.max(0.3, Math.min(1, (3 - p[2]) / 3));
        ctx.fillStyle = color.replace('ALPHA', alpha.toFixed(2));
        ctx.beginPath();
        ctx.arc(p[0], p[1], 1.5, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const animate = () => {
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      ctx.clearRect(0, 0, w, h);

      angle += 0.004;
      parallaxX += (mouseX * 30 - parallaxX) * 0.05;
      parallaxY += (mouseY * 20 - parallaxY) * 0.05;

      // Big icosahedron - center
      drawShape(
        verts, edges,
        Math.min(w, h) * 0.18,
        w / 2 + parallaxX, h / 2 + parallaxY,
        angle * 0.7 + mouseY * 0.3, angle + mouseX * 0.4,
        'rgba(99, 102, 241, ALPHA)',
        1.2
      );

      // Small cube top-right
      drawShape(
        cubeVerts, cubeEdges,
        Math.min(w, h) * 0.07,
        w * 0.85 + parallaxX * 0.5, h * 0.25 + parallaxY * 0.5,
        angle * 1.3, angle * 0.9,
        'rgba(236, 72, 153, ALPHA)',
        1
      );

      // Small icosahedron bottom-left
      drawShape(
        verts, edges,
        Math.min(w, h) * 0.06,
        w * 0.15 + parallaxX * 0.6, h * 0.78 + parallaxY * 0.6,
        -angle * 1.1, angle * 1.4,
        'rgba(34, 211, 238, ALPHA)',
        0.8
      );

      rafRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
        opacity: 0.7,
        mixBlendMode: 'screen',
      }}
    />
  );
}

export default Hero3D;
