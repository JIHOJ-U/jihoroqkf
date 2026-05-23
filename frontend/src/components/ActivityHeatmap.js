import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { getPortfolios, getBlogPosts } from '../api';
import { useLanguage } from '../contexts/LanguageContext';
import './ActivityHeatmap.css';

const DAYS = 365;
const WEEKS = Math.ceil(DAYS / 7);

const COPY = {
  ko: {
    title: '최근 1년 활동',
    total: '총 활동',
    streak: '최장 연속일',
    max: '최다 / 일',
    less: '적음',
    more: '많음',
    unit: (n) => `${n}건`,
  },
  en: {
    title: 'Activity in the last year',
    total: 'Total activity',
    streak: 'Longest streak',
    max: 'Busiest day',
    less: 'Less',
    more: 'More',
    unit: (n) => `${n} ${n === 1 ? 'item' : 'items'}`,
  },
};

function ActivityHeatmap() {
  const { lang } = useLanguage();
  const c = COPY[lang] || COPY.ko;
  const [activity, setActivity] = useState({});
  const [stats, setStats] = useState({ total: 0, max: 0, longestStreak: 0 });
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    Promise.allSettled([getPortfolios(), getBlogPosts()]).then(results => {
      const counts = {};

      results.forEach(r => {
        if (r.status !== 'fulfilled') return;
        const items = Array.isArray(r.value.data) ? r.value.data : (r.value.data.posts || []);
        items.forEach(item => {
          const dateStr = item.createdAt || item.updatedAt || item.pubDate;
          if (!dateStr) return;
          const d = new Date(dateStr);
          if (isNaN(d.getTime())) return;
          const key = d.toISOString().slice(0, 10);
          counts[key] = (counts[key] || 0) + 1;
        });
      });

      setActivity(counts);

      const values = Object.values(counts);
      const total = values.reduce((s, v) => s + v, 0);
      const max = values.length > 0 ? Math.max(...values) : 0;

      // Calculate longest streak
      const sortedDates = Object.keys(counts).sort();
      let longestStreak = 0, currentStreak = 0, prevDate = null;
      sortedDates.forEach(d => {
        const cur = new Date(d);
        if (prevDate) {
          const diff = (cur - prevDate) / (1000 * 60 * 60 * 24);
          if (diff === 1) currentStreak++;
          else { longestStreak = Math.max(longestStreak, currentStreak); currentStreak = 1; }
        } else {
          currentStreak = 1;
        }
        prevDate = cur;
      });
      longestStreak = Math.max(longestStreak, currentStreak);

      setStats({ total, max, longestStreak });
    });
  }, []);

  const grid = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days = [];
    for (let i = DAYS - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days.push({ date: d, key, count: activity[key] || 0 });
    }
    // Group by week
    const startDay = days[0].date.getDay();
    const padding = startDay;
    const padded = [...Array(padding).fill(null), ...days];
    const weeks = [];
    for (let w = 0; w < WEEKS; w++) {
      weeks.push(padded.slice(w * 7, (w + 1) * 7));
    }
    return weeks;
  }, [activity]);

  const level = (count) => {
    if (count === 0) return 0;
    if (stats.max <= 1) return 4;
    const pct = count / stats.max;
    if (pct < 0.25) return 1;
    if (pct < 0.5) return 2;
    if (pct < 0.75) return 3;
    return 4;
  };

  const months = useMemo(() => {
    const labels = [];
    grid.forEach((week, wIdx) => {
      const firstDay = week.find(d => d !== null);
      if (!firstDay) return;
      const m = firstDay.date.getMonth();
      const last = labels[labels.length - 1];
      if (!last || last.month !== m) {
        labels.push({ month: m, weekIdx: wIdx });
      }
    });
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return labels.map(l => ({ ...l, name: monthNames[l.month] }));
  }, [grid]);

  return (
    <motion.div
      className="heatmap"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="heatmap__header">
        <div>
          <span className="section-label">ACTIVITY</span>
          <h3 className="heatmap__title">{c.title}</h3>
        </div>
        <div className="heatmap__stats">
          <div className="heatmap__stat">
            <strong>{stats.total}</strong>
            <span>{c.total}</span>
          </div>
          <div className="heatmap__stat">
            <strong>{stats.longestStreak}</strong>
            <span>{c.streak}</span>
          </div>
          <div className="heatmap__stat">
            <strong>{stats.max}</strong>
            <span>{c.max}</span>
          </div>
        </div>
      </div>

      <div className="heatmap__scroll">
        <div className="heatmap__grid-wrap">
          {/* Month labels */}
          <div className="heatmap__months">
            {months.map((m, i) => (
              <span
                key={i}
                className="heatmap__month-label"
                style={{ left: `${m.weekIdx * 14}px` }}
              >
                {m.name}
              </span>
            ))}
          </div>

          {/* Day labels */}
          <div className="heatmap__days">
            <span>Mon</span>
            <span>Wed</span>
            <span>Fri</span>
          </div>

          {/* Grid */}
          <div className="heatmap__grid">
            {grid.map((week, wi) => (
              <div key={wi} className="heatmap__week">
                {week.map((day, di) => (
                  <div
                    key={di}
                    className={`heatmap__cell ${day ? `heatmap__cell--lvl-${level(day.count)}` : 'heatmap__cell--empty'}`}
                    onMouseEnter={() => day && setHovered(day)}
                    onMouseLeave={() => setHovered(null)}
                    title={day ? `${day.key}: ${c.unit(day.count)}` : ''}
                  />
                ))}
              </div>
            ))}
          </div>

          {hovered && (
            <div className="heatmap__tooltip">
              <strong>{c.unit(hovered.count)}</strong>
              <span>{hovered.key}</span>
            </div>
          )}
        </div>
      </div>

      <div className="heatmap__legend">
        <span>{c.less}</span>
        <div className="heatmap__cell heatmap__cell--lvl-0" />
        <div className="heatmap__cell heatmap__cell--lvl-1" />
        <div className="heatmap__cell heatmap__cell--lvl-2" />
        <div className="heatmap__cell heatmap__cell--lvl-3" />
        <div className="heatmap__cell heatmap__cell--lvl-4" />
        <span>{c.more}</span>
      </div>
    </motion.div>
  );
}

export default ActivityHeatmap;
