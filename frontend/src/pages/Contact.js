import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import {
  HiMail, HiPhone, HiLocationMarker, HiPaperAirplane, HiExclamationCircle, HiChatAlt2,
} from 'react-icons/hi';
import { submitInquiry } from '../api';
import CopyButton from '../components/CopyButton';
import TerminalSuccess from '../components/TerminalSuccess';
import { useLanguage } from '../contexts/LanguageContext';
import { trackInquirySubmit, trackFormStart, trackInquiryFail, trackContactClick } from '../utils/analytics';
import { PHONE_DISPLAY, PHONE_TEL, EMAIL, KAKAO_CHANNEL_URL } from '../data/contactChannels';
import './Contact.css';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }
  })
};

const COPY = {
  ko: {
    title: '프로젝트 문의',
    desc: '이름, 연락처, 한 줄 설명만 남겨주세요. 확인 후 바로 연락드립니다.',
    labels: { name: '이름 *', contact: '연락처 *', description: '한 줄 설명 *' },
    ph: { name: '홍길동', contact: '010-0000-0000 또는 name@naver.com', description: '예: 미용실 예약되는 홈페이지가 필요해요' },
    submit: '문의 보내기', submitting: '접수 중...',
    err: {
      nameReq: '이름을 입력해주세요.', nameInvalid: '한글/영문만 입력 가능합니다.',
      contactReq: '전화번호나 이메일을 입력해주세요.',
      contactInvalid: '전화번호(010-0000-0000) 또는 이메일 형식으로 입력해주세요.',
      desc: '어떤 홈페이지가 필요한지 한 줄로 적어주세요.',
      submitFail: '문의 접수에 실패했습니다. 잠시 후 다시 시도하시거나 아래 전화·카카오톡으로 바로 연락해주세요.',
    },
    alt: { phone: '전화 걸기', kakao: '카카오톡 상담' },
    info: {
      email: '이메일', emailNote: '24시간 이내 회신',
      phone: '전화', phoneNote: '평일 09:00 - 18:00',
      kakao: '카카오톡', kakaoNote: '채팅으로 편하게 상담', kakaoCta: '카카오톡 채널 열기',
      location: '위치', locationVal: '경기도 안양시', locationNote: '원격 작업 가능',
      noteTitle: '상담은 무료입니다',
      noteBody: '프로젝트 규모와 요구사항을 파악한 후, 정확한 견적과 일정을 안내드립니다. 부담 없이 문의해주세요.',
    },
  },
  en: {
    title: 'Project Inquiry',
    desc: 'Just leave your name, a way to reach you, and one line about the project. We\'ll get back to you right away.',
    labels: { name: 'Name *', contact: 'Phone or email *', description: 'One-line description *' },
    ph: { name: 'John', contact: '010-0000-0000 or name@email.com', description: 'e.g. I need a website with online booking for my salon' },
    submit: 'Send inquiry', submitting: 'Sending...',
    err: {
      nameReq: 'Please enter your name.', nameInvalid: 'Letters only (Korean / English).',
      contactReq: 'Please enter a phone number or email.',
      contactInvalid: 'Enter a phone number (010-0000-0000) or an email address.',
      desc: 'Please describe what you need in one line.',
      submitFail: 'Failed to submit. Please try again shortly, or reach us directly by phone or KakaoTalk below.',
    },
    alt: { phone: 'Call', kakao: 'KakaoTalk chat' },
    info: {
      email: 'Email', emailNote: 'Reply within 24h',
      phone: 'Phone', phoneNote: 'Weekdays 09:00 - 18:00',
      kakao: 'KakaoTalk', kakaoNote: 'Chat with us', kakaoCta: 'Open KakaoTalk channel',
      location: 'Location', locationVal: 'Anyang, South Korea', locationNote: 'Remote work available',
      noteTitle: 'Consultation is free',
      noteBody: 'After understanding your project scope and requirements, we provide an accurate quote and timeline. Feel free to reach out.',
    },
  },
};

const NAME_REGEX = /^[가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z\s]*$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMPTY = { name: '', contact: '', description: '', website: '' };

// One "contact" box accepts a phone number or an email; split it for the API.
function parseContact(value) {
  const v = value.trim();
  if (v.includes('@')) return EMAIL_REGEX.test(v) ? { email: v } : null;
  const digits = v.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 11) return null;
  const phone = digits.length === 11
    ? `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
    : `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  return { phone };
}

