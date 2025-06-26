import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ["**/*.json"],
  build: {
    outDir: "build",
    chunkSizeWarningLimit: 1000
  },
  server: {
    host: '127.0.0.1',
    port: 5173
  }
})
