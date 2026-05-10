import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaBlog } from 'react-icons/fa';
import { HiArrowRight, HiCalendar } from 'react-icons/hi';
import { getBlogPosts } from '../api';
import './BlogPanel.css';

function BlogPanel() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getBlogPosts()
      .then(res => setPosts(res.data.posts || []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="blog-panel-loading">
        <div className="blog-spinner" />
      </div>
    );
  }

  if (error || posts.length === 0) return null;

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString('ko-KR', {
        year: 'numeric', month: 'short', day: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="blog-panel">
      <div className="blog-panel-header">
        <div>
          <span className="section-label">LATEST POSTS</span>
          <h3>최근 블로그 글</h3>
        </div>
        <a
          href="https://blog.naver.com/longnight0719"
          target="_blank"
          rel="noopener noreferrer"
          className="blog-view-all"
        >
          블로그 전체 보기 <HiArrowRight />
        </a>
      </div>

      <div className="blog-grid">
        {posts.map((post, i) => (
          <motion.a
            key={i}
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            className="blog-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <div className="blog-card-icon"><FaBlog /></div>
            <div className="blog-card-body">
              <h4 className="blog-card-title">{post.title}</h4>
              {post.contentSnippet && (
                <p className="blog-card-snippet">{post.contentSnippet}</p>
              )}
              <div className="blog-card-meta">
                <span><HiCalendar /> {formatDate(post.pubDate)}</span>
                {post.categories && post.categories[0] && (
                  <span className="blog-card-cat">{post.categories[0]}</span>
                )}
              </div>
            </div>
            <HiArrowRight className="blog-card-arrow" />
          </motion.a>
        ))}
      </div>
    </div>
  );
}

export default BlogPanel;
