import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useLanguage } from '../contexts/LanguageContext';
import './PCBScene3D.css';

const COPY = {
  ko: {
    label: '// UNDER_THE_HOOD',
    title: '코드 한 줄까지 직접 만듭니다',
    desc: '드래그하거나 스크롤해보세요. 데이터가 회로 위를 흐르는 동안 보드가 따라 움직입니다.',
  },
  en: {
    label: '// UNDER_THE_HOOD',
    title: 'Engineered from the ground up',
    desc: 'Drag or scroll to interact. Data packets travel the traces while the board responds.',
  },
};

/**
 * 3D PCB scene. Plain Three.js (no react-three-fiber) so we can lean on the
 * existing devtools mental model: one scene, one renderer, one rAF loop.
 *
 * Visuals
 *   - Dark PCB plane (slate green) with subtle bevel
 *   - A grid of rectangular "chips" sitting on top, lit emissive on top edge
 *   - Glowing trace lines connecting chips (additive blending)
 *   - Particle "data packets" hopping along the traces
 *
 * Interaction
 *   - Mouse move → idle tilt (lerps toward pointer-driven target)
 *   - Pointer drag inside the canvas → grab rotate (overrides tilt while held)
 *   - Scroll (when the section enters viewport) → camera zoom + dolly via
 *     a scroll-progress lerp computed off the section bounding rect
 */
