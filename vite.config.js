import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base so the build works both on *.github.io/axium-solutions and on the custom domain
export default defineConfig({
  base: './',
  plugins: [react()],
})
