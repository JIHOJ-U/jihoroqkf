import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiArrowRight } from 'react-icons/hi';
import { useLanguage } from '../contexts/LanguageContext';
import './AvailabilityBadge.css';

function getKstClock() {
  // KST = UTC+9
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const kst = new Date(utc + 9 * 60 * 60000);
  const hh = String(kst.getHours()).padStart(2, '0');
  const mm = String(kst.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

function AvailabilityBadge({ variant = 'chip' }) {
  const { t } = useLanguage();
  const { label, hint, cta } = t.availability;
  const [time, setTime] = useState(getKstClock());

  useEffect(() => {
    const id = setInterval(() => setTime(getKstClock()), 30000);
    return () => clearInterval(id);
  }, []);

  if (variant === 'bar') {
    return (
      <Link to="/contact" className="avb-bar" aria-label={label}>
        <span className="avb-dot" />
        <span className="avb-bar-text">
          <strong>{label}</strong>
          <span className="avb-bar-sep">·</span>
          <span className="avb-bar-time">KST {time}</span>
        </span>
        <span className="avb-bar-cta">
          {cta} <HiArrowRight />
        </span>
      </Link>
    );
  }

  return (
    <Link to="/contact" className="avb-chip">
      <span className="avb-dot" />
      <span className="avb-chip-label">{label}</span>
      {hint && <span className="avb-chip-hint">· {hint}</span>}
    </Link>
  );
}

export default AvailabilityBadge;
