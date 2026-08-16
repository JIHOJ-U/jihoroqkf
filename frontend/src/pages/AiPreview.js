import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiArrowRight, HiArrowUp, HiPlus, HiRefresh } from 'react-icons/hi';
import { submitAiPreview } from '../api';
import { useLanguage } from '../contexts/LanguageContext';
import ComingSoonBadge from '../components/ComingSoonBadge';
import TypeOnView from '../components/TypeOnView';
import TypingIndicator from '../components/TypingIndicator';
import './AiPreview.css';

/* AI Preview — ChatGPT/Claude-style home screen.
   Phase 'prompt' shows one centered pill input; after submit the layout
   collapses to a compact chat window that asks for email → shows a typing
   indicator while the AI backend runs → renders a rich result card or a
   fallback that hands off to /contact. */

let msgIdCounter = 0;
const nextId = () => ++msgIdCounter;

const CHAR_SPEED = 40;              // ms per char, matches TypeOnView default feel
const TYPING_BEAT = 650;             // typing-indicator dwell before next bot line
const POST_TYPE_BUFFER = 250;        // small pause after typewriter finishes
const RESPONSE_DELAY = 400;          // user msg → typing indicator delay

const MAX_TEXTAREA_PX = 160;         // caps textarea auto-grow (~4 lines)
const PROMPT_PREVIEW_CHARS = 20;

const emailValid = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v || '').trim());
const truncate = (s, n) => (s.length > n ? s.slice(0, n) + '...' : s);

