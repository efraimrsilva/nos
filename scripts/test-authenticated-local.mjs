// Obtém credenciais somente do ambiente local e as entrega ao processo de teste sem imprimi-las.
import { execFileSync, spawn } from "node:child_process";
import { cpSync, mkdtempSync, symlinkSync, rmSync, unlinkSync, mkdirSync, readdirSync, lstatSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
import path from "node:path";
const cli = process.env.SUPABASE_CLI_PATH;
if (!cli) throw new Error("Defina SUPABASE_CLI_PATH com a CLI do Supabase.");
const config = JSON.parse(execFileSync(cli, ["status", "-o", "json"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }));
if (!/^http:\/\/(?:127\.0\.0\.1|localhost):/.test(config.API_URL)) throw new Error("Somente Supabase local permitido.");
const authContainer = JSON.parse(execFileSync("docker", ["inspect", "supabase_auth_nos"], { encoding: "utf8" }))[0];
const signingKeys = authContainer.Config.Env.find(entry => entry.startsWith("GOTRUE_JWT_KEYS="))?.slice("GOTRUE_JWT_KEYS=".length);
if (!signingKeys) throw new Error("Chaves de assinatura do Auth local não disponíveis.");
// No Windows, compilar no disco local evita a trava de inicialização observada no volume G:.
// A cópia contém somente fontes/configuração/recursos públicos; credenciais ficam no ambiente do processo.
const workspace = mkdtempSync(path.join(tmpdir(), "nos-auth-"));
for (const entry of ["src", "public", "package.json", "package-lock.json", "tsconfig.json", "next.config.ts", "postcss.config.mjs"]) {
  cpSync(path.resolve(entry), path.join(workspace, entry), { recursive: true });
}
function sourceHash(root) {
  const hash = createHash("sha256");
  const visit = relative => {
    for (const entry of readdirSync(path.join(root, relative), { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const file = path.join(relative, entry.name);
      if (entry.isDirectory()) visit(file);
      else hash.update(file).update(readFileSync(path.join(root, file)));
    }
  };
  visit("src"); visit("public");
  return hash.digest("hex");
}
if (sourceHash(process.cwd()) !== sourceHash(workspace)) throw new Error("A cópia não corresponde aos fontes/recursos originais.");
console.log("Cópia de fontes e recursos conferida por SHA-256; backend somente local.");
const modules = path.join(workspace, "node_modules");
mkdirSync(modules);
for (const entry of readdirSync("node_modules", { withFileTypes: true })) {
  const source = path.resolve("node_modules", entry.name), target = path.join(modules, entry.name);
  // O Next resolve seus arquivos a partir da cópia; as demais dependências podem usar junções locais.
  if (entry.name === "next" || !entry.isDirectory()) cpSync(source, target, { recursive: true });
  else symlinkSync(source, target, "junction");
}
const child = spawn(process.execPath, ["node_modules/@playwright/test/cli.js", "test", "--config=playwright.authenticated.config.ts", ...process.argv.slice(2)], {
  env: { ...process.env, NOS_AUTH_WORKSPACE: workspace, PLAYWRIGHT_TEST: "", NEXT_PUBLIC_SUPABASE_URL: config.API_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: config.ANON_KEY, SUPABASE_LOCAL_SERVICE_KEY: config.SERVICE_ROLE_KEY, SUPABASE_LOCAL_JWT_KEYS: signingKeys },
  stdio: "inherit", windowsHide: true,
});
child.on("exit", code => {
  // O destino vem de mkdtemp; validar o pai antes de remover a cópia, nunca o workspace original.
  if (path.dirname(workspace) !== path.resolve(tmpdir()) || !path.basename(workspace).startsWith("nos-auth-")) throw new Error("Destino de limpeza inválido.");
  try {
    for (const entry of readdirSync(modules)) {
      const target = path.join(modules, entry);
      if (lstatSync(target).isSymbolicLink()) unlinkSync(target);
    }
    rmSync(workspace, { recursive: true, force: true, maxRetries: 3 });
  } catch {
    console.error(`A cópia de verificação requer limpeza manual: ${workspace}`);
  }
  process.exitCode = code ?? 1;
});
child.on("error", () => { console.error("Não foi possível iniciar a suíte autenticada local."); process.exitCode = 1; });
