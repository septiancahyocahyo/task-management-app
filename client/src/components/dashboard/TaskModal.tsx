import { useState, useEffect, type FormEvent } from 'react'
import type { Task, CreateTaskPayload, UpdateTaskPayload } from '@/services/task.service'

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateTaskPayload | UpdateTaskPayload) => Promise<void>
  editingTask?: Task | null  // null = mode create, Task = mode edit
}

/**
 * TaskModal — Modal form untuk membuat atau mengedit task.
 *
 * Mode create: semua field kosong, judul "Tambah Task Baru"
 * Mode edit: pre-fill data task, judul "Edit Task"
 */
export default function TaskModal({ isOpen, onClose, onSubmit, editingTask }: TaskModalProps) {
  const isEditMode = !!editingTask

  // ─── Form state ────────────────────────────────────────────
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<Task['status']>('TODO')
  const [priority, setPriority] = useState<Task['priority']>('MEDIUM')
  const [dueDate, setDueDate] = useState('')

  // ─── UI state ──────────────────────────────────────────────
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // ─── Pre-fill form saat mode edit ──────────────────────────
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title)
      setDescription(editingTask.description || '')
      setStatus(editingTask.status)
      setPriority(editingTask.priority)
      setDueDate(editingTask.dueDate ? editingTask.dueDate.split('T')[0] : '')
    } else {
      // Reset form untuk mode create
      setTitle('')
      setDescription('')
      setStatus('TODO')
      setPriority('MEDIUM')
      setDueDate('')
    }
    setError('')
  }, [editingTask, isOpen])

  // ─── Handle submit ─────────────────────────────────────────
  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (!title.trim()) {
      setError('Judul task harus diisi.')
      return
    }

    setIsSubmitting(true)

    try {
      const payload: CreateTaskPayload | UpdateTaskPayload = {
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      }

      await onSubmit(payload)
      onClose()
    } catch (err: unknown) {
      if (
        err &&
        typeof err === 'object' &&
        'response' in err &&
        (err as { response?: { data?: { message?: string } } }).response?.data?.message
      ) {
        setError((err as { response: { data: { message: string } } }).response.data.message)
      } else {
        setError('Terjadi kesalahan. Silakan coba lagi.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // ─── Jangan render jika tidak open ─────────────────────────
  if (!isOpen) return null

  // ─── Shared input classes ──────────────────────────────────
  const inputClass = 'w-full px-4 py-3 text-sm text-white bg-white/8 border border-white/15 rounded-xl outline-none placeholder-white/30 transition-all duration-300 focus:border-[#4361ee] focus:bg-white/12 focus:ring-2 focus:ring-[#4361ee]/30'
  const labelClass = 'block text-sm font-medium text-white/70 mb-2'

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg bg-[#1a1744]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-lg font-bold text-white">
            {isEditMode ? 'Edit Task' : 'Tambah Task Baru'}
          </h2>
          <button
            id="close-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Error */}
          {error && (
            <div className="bg-pink-500/10 border border-pink-500/30 rounded-xl px-4 py-3 mb-5 text-pink-400 text-sm text-center animate-fade-in">
              {error}
            </div>
          )}

          {/* Title */}
          <div className="mb-4">
            <label htmlFor="task-title" className={labelClass}>
              Judul <span className="text-pink-400">*</span>
            </label>
            <input
              id="task-title"
              type="text"
              placeholder="Contoh: Review proposal klien"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label htmlFor="task-description" className={labelClass}>
              Deskripsi
            </label>
            <textarea
              id="task-description"
              placeholder="Deskripsikan task ini... (opsional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Row: Status + Priority */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Status */}
            <div>
              <label htmlFor="task-status" className={labelClass}>Status</label>
              <select
                id="task-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as Task['status'])}
                className={`${inputClass} cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22rgba(255%2C255%2C255%2C0.4)%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat pr-8`}
              >
                <option value="TODO" className="bg-[#1a1744]">To Do</option>
                <option value="IN_PROGRESS" className="bg-[#1a1744]">In Progress</option>
                <option value="COMPLETED" className="bg-[#1a1744]">Completed</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label htmlFor="task-priority" className={labelClass}>Prioritas</label>
              <select
                id="task-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Task['priority'])}
                className={`${inputClass} cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22rgba(255%2C255%2C255%2C0.4)%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat pr-8`}
              >
                <option value="LOW" className="bg-[#1a1744]">Low</option>
                <option value="MEDIUM" className="bg-[#1a1744]">Medium</option>
                <option value="HIGH" className="bg-[#1a1744]">High</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div className="mb-6">
            <label htmlFor="task-due-date" className={labelClass}>
              Tanggal Jatuh Tempo
            </label>
            <input
              id="task-due-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={`${inputClass} cursor-pointer [color-scheme:dark]`}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-sm font-medium text-white/60 bg-white/5 border border-white/10 rounded-xl cursor-pointer transition-all duration-200 hover:bg-white/10 hover:text-white"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#4361ee] to-[#7209b7] rounded-xl cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(67,97,238,0.4)] active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              {isSubmitting
                ? 'Menyimpan...'
                : isEditMode
                  ? 'Simpan Perubahan'
                  : 'Tambah Task'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
