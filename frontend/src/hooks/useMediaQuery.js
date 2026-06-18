import { useEffect, useState } from 'react';

/**
 * Reactive matchMedia hook. Mirrors window.matchMedia, re-renders on change.
 *
 *   const isDesktop = useMediaQuery('(min-width: 769px)');
 *
 * Initial value is computed synchronously so the first render already reflects
 * the current viewport (no flash of wrong-state UI). Listener cleanup happens
 * on unmount.
 */
export default function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mql = window.matchMedia(query);
    const onChange = (e) => setMatches(e.matches);
    setMatches(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}
