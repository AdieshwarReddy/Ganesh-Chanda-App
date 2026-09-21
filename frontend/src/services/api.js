// Centralized API client — single source of truth for backend URL
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
})

// Attach JWT token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('gc_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle auth errors globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('gc_token')
      localStorage.removeItem('gc_user')
    }
    return Promise.reject(err)
  }
)

export default api

// ---- Auth ----
export const authAPI = {
  googleLogin: (token) => api.post('/auth/google', { token }),
  devLogin: (data) => api.post('/auth/dev-login', data),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
}

// ---- Campaigns ----
export const campaignAPI = {
  getCurrent: () => api.get('/campaign/current'),
  create: (data) => api.post('/admin/campaign', data),
  update: (id, data) => api.put(`/admin/campaign/${id}`, data),
}

// ---- Donations ----
export const donationAPI = {
  submit: (data) => api.post('/donations', data),
  getPublic: (params) => api.get('/donations/public', { params }),
  getMy: () => api.get('/donations/my'),
  getById: (id) => api.get(`/donations/${id}`),
  uploadScreenshot: (formData) =>
    api.post('/donations/upload-screenshot', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
}

// ---- Admin ----
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  listDonations: (params) => api.get('/admin/donations', { params }),
  getDonation: (id) => api.get(`/admin/donations/${id}`),
  verify: (id, notes) => api.patch(`/admin/donations/${id}/verify`, null, { params: { notes } }),
  reject: (id, notes) => api.patch(`/admin/donations/${id}/reject`, null, { params: { notes } }),
  update: (id, data) => api.patch(`/admin/donations/${id}`, data),
  delete: (id) => api.delete(`/admin/donations/${id}`),
  exportCSV: () =>
    api.get('/admin/donations/export/csv', { responseType: 'blob' }),
  getDailyStats: (days) => api.get('/admin/daily-stats', { params: { days } }),
  getMethodStats: () => api.get('/admin/payment-method-stats'),
}
