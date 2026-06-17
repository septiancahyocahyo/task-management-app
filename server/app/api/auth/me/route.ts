import { getMeController } from "@/features/auth/controllers/auth.controller";

// Next.js Route Handler
// Endpoint: GET /api/auth/me
// Protected: hanya user dengan JWT token valid yang bisa akses
export async function GET(req: Request) {
  return getMeController(req);
}
