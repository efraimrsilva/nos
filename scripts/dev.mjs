import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

// Carrega o ambiente antes do processo que configura proxy/certificados, sem
// repassar --env-file ao Next.js (que o propagaria para NODE_OPTIONS).
if (existsSync(".env.local")) process.loadEnvFile(".env.local");

const result = spawnSync(process.execPath, [
  "--use-system-ca",
  "--use-env-proxy",
  "node_modules/next/dist/bin/next",
  "dev",
  "--hostname",
  "127.0.0.1",
  ...process.argv.slice(2),
], { stdio: "inherit", env: process.env });

if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
