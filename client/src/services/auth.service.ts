import api from './api'

// ─── Types ────────────────────────────────────────────────────
// Tipe data yang dikirim ke backend (request payload)

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
}

// Tipe data yang diterima dari backend (response)

export interface User {
  id: string
  name: string
  email: string
  role: 'USER' | 'ADMIN'
  createdAt: string
}

export interface LoginResponse {
  user: User
  token: string
}

// ─── API Functions ────────────────────────────────────────────

/**
 * Login user — mengirim email & password ke backend
 * Endpoint: POST /api/auth/login
 * Return: { user, token }
 */
export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await api.post('/auth/login', payload)
  return data.data // backend membungkus response dalam { success, message, data }
}

/**
 * Register user baru
 * Endpoint: POST /api/auth/register
 * Return: data user yang baru dibuat (tanpa token, harus login lagi)
 */
export async function register(payload: RegisterPayload): Promise<User> {
  const { data } = await api.post('/auth/register', payload)
  return data.data
}

/**
 * Ambil profil user yang sedang login berdasarkan token
 * Endpoint: GET /api/auth/me
 * Return: data user
 */
export async function getMe(): Promise<User> {
  const { data } = await api.get('/auth/me')
  return data.data
}
