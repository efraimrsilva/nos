import { defineConfig, devices } from '@playwright/test';

// Impede que códigos de convite apareçam no instantâneo de erro, além de manter traces desligados.
process.env.PLAYWRIGHT_NO_COPY_PROMPT = '1';

const port = process.env.NOS_ANGULAR_TEST_PORT ?? '3200';
if (!/^\d{4,5}$/.test(port) || Number(port) > 65535) throw new Error('Porta de teste Angular inválida.');
const baseURL = 'http://127.0.0.1:' + port;

export default defineConfig({
  testDir: './tests/angular',
  outputDir: './test-results/angular',
  workers: 1,
  // A sessão local aparece no tráfego. Não gravar traces, vídeos ou capturas automáticas.
  use: { baseURL, trace: 'off' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 960 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'], viewport: { width: 390, height: 844 } } },
  ],
  webServer: {
    command: 'node scripts/start-angular-local.mjs ' + port,
    url: baseURL + '/configuracoes/conta',
    timeout: 120_000,
    reuseExistingServer: false,
  },
});
