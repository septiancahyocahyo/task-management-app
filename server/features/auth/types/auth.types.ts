// Tipe data User yang aman dikembalikan ke client
// (tanpa password!)
export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  createdAt: Date;
};

// Tipe data response setelah login berhasil
export type LoginResponse = {
  user: AuthUser;
  token: string;
};

// Tipe data payload yang tersimpan di dalam JWT token
// Ini adalah data yang kita sisipkan saat jwt.sign() di auth.service.ts
export type JwtPayload = {
  id: string;
  email: string;
  role: "USER" | "ADMIN";
  iat?: number; // issued at  — ditambahkan otomatis oleh jsonwebtoken
  exp?: number; // expiration — ditambahkan otomatis oleh jsonwebtoken
};
