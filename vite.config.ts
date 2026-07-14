import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// The app is served from https://ronhachmon.github.io/Cemento/, a subpath, so
// `base` must match the repo name or asset URLs 404 (blank page). See README.
// https://vite.dev/config/
export default defineConfig({
  base: '/Cemento/',
  plugins: [react(), tailwindcss()],
})
