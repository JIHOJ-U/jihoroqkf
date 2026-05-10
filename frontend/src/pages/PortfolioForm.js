import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiUpload, HiX, HiSave, HiPhotograph, HiPlus } from 'react-icons/hi';
import { createPortfolio, getPortfolio, updatePortfolio, getImageUrl } from '../api';
import './PortfolioForm.css';

const categories = ['웹 개발', '앱 개발', '백엔드/API', 'UI/UX 디자인', '기타'];

function PortfolioForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    title: '',
    description: '',
    techStack: '',
    projectUrl: '',
    githubUrl: '',
    demoUrl: '',
    category: '웹 개발',
    duration: '',
    client: '',
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState('');
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit) {
      getPortfolio(id).then(res => {
        const p = res.data;
        setForm({
          title: p.title,
          description: p.description,
          techStack: p.techStack.join(', '),
          projectUrl: p.projectUrl,
          githubUrl: p.githubUrl,
          demoUrl: p.demoUrl || '',
          category: p.category,
          duration: p.duration,
          client: p.client,
        });
        if (p.thumbnail) setPreview(getImageUrl(p.thumbnail));
        if (Array.isArray(p.images)) setExistingImages(p.images);
      }).catch(() => navigate('/portfolio'));
    }
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleAddImages = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const additions = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setNewImages(prev => [...prev, ...additions]);
    e.target.value = '';
  };

  const removeNewImage = (idx) => setNewImages(prev => prev.filter((_, i) => i !== idx));
  const removeExistingImage = (idx) => setExistingImages(prev => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) {
      alert('제목과 설명은 필수입니다.');
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => formData.append(key, val));
    if (thumbnail) formData.append('thumbnail', thumbnail);
    newImages.forEach(({ file }) => formData.append('images', file));
    if (isEdit) formData.append('existingImages', JSON.stringify(existingImages));

    try {
      if (isEdit) {
        await updatePortfolio(id, formData);
      } else {
        await createPortfolio(formData);
      }
      navigate('/portfolio');
    } catch (err) {
      alert('저장에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-page">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="form-header">
            <span className="section-tag">{isEdit ? 'Edit' : 'New'}</span>
            <h1 className="section-title">{isEdit ? '포트폴리오 수정' : '새 포트폴리오 등록'}</h1>
          </div>

          <form onSubmit={handleSubmit} className="portfolio-form">
            <div className="form-grid">
              {/* Left */}
              <div className="form-main">
                <div className="form-group">
                  <label>프로젝트 제목 *</label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="프로젝트 이름을 입력하세요"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>프로젝트 설명 *</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="프로젝트에 대한 상세 설명을 작성하세요"
                    rows={8}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>기술 스택</label>
                  <input
                    type="text"
                    name="techStack"
                    value={form.techStack}
                    onChange={handleChange}
                    placeholder="React, Node.js, MongoDB (콤마로 구분)"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>프로젝트 URL</label>
                    <input
                      type="text"
                      name="projectUrl"
                      value={form.projectUrl}
                      onChange={handleChange}
                      placeholder="https://example.com"
                    />
                  </div>
                  <div className="form-group">
                    <label>GitHub URL</label>
                    <input
                      type="text"
                      name="githubUrl"
                      value={form.githubUrl}
                      onChange={handleChange}
                      placeholder="https://github.com/..."
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>라이브 코드 데모 (선택)</label>
                  <input
                    type="text"
                    name="demoUrl"
                    value={form.demoUrl}
                    onChange={handleChange}
                    placeholder="CodeSandbox / StackBlitz / CodePen 등 임베드 가능한 URL"
                  />
                  <p className="form-hint">
                    예: https://codesandbox.io/embed/xxxxx, https://stackblitz.com/edit/yyyy?embed=1
                    <br />상세 페이지에서 iframe으로 코드를 직접 보여줍니다.
                  </p>
                </div>

                {/* Multiple Images */}
                <div className="form-group">
                  <label>
                    <HiPhotograph style={{ verticalAlign: 'middle', marginRight: 4 }} />
                    추가 이미지 (여러장 가능)
                  </label>
                  <div className="gallery-grid">
                    {existingImages.map((img, idx) => (
                      <div key={`exist-${idx}`} className="gallery-item">
                        <img src={getImageUrl(img)} alt={`existing-${idx}`} />
                        <button type="button" className="gallery-remove" onClick={() => removeExistingImage(idx)}>
                          <HiX />
                        </button>
                      </div>
                    ))}
                    {newImages.map((img, idx) => (
                      <div key={`new-${idx}`} className="gallery-item gallery-item--new">
                        <img src={img.preview} alt={`new-${idx}`} />
                        <button type="button" className="gallery-remove" onClick={() => removeNewImage(idx)}>
                          <HiX />
                        </button>
                        <span className="gallery-badge">NEW</span>
                      </div>
                    ))}
                    <label className="gallery-add">
                      <HiPlus />
                      <span>이미지 추가</span>
                      <input type="file" accept="image/*" multiple onChange={handleAddImages} hidden />
                    </label>
                  </div>
                  <p className="form-hint">대표 이미지 외에 추가로 보여줄 이미지를 여러 장 업로드할 수 있습니다.</p>
                </div>
              </div>

              {/* Right */}
              <div className="form-sidebar">
                <div className="form-group">
                  <label>대표 이미지 (썸네일)</label>
                  <div className="upload-area">
                    {preview ? (
                      <div className="upload-preview">
                        <img src={preview} alt="Preview" />
                        <button type="button" className="upload-remove" onClick={() => { setThumbnail(null); setPreview(''); }}>
                          <HiX />
                        </button>
                      </div>
                    ) : (
                      <label className="upload-label">
                        <HiUpload />
                        <span>이미지 업로드</span>
                        <span className="upload-hint">JPG, PNG, GIF (최대 5MB)</span>
                        <input type="file" accept="image/*" onChange={handleFile} hidden />
                      </label>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label>카테고리</label>
                  <select name="category" value={form.category} onChange={handleChange}>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>개발 기간</label>
                  <input
                    type="text"
                    name="duration"
                    value={form.duration}
                    onChange={handleChange}
                    placeholder="예: 2개월"
                  />
                </div>

                <div className="form-group">
                  <label>클라이언트</label>
                  <input
                    type="text"
                    name="client"
                    value={form.client}
                    onChange={handleChange}
                    placeholder="클라이언트 이름 (선택)"
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={submitting}>
                  <HiSave /> {submitting ? '저장 중...' : isEdit ? '수정 완료' : '포트폴리오 등록'}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default PortfolioForm;
