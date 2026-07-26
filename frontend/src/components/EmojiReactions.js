import React, { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './EmojiReactions.css';

const EMOJIS = ['❤️', '🔥', '✨', '👏', '😍'];

// Cheap deterministic hash so each project gets a stable "starter" count
// that varies between projects (so it doesn't read 0/0/0/0/0 on first visit).
function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = (h * 16777619) >>> 0;
  }
  return h >>> 0;
}

function seedCounts(portfolioId) {
  const base = hashStr(String(portfolioId));
  return EMOJIS.reduce((acc, e, i) => {
    // Range 3..22 — enough to look "used" but not gaming the user
    acc[e] = 3 + ((base + i * 2654435761) % 20);
    return acc;
  }, {});
}

function readStorage(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota */
  }
}

function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function EmojiReactions({ portfolioId }) {
  const { t } = useLanguage();
  const rx = t.reactions || { title: '> How was it?', aria: (e, c) => `${e} (${c})` };

  const seed = useMemo(() => seedCounts(portfolioId), [portfolioId]);
  const countsKey = `reactions:${portfolioId}`;
  const mineKey = `reactions-mine:${portfolioId}`;

  const [counts, setCounts] = useState(() => ({ ...seed, ...readStorage(countsKey, {}) }));
  const [mine, setMine] = useState(() => readStorage(mineKey, {}));
  const [flashing, setFlashing] = useState(null);

  // Rehydrate when portfolioId changes
  useEffect(() => {
    setCounts({ ...seed, ...readStorage(countsKey, {}) });
    setMine(readStorage(mineKey, {}));
  }, [portfolioId, seed, countsKey, mineKey]);

  const onTap = (emoji) => {
    if (mine[emoji]) return; // throttle: once per emoji per browser
    const nextCounts = { ...counts, [emoji]: (counts[emoji] || 0) + 1 };
    const nextMine = { ...mine, [emoji]: true };
    setCounts(nextCounts);
    setMine(nextMine);
    writeStorage(countsKey, nextCounts);
    writeStorage(mineKey, nextMine);

    if (!prefersReducedMotion()) {
      setFlashing(emoji);
      window.setTimeout(() => setFlashing((cur) => (cur === emoji ? null : cur)), 520);
    }
  };

  return (
    <section className="emoji-rx" aria-labelledby={`rx-title-${portfolioId}`}>
      <h4 id={`rx-title-${portfolioId}`} className="emoji-rx__title">
        {rx.title}
      </h4>
      <ul className="emoji-rx__list">
        {EMOJIS.map((e) => {
          const isMine = !!mine[e];
          const isFlashing = flashing === e;
          const count = counts[e] || 0;
          return (
            <li key={e} className="emoji-rx__item">
              <button
                type="button"
                className={`emoji-rx__btn ${isMine ? 'is-mine' : ''}`}
                onClick={() => onTap(e)}
                aria-pressed={isMine}
                aria-label={rx.aria(e, count)}
              >
                <span
                  className={`emoji-rx__emoji ${isFlashing ? 'is-pop' : ''}`}
                  aria-hidden="true"
                >
                  {e}
                </span>
                <span className={`emoji-rx__count ${isFlashing ? 'is-flash' : ''}`}>
                  {count}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default EmojiReactions;
