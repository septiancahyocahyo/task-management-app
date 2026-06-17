import { ZodError } from "zod";

import { registerSchema } from "../schemas/register.schema";
import { loginSchema } from "../schemas/login.schema";
import { registerUser, loginUser, getMe } from "../services/auth.service";
import { AppError } from "@/lib/api-error";
import { successResponse, errorResponse } from "@/lib/api-response";
import { authenticateRequest } from "@/lib/auth-middleware";

// ─── REGISTER ────────────────────────────────────────────────
export async function registerController(req: Request) {
  try {
    const body = await req.json();

    const validatedData =
      registerSchema.parse(body);

    const user =
      await registerUser(validatedData);

    return successResponse(user, "Registration successful", 201);
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = Object.fromEntries(
        error.issues.map((err) => [err.path[0], err.message])
      );
      return errorResponse("Validation error", 400, errors);
    }

    if (error instanceof AppError) {
      return errorResponse(
        error.message,
        error.statusCode,
        error.errors
      );
    }

    return errorResponse("Something went wrong", 500);
  }
}

// ─── LOGIN ────────────────────────────────────────────────────
export async function loginController(req: Request) {
  try {
    // 1. Ambil body dari request
    const body = await req.json();

    // 2. Validasi input dengan loginSchema (Zod)
    //    Jika ada field yang tidak valid, ZodError akan dilempar
    const validatedData = loginSchema.parse(body);

    // 3. Panggil service loginUser untuk proses autentikasi
    const result = await loginUser(validatedData);

    // 4. Kirim response sukses dengan data user + token
    return successResponse(result, "Login successful", 200);
  } catch (error) {
    // Tangkap error validasi Zod
    if (error instanceof ZodError) {
      const errors = Object.fromEntries(
        error.issues.map((err) => [err.path[0], err.message])
      );
      return errorResponse("Validation error", 400, errors);
    }

    // Tangkap error bisnis (email tidak ada, password salah, dll)
    if (error instanceof AppError) {
      return errorResponse(
        error.message,
        error.statusCode,
        error.errors
      );
    }

    // Fallback: error yang tidak terduga
    return errorResponse("Something went wrong", 500);
  }
}

// ─── GET CURRENT USER ─────────────────────────────────────────
export async function getMeController(req: Request) {
  try {
    // 1. Jalankan middleware — cek dan verifikasi JWT token
    const auth = await authenticateRequest(req);

    // 2. Jika token tidak ada / tidak valid → langsung return 401
    //    (tidak perlu throw, middleware sudah siapkan response-nya)
    if (!auth.success) return auth.response;

    // 3. Token valid! Ambil id user dari payload JWT
    const { id } = auth.user;

    // 4. Ambil data terbaru user dari database menggunakan id
    //    (bukan dari token, karena data di DB bisa berubah)
    const user = await getMe(id);

    // 5. Return data user
    return successResponse(user, "User fetched successfully", 200);
  } catch (error) {
    if (error instanceof AppError) {
      return errorResponse(error.message, error.statusCode, error.errors);
    }

    return errorResponse("Something went wrong", 500);
  }
}