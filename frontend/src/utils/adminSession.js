/* Admin session — the key the operator typed, kept for this tab only.
   The real check happens on the server (x-admin-key header); nothing secret
   is compiled into the bundle. sessionStorage clears when the tab closes. */
const KEY = 'hpgb_admin_session';
const LEGACY_KEY = 'joe_dev_admin_auth'; // old plaintext flag from localStorage

function safe(fn, fallback) {
  try { return fn(); } catch (e) { return fallback; }
}

// Drop the old localStorage value left by the previous client-side login.
safe(() => window.localStorage.removeItem(LEGACY_KEY));

export const getAdminKey = () => safe(() => window.sessionStorage.getItem(KEY) || '', '');
export const isAdminSession = () => Boolean(getAdminKey());
export const setAdminKey = (value) => safe(() => window.sessionStorage.setItem(KEY, value));
export const clearAdminKey = () => safe(() => window.sessionStorage.removeItem(KEY));
