import { Link } from 'react-router-dom'

/**
 * NotFoundPage — Halaman 404
 * Route: * (catch-all, URL yang tidak dikenali)
 *
 * Ditampilkan ketika user mengakses URL yang tidak terdaftar di routing.
 */
export default function NotFoundPage() {
  return (
    <div style={{ textAlign: 'center', marginTop: '4rem' }}>
      <h1>404</h1>
      <p>Halaman yang Anda cari tidak ditemukan.</p>
      <Link to="/dashboard">← Kembali ke Dashboard</Link>
    </div>
  )
}
