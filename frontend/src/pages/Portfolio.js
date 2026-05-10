import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiCode, HiPlus } from 'react-icons/hi';
import { getPortfolios, getImageUrl } from '../api';
import './Portfolio.css';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }
  })
};

const categories = ['ALL', '웹 개발', '앱 개발', '백엔드/API', 'UI/UX 디자인', '기타'];

function Portfolio() {
  const [portfolios, setPortfolios] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPortfolios()
      .then(res => {
        setPortfolios(res.data);
        setFiltered(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (activeCategory === 'ALL') {
      setFiltered(portfolios);
    } else {
      setFiltered(portfolios.filter(p => p.category === activeCategory));
    }
  }, [activeCategory, portfolios]);

  return (
    <div className="portfolio-page">
      {/* Background decorations */}
      <div className="portfolio-bg-decor" aria-hidden="true">
        <span className="portfolio-symbol portfolio-symbol--1">{'</>'}</span>
        <span className="portfolio-symbol portfolio-symbol--2">{'{ }'}</span>
        <span className="portfolio-symbol portfolio-symbol--3">{'=>'}</span>
        <span className="portfolio-symbol portfolio-symbol--4">{'( )'}</span>
        <span className="portfolio-symbol portfolio-symbol--5">{'[ ]'}</span>
      </div>

      {/* Hero */}
      <section className="portfolio-hero">
        <div className="container">
          <motion.span className="section-label" variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            WORKS
          </motion.span>
          <motion.h1 className="portfolio-title" variants={fadeUp} initial="hidden" animate="visible" custom={1}>
            Our Works
          </motion.h1>
        </div>
      </section>

      {/* Filter + Content */}
      <section className="portfolio-content">
        <div className="container">
          {/* Filter Bar */}
          <div className="filter-bar">
            <div className="filter-tabs">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`filter-tab ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
            <Link to="/portfolio/new" className="btn btn-dark btn-add">
              <HiPlus /> 등록
            </Link>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="portfolio-grid">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton-image" />
                  <div className="skeleton-meta">
                    <div className="skeleton-line" />
                    <div className="skeleton-line short" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <HiCode className="empty-icon" />
              <h3>등록된 프로젝트가 없습니다</h3>
              <p>첫 번째 포트폴리오를 등록해보세요.</p>
              <Link to="/portfolio/new" className="btn btn-dark">
                <HiPlus /> 포트폴리오 등록
              </Link>
            </div>
          ) : (
            <div className="portfolio-grid">
              {filtered.map((item, i) => (
                <motion.div key={item.id} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i % 2}>
                  <Link to={`/portfolio/${item.id}`} className="portfolio-card">
                    <div className="portfolio-image">
                      {item.thumbnail ? (
                        <img src={getImageUrl(item.thumbnail)} alt={item.title} />
                      ) : (
                        <div className="portfolio-placeholder">
                          <HiCode />
                        </div>
                      )}
                      {/* Dimmed overlay on hover */}
                      <div className="portfolio-dimmed" />
                      {/* Tag at bottom */}
                      <div className="portfolio-tag-box">
                        <span className="portfolio-tag-text">
                          {item.techStack.length > 0
                            ? item.techStack.join(', ')
                            : item.category}
                        </span>
                      </div>
                    </div>
                    <div className="portfolio-meta">
                      <span className="portfolio-client">{item.client || item.category}</span>
                      <h3 className="portfolio-name">{item.title}</h3>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Portfolio;