function PCBScene3D() {
  const { lang } = useLanguage();
  const c = COPY[lang] || COPY.ko;

  const sectionRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return undefined;

    // Respect prefers-reduced-motion — render a static, still scene.
    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ---- renderer / scene / camera ----------------------------------------
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 6, 9);
    camera.lookAt(0, 0, 0);

    // Group everything so the whole board rotates as one rigid body.
    const board = new THREE.Group();
    scene.add(board);

    // ---- lighting ---------------------------------------------------------
    scene.add(new THREE.AmbientLight(0x1a1f2e, 0.7));

    const keyLight = new THREE.DirectionalLight(0x8b9bff, 1.4);
    keyLight.position.set(4, 6, 4);
    scene.add(keyLight);

    const rim = new THREE.PointLight(0xa78bfa, 1.0, 14);
    rim.position.set(-3, 3, -2);
    scene.add(rim);

    const fillCyan = new THREE.PointLight(0x06b6d4, 0.55, 12);
    fillCyan.position.set(3, 2, -1);
    scene.add(fillCyan);

    // ---- PCB substrate ----------------------------------------------------
    const pcb = new THREE.Mesh(
      new THREE.BoxGeometry(7, 0.18, 5),
      new THREE.MeshStandardMaterial({
        color: 0x0f3b2e,
        roughness: 0.6,
        metalness: 0.25,
        emissive: 0x041a14,
      })
    );
    board.add(pcb);

    // Subtle gold "border" frame around the PCB edge — a thin extruded ring.
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0xd4a857,
      metalness: 0.8,
      roughness: 0.4,
      emissive: 0x3a2d10,
      emissiveIntensity: 0.4,
    });
    [
      [3.5, 0, 0],
      [-3.5, 0, 0],
      [0, 0, 2.5],
      [0, 0, -2.5],
    ].forEach(([x, y, z], i) => {
      const isHorizontal = i < 2;
      const w = isHorizontal ? 0.08 : 7;
      const d = isHorizontal ? 5 : 0.08;
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, 0.20, d), frameMat);
      m.position.set(x, 0.005, z);
      board.add(m);
    });

    // ---- chips on the board ----------------------------------------------
    // Layout: a deliberate scatter, like a real motherboard. Each entry is
    // [x, z, w, d, color, emissive].
    const chips = [
      [-1.8,  1.3, 1.2, 0.9, 0x121723, 0x6366f1],
      [ 1.6,  0.6, 1.0, 1.4, 0x121723, 0x06b6d4],
      [-1.0, -0.9, 1.6, 0.7, 0x121723, 0x10b981],
      [ 2.0, -1.4, 0.8, 0.6, 0x121723, 0xf59e0b],
      [-2.6, -0.3, 0.5, 0.5, 0x121723, 0xec4899],
      [ 0.2,  1.6, 0.6, 0.5, 0x121723, 0x6366f1],
    ];
    const chipMeshes = [];
    chips.forEach(([x, z, w, d, color, emissive]) => {
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(w, 0.22, d),
        new THREE.MeshStandardMaterial({
          color,
          roughness: 0.35,
          metalness: 0.55,
        })
      );
      body.position.set(x, 0.20, z);
      board.add(body);

      // Glowing emissive cap on top — the chip's "model name plate".
      const cap = new THREE.Mesh(
        new THREE.PlaneGeometry(w * 0.65, d * 0.45),
        new THREE.MeshBasicMaterial({
          color: emissive,
          transparent: true,
          opacity: 0.8,
          blending: THREE.AdditiveBlending,
        })
      );
      cap.position.set(x, 0.32, z);
      cap.rotation.x = -Math.PI / 2;
      board.add(cap);

      // Pulse data — assigned to each chip so we can animate independently.
      chipMeshes.push({ cap, phase: Math.random() * Math.PI * 2 });
    });

    // ---- circuit traces (line segments with additive blending) -----------
    // Generated programmatically: short L-shaped or straight segments between
    // chip footprints. Lighter when zoomed out, glowing when close.
    const tracePoints = [];
    const traceColors = [];
    const traceColor = new THREE.Color(0x67e8f9); // cyan-300
    function addSeg(ax, az, bx, bz) {
      tracePoints.push(ax, 0.105, az, bx, 0.105, bz);
      for (let i = 0; i < 2; i++) {
        traceColors.push(traceColor.r, traceColor.g, traceColor.b);
      }
    }
    // Build a small mesh of L-traces between adjacent chips
    addSeg(-1.8, 1.8, -1.8, 0.6);
    addSeg(-1.8, 0.6, 1.0, 0.6);
    addSeg(1.0, 0.6, 1.6, 0.6);
    addSeg(1.6, 0.6, 1.6, -0.6);
    addSeg(1.6, -0.6, 2.0, -0.6);
    addSeg(-1.0, -0.4, -1.0, -1.4);
    addSeg(-1.0, -1.4, -2.6, -1.4);
    addSeg(-2.6, -1.4, -2.6, -0.3);
    addSeg(0.2, 1.6, 0.2, 1.0);
    addSeg(0.2, 1.0, -1.0, 1.0);
    addSeg(-2.4, 1.0, -1.8, 1.0);
    addSeg(-2.4, 1.0, -2.4, -0.6);
    addSeg(2.0, -1.0, 2.8, -1.0);
    addSeg(2.8, -1.0, 2.8, 1.4);

    const traceGeom = new THREE.BufferGeometry();
    traceGeom.setAttribute('position', new THREE.Float32BufferAttribute(tracePoints, 3));
    traceGeom.setAttribute('color', new THREE.Float32BufferAttribute(traceColors, 3));
    const traceMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const traces = new THREE.LineSegments(traceGeom, traceMat);
    board.add(traces);

    // ---- data "packets" flowing along the traces ------------------------
    // Each packet is a tiny additive sphere walking from a→b on a segment.
    // Stored as { segIdx, t, speed }. When t > 1, jump to a new segment.
    const segCount = tracePoints.length / 6;
    const segs = [];
    for (let i = 0; i < segCount; i++) {
      const ax = tracePoints[i * 6 + 0];
      const az = tracePoints[i * 6 + 2];
      const bx = tracePoints[i * 6 + 3];
      const bz = tracePoints[i * 6 + 5];
      segs.push({ ax, az, bx, bz });
    }

    const packetCount = 18;
    const packets = [];
    const packetGeom = new THREE.SphereGeometry(0.045, 6, 6);
    const packetColors = [0x67e8f9, 0xfcd34d, 0x6ee7b7, 0xf9a8d4];
    for (let i = 0; i < packetCount; i++) {
      const color = packetColors[i % packetColors.length];
      const mat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
      });
      const mesh = new THREE.Mesh(packetGeom, mat);
      mesh.position.y = 0.13;
      board.add(mesh);
      packets.push({
        mesh,
        segIdx: Math.floor(Math.random() * segCount),
        t: Math.random(),
        speed: 0.20 + Math.random() * 0.40,
      });
    }

    // ---- starfield / dust behind the board ------------------------------
    const dustGeom = new THREE.BufferGeometry();
    const dustCount = 220;
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3 + 0] = (Math.random() - 0.5) * 14;
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 8 - 1;
      dustPos[i * 3 + 2] = -2 - Math.random() * 5;
    }
    dustGeom.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dust = new THREE.Points(
      dustGeom,
      new THREE.PointsMaterial({
        color: 0xa5b4fc,
        size: 0.04,
        transparent: true,
        opacity: 0.45,
        depthWrite: false,
      })
    );
    scene.add(dust);

    // ---- pointer interaction state ---------------------------------------
    const target = { x: 0, y: 0 }; // desired board tilt
    const current = { x: 0, y: 0 }; // smoothed tilt
    const drag = { active: false, startX: 0, startY: 0, baseY: 0, baseX: 0 };
    let manualYaw = 0; // accumulated yaw from drag
    let manualPitch = 0;

    let scrollProgress = 0; // 0..1 across section viewport

    const onPointerMove = (e) => {
      if (drag.active) return;
      const rect = canvas.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      target.x = ny * 0.25;
      target.y = nx * 0.35;
    };

    const onPointerDown = (e) => {
      drag.active = true;
      drag.startX = e.clientX;
      drag.startY = e.clientY;
      drag.baseY = manualYaw;
      drag.baseX = manualPitch;
      canvas.setPointerCapture(e.pointerId);
    };
    const onPointerDrag = (e) => {
      if (!drag.active) return;
      const dx = e.clientX - drag.startX;
      const dy = e.clientY - drag.startY;
      manualYaw = drag.baseY + dx * 0.006;
      manualPitch = Math.max(-0.6, Math.min(0.6, drag.baseX + dy * 0.005));
    };
    const onPointerUp = (e) => {
      drag.active = false;
      try { canvas.releasePointerCapture(e.pointerId); } catch (err) { /* noop */ }
    };

    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerDrag);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);

    // ---- resize handling --------------------------------------------------
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // ---- scroll driving ---------------------------------------------------
    // Map section's vertical position in viewport (top edge from 1.0 → -0.5)
    // to a scrollProgress in [0..1] that drives camera distance/angle.
    const updateScroll = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const t = 1 - rect.top / vh;
      scrollProgress = Math.max(0, Math.min(1, (t - 0.0) / 1.5));
    };
    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', updateScroll);

    // ---- IntersectionObserver to pause when off-screen ------------------
    let inView = true;
    const io = new IntersectionObserver(
      ([entry]) => { inView = entry.isIntersecting; },
      { threshold: 0 }
    );
    io.observe(section);

    // ---- animation loop --------------------------------------------------
    let raf = 0;
    let lastT = performance.now();

    const animate = (now) => {
      raf = requestAnimationFrame(animate);
      const dt = Math.min(0.05, (now - lastT) / 1000);
      lastT = now;

      if (!inView) return; // don't burn frames when scrolled away

      // Smooth tilt toward pointer target, plus accumulated drag yaw/pitch.
      current.x += (target.x - current.x) * 0.06;
      current.y += (target.y - current.y) * 0.06;
      board.rotation.x = -0.55 + current.x + manualPitch;
      board.rotation.y = current.y + manualYaw + (reduceMotion ? 0 : now * 0.00006);

      // Scroll-driven camera dolly: from far+high to close+lower.
      const sp = scrollProgress;
      camera.position.y = 6 - sp * 1.4;
      camera.position.z = 9 - sp * 2.6;
      camera.position.x = Math.sin(now * 0.0001) * 0.4 * (1 - sp);
      camera.lookAt(0, 0, 0);

      // Chip pulses
      const t = now * 0.001;
      for (let i = 0; i < chipMeshes.length; i++) {
        const cm = chipMeshes[i];
        cm.cap.material.opacity = 0.55 + Math.sin(t * 1.8 + cm.phase) * 0.25;
      }

      // Slowly drift dust
      dust.rotation.y += dt * 0.02;

      // March packets along their segments
      for (let i = 0; i < packets.length; i++) {
        const p = packets[i];
        p.t += dt * p.speed;
        if (p.t >= 1) {
          p.t = 0;
          p.segIdx = Math.floor(Math.random() * segCount);
        }
        const s = segs[p.segIdx];
        p.mesh.position.x = s.ax + (s.bx - s.ax) * p.t;
        p.mesh.position.z = s.az + (s.bz - s.az) * p.t;
      }

      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(animate);

    // ---- cleanup ----------------------------------------------------------
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', updateScroll);
      window.removeEventListener('pointermove', onPointerDrag);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerdown', onPointerDown);
      io.disconnect();
      ro.disconnect();
      renderer.dispose();
      traceGeom.dispose();
      traceMat.dispose();
      dustGeom.dispose();
      packetGeom.dispose();
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      });
    };
  }, []);

  return (
    <section className="pcb-section" ref={sectionRef}>
      <div className="container-wide pcb-inner">
        <header className="pcb-head">
          <span className="pcb-label" translate="no">{c.label}</span>
          <h2 className="pcb-title">{c.title}</h2>
          <p className="pcb-desc">{c.desc}</p>
        </header>

        <div className="pcb-stage">
          <canvas ref={canvasRef} className="pcb-canvas" />
          <div className="pcb-vignette" aria-hidden="true" />
          <div className="pcb-hint" aria-hidden="true">
            <span>↕ scroll</span>
            <span className="pcb-hint-sep">·</span>
            <span>↻ drag</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PCBScene3D;