function AiPreview() {
  const { t, lang } = useLanguage();
  const c = t.aiPreview;
  const chat = c.chat;
  const navigate = useNavigate();

  const [phase, setPhase] = useState('prompt'); // prompt | email | generating | result | error
  const [promptText, setPromptText] = useState('');
  const [emailText, setEmailText] = useState('');
  const [emailError, setEmailError] = useState('');
  const [messages, setMessages] = useState([]);
  const [resultData, setResultData] = useState(null);

  const promptRef = useRef(null);
  const emailRef = useRef(null);
  const scrollRef = useRef(null);
  const timersRef = useRef([]);

  // --- timers -------------------------------------------------------------
  const schedule = (fn, delay) => {
    const id = setTimeout(fn, delay);
    timersRef.current.push(id);
    return id;
  };
  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };
  useEffect(() => clearTimers, []);

  // --- message helpers ----------------------------------------------------
  const pushMsg = (msg) => setMessages((prev) => [...prev, { id: nextId(), ...msg }]);
  const removeTyping = () =>
    setMessages((prev) => prev.filter((m) => m.role !== 'typing'));

  // Auto-scroll chat to bottom on new messages
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  // Auto-grow the prompt textarea whenever value changes
  useEffect(() => {
    const el = promptRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, MAX_TEXTAREA_PX) + 'px';
  }, [promptText, phase]);

  // Focus email input when entering email phase
  useEffect(() => {
    if (phase !== 'email') return;
    const id = setTimeout(() => emailRef.current?.focus(), 350);
    return () => clearTimeout(id);
  }, [phase]);

  // --- Prompt phase -------------------------------------------------------
  const handlePromptSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const val = promptText.trim();
    if (!val) return;
    setPhase('email');
    setMessages([]);
    pushMsg({ role: 'user', text: val });
    const preview = truncate(val, PROMPT_PREVIEW_CHARS);
    schedule(() => pushMsg({ role: 'typing' }), RESPONSE_DELAY);
    schedule(() => {
      removeTyping();
      pushMsg({ role: 'bot', text: chat.emailAsk(preview) });
    }, RESPONSE_DELAY + TYPING_BEAT);
  };

  const handleSuggestion = (text) => {
    setPromptText(text);
    // Focus the input so user can edit inline before submitting
    schedule(() => promptRef.current?.focus(), 0);
  };

  // --- Email phase --------------------------------------------------------
  const handleEmailSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const val = emailText.trim();
    if (!emailValid(val)) {
      setEmailError(chat.emailInvalid);
      return;
    }
    setEmailError('');
    pushMsg({ role: 'user', text: val });
    setEmailText('');
    setPhase('generating');
    schedule(() => pushMsg({ role: 'typing', label: chat.typingLabel }), RESPONSE_DELAY);

    try {
      const res = await submitAiPreview({
        businessType: promptText.trim(),
        siteGoal: promptText.trim(),
        mood: '',
        mustHave: '',
        referenceSite: '',
        email: val,
        lang,
      });
      removeTyping();
      pushMsg({ role: 'bot', text: chat.resultIntro });
      const dur = chat.resultIntro.length * CHAR_SPEED + POST_TYPE_BUFFER;
      schedule(() => {
        setResultData(res.data);
        pushMsg({ role: 'result', data: res.data });
        setPhase('result');
      }, dur + 200);
    } catch (err) {
      removeTyping();
      pushMsg({ role: 'bot', text: chat.fallbackIntro });
      const dur = chat.fallbackIntro.length * CHAR_SPEED + POST_TYPE_BUFFER;
      schedule(() => {
        pushMsg({ role: 'fallback' });
        setPhase('error');
      }, dur + 200);
    }
  };

  // --- Handoff to /contact ------------------------------------------------
  const goToContact = () => {
    const summary = resultData
      ? `"${resultData.headline}"\n\n${resultData.sections
          .map((s) => `- ${s.title}: ${s.description}`)
          .join('\n')}`
      : promptText.trim();
    navigate('/contact', {
      state: {
        prefill: {
          projectType: '',
          description: `${c.prefillPrefix}\n\n${summary}`,
        },
      },
    });
  };

  const restart = () => {
    clearTimers();
    setPhase('prompt');
    setPromptText('');
    setEmailText('');
    setEmailError('');
    setMessages([]);
    setResultData(null);
    schedule(() => promptRef.current?.focus(), 0);
  };

  const showRestart = phase === 'result' || phase === 'error';
  const isChatPhase = phase !== 'prompt';

  return (
    <div className="aichat-page">
      <div className="container">
        <ComingSoonBadge
          variant="notice"
          title={t.comingSoon?.aiPreviewTitle}
          message={t.comingSoon?.aiPreviewBody}
        />

        {phase === 'prompt' && (
          <section className="aichat-prompt-hero">
            <span className="aichat-prompt-eyebrow" translate="no">{chat.botLabel}</span>
            <h1 className="aichat-prompt-title">{chat.heroTitle}</h1>
            <p className="aichat-prompt-desc">{chat.heroDesc}</p>

            <form className="aichat-prompt-input-wrap" onSubmit={handlePromptSubmit}>
              <button
                type="button"
                className="aichat-prompt-attach"
                aria-label={chat.attachLabel}
                title={chat.attachLabel}
                tabIndex={-1}
              >
                <HiPlus />
              </button>
              <textarea
                ref={promptRef}
                className="aichat-prompt-input"
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handlePromptSubmit();
                  }
                }}
                placeholder={chat.promptPlaceholder}
                rows={1}
                aria-label={chat.heroTitle}
                /* eslint-disable-next-line jsx-a11y/no-autofocus */
                autoFocus
              />
              <button
                type="submit"
                className="aichat-prompt-send"
                aria-label={chat.sendLabel}
                disabled={!promptText.trim()}
              >
                <HiArrowUp />
              </button>
            </form>

            <div className="aichat-prompt-suggestions">
              {chat.suggestions.map((s) => (
                <button
                  key={s.text}
                  type="button"
                  className="aichat-prompt-suggestion"
                  onClick={() => handleSuggestion(s.text)}
                >
                  <span className="aichat-prompt-suggestion-emoji" aria-hidden="true">
                    {s.emoji}
                  </span>
                  <span>{s.text}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {isChatPhase && (
          <section className="aichat-window" aria-live="polite">
            <div className="aichat-window-header">
              <span className="aichat-window-dots" aria-hidden="true">
                <span className="aichat-window-dot" />
                <span className="aichat-window-dot" />
                <span className="aichat-window-dot" />
              </span>
              <span className="aichat-window-label" translate="no">{chat.botLabel}</span>
              {showRestart && (
                <button type="button" className="aichat-restart-btn" onClick={restart}>
                  <HiRefresh /> {chat.restart}
                </button>
              )}
            </div>

            <div className="aichat-messages" ref={scrollRef}>
              {messages.map((m) => (
                <ChatMessage
                  key={m.id}
                  m={m}
                  chat={chat}
                  c={c}
                  goToContact={goToContact}
                />
              ))}
            </div>

            {phase === 'email' && (
              <form className="aichat-input-row" onSubmit={handleEmailSubmit}>
                {emailError && (
                  <div className="aichat-input-error" role="alert">{emailError}</div>
                )}
                <div className="aichat-input-pill">
                  <input
                    ref={emailRef}
                    type="email"
                    className="aichat-input-field"
                    value={emailText}
                    onChange={(e) => {
                      setEmailText(e.target.value);
                      if (emailError) setEmailError('');
                    }}
                    placeholder={chat.emailPlaceholder}
                    aria-label={chat.emailPlaceholder}
                    autoComplete="email"
                  />
                  <button
                    type="submit"
                    className="aichat-input-send"
                    aria-label={chat.sendLabel}
                    disabled={!emailText.trim()}
                  >
                    <HiArrowUp />
                  </button>
                </div>
              </form>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Message renderer                                                          */
/* ------------------------------------------------------------------------ */
function ChatMessage({ m, chat, c, goToContact }) {
  if (m.role === 'typing') {
    return (
      <div className="aichat-msg aichat-msg--bot">
        <span className="aichat-avatar" aria-hidden="true">{chat.botAvatar}</span>
        <div className="aichat-bubble aichat-bubble--bot aichat-bubble--typing">
          <TypingIndicator label={m.label} />
        </div>
      </div>
    );
  }

  if (m.role === 'user') {
    return (
      <div className="aichat-msg aichat-msg--user">
        <div className="aichat-bubble aichat-bubble--user">{m.text}</div>
      </div>
    );
  }

  if (m.role === 'result') {
    const r = m.data;
    return (
      <div className="aichat-msg aichat-msg--bot aichat-msg--wide">
        <span className="aichat-avatar" aria-hidden="true">{chat.botAvatar}</span>
        <div className="aichat-bubble aichat-bubble--bot aichat-result-card">
          <h3 className="aichat-result-headline">{r.headline}</h3>
          <p className="aichat-result-tagline">{r.tagline}</p>
          <ol className="aichat-result-sections">
            {r.sections.map((s, idx) => (
              <li key={idx}>
                <span className="aichat-result-secnum" translate="no">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <div>
                  <h4>{s.title}</h4>
                  <p>{s.description}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="aichat-result-tone">
            <span className="aichat-result-tone-label">{c.result.toneLabel}</span>
            <span>{r.toneSuggestion}</span>
            <span className="aichat-result-colors">
              {(r.suggestedColors || []).map((hex, idx) => (
                <span
                  key={idx}
                  className="aichat-result-swatch"
                  style={{ background: hex }}
                  title={hex}
                />
              ))}
            </span>
          </div>
          <Link
            to="/contact"
            onClick={(e) => { e.preventDefault(); goToContact(); }}
            className="aichat-result-cta"
          >
            {chat.contactCta} <HiArrowRight />
          </Link>
        </div>
      </div>
    );
  }

  if (m.role === 'fallback') {
    return (
      <div className="aichat-msg aichat-msg--bot">
        <span className="aichat-avatar" aria-hidden="true">{chat.botAvatar}</span>
        <div className="aichat-bubble aichat-bubble--bot aichat-fallback-card">
          <button type="button" className="aichat-fallback-cta" onClick={goToContact}>
            {chat.fallbackCta} <HiArrowRight />
          </button>
        </div>
      </div>
    );
  }

  // Default: bot text bubble with typewriter reveal
  return (
    <div className="aichat-msg aichat-msg--bot">
      <span className="aichat-avatar" aria-hidden="true">{chat.botAvatar}</span>
      <div className="aichat-bubble aichat-bubble--bot">
        <TypeOnView text={m.text} as="span" speed={CHAR_SPEED} caret={false} />
      </div>
    </div>
  );
}

export default AiPreview;
