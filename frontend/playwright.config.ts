import { defineConfig, devices } from '@playwright/test';

/**
 * Smoke E2E del flujo feliz.
 *
 * Da por hecho que la API está levantada en el 8080 (con
 * `docker compose -f docker-compose.dev.yml up -d` y el jar del backend en
 * marcha). El servidor de Vite lo arranca Playwright solo.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env['CI']),
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 1 : undefined,
  reporter: process.env['CI'] ? [['github'], ['html', { open: 'never' }]] : [['list']],

  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    locale: 'es-ES',
  },

  projects: [
    { name: 'escritorio', use: { ...devices['Desktop Chrome'] } },
    // La mayoría del tráfico será móvil: el flujo se prueba también ahí.
    { name: 'movil', use: { ...devices['Pixel 5'] } },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env['CI'],
    timeout: 120_000,
  },
});
