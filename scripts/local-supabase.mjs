import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";

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
