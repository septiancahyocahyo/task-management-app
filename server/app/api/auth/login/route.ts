import { loginController } from "@/features/auth/controllers/auth.controller";

// Next.js Route Handler
// Endpoint: POST /api/auth/login
export async function POST(req: Request) {
  return loginController(req);
}
