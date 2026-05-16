import { useEffect } from 'react';
import Lenis from 'lenis';

function SmoothScroll() {
  useEffect(() => {
    // Skip on mobile (native scroll feels better) and when user prefers reduced motion
    const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;
    const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isMobile || reduceMotion) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
      wheelMultiplier: 1,
    });

    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
}

export default SmoothScroll;
