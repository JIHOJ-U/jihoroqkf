import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { HiClipboard, HiCheck } from 'react-icons/hi';
import { useTheme } from '../contexts/ThemeContext';
import { useAchievement } from '../contexts/AchievementContext';
import { useLanguage } from '../contexts/LanguageContext';
import './MarkdownContent.css';

function CodeBlock({ inline, className, children, ...props }) {
  const { theme } = useTheme();
  const { unlock } = useAchievement();
  const { lang: uiLang } = useLanguage();
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const lang = match ? match[1] : '';
  const codeText = String(children).replace(/\n$/, '');

  if (inline) {
    return <code className="md-inline-code" {...props}>{children}</code>;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(codeText);
    unlock('CODE_COPIED');
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="md-code-wrap">
      <div className="md-code-header">
        <span className="md-code-lang">{lang || 'code'}</span>
        <button className="md-code-copy" onClick={handleCopy}>
          {copied
            ? <><HiCheck /> {uiLang === 'en' ? 'Copied' : '복사됨'}</>
            : <><HiClipboard /> {uiLang === 'en' ? 'Copy' : '복사'}</>}
        </button>
      </div>
      <SyntaxHighlighter
        language={lang || 'text'}
        style={theme === 'dark' ? vscDarkPlus : oneLight}
        showLineNumbers
        customStyle={{
          margin: 0,
          borderRadius: 0,
          fontSize: '0.85rem',
          background: theme === 'dark' ? '#1a1d29' : '#fafbff',
        }}
      >
        {codeText}
      </SyntaxHighlighter>
    </div>
  );
}

function MarkdownContent({ children, className = '' }) {
  return (
    <div className={`md-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code: CodeBlock,
          a: ({ href, children, ...props }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}

export default MarkdownContent;
