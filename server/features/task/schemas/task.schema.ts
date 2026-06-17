import { z } from "zod";

// Enum yang sesuai dengan Prisma schema
const TaskStatus = z.enum(["TODO", "IN_PROGRESS", "COMPLETED"]);
const TaskPriority = z.enum(["LOW", "MEDIUM", "HIGH"]);

// ─── CREATE TASK ──────────────────────────────────────────────
// Dipakai saat POST /api/tasks
export const createTaskSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters"),

  description: z
    .string()
    .optional(), // boleh kosong

  status: TaskStatus
    .optional(), // default TODO (diatur di Prisma)

  priority: TaskPriority
    .optional(), // default MEDIUM (diatur di Prisma)

  dueDate: z.iso
    .datetime({ message: "Invalid date format, use ISO 8601" })
    .optional(), // boleh kosong
});

// ─── UPDATE TASK ──────────────────────────────────────────────
// Dipakai saat PUT /api/tasks/:id
// Semua field opsional (partial update)
export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .optional(),

  description: z
    .string()
    .optional(),

  status: TaskStatus
    .optional(),

  priority: TaskPriority
    .optional(),

  dueDate: z.iso
    .datetime({ message: "Invalid date format, use ISO 8601" })
    .optional(),
});

// Type otomatis dari schema Zod
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
