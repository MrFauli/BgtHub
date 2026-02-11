import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr';
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),svgr()],
  server: {
    proxy: {
      '/uploads': 'http://localhost:5000', // Hier dein Backend-Port
      '/api': 'http://localhost:5000'
    }
  }
})
