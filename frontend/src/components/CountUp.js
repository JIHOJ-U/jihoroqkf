import React, { useEffect, useRef, useState } from 'react';

/* Counts from 0 → `end` the first time it scrolls into view.
   Supports prefix/suffix and decimals.
   The IntersectionObserver stays attached after the first run so we can
   cancel the RAF tick if the visitor scrolls past mid-animation — otherwise
   the loop keeps firing off-screen until the easing settles. */
export default function CountUp({
  end = 100,
  duration = 1400,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
}) {
  const ref = useRef(null);
  const [val, setVal] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    let rafId = null;
    const cancel = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          // Off-screen mid-animation — snap to the final value before cancelling
          // the RAF. Otherwise the partial eased value (e.g. 73 for end=100)
          // gets painted and the `started.current` guard prevents resume on
          // re-entry, leaving the trust-signal numbers permanently wrong.
          if (rafId !== null) {
            cancel();
            setVal(end);
          }
          return;
        }
        if (started.current) return;
        started.current = true;

        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduce) { setVal(end); return; }

        const startTime = performance.now();
        const tick = (now) => {
          const p = Math.min((now - startTime) / duration, 1);
          // easeOutCubic
          const eased = 1 - Math.pow(1 - p, 3);
          setVal(end * eased);
          if (p < 1) {
            rafId = requestAnimationFrame(tick);
          } else {
            rafId = null;
            setVal(end);
          }
        };
        rafId = requestAnimationFrame(tick);
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancel();
    };
  }, [end, duration]);

  const display = decimals > 0
    ? val.toFixed(decimals)
    : Math.round(val).toLocaleString();

  return (
    <span ref={ref} className={className}>
      {prefix}{display}{suffix}
    </span>
  );
}
