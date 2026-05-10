import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAchievement } from '../contexts/AchievementContext';

const ALL_PAGES = ['/', '/about', '/portfolio', '/contact'];
const VISITED_KEY = 'devvibe_pages_visited';

function ScrollToTop() {
  const { pathname } = useLocation();
  const { unlock } = useAchievement();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    // Track page visits
    try {
      const visited = JSON.parse(localStorage.getItem(VISITED_KEY) || '[]');
      if (ALL_PAGES.includes(pathname) && !visited.includes(pathname)) {
        const next = [...visited, pathname];
        localStorage.setItem(VISITED_KEY, JSON.stringify(next));
        if (ALL_PAGES.every(p => next.includes(p))) {
          unlock('ALL_PAGES');
        }
      }
    } catch (e) {}
  }, [pathname, unlock]);

  return null;
}

export default ScrollToTop;
