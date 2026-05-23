import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { HiMail, HiPhone, HiLocationMarker, HiPaperAirplane, HiCheckCircle, HiExclamationCircle } from 'react-icons/hi';
import { submitInquiry } from '../api';
import QuoteCalculator from '../components/QuoteCalculator';
import CopyButton from '../components/CopyButton';
import TerminalSuccess from '../components/TerminalSuccess';
import { useLanguage } from '../contexts/LanguageContext';
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
    projectTypes: ['웹 개발', '앱 개발', '백엔드/API', 'UI/UX 디자인', '유지보수', '기타'],
    budgets: ['100만원 이하', '100~300만원', '300~500만원', '500~1000만원', '1000만원 이상', '미정'],
    timelines: ['1개월 이내', '1~3개월', '3~6개월', '6개월 이상', '미정'],
    title: '프로젝트 문의',
    desc: '프로젝트에 대해 알려주세요. 무료 상담을 통해 최적의 방안을 제안드립니다.',
    labels: { name: '이름 *', email: '이메일 *', phone: '연락처', company: '회사/단체', type: '프로젝트 유형', budget: '예산 범위', timeline: '희망 일정', description: '프로젝트 설명 *' },
    ph: { name: '홍길동 / John', email: 'name@naver.com', phone: '010-0000-0000', company: '회사명 (선택)', select: '선택해주세요', description: '프로젝트에 대해 자유롭게 설명해주세요. (목적, 주요 기능, 참고 사이트 등)' },
    submit: '문의 보내기', submitting: '접수 중...',
    err: {
      email: '올바른 이메일 형식이 아닙니다. (예: name@naver.com)',
      nameReq: '이름을 입력해주세요.', nameInvalid: '한글/영문만 입력 가능합니다.',
      emailReq: '이메일을 입력해주세요.', phone: '올바른 전화번호 형식이 아닙니다.',
      desc: '프로젝트 설명을 입력해주세요.', submitFail: '문의 접수에 실패했습니다. 다시 시도해주세요.',
    },
    info: {
      email: '이메일', emailNote: '24시간 이내 회신',
      phone: '전화', phoneNote: '평일 09:00 - 18:00',
      location: '위치', locationVal: '경기도 안양시', locationNote: '원격 작업 가능',
      noteTitle: '상담은 무료입니다',
      noteBody: '프로젝트 규모와 요구사항을 파악한 후, 정확한 견적과 일정을 안내드립니다. 부담 없이 문의해주세요.',
    },
  },
  en: {
    projectTypes: ['Web Development', 'App Development', 'Backend / API', 'UI/UX Design', 'Maintenance', 'Other'],
    budgets: ['Under $1k', '$1k–$3k', '$3k–$5k', '$5k–$10k', 'Over $10k', 'Undecided'],
    timelines: ['Within 1 month', '1–3 months', '3–6 months', '6+ months', 'Undecided'],
    title: 'Project Inquiry',
    desc: 'Tell us about your project. We\'ll propose the best approach in a free consultation.',
    labels: { name: 'Name *', email: 'Email *', phone: 'Phone', company: 'Company / Org', type: 'Project type', budget: 'Budget range', timeline: 'Timeline', description: 'Project description *' },
    ph: { name: 'John / 홍길동', email: 'name@email.com', phone: '010-0000-0000', company: 'Company name (optional)', select: 'Please select', description: 'Describe your project freely (goal, key features, reference sites, etc.)' },
    submit: 'Send inquiry', submitting: 'Sending...',
    err: {
      email: 'Invalid email format. (e.g. name@email.com)',
      nameReq: 'Please enter your name.', nameInvalid: 'Letters only (Korean / English).',
      emailReq: 'Please enter your email.', phone: 'Invalid phone number format.',
      desc: 'Please describe your project.', submitFail: 'Failed to submit. Please try again.',
    },
    info: {
      email: 'Email', emailNote: 'Reply within 24h',
      phone: 'Phone', phoneNote: 'Weekdays 09:00 - 18:00',
      location: 'Location', locationVal: 'Anyang, South Korea', locationNote: 'Remote work available',
      noteTitle: 'Consultation is free',
      noteBody: 'After understanding your project scope and requirements, we provide an accurate quote and timeline. Feel free to reach out.',
    },
  },
};

const NAME_REGEX = /^[가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z\s]*$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const formatPhone = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length < 4) return digits;
  if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
};

