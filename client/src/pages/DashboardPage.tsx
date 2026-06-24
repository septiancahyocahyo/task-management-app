import { useState, useEffect, useMemo, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import DashboardLayout from '@/components/DashboardLayout'
import StatsCards from '@/components/dashboard/StatsCards'
import TaskFilters from '@/components/dashboard/TaskFilters'
import TaskList from '@/components/dashboard/TaskList'
import TaskModal from '@/components/dashboard/TaskModal'
import DeleteConfirmModal from '@/components/dashboard/DeleteConfirmModal'
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  type Task,
  type CreateTaskPayload,
  type UpdateTaskPayload,
} from '@/services/task.service'

/**
 * DashboardPage — Halaman utama setelah login.
 *
 * Menampilkan:
 * - Greeting user
 * - Statistik task (StatsCards)
 * - Filter/sort/search (TaskFilters)
 * - Daftar task (TaskList → TaskCard)
 * - Modal create/edit (TaskModal)
 * - Modal konfirmasi hapus (DeleteConfirmModal)
 *
 * Semua data task diambil dari API dan disimpan di state lokal.
 */
export default function DashboardPage() {
  const { user } = useAuth()

  // ─── Task data ─────────────────────────────────────────────
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // ─── Filter & sort state ───────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [priorityFilter, setPriorityFilter] = useState('ALL')
  const [sortBy, setSortBy] = useState('newest')

  // ─── Modal state ───────────────────────────────────────────
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deletingTask, setDeletingTask] = useState<Task | null>(null)

  // ─── Toast notification state ──────────────────────────────
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // ─── Fetch tasks saat mount ────────────────────────────────
  useEffect(() => {
    fetchTasks()
  }, [])

  // ─── Auto-dismiss toast ────────────────────────────────────
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  async function fetchTasks() {
    try {
      const data = await getAllTasks()
      setTasks(data)
    } catch {
      showToast('Gagal memuat daftar task.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  function showToast(message: string, type: 'success' | 'error') {
    setToast({ message, type })
  }

  // ─── Filter & sort logic ───────────────────────────────────
  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks]

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        t =>
          t.title.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q))
      )
    }

    // Filter by status
    if (statusFilter !== 'ALL') {
      result = result.filter(t => t.status === statusFilter)
    }

    // Filter by priority
    if (priorityFilter !== 'ALL') {
      result = result.filter(t => t.priority === priorityFilter)
    }

    // Sort
    const priorityOrder: Record<string, number> = { HIGH: 3, MEDIUM: 2, LOW: 1 }

    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case 'dueDate':
        result.sort((a, b) => {
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        })
        break
      case 'priority':
        result.sort((a, b) => (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0))
        break
    }

    return result
  }, [tasks, searchQuery, statusFilter, priorityFilter, sortBy])

  // ─── Handlers ──────────────────────────────────────────────

  const handleOpenCreateModal = useCallback(() => {
    setEditingTask(null)
    setIsTaskModalOpen(true)
  }, [])

  const handleOpenEditModal = useCallback((task: Task) => {
    setEditingTask(task)
    setIsTaskModalOpen(true)
  }, [])

  const handleCloseTaskModal = useCallback(() => {
    setIsTaskModalOpen(false)
    setEditingTask(null)
  }, [])

  const handleSubmitTask = useCallback(async (data: CreateTaskPayload | UpdateTaskPayload) => {
    if (editingTask) {
      // ─── Update task ───
      const updated = await updateTask(editingTask.id, data as UpdateTaskPayload)
      setTasks(prev => prev.map(t => (t.id === updated.id ? updated : t)))
      showToast('Task berhasil diperbarui!', 'success')
    } else {
      // ─── Create task ───
      const created = await createTask(data as CreateTaskPayload)
      setTasks(prev => [created, ...prev])
      showToast('Task baru berhasil ditambahkan!', 'success')
    }
  }, [editingTask])

  const handleOpenDeleteModal = useCallback((task: Task) => {
    setDeletingTask(task)
    setIsDeleteModalOpen(true)
  }, [])

  const handleCloseDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false)
    setDeletingTask(null)
  }, [])

  const handleConfirmDelete = useCallback(async () => {
    if (!deletingTask) return
    try {
      await deleteTask(deletingTask.id)
      setTasks(prev => prev.filter(t => t.id !== deletingTask.id))
      showToast('Task berhasil dihapus.', 'success')
    } catch {
      showToast('Gagal menghapus task.', 'error')
    }
  }, [deletingTask])

  const handleToggleStatus = useCallback(async (task: Task) => {
    const statusCycle: Record<Task['status'], Task['status']> = {
      TODO: 'IN_PROGRESS',
      IN_PROGRESS: 'COMPLETED',
      COMPLETED: 'TODO',
    }
    const newStatus = statusCycle[task.status]

    try {
      const updated = await updateTask(task.id, { status: newStatus })
      setTasks(prev => prev.map(t => (t.id === updated.id ? updated : t)))

      const statusLabels: Record<string, string> = {
        TODO: 'To Do',
        IN_PROGRESS: 'In Progress',
        COMPLETED: 'Completed',
      }
      showToast(`Status diubah ke "${statusLabels[newStatus]}".`, 'success')
    } catch {
      showToast('Gagal mengubah status task.', 'error')
    }
  }, [])

  // ─── Render ────────────────────────────────────────────────
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page header */}
        <div className="animate-fade-in-up">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Selamat datang, {user?.name?.split(' ')[0] || 'User'}! 👋
          </h2>
          <p className="text-sm text-white/40 mt-1">
            Kelola task dan tingkatkan produktivitasmu hari ini.
          </p>
        </div>

        {/* Stats */}
        <StatsCards tasks={tasks} isLoading={isLoading} />

        {/* Filters */}
        <TaskFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          priorityFilter={priorityFilter}
          onPriorityFilterChange={setPriorityFilter}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          onAddTask={handleOpenCreateModal}
        />

        {/* Task count info */}
        {!isLoading && tasks.length > 0 && (
          <div className="flex items-center justify-between animate-fade-in" style={{ animationDelay: '500ms', animationFillMode: 'backwards' }}>
            <p className="text-sm text-white/40">
              Menampilkan <span className="text-white font-medium">{filteredAndSortedTasks.length}</span>
              {filteredAndSortedTasks.length !== tasks.length && (
                <span> dari {tasks.length}</span>
              )}
              {' '}task
            </p>
            {(statusFilter !== 'ALL' || priorityFilter !== 'ALL' || searchQuery.trim()) && (
              <button
                id="clear-filters"
                onClick={() => {
                  setSearchQuery('')
                  setStatusFilter('ALL')
                  setPriorityFilter('ALL')
                }}
                className="text-xs text-[#4cc9f0] hover:text-[#72efdd] cursor-pointer transition-colors duration-200"
              >
                Reset filter
              </button>
            )}
          </div>
        )}

        {/* Task list */}
        <TaskList
          tasks={filteredAndSortedTasks}
          isLoading={isLoading}
          onEdit={handleOpenEditModal}
          onDelete={handleOpenDeleteModal}
          onToggleStatus={handleToggleStatus}
          onAddTask={handleOpenCreateModal}
        />
      </div>

      {/* ─── Modals ────────────────────────────────────────── */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={handleCloseTaskModal}
        onSubmit={handleSubmitTask}
        editingTask={editingTask}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        taskTitle={deletingTask?.title || ''}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />

      {/* ─── Toast Notification ────────────────────────────── */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-5 py-3 rounded-xl border shadow-2xl animate-slide-up ${
            toast.type === 'success'
              ? 'bg-[#22c55e]/10 border-[#22c55e]/30 text-[#22c55e]'
              : 'bg-[#ef4444]/10 border-[#ef4444]/30 text-[#ef4444]'
          }`}
        >
          {toast.type === 'success' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          <span className="text-sm font-medium">{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="ml-2 p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </DashboardLayout>
  )
}
