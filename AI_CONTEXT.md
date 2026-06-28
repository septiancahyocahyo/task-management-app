# AI Context & Guidelines: Task Management App (TaskFlow)

**CRITICAL: Read this file before making any changes to the project.**
Mendefinisikan arsitektur, teknologi, aturan desain, dan status proyek terkini.

## 1. Tech Stack & Setup
- **Frontend**: React 19 + Vite + TypeScript
  - Path alias: `@` mengarah ke `./client/src`
  - Routing: React Router v7 (`BrowserRouter` di `main.tsx`)
- **Styling**: Tailwind CSS v4
  - Konfigurasi tema & animasi dilakukan di `client/src/index.css` via `@theme` (Tidak ada `tailwind.config.js`)
- **Backend**: Next.js API Routes (Port 3000)
  - Di environment development, Vite mem-proxy request `/api` ke `http://localhost:3000`
- **Database & ORM**: PostgreSQL + Prisma

## 2. Key File Map
- **Database Schema**: `server/prisma/schema.prisma` (Definisi model `User`, `Task`, dan enum)
- **API Client**: `client/src/services/api.ts` (Instance Axios dengan interceptor JWT otomatis)
- **API Services**: `client/src/services/auth.service.ts` & `task.service.ts`
- **Global State**: `client/src/contexts/AuthContext.tsx` (State autentikasi user)
- **Route Guards**: `client/src/components/ProtectedRoute.tsx` (Wajib login) & `GuestRoute.tsx` (Hanya guest)
- **Routing Entry**: `client/src/App.tsx`

## 3. Theme & Design System
- **Style**: Premium Dark Glassmorphism
- **Background**: Gradient (`bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]`) dengan dekorasi blur.
- **Containers**: Efek glass (`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl`).
- **Typography**: Font 'Inter'. Teks utama `text-white`, teks sekunder `text-white/50` atau `text-white/70`.
- **Color Accents**:
  - Primary Blue: `#4361ee`
  - Purple: `#7209b7`
  - Teal/Cyan: `#4cc9f0`
- **Status Colors**:
  - TODO: Cyan `#4cc9f0`
  - In Progress: Orange `#f59e0b`
  - Completed: Green `#22c55e`
- **Interactions**: Gunakan animasi halus (hover lift `-translate-y-0.5`, subtle glow box-shadow, custom keyframes `fadeInUp`, `slideUp` dari `index.css`).

## 4. Constraints & Rules
- **No unauthorized packages**: Jangan install dependensi baru tanpa konfirmasi user.
- **Strict Typing**: Gunakan interface/tipe TypeScript yang ketat. Hindari `any`.
- **Design Adherence**: Dilarang menggunakan warna Tailwind default (misal `bg-blue-500`). Gunakan palet custom di atas atau variasi opacity (`bg-white/10`).
- **Code Documentation**: Pertahankan komentar yang ada. Berikan dokumentasi pada logika/komponen kompleks yang baru.
- **Mandatory Updates**: Selalu update bagian "Project Progress & Status" di file ini setelah menyelesaikan milestone/commit.

## 5. Project Progress & Status
**Last Update:** 26 Juni 2026 (Golang Migration - Register Endpoint)

### Completed Milestones
- **Backend Core**: Setup skema Prisma, koneksi PostgreSQL, logika autentikasi JWT.
- **API Routes**: Endpoint Auth (`/register`, `/login`, `/me`) dan CRUD Task.
- **Frontend Core**: Setup Vite, integrasi Tailwind v4, React Router, Axios interceptor, `AuthContext`.
- **Auth UI**: Halaman Login dan Register dengan desain dark glassmorphism.
- **Dashboard UI & Logic**:
  - Layout utama (Sidebar, Header responsive).
  - Stats Cards (Total, To Do, In Progress, Completed).
  - Logika Client-side filtering & sorting.
  - TaskList & TaskCard (badge status, hitung mundur due date, quick actions).
  - Modal untuk Create/Edit Task dan Konfirmasi Hapus.
  - Sistem Toast notification.

### Current WIP / Next Steps
- **Golang Backend Migration (Learning Stage)**:
  - [x] Milestone 1: Initialize project in `server-go/`, setup Fiber server & `/api/health`.
  - [x] Milestone 2: Setup GORM & connect to PostgreSQL database.
  - [/] Milestone 3: Implement Auth endpoints (Implemented `/register`, WIP: `/login`, `/me`) and JWT Middleware.
  - [ ] Milestone 4: Implement Task CRUD endpoints.
  - [ ] Milestone 5: Switch frontend proxy and perform E2E integration test.

