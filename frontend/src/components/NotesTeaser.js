import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowRight } from 'react-icons/hi';
import { POSTS } from '../data/posts';
import { useLanguage } from '../contexts/LanguageContext';
import './NotesTeaser.css';

const COPY = {
  ko: {
    label: '// NOTES',
    title: '최근에 쓴 노트',
    desc: '결정 뒤의 가설을 짧게 남깁니다.',
    all: '전체 노트 보기',
  },
  en: {
    label: '// NOTES',
    title: 'Recent notes',
    desc: 'Short writeups of the hypotheses behind decisions.',
    all: 'All notes',
  },
};

function NotesTeaser({ limit = 3 }) {
  const { lang } = useLanguage();
  const c = COPY[lang] || COPY.ko;

  const posts = [...POSTS]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, limit);

  if (posts.length === 0) return null;

  return (
    <section className="notes-teaser">
      <div className="container">
        <div className="notes-teaser-head">
          <div>
            <span className="notes-teaser-label" translate="no">{c.label}</span>
            <h2 className="notes-teaser-title">{c.title}</h2>
            <p className="notes-teaser-desc">{c.desc}</p>
          </div>
          <Link to="/blog" className="notes-teaser-all">
            {c.all} <HiArrowRight />
          </Link>
        </div>

        <ul className="notes-teaser-list">
          {posts.map((p, i) => (
            <motion.li
              key={p.slug}
              className="notes-teaser-card"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
            >
              <Link to={`/blog/${p.slug}`} className="notes-teaser-link">
                <div className="notes-teaser-meta">
                  <time dateTime={p.date}>{p.date}</time>
                  <span className="notes-teaser-tag">#{p.tags[0]}</span>
                </div>
                <h3 className="notes-teaser-name">{p.title[lang] || p.title.ko}</h3>
                <p className="notes-teaser-summary">{p.summary[lang] || p.summary.ko}</p>
                <span className="notes-teaser-cta">
                  {lang === 'ko' ? '읽기' : 'Read'} <HiArrowRight />
                </span>
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default NotesTeaser;
