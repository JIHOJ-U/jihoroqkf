import { useCallback, useEffect, useState } from 'react';

// Portfolio "save/pin" collection persisted to localStorage.
// Cross-instance sync via a window CustomEvent + native `storage` event
// (so multiple tabs also stay in sync).
const KEY = 'saved-portfolios';
const EVT = 'collection-changed';

const isBrowser = () => typeof window !== 'undefined';

function read() {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function write(list) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* quota / private mode — ignore */
  }
  window.dispatchEvent(new CustomEvent(EVT, { detail: list }));
}

export function useCollection() {
  const [pinned, setPinned] = useState(read);

  useEffect(() => {
    if (!isBrowser()) return undefined;
    const sync = () => setPinned(read());
    const onCustom = (e) => {
      if (e && e.detail && Array.isArray(e.detail)) setPinned(e.detail.map(String));
      else sync();
    };
    window.addEventListener(EVT, onCustom);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVT, onCustom);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const toggle = useCallback((rawId) => {
    const id = String(rawId);
    const current = read();
    const next = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id];
    write(next);
    setPinned(next);
  }, []);

  const has = useCallback((rawId) => pinned.includes(String(rawId)), [pinned]);

  const clearAll = useCallback(() => {
    write([]);
    setPinned([]);
  }, []);

  return { pinned, toggle, has, count: pinned.length, clearAll };
}

export default useCollection;
