// Usa a mesma credencial da CLI somente em memória e apenas na API oficial do Supabase.
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { isDeepStrictEqual } from "node:util";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { Entry, findCredentials } from "@napi-rs/keyring";
import { messages, managementPayload, renderEmail } from "./generate-auth-emails.mjs";

const project = "pyvohqgcwkcfzbtkmbvx";
const env = { ...process.env, NODE_USE_SYSTEM_CA: "1", NODE_USE_ENV_PROXY: "1" };
const args = process.argv.slice(2);
if (args.some(arg => !["--check", "--apply", "--login"].includes(arg)) || args.length > 1) throw new Error("Use --check, --apply ou --login.");
// Usa a configuração local fixa; os certificados e o proxy são lidos ao iniciar o Node.
if (!process.execArgv.includes("--use-system-ca") || !process.execArgv.includes("--use-env-proxy")) {
  const localEnv = fileURLToPath(new URL("../.env.local", import.meta.url));
  const child = spawnSync(process.execPath, ["--use-system-ca", "--use-env-proxy", `--env-file-if-exists=${localEnv}`, fileURLToPath(import.meta.url), ...args], { env, stdio: "inherit", windowsHide: true });
  process.exit(child.status ?? 1);
}
function findCLI() {
  if (process.env.SUPABASE_CLI_PATH) return process.env.SUPABASE_CLI_PATH;
  const cache = process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, "npm-cache/_npx");
  if (process.platform === "win32" && cache && existsSync(cache)) for (const entry of readdirSync(cache)) {
    const candidate = path.join(cache, entry, "node_modules/@supabase/cli-windows-x64/bin/supabase.exe");
    if (existsSync(candidate) && spawnSync(candidate, ["--version"], { encoding: "utf8", windowsHide: true }).stdout?.trim() === "2.118.0") return candidate;
  }
  return "supabase";
}
if (args.includes("--login")) {
  const cli = findCLI();
  if (spawnSync(cli, ["--version"], { encoding: "utf8", env, windowsHide: true }).stdout?.trim() !== "2.118.0") throw new Error("Prepare a CLI com npx supabase@2.118.0 --help ou defina SUPABASE_CLI_PATH.");
  const login = spawnSync(cli, ["login", "--agent", "no", "--output-format", "text"], { env, stdio: "inherit", windowsHide: true });
  process.exit(login.status ?? 1);
}
function accessToken() {
  if (process.env.SUPABASE_ACCESS_TOKEN) return process.env.SUPABASE_ACCESS_TOKEN;
  // Exatamente as duas entradas documentadas no código oficial da CLI; não enumera credenciais.
  for (const account of ["access-token", "supabase"]) {
    try {
      const value = new Entry("Supabase CLI", account).getPassword();
      if (value) return value.startsWith("go-keyring-base64:") ? Buffer.from(value.slice("go-keyring-base64:".length), "base64").toString("utf8") : value;
    } catch { /* A CLI usa arquivo como alternativa quando não há chaveiro. */ }
    if (process.platform === "win32") {
      try {
        // A CLI grava no alvo compatível com Go; leitura direcionada, sem criar credencial.
        const value = findCredentials("Supabase CLI", `Supabase CLI:${account}`).find(entry => entry.account === account)?.password;
        if (value) {
          if (value.startsWith("sbp_")) return value;
          if (value.startsWith("go-keyring-base64:")) return Buffer.from(value.slice("go-keyring-base64:".length), "base64").toString("utf8");
          const bytes = [];
          for (let index = 0; index < value.length; index++) {
            const code = value.charCodeAt(index);
            bytes.push(code & 0xff);
            if ((code >> 8) & 0xff) bytes.push((code >> 8) & 0xff);
          }
          const unpacked = Buffer.from(bytes).toString("utf8");
          if (unpacked.startsWith("sbp_")) return unpacked;
        }
      } catch { /* Alternativa documentada da CLI para o chaveiro do Windows. */ }
    }
  }
  const fallback = path.join(process.env.SUPABASE_HOME || path.join(os.homedir(), ".supabase"), "access-token");
  if (existsSync(fallback)) return readFileSync(fallback, "utf8").trim();
  throw new Error("A CLI ainda não está autenticada. Execute node scripts/configure-auth-emails.mjs --login. Não envie senhas ou tokens pelo chat.");
}
const token = accessToken();
const endpoint = `https://api.supabase.com/v1/projects/${project}/config/auth`;
async function request(method, body) {
  let response;
  try {
    response = await fetch(endpoint, { method, headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: body && JSON.stringify(body), signal: AbortSignal.timeout(30_000) });
  } catch { throw new Error("Não foi possível acessar a API oficial de configuração. Nenhuma conclusão de publicação foi certificada."); }
  if (!response.ok) throw new Error(`Configuração de e-mails recusada pelo Supabase: HTTP ${response.status}. Resposta administrativa não impressa.`);
  try { return await response.json(); } catch { throw new Error("Resposta inesperada da API de configuração; conteúdo administrativo não impresso."); }
}
const payload = managementPayload();
const allowed = new Set(messages.flatMap(message => {
  const key = message.id + (message.category === "notification" ? "_notification" : "");
  return [`mailer_subjects_${key}`, `mailer_templates_${key}_content`];
}));
if (Object.keys(payload).length !== 26 || Object.keys(payload).some(key => !allowed.has(key))) throw new Error("O payload contém campos fora dos 13 assuntos e 13 conteúdos. Operação bloqueada.");
const before = await request("GET");
const differences = () => Object.keys(payload).filter(key => String(before[key] ?? "").replaceAll("\r\n", "\n").trim() !== payload[key].trim());
// Uma mudança visual não pode substituir silenciosamente um callback personalizado já existente.
for (const id of ["confirmation", "recovery"]) {
  const html = String(before[`mailer_templates_${id}_content`] ?? "");
  if (html.includes(".TokenHash") && !html.includes(".ConfirmationURL")) throw new Error(`O modelo ${id} usa um link personalizado. Preserve esse link no catálogo antes de publicar.`);
}
console.log(`Projeto nos-dev: 13 modelos, ${differences().length} diferenças de assunto/HTML. Nenhum campo SMTP, URL, método de login ou ativação entra no payload.`);
if (!args.includes("--apply")) {
  console.log("Comparação somente leitura concluída. Use --apply para publicar.");
} else {
  await request("PATCH", payload);
  const after = await request("GET");
  const mismatches = Object.keys(payload).filter(key => String(after[key] ?? "").replaceAll("\r\n", "\n").trim() !== payload[key].trim());
  if (mismatches.length) throw new Error(`A conferência encontrou ${mismatches.length} campos de modelo divergentes; publicação não certificada.`);
  const protectedFields = Object.keys(before).filter(key => !allowed.has(key) && key !== "updated_at");
  const changed = protectedFields.filter(key => !isDeepStrictEqual(before[key], after[key]));
  if (changed.length) throw new Error(`A comparação detectou atualização nos campos: ${changed.join(", ")}. Revisar antes de considerar concluído; nenhum valor administrativo foi impresso.`);
  console.log("Publicação conferida por leitura remota: 13 assuntos e 13 HTMLs iguais aos arquivos locais; configuração restante preservada.");
  console.log(JSON.stringify({ project, models: messages.length, htmlsVerified: messages.filter(message => String(after[`mailer_templates_${message.id}${message.category === "notification" ? "_notification" : ""}_content`] ?? "").trim() === renderEmail(message).trim()).length, protectedFieldsUnchanged: protectedFields.length, securityNotifications: Object.fromEntries(messages.filter(message => message.category === "notification").map(message => [message.id, Boolean(after[`mailer_notifications_${message.id}_enabled`])])) }));
}
