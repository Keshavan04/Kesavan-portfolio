import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const API = `http://localhost:${process.env.API_PORT || 3001}`

export default defineConfig({
  plugins: [react()],
  server: {
    // Honour PORT when the host assigns one, otherwise use the Vite default.
    port: Number(process.env.PORT) || 5173,
    open: false,
    // In dev the API runs as a separate process; production serves both together.
    proxy: {
      '/api': API,
      '/uploads': API,
    },
  },
})
