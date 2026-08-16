import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiArrowRight, HiRefresh } from 'react-icons/hi';
import { submitAiPreview } from '../api';
import { useLanguage } from '../contexts/LanguageContext';
import ComingSoonBadge from '../components/ComingSoonBadge';
import TypeOnView from '../components/TypeOnView';
import TypingIndicator from '../components/TypingIndicator';
import './AiPreview.css';

/* Chat-style AI preview. Instead of a static form the visitor talks with a bot
   that walks them through 6 short questions, then either delivers a rich
   result card or (when the AI backend is still in prep) hands off to /contact
   with the collected answers as prefill. See CLAUDE.md § "chat over form" for
   the design rationale. */

let msgIdCounter = 0;
const nextId = () => ++msgIdCounter;

const CHAR_SPEED = 40;              // ms per char, matches TypeOnView default feel
const TYPING_BEAT = 650;             // typing-indicator dwell before next bot line
const POST_TYPE_BUFFER = 250;        // small pause after typewriter finishes
const ANSWER_TO_TYPING_DELAY = 400;  // user msg → typing indicator delay

const emailValid = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v || '').trim());

function AiPreview() {
  const { t, lang } = useLanguage();
  const c = t.aiPreview;
  const chat = c.chat;
  const navigate = useNavigate();

  const [sessionKey, setSessionKey] = useState(0);
  const [messages, setMessages] = useState([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [status, setStatus] = useState('chatting'); // chatting | generating | result | error
  const [awaitingInput, setAwaitingInput] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [resultData, setResultData] = useState(null);

  const scrollRef = useRef(null);
  const timersRef = useRef([]);

  const steps = [
    { key: 'businessType',  question: chat.questions.businessType,  type: 'chips', options: c.businessTypes },
    { key: 'siteGoal',      question: chat.questions.siteGoal,      type: 'chips', options: c.siteGoals },
    { key: 'mood',          question: chat.questions.mood,          type: 'chips', options: c.moods },
    { key: 'mustHave',      question: chat.questions.mustHave,      type: 'text',  optional: true,  placeholder: c.form.mustHavePh },
    { key: 'referenceSite', question: chat.questions.referenceSite, type: 'text',  optional: true,  placeholder: c.form.referenceSitePh },
    { key: 'email',         question: chat.questions.email,         type: 'email', placeholder: c.form.emailPh },
  ];

  // --- timer helpers -------------------------------------------------------
  const schedule = (fn, delay) => {
    const id = setTimeout(fn, delay);
    timersRef.current.push(id);
    return id;
  };
  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  // --- message helpers -----------------------------------------------------
  const pushMsg = (msg) => setMessages((prev) => [...prev, { id: nextId(), ...msg }]);
  const removeTyping = () => setMessages((prev) => prev.filter((m) => m.role !== 'typing'));

  // --- Kickoff / restart ---------------------------------------------------
  useEffect(() => {
    clearTimers();
    setMessages([]);
    setStepIdx(0);
    setUserAnswers({});
    setAwaitingInput(false);
    setTextInput('');
    setStatus('chatting');
    setResultData(null);

    // Greet, then ask the first question. Two separate bot messages with a
    // typing indicator between them for the chat feel.
    schedule(() => pushMsg({ role: 'typing' }), 300);
    schedule(() => {
      removeTyping();
      pushMsg({ role: 'bot', text: chat.greeting });
    }, 900);

    const greetingDur = chat.greeting.length * CHAR_SPEED + POST_TYPE_BUFFER;
    schedule(() => pushMsg({ role: 'typing' }), 900 + greetingDur);
    schedule(() => {
      removeTyping();
      pushMsg({ role: 'bot', text: steps[0].question });
    }, 900 + greetingDur + TYPING_BEAT);

    const firstQDur = steps[0].question.length * CHAR_SPEED + POST_TYPE_BUFFER;
    schedule(() => setAwaitingInput(true), 900 + greetingDur + TYPING_BEAT + firstQDur);

    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionKey, lang]);

  // --- Auto-scroll on new messages ----------------------------------------
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  // --- API call once all answers gathered ---------------------------------
  useEffect(() => {
    if (status !== 'generating') return;
    let cancelled = false;
    (async () => {
      try {
        const res = await submitAiPreview({ ...userAnswers, lang });
        if (cancelled) return;
        removeTyping();
        pushMsg({ role: 'bot', text: chat.resultIntro });
        const dur = chat.resultIntro.length * CHAR_SPEED + POST_TYPE_BUFFER;
        schedule(() => {
          setResultData(res.data);
          pushMsg({ role: 'result', data: res.data });
          setStatus('result');
        }, dur + 200);
      } catch (err) {
        if (cancelled) return;
        removeTyping();
        pushMsg({ role: 'bot', text: chat.fallbackIntro });
        const dur = chat.fallbackIntro.length * CHAR_SPEED + POST_TYPE_BUFFER;
        schedule(() => {
          pushMsg({ role: 'fallback' });
          setStatus('error');
        }, dur + 200);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  // --- Advance flow after user answers ------------------------------------
  const advance = (nextIdx) => {
    setAwaitingInput(false);
    if (nextIdx < steps.length) {
      schedule(() => pushMsg({ role: 'typing' }), ANSWER_TO_TYPING_DELAY);
      schedule(() => {
        removeTyping();
        pushMsg({ role: 'bot', text: steps[nextIdx].question });
      }, ANSWER_TO_TYPING_DELAY + TYPING_BEAT);
      const dur = steps[nextIdx].question.length * CHAR_SPEED + POST_TYPE_BUFFER;
      schedule(() => {
        setStepIdx(nextIdx);
        setAwaitingInput(true);
      }, ANSWER_TO_TYPING_DELAY + TYPING_BEAT + dur);
    } else {
      // All answers gathered — start generation
      schedule(() => {
        pushMsg({ role: 'typing', label: chat.typingLabel });
        setStatus('generating');
      }, ANSWER_TO_TYPING_DELAY);
    }
  };

  // --- User actions -------------------------------------------------------
  const handleChip = (value) => {
    if (!awaitingInput) return;
    const step = steps[stepIdx];
    setUserAnswers((a) => ({ ...a, [step.key]: value }));
    pushMsg({ role: 'user', text: value });
    advance(stepIdx + 1);
  };

  const handleSkip = () => {
    if (!awaitingInput) return;
    const step = steps[stepIdx];
    if (!step.optional) return;
    setUserAnswers((a) => ({ ...a, [step.key]: '' }));
    pushMsg({ role: 'user', text: chat.skipLabel });
    setTextInput('');
    advance(stepIdx + 1);
  };

  const handleTextSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!awaitingInput) return;
    const step = steps[stepIdx];
    const val = textInput.trim();
    if (step.type === 'email') {
      if (!emailValid(val)) {
        pushMsg({ role: 'bot', text: chat.emailInvalid });
        return;
      }
    } else if (!val) {
      if (step.optional) { handleSkip(); return; }
      return;
    }
    setUserAnswers((a) => ({ ...a, [step.key]: val }));
    pushMsg({ role: 'user', text: val });
    setTextInput('');
    advance(stepIdx + 1);
  };

  // --- Handoff to /contact -------------------------------------------------
  const goToContact = () => {
    const a = userAnswers;
    const summary = resultData
      ? `"${resultData.headline}"\n\n${resultData.sections.map((s) => `- ${s.title}: ${s.description}`).join('\n')}`
      : [
          a.businessType && `업종: ${a.businessType}`,
          a.siteGoal && `목표: ${a.siteGoal}`,
          a.mood && `분위기: ${a.mood}`,
          a.mustHave && `필수 기능: ${a.mustHave}`,
          a.referenceSite && `참고: ${a.referenceSite}`,
        ].filter(Boolean).join('\n');
    navigate('/contact', {
      state: {
        prefill: {
          projectType: a.businessType || '',
          description: `${c.prefillPrefix}\n\n${summary}`,
        },
      },
    });
  };

  const restart = () => setSessionKey((k) => k + 1);

  const currentStep = steps[stepIdx];
  const inputMode = status === 'chatting' && awaitingInput ? currentStep?.type : null;
  const showChips = inputMode === 'chips';
  const showInput = inputMode === 'text' || inputMode === 'email';
  const showRestart = status === 'result' || status === 'error';

  return (
    <div className="aichat-page">
      <div className="container">
        <header className="aichat-header">
          <span className="aichat-eyebrow" translate="no">{c.label}</span>
          <h1 className="aichat-title">{c.title}</h1>
          <p className="aichat-desc">{c.desc}</p>
        </header>

        <ComingSoonBadge
          variant="notice"
          title={t.comingSoon?.aiPreviewTitle}
          message={t.comingSoon?.aiPreviewBody}
        />

        <div className="aichat-window" aria-live="polite">
          <div className="aichat-topbar">
            <span className="aichat-topbar-dots" aria-hidden="true">
              <span className="aichat-topbar-dot" />
              <span className="aichat-topbar-dot" />
              <span className="aichat-topbar-dot" />
            </span>
            <span className="aichat-topbar-label" translate="no">{chat.botLabel}</span>
            <span className="aichat-topbar-session" translate="no">{chat.sessionLabel}</span>
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

          {showChips && (
            <div className="aichat-chips" role="group" aria-label={currentStep.question}>
              {currentStep.options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className="aichat-chip"
                  onClick={() => handleChip(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {showInput && (
            <form className="aichat-input-row" onSubmit={handleTextSubmit}>
              <input
                type={inputMode === 'email' ? 'email' : 'text'}
                className="aichat-input"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder={currentStep.placeholder || chat.inputPh}
                aria-label={currentStep.question}
                autoFocus
              />
              <button type="submit" className="aichat-send-btn" aria-label={chat.sendLabel}>
                <HiArrowRight />
              </button>
              {currentStep.optional && (
                <button type="button" className="aichat-skip-btn" onClick={handleSkip}>
                  {chat.skipLabel}
                </button>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Message renderer — kept as a sub-component so React can memoize by key    */
/* and the parent stays readable.                                            */
/* ------------------------------------------------------------------------ */
function ChatMessage({ m, chat, c, goToContact }) {
  if (m.role === 'typing') {
    return (
      <div className="aichat-msg aichat-msg--bot">
        <span className="aichat-avatar" aria-hidden="true">{chat.avatar}</span>
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
        <span className="aichat-avatar" aria-hidden="true">{chat.avatar}</span>
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
        <span className="aichat-avatar" aria-hidden="true">{chat.avatar}</span>
        <div className="aichat-bubble aichat-bubble--bot aichat-fallback-card">
          <button type="button" className="aichat-fallback-cta" onClick={goToContact}>
            {chat.fallbackCta} <HiArrowRight />
          </button>
        </div>
      </div>
    );
  }

  // Default: bot text message with typewriter reveal.
  return (
    <div className="aichat-msg aichat-msg--bot">
      <span className="aichat-avatar" aria-hidden="true">{chat.avatar}</span>
      <div className="aichat-bubble aichat-bubble--bot">
        <TypeOnView text={m.text} as="span" speed={CHAR_SPEED} caret={false} />
      </div>
    </div>
  );
}

export default AiPreview;
