import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Proxies all /api/* calls to your FastAPI backend
      // FastAPI is running on http://localhost:8000
      '/api': {
        target: 'https://voxguard-ai-1zz7.onrender.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
