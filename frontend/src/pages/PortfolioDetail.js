import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowLeft, HiExternalLink, HiPencil, HiTrash, HiCode, HiCalendar, HiUser } from 'react-icons/hi';
import { FaGithub } from 'react-icons/fa';
import { getPortfolio, deletePortfolio, getImageUrl } from '../api';
import { useAchievement } from '../contexts/AchievementContext';
import MarkdownContent from '../components/MarkdownContent';
import './PortfolioDetail.css';

function PortfolioDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const { unlock } = useAchievement();

  useEffect(() => {
    getPortfolio(id)
      .then(res => { setPortfolio(res.data); unlock('PORTFOLIO_VIEWED'); })
      .catch(() => navigate('/portfolio'))
      .finally(() => setLoading(false));
  }, [id, navigate, unlock]);

  const handleDelete = async () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await deletePortfolio(id);
        navigate('/portfolio');
      } catch (err) {
        alert('삭제에 실패했습니다.');
      }
    }
  };

  if (loading) {
    return (
      <div className="detail-loading">
        <div className="spinner" />
      </div>
    );
  }

  if (!portfolio) return null;

  return (
    <div className="detail-page">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Link to="/portfolio" className="detail-back">
            <HiArrowLeft /> Back to Works
          </Link>

          <div className="detail-header">
            <div className="detail-meta">
              <span className="detail-category">{portfolio.category}</span>
              {portfolio.duration && (
                <span className="detail-info-item"><HiCalendar /> {portfolio.duration}</span>
              )}
              {portfolio.client && (
                <span className="detail-info-item"><HiUser /> {portfolio.client}</span>
              )}
            </div>
            <h1 className="detail-title">{portfolio.title}</h1>
            <div className="detail-actions">
              <Link to={`/portfolio/edit/${id}`} className="btn-icon">
                <HiPencil /> 수정
              </Link>
              <button onClick={handleDelete} className="btn-icon btn-icon-danger">
                <HiTrash /> 삭제
              </button>
            </div>
          </div>

          {portfolio.demoUrl && (
            <div className="detail-demo">
              <h2 className="detail-gallery-title">LIVE CODE DEMO</h2>
              <div className="detail-demo-frame">
                <iframe
                  src={portfolio.demoUrl}
                  title={`${portfolio.title} demo`}
                  loading="lazy"
                  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; microphone; midi; usb; xr-spatial-tracking"
                  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
                />
              </div>
            </div>
          )}

          {Array.isArray(portfolio.images) && portfolio.images.length > 0 && (
            <div className="detail-gallery">
              <h2 className="detail-gallery-title">PROJECT IMAGES</h2>
              <div className="detail-gallery-grid">
                {portfolio.images.map((img, i) => (
                  <a key={i} href={getImageUrl(img)} target="_blank" rel="noopener noreferrer" className="detail-gallery-item">
                    <img src={getImageUrl(img)} alt={`${portfolio.title}-${i + 1}`} />
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="detail-content">
            <div className="detail-main">
              <h2>프로젝트 설명</h2>
              <MarkdownContent className="detail-description">{portfolio.description}</MarkdownContent>
            </div>

            <div className="detail-sidebar">
              <div className="sidebar-block">
                <h3>TECH STACK</h3>
                <div className="detail-tags">
                  {portfolio.techStack.map((tech, i) => (
                    <span key={i} className="detail-tag">{tech}</span>
                  ))}
                </div>
              </div>

              {(portfolio.projectUrl || portfolio.githubUrl || portfolio.demoUrl) && (
                <div className="sidebar-block">
                  <h3>LINKS</h3>
                  <div className="detail-link-list">
                    {portfolio.demoUrl && (
                      <a href={portfolio.demoUrl} target="_blank" rel="noopener noreferrer" className="detail-link">
                        <HiExternalLink /> Live Demo
                      </a>
                    )}
                    {portfolio.projectUrl && (
                      <a href={portfolio.projectUrl} target="_blank" rel="noopener noreferrer" className="detail-link">
                        <HiExternalLink /> Live Site
                      </a>
                    )}
                    {portfolio.githubUrl && (
                      <a href={portfolio.githubUrl} target="_blank" rel="noopener noreferrer" className="detail-link">
                        <FaGithub /> GitHub
                      </a>
                    )}
                  </div>
                </div>
              )}

              {portfolio.budget && (
                <div className="sidebar-block">
                  <h3>BUDGET</h3>
                  <p className="sidebar-text sidebar-highlight">{portfolio.budget}</p>
                </div>
              )}

              {portfolio.rating && (
                <div className="sidebar-block">
                  <h3>RATING</h3>
                  <p className="sidebar-text sidebar-highlight">{portfolio.rating} / 5.0 ⭐</p>
                </div>
              )}

              <div className="sidebar-block">
                <h3>DATE</h3>
                <p className="sidebar-text">{new Date(portfolio.createdAt).toLocaleDateString('ko-KR')}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default PortfolioDetail;
