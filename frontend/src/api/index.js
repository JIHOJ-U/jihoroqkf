import axios from 'axios';
import { getAdminKey } from '../utils/adminSession';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  // Without a timeout the form just sits on "submitting..." forever when the
  // backend hangs (e.g. SMTP wedged). 20s is comfortably above any normal
  // request but short enough that the user gets a real error instead.
  timeout: 20000,
});

// Admin-only calls carry the operator's key; the server verifies it.
const adminHeaders = (extra = {}) => ({ headers: { ...extra, 'x-admin-key': getAdminKey() } });

// Portfolio API
export const getPortfolios = () => api.get('/portfolios');
export const getPortfolio = (id) => api.get(`/portfolios/${id}`);
export const createPortfolio = (formData) => api.post('/portfolios', formData,
  adminHeaders({ 'Content-Type': 'multipart/form-data' }));
export const updatePortfolio = (id, formData) => api.put(`/portfolios/${id}`, formData,
  adminHeaders({ 'Content-Type': 'multipart/form-data' }));
export const deletePortfolio = (id) => api.delete(`/portfolios/${id}`, adminHeaders());

// Admin
export const verifyAdminKey = (key) => api.post('/admin/verify', null, { headers: { 'x-admin-key': key } });

// Inquiry API
export const submitInquiry = (data) => api.post('/inquiries', data);
export const getInquiries = () => api.get('/inquiries', adminHeaders());
// Masked name + project type + date only — safe for the public homepage board.
export const getPublicInquiries = () => api.get('/inquiries/public');

// GitHub & Blog
export const getGithubStats = () => api.get('/github/stats');
export const getBlogPosts = () => api.get('/blog/posts');

export const API_BASE = API_URL;

// Folders under frontend/public that should be served directly (not via backend)
const FRONTEND_STATIC_FOLDERS = [
  '/portfolio-images/',
  '/autowant/',
  '/velcrocat/',
  '/carplayauto/',
  '/sonara/',
  '/qr-order/',
  '/bom-friends/',
  '/gage-note/',
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
