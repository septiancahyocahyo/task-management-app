import axios from 'axios'

/**
 * Instance Axios yang sudah dikonfigurasi untuk komunikasi dengan backend API.
 *
 * - baseURL '/api' → semua request diawali dengan /api
 *   (contoh: api.get('/tasks') → GET /api/tasks)
 *
 * - Interceptor → otomatis menyisipkan token JWT dari localStorage
 *   ke header Authorization di setiap request
 */
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// ─── Request Interceptor ──────────────────────────────────────
// Dijalankan SEBELUM setiap request dikirim ke server
api.interceptors.request.use(
  (config) => {
    // Ambil token dari localStorage (disimpan saat login)
    const token = localStorage.getItem('token')

    // Jika token ada, sisipkan ke header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// ─── Response Interceptor ─────────────────────────────────────
// Dijalankan SETELAH response diterima dari server
api.interceptors.response.use(
  (response) => {
    // Jika response sukses, langsung teruskan
    return response
  },
  (error) => {
    // Jika server merespons 401 (Unauthorized) → token expired/invalid
    // Hapus token dan redirect ke halaman login
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default api
