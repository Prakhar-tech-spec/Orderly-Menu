import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    // Do not fail on warnings
    chunkSizeWarningLimit: 1600,
    // Produce source maps for debugging
    sourcemap: true,
    // Ensure output directory matches netlify.toml config
    outDir: 'dist',
    // Optimize for Netlify hosting
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom', 'framer-motion'],
          'firebase': ['firebase/app', 'firebase/firestore', 'firebase/auth']
        }
      },
      // Explicitly mark external dependencies
      external: []
    }
  },
  // Add base to support Netlify hosting
  base: '/'
}); 