import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { HiKey, HiLogout, HiMail, HiPhone, HiOfficeBuilding, HiCalendar, HiCurrencyDollar, HiClock, HiX } from 'react-icons/hi';
import { getInquiries } from '../api';
import './Admin.css';

const ADMIN_KEY = 'wnwlgh0719';
const STORAGE_KEY = 'joe_dev_admin_auth';

function Admin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [keyInput, setKeyInput] = useState('');
  const [error, setError] = useState('');
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === ADMIN_KEY) {
      setAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (authenticated) {
      loadInquiries();
    }
  }, [authenticated]);

  const loadInquiries = async () => {
    setLoading(true);
    try {
      const res = await getInquiries();
      setInquiries(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (keyInput === ADMIN_KEY) {
      localStorage.setItem(STORAGE_KEY, ADMIN_KEY);
      setAuthenticated(true);
      setError('');
    } else {
      setError('잘못된 관리자 키입니다.');
      setKeyInput('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAuthenticated(false);
    setKeyInput('');
  };

  if (!authenticated) {
    return (
      <div className="admin-page admin-login-wrap">
        <motion.div
          className="admin-login-box"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="admin-login-icon">
            <HiKey />
          </div>
          <h1>ADMIN ACCESS</h1>
          <p>관리자 키를 입력해주세요.</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="관리자 키"
              autoFocus
            />
            {error && <span className="admin-error">{error}</span>}
            <button type="submit" className="admin-login-btn">
              로그인
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        <motion.div className="admin-header" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div>
            <span className="section-label">ADMIN</span>
            <h1>문의 내역 관리</h1>
            <p>총 <strong>{inquiries.length}</strong>건의 문의가 있습니다.</p>
          </div>
          <button className="admin-logout" onClick={handleLogout}>
            <HiLogout /> 로그아웃
          </button>
        </motion.div>

        {loading ? (
          <div className="admin-loading">
            <div className="spinner-admin" />
          </div>
        ) : inquiries.length === 0 ? (
          <div className="admin-empty">
            <HiMail className="empty-icon" />
            <h3>아직 접수된 문의가 없습니다</h3>
            <p>새로운 문의가 들어오면 이곳에 표시됩니다.</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>접수일</th>
                  <th>이름</th>
                  <th>이메일</th>
                  <th>회사/단체</th>
                  <th>프로젝트 유형</th>
                  <th>예산</th>
                  <th>상태</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inq, i) => (
                  <motion.tr
                    key={inq.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => setSelected(inq)}
                  >
                    <td>{new Date(inq.createdAt).toLocaleDateString('ko-KR')}</td>
                    <td className="td-name">{inq.name}</td>
                    <td>{inq.email}</td>
                    <td>{inq.company || '-'}</td>
                    <td><span className="td-type">{inq.projectType}</span></td>
                    <td>{inq.budget || '-'}</td>
                    <td><span className="td-status">{inq.status}</span></td>
                    <td><button className="td-detail-btn">상세 →</button></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="admin-modal-overlay" onClick={() => setSelected(null)}>
          <motion.div
            className="admin-modal"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="admin-modal-close" onClick={() => setSelected(null)}>
              <HiX />
            </button>
            <div className="modal-header">
              <span className="section-label">문의 상세</span>
              <h2>{selected.name}</h2>
              <span className="modal-date">
                {new Date(selected.createdAt).toLocaleString('ko-KR')}
              </span>
            </div>

            <div className="modal-info-grid">
              <div className="modal-info-item">
                <HiMail />
                <div>
                  <span>이메일</span>
                  <a href={`mailto:${selected.email}`}>{selected.email}</a>
                </div>
              </div>
              {selected.phone && (
                <div className="modal-info-item">
                  <HiPhone />
                  <div>
                    <span>연락처</span>
                    <a href={`tel:${selected.phone}`}>{selected.phone}</a>
                  </div>
                </div>
              )}
              {selected.company && (
                <div className="modal-info-item">
                  <HiOfficeBuilding />
                  <div>
                    <span>회사/단체</span>
                    <p>{selected.company}</p>
                  </div>
                </div>
              )}
              <div className="modal-info-item">
                <HiCalendar />
                <div>
                  <span>프로젝트 유형</span>
                  <p>{selected.projectType}</p>
                </div>
              </div>
              {selected.budget && (
                <div className="modal-info-item">
                  <HiCurrencyDollar />
                  <div>
                    <span>예산</span>
                    <p>{selected.budget}</p>
                  </div>
                </div>
              )}
              {selected.timeline && (
                <div className="modal-info-item">
                  <HiClock />
                  <div>
                    <span>희망 일정</span>
                    <p>{selected.timeline}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-description">
              <h3>프로젝트 설명</h3>
              <p>{selected.description}</p>
            </div>

            <div className="modal-actions">
              <a href={`mailto:${selected.email}?subject=프로젝트 문의 회신&body=안녕하세요 ${selected.name}님,`} className="btn btn-dark">
                <HiMail /> 이메일 회신
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default Admin;