function Contact() {
  const { lang } = useLanguage();
  const c = COPY[lang] || COPY.ko;
  const [form, setForm] = useState({
    name: '', email: '', phone: '', company: '',
    projectType: c.projectTypes[0], budget: '', timeline: '', description: ''
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef(null);
  const location = useLocation();

  // Apply prefill from quote calculator
  useEffect(() => {
    const prefill = location.state?.prefill;
    if (prefill) {
      setForm(prev => ({
        ...prev,
        projectType: prefill.projectType || prev.projectType,
        budget: prefill.budget || prev.budget,
        description: prefill.description || prev.description,
      }));
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'name') {
      if (!NAME_REGEX.test(value)) return;
      setForm({ ...form, name: value });
      setErrors({ ...errors, name: '' });
      return;
    }

    if (name === 'phone') {
      setForm({ ...form, phone: formatPhone(value) });
      return;
    }

    if (name === 'email') {
      setForm({ ...form, email: value });
      if (value && !EMAIL_REGEX.test(value)) {
        setErrors({ ...errors, email: c.err.email });
      } else {
        setErrors({ ...errors, email: '' });
      }
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = c.err.nameReq;
    else if (!NAME_REGEX.test(form.name)) newErrors.name = c.err.nameInvalid;

    if (!form.email.trim()) newErrors.email = c.err.emailReq;
    else if (!EMAIL_REGEX.test(form.email)) newErrors.email = c.err.email;

    if (form.phone && form.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = c.err.phone;
    }

    if (!form.description.trim()) newErrors.description = c.err.desc;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await submitInquiry(form);
      setSubmitted(true);
    } catch (err) {
      alert(c.err.submitFail);
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
              setForm({ name: '', email: '', phone: '', company: '', projectType: c.projectTypes[0], budget: '', timeline: '', description: '' });
            }}
          />
        </div>
      </div>
    );
  }

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

      <section className="contact-quote-section">
        <div className="container">
          <QuoteCalculator />
        </div>
      </section>

      <section className="contact-content" ref={formRef}>
        <div className="container">
          <div className="contact-grid">
            <motion.form className="contact-form" onSubmit={handleSubmit} variants={fadeUp} initial="hidden" animate="visible" custom={2} noValidate>
              <div className="form-row">
                <div className="form-group">
                  <label>{c.labels.name}</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder={c.ph.name}
                    className={errors.name ? 'has-error' : ''}
                  />
                  {errors.name && <span className="form-error"><HiExclamationCircle /> {errors.name}</span>}
                </div>
                <div className="form-group">
                  <label>{c.labels.email}</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder={c.ph.email}
                    className={errors.email ? 'has-error' : ''}
                  />
                  {errors.email && <span className="form-error"><HiExclamationCircle /> {errors.email}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>{c.labels.phone}</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder={c.ph.phone}
                    maxLength={13}
                    className={errors.phone ? 'has-error' : ''}
                  />
                  {errors.phone && <span className="form-error"><HiExclamationCircle /> {errors.phone}</span>}
                </div>
                <div className="form-group">
                  <label>{c.labels.company}</label>
                  <input type="text" name="company" value={form.company} onChange={handleChange} placeholder={c.ph.company} />
                </div>
              </div>

              <div className="form-group">
                <label>{c.labels.type}</label>
                <div className="type-group">
                  {c.projectTypes.map(type => (
                    <label key={type} className={`type-option ${form.projectType === type ? 'active' : ''}`}>
                      <input type="radio" name="projectType" value={type} checked={form.projectType === type} onChange={handleChange} />
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>{c.labels.budget}</label>
                  <select name="budget" value={form.budget} onChange={handleChange}>
                    <option value="">{c.ph.select}</option>
                    {c.budgets.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>{c.labels.timeline}</label>
                  <select name="timeline" value={form.timeline} onChange={handleChange}>
                    <option value="">{c.ph.select}</option>
                    {c.timelines.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>{c.labels.description}</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder={c.ph.description}
                  rows={6}
                  className={errors.description ? 'has-error' : ''}
                />
                {errors.description && <span className="form-error"><HiExclamationCircle /> {errors.description}</span>}
              </div>

              <button type="submit" className="btn btn-dark btn-lg btn-full" disabled={submitting}>
                <HiPaperAirplane /> {submitting ? c.submitting : c.submit}
              </button>
            </motion.form>

            <motion.div className="contact-info" variants={fadeUp} initial="hidden" animate="visible" custom={3}>
              <div className="info-item">
                <div className="info-icon"><HiMail /></div>
                <div>
                  <h3>{c.info.email}</h3>
                  <p className="info-with-copy">
                    roqkfwkwlgh@naver.com
                    <CopyButton value="roqkfwkwlgh@naver.com" />
                  </p>
                  <span>{c.info.emailNote}</span>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon"><HiPhone /></div>
                <div>
                  <h3>{c.info.phone}</h3>
                  <p className="info-with-copy">
                    010-8975-2847
                    <CopyButton value="010-8975-2847" />
                  </p>
                  <span>{c.info.phoneNote}</span>
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
                <p>
                  {c.info.noteBody}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
