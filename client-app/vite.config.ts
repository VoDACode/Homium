import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5000,
    proxy: {
      '/api': 'http://api.homium.vodacode.space'
    }
  },
  build: {
    outDir: 'dist'
  }
})
