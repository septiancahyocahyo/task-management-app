import type { Task } from '@/services/task.service'
import TaskCard from './TaskCard'

interface TaskListProps {
  tasks: Task[]
  isLoading: boolean
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  onToggleStatus: (task: Task) => void
  onAddTask: () => void
}

/**
 * TaskList — Grid container untuk daftar TaskCard.
 * Termasuk loading skeleton dan empty state.
 */
export default function TaskList({ tasks, isLoading, onEdit, onDelete, onToggleStatus, onAddTask }: TaskListProps) {
  // ─── Loading Skeleton ──────────────────────────────────────
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={`skeleton-${i}`}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5"
            style={{
              animation: 'fadeIn 0.3s ease-out backwards',
              animationDelay: `${i * 80}ms`,
            }}
          >
            {/* Priority bar skeleton */}
            <div className="w-8 h-1 bg-white/10 rounded-full mb-4" />

            {/* Title skeleton */}
            <div
              className="h-5 w-3/4 bg-white/10 rounded-lg mb-3"
              style={{
                backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite',
              }}
            />

            {/* Description skeleton */}
            <div className="space-y-2 mb-4">
              <div
                className="h-3 w-full bg-white/8 rounded-md"
                style={{
                  backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s infinite',
                  animationDelay: '0.2s',
                }}
              />
              <div
                className="h-3 w-2/3 bg-white/8 rounded-md"
                style={{
                  backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s infinite',
                  animationDelay: '0.4s',
                }}
              />
            </div>

            {/* Badge skeleton */}
            <div className="flex gap-2 mb-3">
              <div className="h-6 w-16 bg-white/8 rounded-lg" />
              <div className="h-6 w-14 bg-white/8 rounded-lg" />
            </div>

            {/* Date skeleton */}
            <div className="pt-3 border-t border-white/5">
              <div className="h-3 w-24 bg-white/8 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  // ─── Empty State ───────────────────────────────────────────
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 animate-fade-in-up">
        {/* Illustration */}
        <div className="w-24 h-24 mb-6 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#4361ee]/20 to-[#7209b7]/20 rounded-full blur-xl" />
          <div className="relative w-full h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-white mb-2">Belum ada task</h3>
        <p className="text-sm text-white/40 text-center mb-6 max-w-xs">
          Mulai atur produktivitasmu dengan menambahkan task pertama.
        </p>

        <button
          id="add-first-task-button"
          onClick={onAddTask}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#4361ee] to-[#7209b7] rounded-xl cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(67,97,238,0.4)] active:translate-y-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Tambah Task Pertama
        </button>
      </div>
    )
  }

  // ─── Task Grid ─────────────────────────────────────────────
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {tasks.map((task, index) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
          animationDelay={index * 60}
        />
      ))}
    </div>
  )
}
