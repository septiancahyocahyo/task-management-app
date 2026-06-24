import type { Task } from '@/services/task.service'

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  onToggleStatus: (task: Task) => void
  animationDelay?: number
}

// ─── Helper: format tanggal ──────────────────────────────────
function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// ─── Helper: hitung sisa hari ────────────────────────────────
function getDaysRemaining(dateStr: string | null): { text: string; isOverdue: boolean; isUrgent: boolean } | null {
  if (!dateStr) return null
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const due = new Date(dateStr)
  due.setHours(0, 0, 0, 0)
  const diffMs = due.getTime() - now.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return { text: `${Math.abs(diffDays)} hari lalu`, isOverdue: true, isUrgent: false }
  if (diffDays === 0) return { text: 'Hari ini', isOverdue: false, isUrgent: true }
  if (diffDays === 1) return { text: 'Besok', isOverdue: false, isUrgent: true }
  if (diffDays <= 3) return { text: `${diffDays} hari lagi`, isOverdue: false, isUrgent: true }
  return { text: `${diffDays} hari lagi`, isOverdue: false, isUrgent: false }
}

// ─── Status config ───────────────────────────────────────────
const statusConfig: Record<Task['status'], { label: string; color: string; bgColor: string; borderColor: string }> = {
  TODO: {
    label: 'To Do',
    color: 'text-[#4cc9f0]',
    bgColor: 'bg-[#4cc9f0]/10',
    borderColor: 'border-[#4cc9f0]/30',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    color: 'text-[#f59e0b]',
    bgColor: 'bg-[#f59e0b]/10',
    borderColor: 'border-[#f59e0b]/30',
  },
  COMPLETED: {
    label: 'Completed',
    color: 'text-[#22c55e]',
    bgColor: 'bg-[#22c55e]/10',
    borderColor: 'border-[#22c55e]/30',
  },
}

// ─── Priority config ─────────────────────────────────────────
const priorityConfig: Record<Task['priority'], { label: string; color: string; dotColor: string }> = {
  LOW: { label: 'Low', color: 'text-[#94a3b8]', dotColor: 'bg-[#94a3b8]' },
  MEDIUM: { label: 'Medium', color: 'text-[#f59e0b]', dotColor: 'bg-[#f59e0b]' },
  HIGH: { label: 'High', color: 'text-[#ef4444]', dotColor: 'bg-[#ef4444]' },
}

// ─── Next status cycle ──────────────────────────────────────
function getNextStatus(current: Task['status']): Task['status'] {
  const cycle: Record<Task['status'], Task['status']> = {
    TODO: 'IN_PROGRESS',
    IN_PROGRESS: 'COMPLETED',
    COMPLETED: 'TODO',
  }
  return cycle[current]
}

/**
 * TaskCard — Menampilkan satu task dengan badge status/priority,
 * due date info, dan quick action buttons.
 */
export default function TaskCard({ task, onEdit, onDelete, onToggleStatus, animationDelay = 0 }: TaskCardProps) {
  const status = statusConfig[task.status]
  const priority = priorityConfig[task.priority]
  const daysRemaining = getDaysRemaining(task.dueDate)
  const isCompleted = task.status === 'COMPLETED'

  return (
    <div
      id={`task-card-${task.id}`}
      className={`group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 transition-all duration-300 hover:bg-white/8 hover:border-white/15 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(67,97,238,0.15)] ${isCompleted ? 'opacity-70' : ''}`}
      style={{
        animation: 'fadeInUp 0.5s ease-out backwards',
        animationDelay: `${animationDelay}ms`,
      }}
    >
      {/* Priority indicator — top-left bar */}
      <div className={`absolute top-0 left-5 w-8 h-1 rounded-b-full ${priority.dotColor}`} />

      {/* Header: Title + Actions */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className={`text-base font-semibold text-white leading-snug line-clamp-2 ${isCompleted ? 'line-through opacity-60' : ''}`}>
          {task.title}
        </h3>

        {/* Quick actions — visible on hover */}
        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {/* Toggle status */}
          <button
            id={`toggle-status-${task.id}`}
            onClick={() => onToggleStatus(task)}
            className="p-1.5 rounded-lg text-white/40 hover:text-[#22c55e] hover:bg-[#22c55e]/10 transition-all duration-200 cursor-pointer"
            title={`Ubah ke ${getNextStatus(task.status)}`}
          >
            {isCompleted ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </button>

          {/* Edit */}
          <button
            id={`edit-task-${task.id}`}
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg text-white/40 hover:text-[#4cc9f0] hover:bg-[#4cc9f0]/10 transition-all duration-200 cursor-pointer"
            title="Edit task"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          {/* Delete */}
          <button
            id={`delete-task-${task.id}`}
            onClick={() => onDelete(task)}
            className="p-1.5 rounded-lg text-white/40 hover:text-[#ef4444] hover:bg-[#ef4444]/10 transition-all duration-200 cursor-pointer"
            title="Hapus task"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className={`text-sm text-white/40 leading-relaxed mb-4 line-clamp-2 ${isCompleted ? 'line-through' : ''}`}>
          {task.description}
        </p>
      )}

      {/* Badges: Status + Priority */}
      <div className="flex items-center gap-2 flex-wrap mb-3">
        {/* Status badge */}
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border ${status.color} ${status.bgColor} ${status.borderColor}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${status.color.replace('text-', 'bg-')}`} />
          {status.label}
        </span>

        {/* Priority badge */}
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border border-white/10 bg-white/5 ${priority.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${priority.dotColor}`} />
          {priority.label}
        </span>
      </div>

      {/* Footer: Due date */}
      {task.dueDate && daysRemaining && (
        <div className="flex items-center gap-2 pt-3 border-t border-white/5">
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-3.5 w-3.5 ${daysRemaining.isOverdue ? 'text-[#ef4444]' : daysRemaining.isUrgent ? 'text-[#f59e0b]' : 'text-white/30'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className={`text-xs ${daysRemaining.isOverdue ? 'text-[#ef4444] font-medium' : daysRemaining.isUrgent ? 'text-[#f59e0b]' : 'text-white/40'}`}>
            {formatDate(task.dueDate)}
          </span>
          <span className={`text-xs ${daysRemaining.isOverdue ? 'text-[#ef4444]/70' : daysRemaining.isUrgent ? 'text-[#f59e0b]/70' : 'text-white/25'}`}>
            · {daysRemaining.text}
          </span>
        </div>
      )}
    </div>
  )
}
