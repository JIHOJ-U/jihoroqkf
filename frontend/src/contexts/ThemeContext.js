import React, { createContext, useContext, useState, useEffect } from 'react';

const STORAGE_KEY = 'devibe_theme';
const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    // System preference fallback
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggle = (event) => {
    const next = theme === 'dark' ? 'light' : 'dark';
    const supportsViewTransitions = typeof document !== 'undefined' && 'startViewTransition' in document;
    const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!supportsViewTransitions || reduceMotion) {
      setTheme(next);
      return;
    }

    // Determine reveal origin from click coordinates (fallback to top-right)
    const x = event?.clientX ?? window.innerWidth - 40;
    const y = event?.clientY ?? 40;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    document.documentElement.style.setProperty('--reveal-x', `${x}px`);
    document.documentElement.style.setProperty('--reveal-y', `${y}px`);
    document.documentElement.style.setProperty('--reveal-r', `${endRadius}px`);

    const transition = document.startViewTransition(() => setTheme(next));
    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0 at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 600,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          pseudoElement: '::view-transition-new(root)',
        },
      );
    }).catch(() => {});
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
