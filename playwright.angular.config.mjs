import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/angular',
  outputDir: './test-results/angular',
  workers: 1,
  // A sessão local aparece no tráfego. Não gravar traces, vídeos ou capturas automáticas.
  use: { baseURL: 'http://127.0.0.1:3200', trace: 'off' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 960 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'], viewport: { width: 390, height: 844 } } },
  ],
  webServer: {
    command: 'node scripts/start-angular-local.mjs 3200',
    url: 'http://127.0.0.1:3200/configuracoes/conta',
    timeout: 120_000,
    reuseExistingServer: false,
  },
});
