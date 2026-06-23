import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

/**
 * LoginPage — Halaman login user
 * Route: /login
 *
 * Flow:
 * 1. User mengisi email & password
 * 2. Klik tombol "Masuk"
 * 3. AuthContext.login() mengirim data ke POST /api/auth/login
 * 4. Jika berhasil → redirect ke /dashboard
 * 5. Jika gagal → tampilkan pesan error
 */
export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  // State form
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // State UI
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // ─── Handle Submit Form ─────────────────────────────────────
  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Email dan password harus diisi.')
      return
    }

    setIsLoading(true)

    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err: unknown) {
      if (
        err &&
        typeof err === 'object' &&
        'response' in err &&
        (err as { response?: { data?: { message?: string } } }).response?.data?.message
      ) {
        setError((err as { response: { data: { message: string } } }).response.data.message)
      } else {
        setError('Terjadi kesalahan. Silakan coba lagi.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] relative overflow-hidden">
      {/* Dekorasi blur background */}
      <div className="absolute w-[400px] h-[400px] bg-[#4361ee] rounded-full blur-[80px] opacity-30 -top-24 -right-24" />
      <div className="absolute w-[300px] h-[300px] bg-[#7209b7] rounded-full blur-[80px] opacity-30 -bottom-20 -left-20" />

      {/* Card form */}
      <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl animate-fade-in-up">
        {/* Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">TaskFlow</h1>
          <p className="text-white/50 text-sm mt-2">Masuk ke akun Anda</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Error global */}
          {error && (
            <div className="bg-pink-500/10 border border-pink-500/30 rounded-xl px-4 py-3 mb-5 text-pink-400 text-sm text-center">
              {error}
            </div>
          )}

          {/* Email */}
          <div className="mb-5">
            <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="w-full px-4 py-3 text-sm text-white bg-white/8 border border-white/15 rounded-xl outline-none placeholder-white/30 transition-all duration-300 focus:border-[#4361ee] focus:bg-white/12 focus:ring-2 focus:ring-[#4361ee]/30"
            />
          </div>

          {/* Password */}
          <div className="mb-5">
            <label htmlFor="password" className="block text-sm font-medium text-white/70 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="w-full px-4 py-3 text-sm text-white bg-white/8 border border-white/15 rounded-xl outline-none placeholder-white/30 transition-all duration-300 focus:border-[#4361ee] focus:bg-white/12 focus:ring-2 focus:ring-[#4361ee]/30"
            />
          </div>

          {/* Tombol submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 mt-2 text-base font-semibold text-white bg-gradient-to-r from-[#4361ee] to-[#7209b7] rounded-xl cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(67,97,238,0.4)] active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
          >
            {isLoading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        {/* Link ke register */}
        <p className="text-center mt-6 text-sm text-white/50">
          Belum punya akun?{' '}
          <Link to="/register" className="text-[#4cc9f0] font-medium hover:text-[#72efdd] hover:underline transition-colors duration-200">
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  )
}
