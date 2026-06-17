import {
  createTaskController,
  getAllTasksController,
} from "@/features/task/controllers/task.controller";

// POST /api/tasks — Buat task baru
export async function POST(req: Request) {
  return createTaskController(req);
}

// GET /api/tasks — Ambil semua task milik user
export async function GET(req: Request) {
  return getAllTasksController(req);
}
