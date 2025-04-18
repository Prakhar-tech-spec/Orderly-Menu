import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Do not fail on warnings
    chunkSizeWarningLimit: 1600,
    // Ignore TypeScript errors at build time
    sourcemap: true,
    rollupOptions: {
      // Disable treeshaking to preserve potentially unused variables
      treeshake: false
    }
  }
}); 