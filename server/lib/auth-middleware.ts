import { verifyJwt } from "@/lib/jwt";
import { errorResponse } from "@/lib/api-response";
import { JwtPayload } from "@/features/auth/types/auth.types";
import { NextResponse } from "next/server";

// Return type: union type — bisa sukses atau gagal
type AuthResult =
  | { success: true; user: JwtPayload }
  | { success: false; response: NextResponse };

/**
 * Middleware untuk memproteksi route yang butuh autentikasi.
 *
 * Cara pakai di controller:
 *   const auth = await authenticateRequest(req);
 *   if (!auth.success) return auth.response; // langsung return 401
 *   const { id, email, role } = auth.user;   // data user tersedia
 *
 * @param req - Request object dari Next.js Route Handler
 * @returns AuthResult — { success: true, user } atau { success: false, response }
 */
export async function authenticateRequest(req: Request): Promise<AuthResult> {
  // 1. Ambil header Authorization dari request
  //    Format yang diharapkan: "Bearer eyJhbGciOiJIUzI1NiIs..."
  const authHeader = req.headers.get("Authorization");

  // 2. Cek apakah header ada dan formatnya benar (harus diawali "Bearer ")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      success: false,
      response: errorResponse(
        "Unauthorized: No token provided",
        401
      ),
    };
  }

  // 3. Extract token — buang prefix "Bearer " (7 karakter), ambil sisanya
  const token = authHeader.substring(7);

  // 4. Verifikasi token menggunakan helper verifyJwt
  const payload = verifyJwt(token);

  // 5. Jika token tidak valid atau sudah expired → payload = null
  if (!payload) {
    return {
      success: false,
      response: errorResponse(
        "Unauthorized: Invalid or expired token",
        401
      ),
    };
  }

  // 6. Token valid! Return payload user agar bisa digunakan controller
  return {
    success: true,
    user: payload,
  };
}
