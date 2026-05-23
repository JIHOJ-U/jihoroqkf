import React, { useEffect, useRef, useState } from 'react';

/* Counts from 0 → `end` the first time it scrolls into view.
   Supports prefix/suffix and decimals. */
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
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        io.disconnect();

        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduce) { setVal(end); return; }

        const startTime = performance.now();
        const tick = (now) => {
          const p = Math.min((now - startTime) / duration, 1);
          // easeOutCubic
          const eased = 1 - Math.pow(1 - p, 3);
          setVal(end * eased);
          if (p < 1) requestAnimationFrame(tick);
          else setVal(end);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
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
