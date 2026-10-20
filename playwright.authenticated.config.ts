import { defineConfig, devices } from "@playwright/test";

// Esta suíte usa somente Supabase local; a suíte sem backend continua certificando o bloqueio.
export default defineConfig({
  testDir: "./tests/authenticated",
  outputDir: "./test-results-authenticated",
  workers: 1,
  timeout: 60_000,
  // Permite isolar uma falha de gravação de traces no volume Windows sem alterar a suíte funcional.
  use: { baseURL: "http://127.0.0.1:3200", trace: process.env.NOS_DISABLE_TRACE === "1" ? "off" : "retain-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: `node "${process.cwd()}/scripts/start-authenticated-server.mjs"`,
    url: "http://127.0.0.1:3200/conta",
    env: { PLAYWRIGHT_TEST: "", NOS_AUTH_TEST: "1", APP_ORIGIN: "http://127.0.0.1:3200" },
    reuseExistingServer: false,
    timeout: 300_000,
    stdout: "pipe",
    cwd: process.env.NOS_AUTH_WORKSPACE || process.cwd(),
  },
});
