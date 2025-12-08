import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path";

// https://vite.dev/config/
// vite.config.ts - Code splitting config
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-select', '@radix-ui/react-popover'],
          'vendor-utils': ['date-fns', 'axios', 'clsx'],
          'vendor-animation': ['framer-motion'],
        }
      }
    },
    chunkSizeWarningLimit: 1000, // Increase warning limit to 1MB
  }
})