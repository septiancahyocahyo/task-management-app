import api from './api'

// ─── Types ────────────────────────────────────────────────────
// Tipe data Task yang diterima dari backend

export interface Task {
  id: string
  title: string
  description: string | null
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  dueDate: string | null
  userId: string
  createdAt: string
  updatedAt: string
}

// Payload untuk membuat task baru (sesuai createTaskSchema di backend)
export interface CreateTaskPayload {
  title: string
  description?: string
  status?: 'TODO' | 'IN_PROGRESS' | 'COMPLETED'
  priority?: 'LOW' | 'MEDIUM' | 'HIGH'
  dueDate?: string // ISO 8601 format
}

// Payload untuk update task (semua field opsional, sesuai updateTaskSchema)
export interface UpdateTaskPayload {
  title?: string
  description?: string
  status?: 'TODO' | 'IN_PROGRESS' | 'COMPLETED'
  priority?: 'LOW' | 'MEDIUM' | 'HIGH'
  dueDate?: string
}

// ─── API Functions ────────────────────────────────────────────

/**
 * Ambil semua task milik user yang sedang login
 * Endpoint: GET /api/tasks
 */
export async function getAllTasks(): Promise<Task[]> {
  const { data } = await api.get('/tasks')
  return data.data
}

/**
 * Ambil detail satu task berdasarkan ID
 * Endpoint: GET /api/tasks/:id
 */
export async function getTaskById(id: string): Promise<Task> {
  const { data } = await api.get(`/tasks/${id}`)
  return data.data
}

/**
 * Buat task baru
 * Endpoint: POST /api/tasks
 */
export async function createTask(payload: CreateTaskPayload): Promise<Task> {
  const { data } = await api.post('/tasks', payload)
  return data.data
}

/**
 * Update task yang sudah ada
 * Endpoint: PUT /api/tasks/:id
 */
export async function updateTask(id: string, payload: UpdateTaskPayload): Promise<Task> {
  const { data } = await api.put(`/tasks/${id}`, payload)
  return data.data
}

/**
 * Hapus task
 * Endpoint: DELETE /api/tasks/:id
 */
export async function deleteTask(id: string): Promise<void> {
  await api.delete(`/tasks/${id}`)
}
