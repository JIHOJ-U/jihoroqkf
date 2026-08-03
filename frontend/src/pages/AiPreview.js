import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowRight, HiSparkles, HiExclamationCircle } from 'react-icons/hi';
import { submitAiPreview } from '../api';
import { useLanguage } from '../contexts/LanguageContext';
import './AiPreview.css';

function AiPreview() {
  const { t, lang } = useLanguage();
  const c = t.aiPreview;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    businessType: c.businessTypes[0],
    siteGoal: c.siteGoals[0],
    mood: c.moods[0],
    mustHave: '',
    referenceSite: '',
    email: '',
  });
  const [status, setStatus] = useState('idle'); // idle | loading | result | error
  const [result, setResult] = useState(null);
  const [errorType, setErrorType] = useState('unknown');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email.trim()) return;
    setStatus('loading');
    try {
      const res = await submitAiPreview({ ...form, lang });
      setResult(res.data);
      setStatus('result');
    } catch (err) {
      setErrorType(err.response?.data?.error || 'unknown');
      setStatus('error');
    }
  };

  const goToContact = () => {
    const summary = result
      ? `"${result.headline}"\n\n${result.sections.map((s) => `- ${s.title}: ${s.description}`).join('\n')}`
      : `${form.businessType} / ${form.siteGoal}`;
    navigate('/contact', {
      state: {
        prefill: {
          projectType: form.businessType,
          description: `${c.prefillPrefix}\n\n${summary}`,
        },
      },
    });
  };

  return (
    <div className="ai-prev-page">
      <div className="container">
        <header className="ai-prev-header">
          <span className="ai-prev-label" translate="no">{c.label}</span>
          <h1 className="ai-prev-title">{c.title}</h1>
          <p className="ai-prev-desc">{c.desc}</p>
        </header>

        {status !== 'result' && (
          <form className="ai-prev-form" onSubmit={handleSubmit}>
            <div className="ai-prev-field">
              <label>{c.form.businessType}</label>
              <select name="businessType" value={form.businessType} onChange={handleChange}>
                {c.businessTypes.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>

            <div className="ai-prev-field">
              <label>{c.form.siteGoal}</label>
              <select name="siteGoal" value={form.siteGoal} onChange={handleChange}>
                {c.siteGoals.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>

            <div className="ai-prev-field">
              <label>{c.form.mood}</label>
              <div className="ai-prev-chips">
                {c.moods.map((m) => (
                  <label key={m} className={`ai-prev-chip ${form.mood === m ? 'active' : ''}`}>
                    <input type="radio" name="mood" value={m} checked={form.mood === m} onChange={handleChange} />
                    {m}
                  </label>
                ))}
              </div>
            </div>

            <div className="ai-prev-field">
              <label>{c.form.mustHave}</label>
              <textarea name="mustHave" value={form.mustHave} onChange={handleChange} rows={3} placeholder={c.form.mustHavePh} />
            </div>

            <div className="ai-prev-field">
              <label>{c.form.referenceSite}</label>
              <input type="text" name="referenceSite" value={form.referenceSite} onChange={handleChange} placeholder={c.form.referenceSitePh} />
            </div>

            <div className="ai-prev-field">
              <label>{c.form.email}</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder={c.form.emailPh} required />
            </div>

            <button type="submit" className="ai-prev-submit" disabled={status === 'loading'}>
              <HiSparkles /> {status === 'loading' ? c.submitting : c.submit}
            </button>
          </form>
        )}

        {status === 'error' && (
          <div className="ai-prev-error">
            <p><HiExclamationCircle /> {c.errors[errorType] || c.errors.unknown}</p>
            <button type="button" className="ai-prev-fallback-btn" onClick={goToContact}>
              {c.errors.fallbackCta} <HiArrowRight />
            </button>
          </div>
        )}

        {status === 'result' && result && (
          <motion.div
            className="ai-prev-result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="ai-prev-result-headline">{result.headline}</h2>
            <p className="ai-prev-result-tagline">{result.tagline}</p>

            <div className="ai-prev-result-sections">
              {result.sections.map((s, i) => (
                <div key={i} className="ai-prev-result-section">
                  <span className="ai-prev-result-section-num">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3>{s.title}</h3>
                    <p>{s.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="ai-prev-result-tone">
              <span>{c.result.toneLabel}</span> {result.toneSuggestion}
              <div className="ai-prev-result-colors">
                {result.suggestedColors.map((hex, i) => (
                  <span key={i} className="ai-prev-result-swatch" style={{ background: hex }} title={hex} />
                ))}
              </div>
            </div>

            <div className="ai-prev-result-cta">
              <Link
                to="/contact"
                onClick={(e) => { e.preventDefault(); goToContact(); }}
                className="ai-prev-result-cta-btn"
              >
                {c.cta} <HiArrowRight />
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default AiPreview;
