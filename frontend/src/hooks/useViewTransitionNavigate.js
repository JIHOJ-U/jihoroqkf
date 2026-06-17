import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Wraps react-router's useNavigate in a View Transitions API call when the
 * browser supports it. The shared `view-transition-name` on matching old/new
 * elements (e.g. the portfolio thumbnail and the detail page hero image) lets
 * the browser animate the morph automatically — Chromium 111+, Safari 18+.
 *
 *   const transitionNavigate = useViewTransitionNavigate();
 *   transitionNavigate(`/portfolio/${id}`, { state });
 *
 * Browsers without support fall through to plain react-router navigation.
 */
export default function useViewTransitionNavigate() {
  const navigate = useNavigate();

  return useCallback(
    (to, options) => {
      if (
        typeof document === 'undefined' ||
        typeof document.startViewTransition !== 'function'
      ) {
        navigate(to, options);
        return;
      }
      document.startViewTransition(() => navigate(to, options));
    },
    [navigate]
  );
}

/**
 * Helper: tag an element with `view-transition-name` right before navigation.
 * Cleared automatically once the source element unmounts after the route
 * change, so we don't need to clean up manually. Pass the name we want the
 * browser to use when matching old↔new snapshots.
 */
export function tagForViewTransition(el, name = 'pf-hero') {
  if (!el || typeof document === 'undefined') return;
  if (typeof document.startViewTransition !== 'function') return;
  el.style.viewTransitionName = name;
}
