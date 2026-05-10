import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAchievement } from '../contexts/AchievementContext';
import './AchievementToast.css';

function AchievementToast() {
  const { recent, dismissRecent } = useAchievement();

  useEffect(() => {
    if (recent) {
      const timer = setTimeout(() => dismissRecent(), 4000);
      return () => clearTimeout(timer);
    }
  }, [recent, dismissRecent]);

  return (
    <AnimatePresence>
      {recent && (
        <motion.div
          className="ach-toast"
          initial={{ opacity: 0, x: 100, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          onClick={dismissRecent}
        >
          <div className="ach-toast__shine" />
          <div className="ach-toast__icon">{recent.icon}</div>
          <div className="ach-toast__body">
            <span className="ach-toast__label">🏆 Achievement Unlocked!</span>
            <strong className="ach-toast__title">{recent.title}</strong>
            <span className="ach-toast__desc">{recent.desc}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default AchievementToast;
