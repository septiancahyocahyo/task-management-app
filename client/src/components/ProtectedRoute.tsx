import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

/**
 * ProtectedRoute — Route guard untuk halaman yang butuh autentikasi.
 *
 * Cara pakai di App.tsx:
 *   <Route path="/dashboard" element={
 *     <ProtectedRoute><DashboardPage /></ProtectedRoute>
 *   } />
 *
 * Logika:
 *   - Jika sedang loading (cek token) → tampilkan loading
 *   - Jika belum login → redirect ke /login
 *   - Jika sudah login → tampilkan halaman (children)
 */
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()

  // Sedang mengecek token di localStorage/backend
  // Tampilkan loading agar tidak flash redirect ke /login
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Loading...</p>
      </div>
    )
  }

  // Belum login → paksa ke halaman login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Sudah login → tampilkan halaman yang diminta
  return <>{children}</>
}
