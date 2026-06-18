import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Backend dev port (Spring Boot default). Override via VITE_BACKEND_URL.
const BACKEND_URL = process.env.VITE_BACKEND_URL ?? 'http://localhost:8080'

export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      // App API
      '/api': { target: BACKEND_URL, changeOrigin: true },
      // OpenAPI / Swagger UI for convenient debugging on the dev port
      '/v3/api-docs': { target: BACKEND_URL, changeOrigin: true },
      '/swagger-ui': { target: BACKEND_URL, changeOrigin: true },
      // Tracking Proxy
      '/t': { target: BACKEND_URL, changeOrigin: true },
    },
  },
})
