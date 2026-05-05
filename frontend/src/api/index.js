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

export const API_BASE = API_URL;

export const getImageUrl = (thumbnail) => {
  if (!thumbnail) return '';
  if (thumbnail.startsWith('http')) return thumbnail;
  return `${API_URL}${thumbnail}`;
};
export default api;
