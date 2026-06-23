import { Routes, Route, Navigate } from 'react-router-dom'

// Import halaman
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import DashboardPage from '@/pages/DashboardPage'
import NotFoundPage from '@/pages/NotFoundPage'

// Import route guard
import ProtectedRoute from '@/components/ProtectedRoute'
import GuestRoute from '@/components/GuestRoute'

/**
 * App — Komponen utama yang mendefinisikan routing aplikasi.
 *
 * Peta routing:
 *   /            → redirect ke /dashboard
 *   /login       → halaman login (hanya untuk guest / belum login)
 *   /register    → halaman registrasi (hanya untuk guest / belum login)
 *   /dashboard   → halaman utama (hanya untuk user yang sudah login)
 *   *            → halaman 404
 */
function App() {
  return (
    <Routes>
      {/* Redirect root ke dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Halaman autentikasi — hanya bisa diakses jika BELUM login */}
      <Route path="/login" element={
        <GuestRoute>
          <LoginPage />
        </GuestRoute>
      } />
      <Route path="/register" element={
        <GuestRoute>
          <RegisterPage />
        </GuestRoute>
      } />

      {/* Halaman utama — hanya bisa diakses jika SUDAH login */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      } />

      {/* Catch-all: 404 Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
