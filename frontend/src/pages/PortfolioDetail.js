import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowLeft, HiArrowRight, HiExternalLink, HiPencil, HiTrash, HiCode, HiCalendar, HiUser, HiSparkles } from 'react-icons/hi';
import { FaGithub } from 'react-icons/fa';
import { getPortfolio, getPortfolios, deletePortfolio, getImageUrl } from '../api';
import { useAchievement } from '../contexts/AchievementContext';
import { useLanguage } from '../contexts/LanguageContext';
import MarkdownContent from '../components/MarkdownContent';
import { trackCta, trackPortfolioOpen } from '../utils/analytics';
import './PortfolioDetail.css';

const COPY = {
  ko: {
    confirmDelete: '정말 삭제하시겠습니까?',
    deleteFail: '삭제에 실패했습니다.',
    edit: '수정', remove: '삭제', desc: '프로젝트 설명',
    relatedTitle: '비슷한 프로젝트',
    relatedDesc: '같은 카테고리·기술의 다른 작업물',
    viewAll: '전체 보기',
    ctaTag: 'LET\'S BUILD',
    ctaTitle: '이런 거 만들고 싶으세요?',
    ctaDesc: '비슷한 톤·기술로 본인 프로젝트도 만들 수 있어요. 무료 상담으로 범위·견적부터 같이 정리해드릴게요.',
    ctaBtn: '비슷한 거 만들기',
  },
  en: {
    confirmDelete: 'Are you sure you want to delete this?',
    deleteFail: 'Failed to delete.',
    edit: 'Edit', remove: 'Delete', desc: 'Project Description',
    relatedTitle: 'Related projects',
    relatedDesc: 'Other work in the same category or tech stack',
    viewAll: 'View all',
    ctaTag: 'LET\'S BUILD',
    ctaTitle: 'Want something like this?',
    ctaDesc: 'We can build the same tone/stack for you. Start with a free consultation — scope and budget first.',
    ctaBtn: 'Start a similar build',
  },
};

