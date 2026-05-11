import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: `${API_URL}/api`,
});

// Portfolio API
export const getPortfolios = () => api.get('/portfolios');
export const getPortfolio = (id) => api.get(`/portfolios/${id}`);
export const createPortfolio = (formData) => api.post('/portfolios', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const updatePortfolio = (id, formData) => api.put(`/portfolios/${id}`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const deletePortfolio = (id) => api.delete(`/portfolios/${id}`);

// Inquiry API
export const submitInquiry = (data) => api.post('/inquiries', data);
export const getInquiries = () => api.get('/inquiries');

// GitHub & Blog
export const getGithubStats = () => api.get('/github/stats');
export const getBlogPosts = () => api.get('/blog/posts');

export const API_BASE = API_URL;

// Folders under frontend/public that should be served directly (not via backend)
const FRONTEND_STATIC_FOLDERS = [
  '/portfolio-images/',
  '/autowant/',
  '/velcrocat/',
];

export const getImageUrl = (thumbnail) => {
  if (!thumbnail) return '';
  // External URLs (https://...)
  if (thumbnail.startsWith('http')) return thumbnail;
  // Static images served from frontend public/ folder (committed to git, permanent)
  if (FRONTEND_STATIC_FOLDERS.some(prefix => thumbnail.startsWith(prefix))) return thumbnail;
  // Backend uploads (volatile on Render free tier)
  return `${API_URL}${thumbnail}`;
};
export default api;
