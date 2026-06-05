import { useCallback } from 'react';

/**
 * Mouse-tracking radial spotlight for cards. Returns an `onMouseMove`
 * handler that writes the cursor's position into CSS custom properties
 * (`--mx`, `--my`) on the element. Pair with `data-spotlight` on the
 * element so the global `[data-spotlight]::after` rule paints the light.
 *
 * Usage:
 *   const onMove = useSpotlight();
 *   <div data-spotlight onMouseMove={onMove} />
 */
export default function useSpotlight() {
  return useCallback((e) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--my', `${e.clientY - rect.top}px`);
  }, []);
}
