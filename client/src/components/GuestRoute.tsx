import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

/**
 * GuestRoute — Route guard untuk halaman yang hanya bisa diakses jika BELUM login.
 *
 * Cara pakai di App.tsx:
 *   <Route path="/login" element={
 *     <GuestRoute><LoginPage /></GuestRoute>
 *   } />
 *
 * Logika:
 *   - Jika sedang loading (cek token) → tampilkan loading
 *   - Jika sudah login → redirect ke /dashboard (tidak perlu login lagi)
 *   - Jika belum login → tampilkan halaman (children)
 */
export default function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()

  // Sedang mengecek token
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Loading...</p>
      </div>
    )
  }

  // Sudah login → redirect ke dashboard (tidak perlu akses login/register lagi)
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  // Belum login → tampilkan halaman login/register
  return <>{children}</>
}
