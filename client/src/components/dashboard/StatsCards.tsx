import type { Task } from '@/services/task.service'

interface StatsCardsProps {
  tasks: Task[]
  isLoading: boolean
}

/**
 * StatsCards — Menampilkan 4 kartu statistik task:
 * Total Tasks, To Do, In Progress, Completed.
 *
 * Setiap kartu memiliki ikon, angka, label, dan warna unik.
 */
export default function StatsCards({ tasks, isLoading }: StatsCardsProps) {
  const totalTasks = tasks.length
  const todoCount = tasks.filter(t => t.status === 'TODO').length
  const inProgressCount = tasks.filter(t => t.status === 'IN_PROGRESS').length
  const completedCount = tasks.filter(t => t.status === 'COMPLETED').length

  const stats = [
    {
      id: 'stat-total',
      label: 'Total Tasks',
      value: totalTasks,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      gradient: 'from-[#4361ee] to-[#3a0ca3]',
      glowColor: 'rgba(67, 97, 238, 0.3)',
    },
    {
      id: 'stat-todo',
      label: 'To Do',
      value: todoCount,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      gradient: 'from-[#4cc9f0] to-[#4361ee]',
      glowColor: 'rgba(76, 201, 240, 0.3)',
    },
    {
      id: 'stat-inprogress',
      label: 'In Progress',
      value: inProgressCount,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      gradient: 'from-[#f59e0b] to-[#d97706]',
      glowColor: 'rgba(245, 158, 11, 0.3)',
    },
    {
      id: 'stat-completed',
      label: 'Completed',
      value: completedCount,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      gradient: 'from-[#22c55e] to-[#16a34a]',
      glowColor: 'rgba(34, 197, 94, 0.3)',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat, index) => (
        <div
          key={stat.id}
          id={stat.id}
          className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-5 transition-all duration-300 hover:bg-white/8 hover:border-white/15 hover:-translate-y-0.5"
          style={{
            animationDelay: `${index * 100}ms`,
            animation: 'fadeInUp 0.5s ease-out backwards',
            boxShadow: `0 0 0 rgba(0,0,0,0)`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = `0 8px 30px ${stat.glowColor}`
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 0 0 rgba(0,0,0,0)'
          }}
        >
          {/* Icon */}
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white mb-3 shadow-lg transition-transform duration-300 group-hover:scale-110`}>
            {stat.icon}
          </div>

          {/* Value & Label */}
          {isLoading ? (
            <>
              <div className="h-8 w-12 bg-white/10 rounded-lg animate-shimmer mb-1" style={{ backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)', backgroundSize: '200% 100%' }} />
              <div className="h-4 w-16 bg-white/10 rounded-md animate-shimmer" style={{ backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)', backgroundSize: '200% 100%' }} />
            </>
          ) : (
            <>
              <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{stat.value}</p>
              <p className="text-xs sm:text-sm text-white/50 mt-0.5">{stat.label}</p>
            </>
          )}
        </div>
      ))}
    </div>
  )
}
