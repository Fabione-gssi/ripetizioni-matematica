import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base relativa: lo stesso build funziona in Capacitor (file locali),
// su GitHub Pages (sottocartella) e su qualsiasi hosting statico.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: { target: 'es2020', chunkSizeWarningLimit: 900 },
  test: { environment: 'node', include: ['tests/**/*.test.ts'] },
});
