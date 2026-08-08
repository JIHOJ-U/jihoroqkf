import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowLeft, HiArrowRight } from 'react-icons/hi';
import { getPostBySlug, POSTS } from '../data/posts';
import { useLanguage } from '../contexts/LanguageContext';
import MarkdownContent from '../components/MarkdownContent';
import './Blog.css';

const COPY = {
  ko: { back: '노트 목록', next: '다음 글', prev: '이전 글', notFound: '글을 찾을 수 없어요.' },
  en: { back: 'All notes', next: 'Next post', prev: 'Previous post', notFound: 'Post not found.' },
};

function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const c = COPY[lang] || COPY.ko;

  const post = getPostBySlug(slug);

  // Find prev/next based on date order
  const sorted = [...POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));
  const idx = sorted.findIndex((p) => p.slug === slug);
  const prev = idx > 0 ? sorted[idx - 1] : null;
  const next = idx >= 0 && idx < sorted.length - 1 ? sorted[idx + 1] : null;

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [slug]);

  // BreadcrumbList JSON-LD — Home > 노트 > [title]. Removed on unmount so
  // the schema is scoped to this route.
  useEffect(() => {
    if (!post) return undefined;
    const origin = window.location.origin;
    const postTitle = post.title[lang] || post.title.ko;
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: lang === 'ko' ? '홈' : 'Home', item: `${origin}/` },
        { '@type': 'ListItem', position: 2, name: lang === 'ko' ? '노트' : 'Notes', item: `${origin}/blog` },
        { '@type': 'ListItem', position: 3, name: postTitle, item: window.location.href },
      ],
    };
    const domId = 'breadcrumb-schema';
    let tag = document.getElementById(domId);
    if (!tag) {
      tag = document.createElement('script');
      tag.type = 'application/ld+json';
      tag.id = domId;
      document.head.appendChild(tag);
    }
    tag.textContent = JSON.stringify(schema);
    return () => {
      const existing = document.getElementById(domId);
      if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
    };
  }, [post, lang]);

  if (!post) {
    return (
      <div className="blog-page">
        <div className="container">
          <div className="blog-empty">{c.notFound}</div>
          <button type="button" onClick={() => navigate('/blog')} className="blog-back">
            <HiArrowLeft /> {c.back}
          </button>
        </div>
      </div>
    );
  }

  const title = post.title[lang] || post.title.ko;
  const content = post.content[lang] || post.content.ko;

  return (
    <div className="blog-page blog-post-page">
      <div className="container blog-post-container">
        <Link to="/blog" className="blog-back">
          <HiArrowLeft /> {c.back}
        </Link>

        <motion.header
          className="blog-post-head"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <div className="blog-card-meta">
            <time dateTime={post.date}>{post.date}</time>
            <div className="blog-card-tags">
              {post.tags.map((t) => <span key={t} className="blog-card-tag">#{t}</span>)}
            </div>
          </div>
          <h1 className="blog-post-title">{title}</h1>
        </motion.header>

        <motion.article
          className="blog-post-body"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <MarkdownContent>{content}</MarkdownContent>
        </motion.article>

        <nav className="blog-post-nav" aria-label="post navigation">
          {prev ? (
            <Link to={`/blog/${prev.slug}`} className="blog-post-nav-link">
              <span className="blog-post-nav-dir"><HiArrowLeft /> {c.prev}</span>
              <span className="blog-post-nav-title">{prev.title[lang] || prev.title.ko}</span>
            </Link>
          ) : <span />}
          {next ? (
            <Link to={`/blog/${next.slug}`} className="blog-post-nav-link blog-post-nav-link--right">
              <span className="blog-post-nav-dir">{c.next} <HiArrowRight /></span>
              <span className="blog-post-nav-title">{next.title[lang] || next.title.ko}</span>
            </Link>
          ) : <span />}
        </nav>
      </div>
    </div>
  );
}

export default BlogPost;
