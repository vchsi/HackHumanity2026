import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: '../../backend/static',
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/analyze': 'http://localhost:8000',
      '/history': 'http://localhost:8000',
      '/report': 'http://localhost:8000',
    },
  },
})
