import { execFileSync, spawn } from "node:child_process";
import { createRequire } from "node:module";
import { randomBytes } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);

export function supabaseCliPath() {
  if (process.env.SUPABASE_CLI_PATH) return process.env.SUPABASE_CLI_PATH;
  const platform = { win32: "windows", darwin: "darwin", linux: "linux" }[process.platform];
  const cliRequire = createRequire(require.resolve("supabase/package.json"));
  const root = path.dirname(cliRequire.resolve(`@supabase/cli-${platform}-${process.arch}/package.json`));
  return path.join(root, "bin", process.platform === "win32" ? "supabase.exe" : "supabase");
}

export function localSupabaseConfig() {
  let config;
  try {
    config = JSON.parse(execFileSync(supabaseCliPath(), ["status", "-o", "json"], {
      encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], windowsHide: true,
    }));
  } catch {
    throw new Error("Supabase local indisponível. Abra o Docker Desktop e execute npm run supabase:start.");
  }
  if (!/^http:\/\/(?:127\.0\.0\.1|localhost):\d+\/?$/.test(config.API_URL ?? "") || !config.ANON_KEY) {
    throw new Error("A configuração deve apontar somente para o Supabase local.");
  }
  return config;
}

function startLocalApp() {
  if (existsSync(".env.local")) process.loadEnvFile(".env.local");
  const config = localSupabaseConfig();
  // Porta e saída próprias permitem manter o servidor ligado ao projeto remoto na porta 3000.
  const origin = "http://127.0.0.1:3001";
  const secretFile = "supabase/.temp/local-recovery-secret";
  mkdirSync(path.dirname(secretFile), { recursive: true });
  if (!existsSync(secretFile)) writeFileSync(secretFile, randomBytes(32).toString("hex"), { flag: "wx", mode: 0o600 });
  const env = {
    ...process.env, NOS_LOCAL_SUPABASE: "1", PLAYWRIGHT_TEST: "", NOS_AUTH_TEST: "", NOS_LOCAL_VERIFY: "",
    NEXT_PUBLIC_SUPABASE_URL: config.API_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: config.ANON_KEY,
    AUTH_RECOVERY_SECRET: readFileSync(secretFile, "utf8").trim(), APP_ORIGIN: origin,
    NO_PROXY: "localhost,127.0.0.1,::1", no_proxy: "localhost,127.0.0.1,::1",
  };
  console.log(`Aplicativo com Supabase local: ${origin}. E-mails ficam na caixa local do Supabase.`);
  const child = spawn(process.execPath, ["--use-system-ca", "--use-env-proxy", "node_modules/next/dist/bin/next", "dev", "--hostname", "127.0.0.1", "--port", "3001"], {
    env, stdio: "inherit", windowsHide: true,
  });
  child.on("exit", code => { process.exitCode = code ?? 1; });
  child.on("error", () => { console.error("Não foi possível iniciar o aplicativo local."); process.exitCode = 1; });
  for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => child.kill(signal));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { startLocalApp(); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
