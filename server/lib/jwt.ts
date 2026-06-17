import jwt from "jsonwebtoken";
import { JwtPayload } from "@/features/auth/types/auth.types";

/**
 * Verifikasi dan decode JWT token.
 *
 * @param token - String token JWT (tanpa prefix "Bearer ")
 * @returns JwtPayload jika token valid, null jika token tidak valid / expired
 */
export function verifyJwt(token: string): JwtPayload | null {
  try {
    const jwtSecret = process.env.JWT_SECRET!;

    // jwt.verify() akan:
    //  Verifikasi signature token (apakah dibuat dengan JWT_SECRET yang benar?)
    //  Cek apakah token sudah expired (exp < waktu sekarang)
    //  Jika salah satu gagal → throw error, ditangkap di catch
    const payload = jwt.verify(token, jwtSecret) as JwtPayload;

    return payload;
  } catch {
    // Token tidak valid atau sudah expired → return null
    return null;
  }
}
