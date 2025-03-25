import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    host: true, // expose to all network interfaces
    watch: {
      usePolling: true, // improve file change detection
    },
    hmr: {
      overlay: true, // show error overlay when errors happen
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  define: {
    // Fix for "process is not defined" error
    'process.env': {}
  }
}) 