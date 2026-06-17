import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/api-error";
import { CreateTaskInput, UpdateTaskInput } from "../schemas/task.schema";

// ─── CREATE ───────────────────────────────────────────────────
export async function createTask(userId: string, data: CreateTaskInput) {
  const task = await prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      status: data.status,       // undefined = pakai default Prisma (TODO)
      priority: data.priority,   // undefined = pakai default Prisma (MEDIUM)
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      userId, // hubungkan task dengan user yang login
    },
  });

  return task;
}

// ─── GET ALL ──────────────────────────────────────────────────
export async function getAllTasks(userId: string) {
  // Ambil semua task milik user, urutkan dari terbaru
  const tasks = await prisma.task.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return tasks;
}

// ─── GET BY ID ────────────────────────────────────────────────
export async function getTaskById(taskId: string, userId: string) {
  // Cari task berdasarkan ID DAN userId (verifikasi kepemilikan)
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId, // hanya bisa akses task milik sendiri
    },
  });

  // Jika tidak ditemukan (task tidak ada ATAU bukan milik user ini)
  if (!task) {
    throw new AppError("Task not found", 404);
  }

  return task;
}

// ─── UPDATE ───────────────────────────────────────────────────
export async function updateTask(
  taskId: string,
  userId: string,
  data: UpdateTaskInput
) {
  // 1. Pastikan task ada dan milik user ini
  await getTaskById(taskId, userId);

  // 2. Update task dengan data baru
  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: {
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    },
  });

  return updatedTask;
}

// ─── DELETE ───────────────────────────────────────────────────
export async function deleteTask(taskId: string, userId: string) {
  // 1. Pastikan task ada dan milik user ini
  await getTaskById(taskId, userId);

  // 2. Hapus task
  await prisma.task.delete({
    where: { id: taskId },
  });

  return { message: "Task deleted successfully" };
}
