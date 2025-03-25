import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on mode
  const env = loadEnv(mode, process.cwd(), '');
  
  // Check if optimization mode is enabled
  const optimizeLoad = env.OPTIMIZE_LOAD === 'true';

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      host: true,
      port: Number(env.PORT) || 3965,
      strictPort: false,
      hmr: {
        overlay: !optimizeLoad, // Disable HMR overlay in optimize mode
      },
    },
    css: {
      devSourcemap: !optimizeLoad, // Disable CSS source maps in optimize mode
    },
    // Optimize for faster development
    optimizeDeps: {
      include: optimizeLoad ? [
        'react',
        'react-dom',
        'react-router-dom',
        'framer-motion',
        'lucide-react',
        'tailwindcss',
        'zustand',
        'class-variance-authority'
      ] : [],
      force: optimizeLoad,
    },
    build: {
      target: 'esnext',
      sourcemap: !optimizeLoad, // Disable sourcemaps in optimize mode
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: optimizeLoad ? {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            ui: ['framer-motion', 'lucide-react', 'class-variance-authority'],
            utils: ['zustand', 'tailwindcss'],
          } : undefined,
        },
      },
    },
    // Performance features
    esbuild: {
      jsxInject: optimizeLoad ? `import React from 'react'` : undefined,
      legalComments: 'none',
      minifyIdentifiers: optimizeLoad,
      minifySyntax: optimizeLoad,
      minifyWhitespace: optimizeLoad,
    },
  };
}); 