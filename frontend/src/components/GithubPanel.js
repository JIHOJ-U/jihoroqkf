import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaUsers, FaCodeBranch, FaStar, FaCode } from 'react-icons/fa';
import { HiExternalLink } from 'react-icons/hi';
import { getGithubStats } from '../api';
import { useLanguage } from '../contexts/LanguageContext';
import './GithubPanel.css';

// Brand-style colors per language for accents
const LANG_COLORS = {
  JavaScript: '#F7DF1E',
  TypeScript: '#3178C6',
  Python: '#3776AB',
  Java: '#ED8B00',
  Go: '#00ADD8',
  HTML: '#E34F26',
  CSS: '#1572B6',
  Vue: '#4FC08D',
  C: '#555555',
  'C++': '#00599C',
  Ruby: '#CC342D',
  PHP: '#777BB4',
  Kotlin: '#7F52FF',
  Swift: '#FA7343',
  Shell: '#4EAA25',
  Dart: '#0175C2',
  default: '#6366f1',
};

function GithubPanel() {
  const { lang } = useLanguage();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getGithubStats()
      .then(res => setStats(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="github-panel github-panel--loading">
        <div className="gh-spinner" />
      </div>
    );
  }

  if (error || !stats) return null;

  const langColor = (name) => LANG_COLORS[name] || LANG_COLORS.default;

  return (
    <motion.div
      className="github-panel"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="gh-header">
        <div className="gh-profile">
          <img src={stats.avatar} alt={stats.username} className="gh-avatar" />
          <div className="gh-info">
            <div className="gh-row">
              <FaGithub className="gh-icon" />
              <a href={stats.url} target="_blank" rel="noopener noreferrer" className="gh-username">
                @{stats.username}
              </a>
              <a href={stats.url} target="_blank" rel="noopener noreferrer" className="gh-link-btn">
                <HiExternalLink />
              </a>
            </div>
            {stats.name && <h3 className="gh-name">{stats.name}</h3>}
            {stats.bio && <p className="gh-bio">{stats.bio}</p>}
          </div>
        </div>

        <div className="gh-metrics">
          <div className="gh-metric">
            <FaCodeBranch />
            <div>
              <strong>{stats.publicRepos}</strong>
              <span>Repos</span>
            </div>
          </div>
          <div className="gh-metric">
            <FaStar />
            <div>
              <strong>{stats.totalStars ?? 0}</strong>
              <span>Stars</span>
            </div>
          </div>
          <div className="gh-metric">
            <FaUsers />
            <div>
              <strong>{stats.followers}</strong>
              <span>Followers</span>
            </div>
          </div>
          <div className="gh-metric">
            <FaCode />
            <div>
              <strong>{stats.topLanguages?.length || 0}</strong>
              <span>Languages</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contribution */}
      <div className="gh-contribution">
        <span className="gh-section-label">Contribution Activity</span>
        <div className="gh-contribution-img">
          <img src={stats.contributionGraph} alt="GitHub Contributions" />
        </div>
      </div>

      {/* Two cards: Top Langs + Top Repos */}
      <div className="gh-cards">
        <div className="gh-card-custom">
          <span className="gh-section-label">Top Languages</span>
          {stats.topLanguages && stats.topLanguages.length > 0 ? (
            <div className="gh-langs">
              {stats.topLanguages.map((l, i) => (
                <div key={i} className="gh-lang">
                  <div className="gh-lang-row">
                    <span className="gh-lang-dot" style={{ background: langColor(l.name) }} />
                    <span className="gh-lang-name">{l.name}</span>
                    <span className="gh-lang-percent">{l.percent}%</span>
                  </div>
                  <div className="gh-lang-bar">
                    <motion.div
                      className="gh-lang-fill"
                      style={{ background: langColor(l.name) }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${l.percent}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: i * 0.05 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="gh-empty">{lang === 'ko' ? '언어 데이터가 없습니다' : 'No language data'}</p>
          )}
        </div>

        <div className="gh-card-custom">
          <span className="gh-section-label">Top Repositories</span>
          {stats.topRepos && stats.topRepos.length > 0 ? (
            <div className="gh-repos">
              {stats.topRepos.map((r, i) => (
                <a
                  key={i}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gh-repo"
                >
                  <div className="gh-repo-head">
                    <FaCodeBranch />
                    <strong>{r.name}</strong>
                  </div>
                  {r.description && <p className="gh-repo-desc">{r.description}</p>}
                  <div className="gh-repo-meta">
                    {r.language && (
                      <span className="gh-repo-lang">
                        <span className="gh-lang-dot" style={{ background: langColor(r.language) }} />
                        {r.language}
                      </span>
                    )}
                    {r.stars > 0 && <span><FaStar /> {r.stars}</span>}
                    {r.forks > 0 && <span><FaCodeBranch /> {r.forks}</span>}
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <p className="gh-empty">{lang === 'ko' ? '레포 데이터가 없습니다' : 'No repo data'}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default GithubPanel;
