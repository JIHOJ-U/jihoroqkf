import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiChevronRight, HiChevronDown, HiX, HiTerminal, HiViewGrid
} from 'react-icons/hi';
import {
  VscChevronRight, VscChevronDown
} from 'react-icons/vsc';
import './ExplorerSidebar.css';

// File-tree style site map
const TREE = [
  {
    type: 'folder',
    name: 'pages',
    children: [
      { type: 'file', name: 'home.tsx', path: '/', icon: 'tsx' },
      { type: 'file', name: 'about.md', path: '/about', icon: 'md' },
      { type: 'file', name: 'portfolio.tsx', path: '/portfolio', icon: 'tsx' },
      { type: 'file', name: 'contact.tsx', path: '/contact', icon: 'tsx' },
      { type: 'file', name: 'terminal.sh', path: '/terminal', icon: 'sh' },
      { type: 'file', name: 'privacy.md', path: '/privacy', icon: 'md' },
    ],
  },
  {
    type: 'folder',
    name: 'public',
    children: [
      { type: 'link', name: 'github.com', url: 'https://github.com/JIHOJ-U/JIHOJ-U', icon: 'link' },
      { type: 'link', name: 'blog.naver.com', url: 'https://blog.naver.com/longnight0719', icon: 'link' },
    ],
  },
  { type: 'file', name: 'package.json', path: '/about', icon: 'json' },
  { type: 'file', name: 'README.md', path: '/', icon: 'md' },
];

const FILE_ICON = {
  tsx: { color: '#3178C6', text: 'TS' },
  jsx: { color: '#61DAFB', text: 'JSX' },
  md: { color: '#3b82f6', text: 'MD' },
  json: { color: '#f59e0b', text: '{}' },
  sh: { color: '#10b981', text: '$_' },
  link: { color: '#8b5cf6', text: '↗' },
};

function FileIcon({ type }) {
  const ic = FILE_ICON[type] || { color: '#999', text: '◯' };
  return (
    <span className="exp-file-icon" style={{ background: ic.color }}>
      {ic.text}
    </span>
  );
}

function TreeNode({ node, depth = 0, currentPath, onNavigate }) {
  const [open, setOpen] = useState(true);

  if (node.type === 'folder') {
    return (
      <div className="exp-folder">
        <button
          className="exp-row exp-row--folder"
          onClick={() => setOpen(o => !o)}
          style={{ paddingLeft: `${8 + depth * 12}px` }}
        >
          {open ? <VscChevronDown /> : <VscChevronRight />}
          <span className="exp-folder-icon">{open ? '📂' : '📁'}</span>
          <span className="exp-name">{node.name}</span>
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ overflow: 'hidden' }}
            >
              {node.children.map((child, i) => (
                <TreeNode
                  key={i}
                  node={child}
                  depth={depth + 1}
                  currentPath={currentPath}
                  onNavigate={onNavigate}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (node.type === 'link') {
    return (
      <a
        href={node.url}
        target="_blank"
        rel="noopener noreferrer"
        className="exp-row"
        style={{ paddingLeft: `${20 + depth * 12}px` }}
      >
        <FileIcon type={node.icon} />
        <span className="exp-name">{node.name}</span>
      </a>
    );
  }

  const isActive = currentPath === node.path;

  return (
    <button
      className={`exp-row ${isActive ? 'exp-row--active' : ''}`}
      onClick={() => onNavigate(node.path)}
      style={{ paddingLeft: `${20 + depth * 12}px` }}
    >
      <FileIcon type={node.icon} />
      <span className="exp-name">{node.name}</span>
    </button>
  );
}

function ExplorerSidebar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Toggle with `Ctrl+B` (VS Code style)
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        setOpen(o => !o);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const go = (path) => {
    navigate(path);
    if (window.innerWidth < 1024) setOpen(false);
  };

  return (
    <>
      {/* Floating toggle button */}
      <button
        className={`exp-toggle ${open ? 'exp-toggle--active' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label="Explorer"
        title="Explorer (Ctrl+B)"
      >
        <HiViewGrid />
      </button>

      <AnimatePresence>
        {open && (
          <motion.aside
            className="exp-sidebar"
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: 'spring', stiffness: 220, damping: 25 }}
          >
            <div className="exp-header">
              <span className="exp-header-title">EXPLORER</span>
              <button className="exp-close" onClick={() => setOpen(false)}>
                <HiX />
              </button>
            </div>

            <div className="exp-section">
              <div className="exp-section-title">DEVVIBE</div>
              <div className="exp-tree">
                {TREE.map((node, i) => (
                  <TreeNode
                    key={i}
                    node={node}
                    currentPath={location.pathname}
                    onNavigate={go}
                  />
                ))}
              </div>
            </div>

            <div className="exp-footer">
              <span className="exp-footer-status">●</span>
              <span>main</span>
              <span className="exp-footer-spacer" />
              <button className="exp-terminal-btn" onClick={() => go('/terminal')}>
                <HiTerminal /> TERMINAL
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

export default ExplorerSidebar;
