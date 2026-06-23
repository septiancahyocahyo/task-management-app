import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  // Path alias: '@' → folder 'src/'
  // Contoh penggunaan: import App from '@/App' alih-alih '../../App'
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // Proxy: request ke /api/* diteruskan ke backend Next.js (port 3000)
  // Ini menyelesaikan masalah CORS saat development
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
