import React, { useEffect, useRef } from 'react';

// Static wireframe scene — drawn once on mount, redrawn only on resize.
// No animation, no RAF, no mouse listeners. Zero ongoing CPU cost.

const ICO_VERTS = (() => {
  const t = (1 + Math.sqrt(5)) / 2;
  return [
    [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
    [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
    [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1],
  ];
})();
const ICO_EDGES = [
  [0, 11], [0, 5], [0, 1], [0, 7], [0, 10],
  [1, 5], [5, 11], [11, 10], [10, 7], [7, 1],
  [3, 9], [3, 4], [3, 2], [3, 6], [3, 8],
  [4, 9], [9, 8], [8, 6], [6, 2], [2, 4],
  [9, 5], [4, 5], [4, 11], [2, 11], [2, 10],
  [6, 10], [6, 7], [8, 7], [8, 1], [9, 1],
];
const CUBE_VERTS = [
  [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
  [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1],
];
const CUBE_EDGES = [
  [0, 1], [1, 2], [2, 3], [3, 0],
  [4, 5], [5, 6], [6, 7], [7, 4],
  [0, 4], [1, 5], [2, 6], [3, 7],
];

function Hero3D() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const project = (v, scale, cx, cy, rotX, rotY) => {
      let [x, y, z] = v;
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      [x, z] = [x * cosY - z * sinY, x * sinY + z * cosY];
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
      projected.forEach(p => {
        const alpha = Math.max(0.3, Math.min(1, (3 - p[2]) / 3));
        ctx.fillStyle = color.replace('ALPHA', alpha.toFixed(2));
        ctx.beginPath();
        ctx.arc(p[0], p[1], 1.5, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const render = () => {
      // Cap DPR at 1 — wireframes don't need retina, saves 4x pixel work
      const dpr = 1;
      const parentW = canvas.parentElement.offsetWidth;
      const parentH = canvas.parentElement.offsetHeight;
      canvas.width = parentW * dpr;
      canvas.height = parentH * dpr;
      canvas.style.width = parentW + 'px';
      canvas.style.height = parentH + 'px';

      const w = parentW;
      const h = parentH;
      ctx.clearRect(0, 0, w, h);

      // Fixed rotation angle — chosen to look balanced
      const angle = 0.6;

      drawShape(
        ICO_VERTS, ICO_EDGES,
        Math.min(w, h) * 0.18,
        w / 2, h / 2,
        angle * 0.7, angle,
        'rgba(99, 102, 241, ALPHA)',
        1.2
      );
      drawShape(
        CUBE_VERTS, CUBE_EDGES,
        Math.min(w, h) * 0.07,
        w * 0.85, h * 0.25,
        angle * 1.3, angle * 0.9,
        'rgba(236, 72, 153, ALPHA)',
        1
      );
      drawShape(
        ICO_VERTS, ICO_EDGES,
        Math.min(w, h) * 0.06,
        w * 0.15, h * 0.78,
        -angle * 1.1, angle * 1.4,
        'rgba(34, 211, 238, ALPHA)',
        0.8
      );
    };

    render();

    // Debounced resize — only redraws when window stops resizing
    let resizeTimer = null;
    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(render, 150);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      if (resizeTimer) clearTimeout(resizeTimer);
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
        opacity: 0.55,
      }}
    />
  );
}

export default Hero3D;
