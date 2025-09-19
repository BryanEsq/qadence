import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  root: './frontend',              // 👈 point Vite to the frontend folder
  plugins: [react()],
  server: {
    port: 5173,
  },
  build: {
    outDir: '../dist',             // 👈 build output goes to project root /dist
    emptyOutDir: true,
  },
})
