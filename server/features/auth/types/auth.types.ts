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
