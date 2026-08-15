import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    port: 5173,
    // En desarrollo el frontend habla con el backend a través de este proxy,
    // igual que en producción lo hace a través de Nginx. Así la aplicación
    // solo conoce rutas relativas `/api/...` y no hay ninguna URL quemada.
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },

  build: {
    target: 'es2022',
    sourcemap: false,
    rollupOptions: {
      output: {
        // Separar las librerías grandes del código de la aplicación: se
        // cachean aparte y no se invalidan en cada despliegue.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return 'react';
          if (id.includes('framer-motion') || id.includes('motion-dom')) return 'animacion';
          if (id.includes('@tanstack') || id.includes('zustand')) return 'datos';
          return undefined;
        },
      },
    },
  },

  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/configuracion-tests.ts'],
    css: false,
    // `e2e/` es cosa de Playwright, no de Vitest.
    exclude: ['node_modules/**', 'dist/**', 'e2e/**'],
  },
});
