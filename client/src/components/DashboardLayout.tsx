import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'

interface DashboardLayoutProps {
  children: ReactNode
}

/**
 * DashboardLayout — Layout utama halaman dashboard.
 *
 * Terdiri dari:
 * - Header (logo, greeting user, tombol logout)
 * - Sidebar navigasi (desktop) / hamburger (mobile)
 * - Area konten utama
 */
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] relative overflow-hidden">
      {/* Dekorasi blur background */}
      <div className="fixed w-[500px] h-[500px] bg-[#4361ee] rounded-full blur-[120px] opacity-15 -top-40 -right-40 pointer-events-none" />
      <div className="fixed w-[400px] h-[400px] bg-[#7209b7] rounded-full blur-[120px] opacity-15 -bottom-32 -left-32 pointer-events-none" />
      <div className="fixed w-[300px] h-[300px] bg-[#4cc9f0] rounded-full blur-[100px] opacity-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      {/* ─── Header ──────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/5 backdrop-blur-2xl border-b border-white/10">
        <div className="h-full px-4 lg:px-6 flex items-center justify-between">
          {/* Logo + Hamburger (mobile) */}
          <div className="flex items-center gap-3">
            {/* Hamburger button — mobile only */}
            <button
              id="sidebar-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer"
              aria-label="Toggle sidebar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {sidebarOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-gradient-to-br from-[#4361ee] to-[#7209b7] rounded-lg flex items-center justify-center shadow-lg shadow-[#4361ee]/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h1 className="text-lg font-bold text-white tracking-tight">TaskFlow</h1>
            </div>
          </div>

          {/* User area */}
          <div className="flex items-center gap-3">
            {/* Greeting — desktop */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#4cc9f0] to-[#4361ee] rounded-full flex items-center justify-center text-white text-xs font-bold uppercase">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <span className="text-sm text-white/70">
                Halo, <span className="text-white font-medium">{user?.name || 'User'}</span>
              </span>
            </div>

            {/* Logout */}
            <button
              id="logout-button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-white/50 hover:text-pink-400 hover:bg-pink-500/10 rounded-lg transition-all duration-200 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* ─── Mobile Sidebar Overlay ──────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ─── Sidebar ─────────────────────────────────────────── */}
      <aside
        className={`fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 bg-white/5 backdrop-blur-2xl border-r border-white/10 transform transition-transform duration-300 ease-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full p-4">
          {/* Nav links */}
          <nav className="flex-1 space-y-1">
            <a
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white bg-white/10 border border-white/10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5 text-[#4cc9f0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Dashboard
            </a>
          </nav>

          {/* User card — bottom */}
          <div className="mt-auto pt-4 border-t border-white/10">
            <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/5">
              <div className="w-9 h-9 bg-gradient-to-br from-[#4cc9f0] to-[#4361ee] rounded-full flex items-center justify-center text-white text-sm font-bold uppercase shrink-0">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-white/40 truncate">{user?.email || ''}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ─── Main Content ────────────────────────────────────── */}
      <main className="pt-16 lg:pl-64 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
