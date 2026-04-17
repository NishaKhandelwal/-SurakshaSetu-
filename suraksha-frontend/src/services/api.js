import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const ML_BASE = import.meta.env.VITE_ML_URL || 'http://localhost:5001'

// ─── Main API instance ────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

// Inject JWT token on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

// Auto-logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear()
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ─── ML service instance ──────────────────────────────────────────────────────
const mlApi = axios.create({
  baseURL: ML_BASE,
  headers: { 'Content-Type': 'application/json' },
})

// ─── Auth APIs ────────────────────────────────────────────────────────────────
export const authAPI = {
  login: (email, password) =>
    api.post('/api/users/login', { email, password }),

  register: (formData) =>
    api.post('/api/users/register', formData),
}

// ─── Policy APIs ──────────────────────────────────────────────────────────────
export const policyAPI = {
  create: ({ type, city, basePremium }) =>
    api.post('/api/policy/create', { type, city, basePremium }),

  getAll: () =>
    api.get('/api/policy/'),

  getById: (id) =>
    api.get(`/api/policy/${id}`),

  delete: (id) =>
    api.delete(`/api/policy/${id}`),
}

// ─── Claims APIs ──────────────────────────────────────────────────────────────
export const claimsAPI = {
  submit: ({ actualIncome, userData }) =>
    api.post('/api/claims/claim', { actualIncome, userData }),

  getByUser: (userId) =>
    api.get(`/api/claims/${userId}`),

  triggerAuto: ({ rain, temp, aqi }) =>
    api.post('/api/claims/trigger', { rain, temp, aqi }),
}

// ─── Weather API ──────────────────────────────────────────────────────────────
export const weatherAPI = {
  getByCity: (city) =>
    api.get(`/api/weather/${city}`),
}

// ─── ML APIs ──────────────────────────────────────────────────────────────────
export const mlAPI = {
  predictIncome: (data) =>
    mlApi.post('/predict-income', data),

  detectFraud: (data) =>
    mlApi.post('/detect-fraud', data),
}

export default api
