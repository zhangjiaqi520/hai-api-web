import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => {
    const { code, message, data } = response.data
    if (code === 200) return data
    return Promise.reject(new Error(message || '请求失败'))
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  login: (username, password) => api.post('/api/auth/login', { username, password }),
  register: (username, password, email) => api.post('/api/auth/register', { username, password, email }),
  getCurrentUser: () => api.get('/api/auth/me'),
}

export const channelAPI = {
  list: (params) => api.get('/api/channels', { params }),
  create: (data) => api.post('/api/channels', data),
  delete: (id) => api.delete(`/api/channels/${id}`),
}

export const tokenAPI = {
  list: (params) => api.get('/api/tokens', { params }),
  create: (data) => api.post('/api/tokens', data),
  delete: (id) => api.delete(`/api/tokens/${id}`),
}

export default api