function Contact() {
  const { lang } = useLanguage();
  const c = COPY[lang] || COPY.ko;
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const startedRef = useRef(false);
  const formRef = useRef(null);
  const location = useLocation();

  // Prefill from a pricing "상담받기" button.
  useEffect(() => {
    const prefill = location.state?.prefill;
    if (prefill?.description) {
      setForm((prev) => ({ ...prev, description: prefill.description }));
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    }
  }, [location.state]);

  const markStarted = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    trackFormStart('contact');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name' && !NAME_REGEX.test(value)) return;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = c.err.nameReq;
    else if (!NAME_REGEX.test(form.name)) next.name = c.err.nameInvalid;
    if (!form.contact.trim()) next.contact = c.err.contactReq;
    else if (!parseContact(form.contact)) next.contact = c.err.contactInvalid;
    if (!form.description.trim()) next.description = c.err.desc;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitError('');
    setSubmitting(true);
    const channel = parseContact(form.contact);
    try {
      await submitInquiry({
        name: form.name.trim(),
        ...channel,
        description: form.description.trim(),
        website: form.website, // honeypot — empty for real visitors
      });
      trackInquirySubmit({ contact_method: channel.email ? 'email' : 'phone' });
      setSubmitted(true);
    } catch (err) {
      const status = err.response ? err.response.status : (err.code === 'ECONNABORTED' ? 'timeout' : 'network');
      trackInquiryFail(String(status));
      setSubmitError(c.err.submitFail);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="contact-page">
        <div className="container">
          <TerminalSuccess
            name={form.name}
            onReset={() => {
              setSubmitted(false);
              setErrors({});
              setForm(EMPTY);
            }}
          />
        </div>
      </div>
    );
  }

  const field = (name, type, extra = {}) => (
    <div className="form-group">
      <label htmlFor={`cf-${name}`}>{c.labels[name]}</label>
      <input
        id={`cf-${name}`}
        type={type}
        name={name}
        value={form[name]}
        onChange={handleChange}
        onFocus={markStarted}
        placeholder={c.ph[name]}
        className={errors[name] ? 'has-error' : ''}
        {...extra}
      />
      {errors[name] && <span className="form-error"><HiExclamationCircle /> {errors[name]}</span>}
    </div>
  );

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="container">
          <motion.span className="section-label" variants={fadeUp} initial="hidden" animate="visible" custom={0}>CONTACT</motion.span>
          <motion.h1 className="contact-title" variants={fadeUp} initial="hidden" animate="visible" custom={1}>
            {c.title}
          </motion.h1>
          <motion.p className="contact-desc" variants={fadeUp} initial="hidden" animate="visible" custom={2}>
            {c.desc}
          </motion.p>
        </div>
      </section>

      <section className="contact-content" ref={formRef}>
        <div className="container">
          <div className="contact-grid">
            <motion.form className="contact-form" onSubmit={handleSubmit} variants={fadeUp} initial="hidden" animate="visible" custom={2} noValidate>
              {field('name', 'text', { autoComplete: 'name', maxLength: 50 })}
              {field('contact', 'text', { autoComplete: 'tel', inputMode: 'text', maxLength: 120 })}
              {field('description', 'text', { maxLength: 200 })}

              {/* Honeypot: hidden from people, bots fill it and get dropped server-side. */}
              <div className="cf-honeypot" aria-hidden="true">
                <label htmlFor="cf-website">Website</label>
                <input id="cf-website" type="text" name="website" value={form.website} onChange={handleChange} tabIndex={-1} autoComplete="off" />
              </div>

              {submitError && (
                <div className="cf-submit-error" role="alert">
                  <HiExclamationCircle /> {submitError}
                  <div className="cf-alt">
                    <a href={PHONE_TEL} className="btn btn-outline-dark" onClick={() => trackContactClick('phone', 'contact_fail')}>
                      <HiPhone /> {c.alt.phone} {PHONE_DISPLAY}
                    </a>
                    {KAKAO_CHANNEL_URL && (
                      <a href={KAKAO_CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="btn btn-outline-dark" onClick={() => trackContactClick('kakao', 'contact_fail')}>
                        <HiChatAlt2 /> {c.alt.kakao}
                      </a>
                    )}
                  </div>
                </div>
              )}

              <div className="cf-nav cf-nav--single">
                <button type="submit" className="btn btn-dark btn-lg" disabled={submitting}>
                  <HiPaperAirplane /> {submitting ? c.submitting : c.submit}
                </button>
              </div>
            </motion.form>

            <motion.div className="contact-info" variants={fadeUp} initial="hidden" animate="visible" custom={3}>
              <div className="info-item">
                <div className="info-icon"><HiPhone /></div>
                <div>
                  <h3>{c.info.phone}</h3>
                  <p className="info-with-copy">
                    <a href={PHONE_TEL} onClick={() => trackContactClick('phone', 'contact_info')}>{PHONE_DISPLAY}</a>
                    <CopyButton value={PHONE_DISPLAY} />
                  </p>
                  <span>{c.info.phoneNote}</span>
                </div>
              </div>
              {KAKAO_CHANNEL_URL && (
                <div className="info-item">
                  <div className="info-icon"><HiChatAlt2 /></div>
                  <div>
                    <h3>{c.info.kakao}</h3>
                    <p>
                      <a href={KAKAO_CHANNEL_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackContactClick('kakao', 'contact_info')}>
                        {c.info.kakaoCta}
                      </a>
                    </p>
                    <span>{c.info.kakaoNote}</span>
                  </div>
                </div>
              )}
              <div className="info-item">
                <div className="info-icon"><HiMail /></div>
                <div>
                  <h3>{c.info.email}</h3>
                  <p className="info-with-copy">
                    <a href={`mailto:${EMAIL}`} onClick={() => trackContactClick('email', 'contact_info')}>{EMAIL}</a>
                    <CopyButton value={EMAIL} />
                  </p>
                  <span>{c.info.emailNote}</span>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon"><HiLocationMarker /></div>
                <div>
                  <h3>{c.info.location}</h3>
                  <p>{c.info.locationVal}</p>
                  <span>{c.info.locationNote}</span>
                </div>
              </div>

              <div className="info-note">
                <h4>{c.info.noteTitle}</h4>
                <p>{c.info.noteBody}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
