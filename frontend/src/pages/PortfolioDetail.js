import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowLeft, HiExternalLink, HiPencil, HiTrash, HiCode, HiCalendar, HiUser } from 'react-icons/hi';
import { FaGithub } from 'react-icons/fa';
import { getPortfolio, deletePortfolio, getImageUrl } from '../api';
import './PortfolioDetail.css';

function PortfolioDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPortfolio(id)
      .then(res => setPortfolio(res.data))
      .catch(() => navigate('/portfolio'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

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

          {portfolio.thumbnail ? (
            <div className="detail-image">
              <img src={getImageUrl(portfolio.thumbnail)} alt={portfolio.title} />
            </div>
          ) : (
            <div className="detail-image detail-no-image">
              <HiCode />
            </div>
          )}

          <div className="detail-content">
            <div className="detail-main">
              <h2>프로젝트 설명</h2>
              <p className="detail-description">{portfolio.description}</p>
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

              {(portfolio.projectUrl || portfolio.githubUrl) && (
                <div className="sidebar-block">
                  <h3>LINKS</h3>
                  <div className="detail-link-list">
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
