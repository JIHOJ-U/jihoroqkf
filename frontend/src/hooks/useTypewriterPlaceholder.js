import { useEffect, useRef, useState } from 'react';

/* Cycles a typewriter-style placeholder string through `words`.
   Returns a string like "홈페이지제작▌" suitable for an input placeholder.
   Pass a STABLE words array (define at module scope) to avoid restarts. */
export default function useTypewriterPlaceholder(words, {
  typeSpeed = 95,
  deleteSpeed = 45,
  hold = 1500,
  prefix = '',
  caret = '▌',
} = {}) {
  const [text, setText] = useState('');
  const timer = useRef(null);

  useEffect(() => {
    if (!words || words.length === 0) return;

    const reduce = typeof window !== 'undefined'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setText(words[0]); return; }

    let wordIdx = 0;
    let charIdx = 0;
    let deleting = false;

    const tick = () => {
      const word = words[wordIdx];
      if (!deleting) {
        charIdx += 1;
        setText(word.slice(0, charIdx));
        if (charIdx >= word.length) {
          deleting = true;
          timer.current = setTimeout(tick, hold);
          return;
        }
        timer.current = setTimeout(tick, typeSpeed);
      } else {
        charIdx -= 1;
        setText(word.slice(0, charIdx));
        if (charIdx <= 0) {
          deleting = false;
          wordIdx = (wordIdx + 1) % words.length;
          timer.current = setTimeout(tick, typeSpeed * 2);
          return;
        }
        timer.current = setTimeout(tick, deleteSpeed);
      }
    };

    timer.current = setTimeout(tick, typeSpeed);
    return () => clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [words]);

  return `${prefix}${text}${caret}`;
}
