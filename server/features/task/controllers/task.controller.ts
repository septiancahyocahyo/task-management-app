import { ZodError } from "zod";

import { createTaskSchema, updateTaskSchema } from "../schemas/task.schema";
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../services/task.service";
import { AppError } from "@/lib/api-error";
import { successResponse, errorResponse } from "@/lib/api-response";
import { authenticateRequest } from "@/lib/auth-middleware";

// ─── CREATE ───────────────────────────────────────────────────
export async function createTaskController(req: Request) {
  try {
    // 1. Proteksi route dengan JWT middleware
    const auth = await authenticateRequest(req);
    if (!auth.success) return auth.response;

    // 2. Ambil dan validasi body request
    const body = await req.json();
    const validatedData = createTaskSchema.parse(body);

    // 3. Buat task baru (userId dari JWT, bukan dari body)
    const task = await createTask(auth.user.id, validatedData);

    return successResponse(task, "Task created successfully", 201);
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = Object.fromEntries(
        error.issues.map((err) => [err.path[0], err.message])
      );
      return errorResponse("Validation error", 400, errors);
    }

    if (error instanceof AppError) {
      return errorResponse(error.message, error.statusCode, error.errors);
    }

    return errorResponse("Something went wrong", 500);
  }
}

// ─── GET ALL ──────────────────────────────────────────────────
export async function getAllTasksController(req: Request) {
  try {
    const auth = await authenticateRequest(req);
    if (!auth.success) return auth.response;

    // Ambil semua task milik user yang login
    const tasks = await getAllTasks(auth.user.id);

    return successResponse(tasks, "Tasks fetched successfully", 200);
  } catch (error) {
    if (error instanceof AppError) {
      return errorResponse(error.message, error.statusCode, error.errors);
    }

    return errorResponse("Something went wrong", 500);
  }
}

// ─── GET BY ID ────────────────────────────────────────────────
export async function getTaskByIdController(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await authenticateRequest(req);
    if (!auth.success) return auth.response;

    // Ambil id task dari URL parameter (/api/tasks/[id])
    const { id } = await params;

    const task = await getTaskById(id, auth.user.id);

    return successResponse(task, "Task fetched successfully", 200);
  } catch (error) {
    if (error instanceof AppError) {
      return errorResponse(error.message, error.statusCode, error.errors);
    }

    return errorResponse("Something went wrong", 500);
  }
}

// ─── UPDATE ───────────────────────────────────────────────────
export async function updateTaskController(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await authenticateRequest(req);
    if (!auth.success) return auth.response;

    const { id } = await params;

    // Validasi body dengan updateTaskSchema (semua field opsional)
    const body = await req.json();
    const validatedData = updateTaskSchema.parse(body);

    const updatedTask = await updateTask(id, auth.user.id, validatedData);

    return successResponse(updatedTask, "Task updated successfully", 200);
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = Object.fromEntries(
        error.issues.map((err) => [err.path[0], err.message])
      );
      return errorResponse("Validation error", 400, errors);
    }

    if (error instanceof AppError) {
      return errorResponse(error.message, error.statusCode, error.errors);
    }

    return errorResponse("Something went wrong", 500);
  }
}

// ─── DELETE ───────────────────────────────────────────────────
export async function deleteTaskController(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await authenticateRequest(req);
    if (!auth.success) return auth.response;

    const { id } = await params;

    const result = await deleteTask(id, auth.user.id);

    return successResponse(result, "Task deleted successfully", 200);
  } catch (error) {
    if (error instanceof AppError) {
      return errorResponse(error.message, error.statusCode, error.errors);
    }

    return errorResponse("Something went wrong", 500);
  }
}
