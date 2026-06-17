import {
  getTaskByIdController,
  updateTaskController,
  deleteTaskController,
} from "@/features/task/controllers/task.controller";

// Tipe params untuk dynamic route [id]
type RouteContext = { params: Promise<{ id: string }> };

// GET /api/tasks/:id — Ambil detail satu task
export async function GET(req: Request, context: RouteContext) {
  return getTaskByIdController(req, context);
}

// PUT /api/tasks/:id — Update task
export async function PUT(req: Request, context: RouteContext) {
  return updateTaskController(req, context);
}

// DELETE /api/tasks/:id — Hapus task
export async function DELETE(req: Request, context: RouteContext) {
  return deleteTaskController(req, context);
}
