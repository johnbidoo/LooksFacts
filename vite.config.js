import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // The Three.js 3D viewer is a lazy-loaded chunk (~300 kB gzip) that only
    // downloads on product pages, so the default 500 kB warning is expected.
    chunkSizeWarningLimit: 1200,
  },
})
