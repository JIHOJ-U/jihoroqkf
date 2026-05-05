import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HiMail, HiPhone, HiLocationMarker, HiPaperAirplane, HiCheckCircle } from 'react-icons/hi';
import { submitInquiry } from '../api';
import './Contact.css';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }
  })
};

const projectTypes = ['웹 개발', '앱 개발', '백엔드/API', 'UI/UX 디자인', '유지보수', '기타'];
const budgets = ['100만원 이하', '100~300만원', '300~500만원', '500~1000만원', '1000만원 이상', '미정'];
const timelines = ['1개월 이내', '1~3개월', '3~6개월', '6개월 이상', '미정'];

function Contact() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', company: '',
    projectType: '웹 개발', budget: '', timeline: '', description: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitInquiry(form);
      setSubmitted(true);
    } catch (err) {
      alert('문의 접수에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="contact-page">
        <div className="container">
          <motion.div className="success-state" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <HiCheckCircle className="success-icon" />
            <h2>문의가 접수되었습니다</h2>
            <p>빠른 시일 내에 연락드리겠습니다.<br />보통 24시간 이내에 회신합니다.</p>
            <button className="btn btn-dark btn-lg" onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', company: '', projectType: '웹 개발', budget: '', timeline: '', description: '' }); }}>
              새 문의 작성
            </button>
          </motion.div>
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
            프로젝트 문의
          </motion.h1>
          <motion.p className="contact-desc" variants={fadeUp} initial="hidden" animate="visible" custom={2}>
            프로젝트에 대해 알려주세요. 무료 상담을 통해 최적의 방안을 제안드립니다.
          </motion.p>
        </div>
      </section>

      <section className="contact-content">
        <div className="container">
          <div className="contact-grid">
            <motion.form className="contact-form" onSubmit={handleSubmit} variants={fadeUp} initial="hidden" animate="visible" custom={2}>
              <div className="form-row">
                <div className="form-group">
                  <label>이름 *</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="홍길동" required />
                </div>
                <div className="form-group">
                  <label>이메일 *</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="email@example.com" required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>연락처</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="010-0000-0000" />
                </div>
                <div className="form-group">
                  <label>회사/단체</label>
                  <input type="text" name="company" value={form.company} onChange={handleChange} placeholder="회사명 (선택)" />
                </div>
              </div>

              <div className="form-group">
                <label>프로젝트 유형</label>
                <div className="type-group">
                  {projectTypes.map(type => (
                    <label key={type} className={`type-option ${form.projectType === type ? 'active' : ''}`}>
                      <input type="radio" name="projectType" value={type} checked={form.projectType === type} onChange={handleChange} />
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>예산 범위</label>
                  <select name="budget" value={form.budget} onChange={handleChange}>
                    <option value="">선택해주세요</option>
                    {budgets.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>희망 일정</label>
                  <select name="timeline" value={form.timeline} onChange={handleChange}>
                    <option value="">선택해주세요</option>
                    {timelines.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>프로젝트 설명 *</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="프로젝트에 대해 자유롭게 설명해주세요. (목적, 주요 기능, 참고 사이트 등)"
                  rows={6}
                  required
                />
              </div>

              <button type="submit" className="btn btn-dark btn-lg btn-full" disabled={submitting}>
                <HiPaperAirplane /> {submitting ? '접수 중...' : '문의 보내기'}
              </button>
            </motion.form>

            <motion.div className="contact-info" variants={fadeUp} initial="hidden" animate="visible" custom={3}>
              <div className="info-item">
                <div className="info-icon"><HiMail /></div>
                <div>
                  <h3>이메일</h3>
                  <p>hello@joe.dev</p>
                  <span>24시간 이내 회신</span>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon"><HiPhone /></div>
                <div>
                  <h3>전화</h3>
                  <p>010-0000-0000</p>
                  <span>평일 09:00 - 18:00</span>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon"><HiLocationMarker /></div>
                <div>
                  <h3>위치</h3>
                  <p>서울특별시</p>
                  <span>원격 작업 가능</span>
                </div>
              </div>

              <div className="info-note">
                <h4>상담은 무료입니다</h4>
                <p>
                  프로젝트 규모와 요구사항을 파악한 후, 정확한 견적과 일정을 안내드립니다.
                  부담 없이 문의해주세요.
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