// Scan markdown for h2/h3 lines and return a flat TOC array.
function buildToc(markdown) {
  if (!markdown) return [];
  const lines = markdown.split('\n');
  const toc = [];
  const seen = new Set();
  for (const raw of lines) {
    const m = /^(##|###)\s+(.+?)\s*$/.exec(raw);
    if (!m) continue;
    const level = m[1].length;
    const text = m[2].trim();
    // Mirror MarkdownContent's slug algorithm (basic)
    let slug = text
      .toLowerCase()
      .replace(/[`*_~]/g, '')
      .replace(/[^\w가-힣]+/g, '-')
      .replace(/^-+|-+$/g, '');
    if (!slug) slug = 'section';
    let unique = slug;
    let i = 2;
    while (seen.has(unique)) unique = `${slug}-${i++}`;
    seen.add(unique);
    toc.push({ level, text, slug: unique });
  }
  return toc;
}

// Score how related two portfolios are. Same category = 5, each shared
// tech-stack item = 2. Highest scores surface first.
function scoreRelated(current, candidate) {
  if (candidate.id === current.id) return -1;
  let score = 0;
  if (candidate.category && candidate.category === current.category) score += 5;
  const a = new Set((current.techStack || []).map((t) => t.toLowerCase()));
  (candidate.techStack || []).forEach((t) => {
    if (a.has(t.toLowerCase())) score += 2;
  });
  return score;
}

function PortfolioDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const c = COPY[lang] || COPY.ko;
  const [portfolio, setPortfolio] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const { unlock } = useAchievement();

  useEffect(() => {
    getPortfolio(id)
      .then(res => {
        setPortfolio(res.data);
        unlock('PORTFOLIO_VIEWED');
        trackPortfolioOpen(res.data.id, res.data.title);
      })
      .catch(() => navigate('/portfolio'))
      .finally(() => setLoading(false));
  }, [id, navigate, unlock]);

  // Pull all portfolios once we know which one we're on, then rank by similarity.
  useEffect(() => {
    if (!portfolio) return;
    getPortfolios()
      .then((res) => {
        const ranked = (res.data || [])
          .map((p) => ({ p, s: scoreRelated(portfolio, p) }))
          .filter((x) => x.s > 0)
          .sort((a, b) => b.s - a.s)
          .slice(0, 3)
          .map((x) => x.p);
        setRelated(ranked);
      })
      .catch(() => setRelated([]));
  }, [portfolio]);

  const handleDelete = async () => {
    if (window.confirm(c.confirmDelete)) {
      try {
        await deletePortfolio(id);
        navigate('/portfolio');
      } catch (err) {
        alert(c.deleteFail);
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

          {portfolio.thumbnail && (
            <div className="detail-hero">
              <img
                src={getImageUrl(portfolio.thumbnail)}
                alt={portfolio.title}
                className={`detail-hero__img ${portfolio.thumbnailFit === 'contain' ? 'detail-hero__img--contain' : ''}`}
                /* shared name so the Portfolio card thumbnail morphs into here
                   via the View Transitions API (Chromium 111+ / Safari 18+). */
                style={{ viewTransitionName: 'pf-hero' }}
              />
              <div className="detail-hero__gradient" aria-hidden="true" />
            </div>
          )}

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
                <HiPencil /> {c.edit}
              </Link>
              <button onClick={handleDelete} className="btn-icon btn-icon-danger">
                <HiTrash /> {c.remove}
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
              <h2>{c.desc}</h2>
              <MarkdownContent className="detail-description">{portfolio.description}</MarkdownContent>
            </div>

            <div className="detail-sidebar">
              {(() => {
                const toc = buildToc(portfolio.description);
                if (toc.length < 3) return null;
                return (
                  <div className="sidebar-block sidebar-toc">
                    <h3>ON THIS PAGE</h3>
                    <ul>
                      {toc.map((t) => (
                        <li
                          key={t.slug}
                          className={`sidebar-toc__item sidebar-toc__item--lvl-${t.level}`}
                        >
                          <a href={`#${t.slug}`}>{t.text}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })()}

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
                <p className="sidebar-text">{new Date(portfolio.createdAt).toLocaleDateString(lang === 'en' ? 'en-US' : 'ko-KR')}</p>
              </div>
            </div>
          </div>

          {related.length > 0 && (
            <motion.section
              className="detail-related"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
            >
              <div className="detail-related-head">
                <div>
                  <span className="detail-related-label">// RELATED</span>
                  <h2 className="detail-related-title">{c.relatedTitle}</h2>
                  <p className="detail-related-desc">{c.relatedDesc}</p>
                </div>
                <Link to="/portfolio" className="detail-related-all">{c.viewAll} →</Link>
              </div>

              <ul className="detail-related-grid">
                {related.map((p) => (
                  <li key={p.id} className="detail-related-item">
                    <Link to={`/portfolio/${p.id}`} className="detail-related-card">
                      <div className="detail-related-thumb">
                        {p.thumbnail ? (
                          <img
                            src={getImageUrl(p.thumbnail)}
                            alt={p.title}
                            loading="lazy"
                            decoding="async"
                            className={p.thumbnailFit === 'contain' ? 'detail-related-thumb--contain' : ''}
                          />
                        ) : (
                          <div className="detail-related-thumb-empty"><HiCode /></div>
                        )}
                        {p.category && <span className="detail-related-badge">{p.category}</span>}
                      </div>
                      <h3 className="detail-related-name">{p.title}</h3>
                      {p.client && <p className="detail-related-client">{p.client}</p>}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.section>
          )}

          {/* "Want one like this?" CTA — prefills the contact form with this
              project's category + a starting description so the inquiry already
              has context when the user lands on /contact. */}
          <motion.section
            className="detail-cta"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6 }}
          >
            <div className="detail-cta-glow" aria-hidden="true" />
            <div className="detail-cta-inner">
              <span className="detail-cta-tag" translate="no">
                <HiSparkles /> {c.ctaTag}
              </span>
              <h3 className="detail-cta-title">{c.ctaTitle}</h3>
              <p className="detail-cta-desc">{c.ctaDesc}</p>
              <Link
                to="/contact"
                state={{
                  prefill: {
                    projectType: portfolio.category,
                    description:
                      lang === 'ko'
                        ? `"${portfolio.title}" 같은 프로젝트 의뢰드리고 싶어요.\n\n참고 톤·기술: ${(portfolio.techStack || []).slice(0, 4).join(', ')}`
                        : `I'd like a project similar to "${portfolio.title}".\n\nReference tone/stack: ${(portfolio.techStack || []).slice(0, 4).join(', ')}`,
                  },
                }}
                className="detail-cta-btn"
                onClick={() => trackCta('similar_build', { portfolio_id: id, portfolio_title: portfolio.title })}
              >
                {c.ctaBtn} <HiArrowRight />
              </Link>
            </div>
          </motion.section>
        </motion.div>
      </div>
    </div>
  );
}

export default PortfolioDetail;
