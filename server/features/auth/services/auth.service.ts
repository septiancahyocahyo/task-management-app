import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/api-error";
import { RegisterInput } from "../schemas/register.schema";
import { LoginInput } from "../schemas/login.schema";
import { LoginResponse } from "../types/auth.types";

// ─── REGISTER ────────────────────────────────────────────────
export async function registerUser(data: RegisterInput) {
  const { name, email, password } = data;

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new AppError("Email already exists", 409, {
      email: "Email already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return user;
}

// ─── LOGIN ────────────────────────────────────────────────────
export async function loginUser(data: LoginInput): Promise<LoginResponse> {
  const { email, password } = data;

  // 1. Cari user berdasarkan email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // 2. Jika user tidak ditemukan
  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  // 3. Bandingkan password yang dikirim dengan hash di database
  const isPasswordValid = await bcrypt.compare(password, user.password);

  // 4. Jika password salah
  if (!isPasswordValid) {
    throw new AppError("Invalid credentials", 401);
  }

  // 5. Buat JWT token dengan payload berisi data user
  const jwtSecret = process.env.JWT_SECRET!;
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    jwtSecret,
    { expiresIn: "7d" } // Token berlaku 7 hari
  );

  // 6. Return data user (tanpa password) + token
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
    token,
  };
}
