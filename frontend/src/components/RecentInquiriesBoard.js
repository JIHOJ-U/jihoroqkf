import React, { useEffect, useState } from 'react';
import { getPublicInquiries } from '../api';
import { useLanguage } from '../contexts/LanguageContext';
import './RecentInquiriesBoard.css';

function formatDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// Dense board-list of recent (masked) consultation requests — the "정보 구조"
// piece borrowed from legacy Korean agency sites' 게시판 layout, backed by
// real /api/inquiries/public data. Hidden entirely until there's at least one
// real submission: same no-placeholder-rows rule as TestimonialsMarquee.
function RecentInquiriesBoard() {
  const { t } = useLanguage();
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getPublicInquiries()
      .then((res) => setItems(Array.isArray(res.data) ? res.data : []))
      .catch(() => setItems([]))
      .finally(() => setLoaded(true));
  }, []);

  if (!loaded || items.length === 0) return null;

  const { label, title, rowTemplate } = t.recentInquiries;

  return (
    <section className="rib-section" aria-label={title}>
      <div className="container">
        <div className="rib-head">
          <span className="section-label">{label}</span>
          <h2 className="section-title">{title}</h2>
        </div>
        <ul className="rib-list">
          {items.map((item, i) => (
            <li key={i} className="rib-row">
              <span className="rib-row__text">
                {rowTemplate.replace('{name}', item.name)}
              </span>
              <span className="rib-row__meta">
                <span className="rib-row__tag">{item.projectType}</span>
                <span className="rib-row__date">{formatDate(item.createdAt)}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default RecentInquiriesBoard;
