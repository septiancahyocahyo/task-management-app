import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react'
import * as authService from '@/services/auth.service'
import type { User } from '@/services/auth.service'

// ─── Tipe data yang disediakan Context ────────────────────────
interface AuthContextType {
  user: User | null            // Data user yang sedang login (null jika belum login)
  isAuthenticated: boolean     // Apakah user sudah login?
  isLoading: boolean           // Apakah sedang proses cek token (loading awal)?
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

// ─── Buat Context ─────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// ─── Provider Component ───────────────────────────────────────
/**
 * AuthProvider membungkus seluruh aplikasi agar semua komponen
 * bisa mengakses state autentikasi (user, login, logout, dll.)
 * melalui hook useAuth().
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true) // true saat pertama kali load

  // ─── Auto-validate token saat app pertama kali dimuat ────────
  // Jika ada token di localStorage, cek apakah masih valid
  // dengan memanggil GET /api/auth/me
  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem('token')

      if (!token) {
        // Tidak ada token → tidak perlu cek, langsung selesai
        setIsLoading(false)
        return
      }

      try {
        // Panggil backend untuk validasi token & ambil data user terbaru
        const userData = await authService.getMe()
        setUser(userData)
      } catch {
        // Token expired atau invalid → hapus dari localStorage
        localStorage.removeItem('token')
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // ─── Login ──────────────────────────────────────────────────
  async function login(email: string, password: string) {
    // 1. Kirim credentials ke backend
    const result = await authService.login({ email, password })

    // 2. Simpan token ke localStorage agar persist saat refresh
    localStorage.setItem('token', result.token)

    // 3. Set data user ke state
    setUser(result.user)
  }

  // ─── Register ───────────────────────────────────────────────
  async function register(name: string, email: string, password: string) {
    // Hanya daftarkan user ke backend
    // Setelah register, user harus login manual (tidak auto-login)
    await authService.register({ name, email, password })
  }

  // ─── Logout ─────────────────────────────────────────────────
  function logout() {
    // 1. Hapus token dari localStorage
    localStorage.removeItem('token')

    // 2. Reset state user
    setUser(null)
  }

  // ─── Value yang disediakan ke seluruh aplikasi ──────────────
  const value: AuthContextType = {
    user,
    isAuthenticated: !!user, // true jika user tidak null
    isLoading,
    login,
    register,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// ─── Custom Hook ──────────────────────────────────────────────
/**
 * Hook useAuth() — cara mudah mengakses AuthContext dari komponen mana pun.
 *
 * Contoh penggunaan:
 *   const { user, login, logout, isAuthenticated } = useAuth()
 */
export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}