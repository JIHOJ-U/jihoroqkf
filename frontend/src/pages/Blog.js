import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowRight } from 'react-icons/hi';
import { POSTS, getAllTags } from '../data/posts';
import { useLanguage } from '../contexts/LanguageContext';
import './Blog.css';

const COPY = {
  ko: {
    label: '// NOTES',
    title: '노트 · 케이스 스터디',
    desc: 'Dev.Vibe에서 어떤 결정을 내렸고, 그 결정 뒤에 어떤 가설이 있었는지.',
    all: '전체',
    readMore: '읽기',
    empty: '아직 등록된 글이 없습니다.',
  },
  en: {
    label: '// NOTES',
    title: 'Notes & case studies',
    desc: 'The decisions behind Dev.Vibe and the thinking that drove them.',
    all: 'All',
    readMore: 'Read',
    empty: 'No posts yet.',
  },
};

function Blog() {
  const { lang } = useLanguage();
  const c = COPY[lang] || COPY.ko;
  const [activeTag, setActiveTag] = useState('all');
  const tags = useMemo(() => getAllTags(), []);

  const sorted = useMemo(() => {
    return [...POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));
  }, []);

  const filtered = useMemo(() => {
    if (activeTag === 'all') return sorted;
    return sorted.filter((p) => p.tags.includes(activeTag));
  }, [sorted, activeTag]);

  return (
    <div className="blog-page">
      <div className="container">
        <motion.header
          className="blog-page-head"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="blog-page-label" translate="no">{c.label}</span>
          <h1 className="blog-page-title">{c.title}</h1>
          <p className="blog-page-desc">{c.desc}</p>
        </motion.header>

        <div className="blog-page-tabs">
          <button
            type="button"
            className={`blog-tab ${activeTag === 'all' ? 'is-active' : ''}`}
            onClick={() => setActiveTag('all')}
          >
            {c.all}
          </button>
          {tags.map((t) => (
            <button
              key={t}
              type="button"
              className={`blog-tab ${activeTag === t ? 'is-active' : ''}`}
              onClick={() => setActiveTag(t)}
            >
              #{t}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="blog-empty">{c.empty}</div>
        ) : (
          <ul className="blog-list">
            {filtered.map((post, i) => (
              <motion.li
                key={post.slug}
                className="blog-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                <Link to={`/blog/${post.slug}`} className="blog-card-link">
                  <div className="blog-card-meta">
                    <time dateTime={post.date}>{post.date}</time>
                    <div className="blog-card-tags">
                      {post.tags.map((t) => <span key={t} className="blog-card-tag">#{t}</span>)}
                    </div>
                  </div>
                  <h2 className="blog-card-title">{post.title[lang] || post.title.ko}</h2>
                  <p className="blog-card-summary">{post.summary[lang] || post.summary.ko}</p>
                  <span className="blog-card-cta">{c.readMore} <HiArrowRight /></span>
                </Link>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Blog;
