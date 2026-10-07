// Testa e-mails e sessão reais somente no Supabase local, sem publicar nem enviar e-mail externo.
import { execFileSync, spawn } from "node:child_process";
import { randomBytes, randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { chromium, expect } from "@playwright/test";

const cli = process.env.SUPABASE_CLI_PATH;
if (!cli) throw new Error("Defina SUPABASE_CLI_PATH.");
const config = JSON.parse(execFileSync(cli, ["status", "-o", "json"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }));
if (!/^http:\/\/(127\.0\.0\.1|localhost):/.test(config.API_URL) || !/^http:\/\/(127\.0\.0\.1|localhost):/.test(config.INBUCKET_URL)) throw new Error("Somente backend/e-mail local permitido.");
const admin = createClient(config.API_URL, config.SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const checked = result => { if (result.error) throw new Error(result.error.message); return result.data; };
const origin = "http://127.0.0.1:3200";
const mailbox = `account-${randomUUID()}`, email = `${mailbox}@example.test`;
const originalPassword = `Aa1!${randomUUID()}`, newPassword = `Bb2!${randomUUID()}`;
let userId, browser;
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "dev", "--hostname", "127.0.0.1", "--port", "3200"], {
  env: { ...process.env, NOS_LOCAL_VERIFY: "1", NEXT_PUBLIC_SUPABASE_URL: config.API_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: config.ANON_KEY, APP_ORIGIN: origin, AUTH_RECOVERY_SECRET: randomBytes(32).toString("hex") },
  stdio: ["ignore", "pipe", "pipe"], windowsHide: true,
});
let serverLog = "";
for (const stream of [server.stdout, server.stderr]) stream.on("data", chunk => { serverLog = (serverLog + chunk).slice(-2000); });
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const mailboxMessages = async () => {
  const result = await (await fetch(`${config.INBUCKET_URL}/api/v1/search?query=${encodeURIComponent(`to:${email}`)}`)).json();
  return result.messages ?? [];
};
const mailLink = async (minimumCount = 1) => {
  for (let i = 0; i < 30; i++) {
    const list = await mailboxMessages();
    if (list.length >= minimumCount) {
      const message = await (await fetch(`${config.INBUCKET_URL}/api/v1/message/${list[0].ID}`)).json();
      const html = message.HTML;
      const link = html.match(/href="([^"]*\/auth\/v1\/verify[^\"]*)"/)?.[1]?.replaceAll("&amp;", "&");
      if (link) return link;
    }
    await wait(500);
  }
  throw new Error("E-mail local esperado não chegou.");
};
try {
  for (let i = 0; i < 90; i++) {
    if (server.exitCode !== null) throw new Error("Servidor de validação encerrou.");
    try { if ((await fetch(`${origin}/conta`, { signal: AbortSignal.timeout(3000) })).ok) break; } catch {}
    if (i === 89) throw new Error("Servidor de validação não iniciou.");
    await wait(1000);
  }
  browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  page.setDefaultTimeout(15000); page.setDefaultNavigationTimeout(90000);
  await page.goto(`${origin}/conta?next=%2Fcomecar%2Fconvite`);
  await page.getByLabel("Nome", { exact: true }).fill("Conta temporária");
  await page.getByLabel("E-mail", { exact: true }).fill(email);
  await page.getByLabel("Senha", { exact: true }).fill(originalPassword);
  await page.locator("form").getByRole("button", { name: "Criar conta" }).click();
  await expect(page).toHaveURL(/\/conta\/confirmar-email\?next=/);
  userId = checked(await admin.auth.admin.listUsers()).users.find(user => user.email === email)?.id;
  const firstConfirmation = await mailLink();
  await wait(1200);
  await page.getByLabel("E-mail da conta").fill(email);
  await page.getByRole("button", { name: "Reenviar confirmação" }).click();
  await expect(page.getByRole("main").getByRole("status")).toContainText("Se este e-mail precisar");
  await expect(page.getByRole("button", { name: "Reenviar confirmação" })).toBeDisabled();
  const confirmation = await mailLink(2);
  await page.goto(confirmation);
  await expect(page).toHaveURL(`${origin}/comecar/convite`);
  await expect(page.getByRole("button", { name: "Aceitar convite" })).toHaveCount(0);
  console.log("Cadastro, reenvio, confirmação e retorno de convite: aprovados.");
  await page.goto(`${origin}/conta/nova-senha`);
  await expect(page.getByLabel("Nova senha", { exact: true })).toHaveCount(0);
  await page.goto(`${origin}/conta`);
  await page.getByRole("button", { name: "Sair da conta" }).click();

  // Uma segunda sessão real deve perder a capacidade de renovar após redefinição.
  const other = createClient(config.API_URL, config.ANON_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
  const oldSession = checked(await other.auth.signInWithPassword({ email, password: originalPassword })).session;
  await page.goto(`${origin}/conta/recuperar?next=%2Fcomecar%2Fconvite`);
  await page.getByLabel("E-mail da conta").fill(email);
  await page.getByRole("button", { name: "Solicitar link" }).click();
  await expect(page.getByRole("main").getByRole("status")).toContainText("Se houver uma conta");
  await expect(page.getByRole("button", { name: "Solicitar link" })).toBeDisabled();
  const recovery = await mailLink(3);
  await page.goto(recovery);
  await expect(page).toHaveURL(/\/conta\/nova-senha\?next=/);
  await expect(page.getByLabel("Nova senha", { exact: true })).toBeVisible();
  expect(page.url()).not.toMatch(/code=|token_hash=/);
  mkdirSync("artifacts", { recursive: true });
  await page.addStyleTag({ content: "nextjs-portal{display:none}" });
  await page.screenshot({ path: "artifacts/account-new-password-mobile.png", fullPage: true });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({ path: "artifacts/account-new-password-desktop.png", fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByLabel("Nova senha", { exact: true }).fill("curta");
  await page.getByLabel("Confirmar nova senha").fill("curta");
  await page.getByRole("button", { name: "Salvar senha" }).click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText("8 caracteres");
  await page.getByLabel("Nova senha", { exact: true }).fill(newPassword);
  await page.getByLabel("Confirmar nova senha").fill(`${newPassword}x`);
  await page.getByRole("button", { name: "Salvar senha" }).click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText("iguais");
  await page.getByLabel("Nova senha", { exact: true }).fill(newPassword);
  await page.getByLabel("Confirmar nova senha").fill(newPassword);
  await page.getByRole("button", { name: "Salvar senha" }).click();
  await expect(page).toHaveURL(/\/conta\?resultado=senha&next=/);
  await expect(page.getByRole("main").getByRole("status")).toContainText("Senha atualizada");
  expect((await other.auth.refreshSession({ refresh_token: oldSession.refresh_token })).error).toBeTruthy();
  expect((await other.auth.signInWithPassword({ email, password: originalPassword })).error).toBeTruthy();
  checked(await other.auth.signInWithPassword({ email, password: newPassword }));
  await page.getByLabel("E-mail", { exact: true }).fill(email);
  await page.getByLabel("Senha", { exact: true }).fill(newPassword);
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await expect(page).toHaveURL(`${origin}/comecar/convite`);
  await page.goto(recovery);
  await expect(page.getByLabel("Nova senha", { exact: true })).toHaveCount(0);
  console.log("Recuperação PKCE, validação de senha, revogação global, senha antiga rejeitada, senha nova aceita e link reutilizado: aprovados.");
  // Link direto personalizado funciona em outro navegador; confirmação não serve para recuperação.
  const direct = checked(await admin.auth.admin.generateLink({ type: "recovery", email }));
  const fresh = await browser.newContext(); const freshPage = await fresh.newPage();
  await freshPage.goto(`${origin}/auth/recovery?token_hash=${direct.properties.hashed_token}&type=recovery`);
  await expect(freshPage.getByLabel("Nova senha", { exact: true })).toBeVisible();
  const proof = (await fresh.cookies()).find(cookie => cookie.name === "nos-recovery");
  expect(proof.httpOnly).toBe(true); expect(proof.sameSite).toBe("Lax");
  await fresh.addCookies([{ ...proof, value: `${proof.value}x` }]);
  await freshPage.goto(`${origin}/conta/nova-senha`);
  await expect(freshPage.getByLabel("Nova senha", { exact: true })).toHaveCount(0);
  const emptyContext = await browser.newContext(); const emptyPage = await emptyContext.newPage();
  await emptyPage.goto(`${origin}/conta/recuperar`);
  await emptyPage.getByLabel("E-mail da conta").fill(`missing-${randomUUID()}@example.test`);
  await emptyPage.getByRole("button", { name: "Solicitar link" }).click();
  await expect(emptyPage.getByRole("main").getByRole("status")).toContainText("Se houver uma conta");
  for (const [slug, route] of [["account", "/conta"], ["confirmation", "/conta/confirmar-email"], ["recovery", "/conta/recuperar"], ["invalid-link", "/conta/nova-senha"]]) {
    await emptyPage.goto(`${origin}${route}`);
    await emptyPage.setViewportSize({ width: 390, height: 844 });
    await emptyPage.screenshot({ path: `artifacts/${slug}-mobile.png`, fullPage: true });
    expect(await emptyPage.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await emptyPage.setViewportSize({ width: 1440, height: 1000 });
    await emptyPage.screenshot({ path: `artifacts/${slug}-desktop.png`, fullPage: true });
  }
  console.log("Token direto, prova adulterada rejeitada, resposta neutra para conta inexistente e capturas mobile/web: aprovados.");
} finally {
  if (browser) await browser.close();
  if (!userId) userId = (await admin.auth.admin.listUsers()).data?.users.find(user => user.email === email)?.id;
  if (userId) checked(await admin.auth.admin.deleteUser(userId));
  const messages = await mailboxMessages();
  if (messages.length) await fetch(`${config.INBUCKET_URL}/api/v1/messages`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ IDs: messages.map(message => message.ID) }) });
  if (server.pid) { try { execFileSync("taskkill", ["/pid", String(server.pid), "/T", "/F"], { stdio: "ignore" }); } catch {} }
  console.log("Contas/e-mails temporários removidos; servidor de validação encerrado.");
}
