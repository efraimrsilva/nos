// Navegador e ações reais, com transporte Supabase isolado. Não usa contas nem envia e-mails externos.
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium, expect as baseExpect } from "@playwright/test";
import { createServerClient } from "@supabase/ssr";

const expect = baseExpect.configure({ timeout: 30_000 });
const origin = "http://127.0.0.1:3150", api = "http://127.0.0.1:3151";
const gallery = path.resolve("Documentacao_Projeto_Nos/wireframes/comparacoes/2026-10-27-confirmacao-email");
mkdirSync(gallery, { recursive: true });
const sends = [];
const user = email => ({ id: "14000000-0000-4000-8000-000000000001", aud: "authenticated", role: "authenticated", email,
  email_confirmed_at: email.startsWith("confirmed") ? "2026-10-27T12:00:00Z" : null, app_metadata: { provider: "email" }, user_metadata: { name: "Pessoa de teste" }, identities: [], created_at: "2026-10-27T12:00:00Z" });
const service = createServer(async (request, response) => {
  let body = "";
  for await (const chunk of request) body += chunk;
  const input = body ? JSON.parse(body) : {};
  const send = (status, data) => { response.writeHead(status, { "Content-Type": "application/json" }); response.end(JSON.stringify(data)); };
  if (request.url === "/rest/v1/rpc/get_email_confirmation_status") {
    const email = input.account_email;
    return email.startsWith("lookup-failure") ? send(503, { message: "fixture" }) : send(200, email.startsWith("confirmed") ? "confirmed" : email.startsWith("missing") ? "missing" : "pending");
  }
  if (request.url?.startsWith("/auth/v1/resend")) {
    sends.push(input.email);
    return input.email.startsWith("smtp-failure") ? send(500, { msg: "fixture" }) : send(200, {});
  }
  if (request.url === "/auth/v1/user") {
    const jwt = String(request.headers.authorization).replace(/^Bearer /, "");
    const payload = JSON.parse(Buffer.from(jwt.split(".")[1], "base64url").toString());
    return send(200, user(payload.email));
  }
  if (request.url?.startsWith("/auth/v1/token")) {
    const now = Math.floor(Date.now() / 1000);
    const jwt = [Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url"), Buffer.from(JSON.stringify({ sub: user(input.email).id, email: input.email, exp: now + 3600, iat: now, role: "authenticated", aud: "authenticated" })).toString("base64url"), "fixture"].join(".");
    return send(200, { access_token: jwt, refresh_token: "fixture-refresh", token_type: "bearer", expires_in: 3600, user: user(input.email) });
  }
  send(404, { message: "fixture endpoint missing" });
});
await new Promise(resolve => service.listen(3151, "127.0.0.1", resolve));
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "dev", "--hostname", "127.0.0.1", "--port", "3150"], {
  env: { ...process.env, NOS_LOCAL_VERIFY: "1", PLAYWRIGHT_TEST: "", NEXT_PUBLIC_SUPABASE_URL: api, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "fixture-publishable-key", APP_ORIGIN: origin },
  stdio: ["ignore", "pipe", "pipe"], windowsHide: true,
});
let logs = "", browser;
for (const stream of [server.stdout, server.stderr]) stream.on("data", chunk => { logs = (logs + chunk).slice(-5000); });
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
try {
  let ready = false;
  for (let attempt = 0; attempt < 90; attempt++) {
    if (server.exitCode !== null) throw new Error(logs);
    try { if ((await fetch(`${origin}/conta`)).ok) { ready = true; break; } } catch {}
    await pause(500);
  }
  assert.ok(ready, logs);
  browser = await chromium.launch(process.env.PLAYWRIGHT_CHROME_PATH ? { executablePath: process.env.PLAYWRIGHT_CHROME_PATH } : {});
  for (const [name, viewport] of [["desktop", { width: 1440, height: 1000 }], ["mobile", { width: 390, height: 844 }]]) {
    for (const [scenario, email, expected, logged] of [
      ["publico-confirmado", "confirmed@example.test", "Este e-mail já está confirmado", false],
      ["publico-enviado", "pending@example.test", "Enviamos a confirmação", false],
      ["publico-inexistente", "missing@example.test", "Não encontramos uma conta", false],
      ["publico-falha-envio", "smtp-failure@example.test", "Não foi possível enviar", false],
      ["publico-falha-consulta", "lookup-failure@example.test", "Não foi possível verificar", false],
      ["logado-confirmado", "confirmed@example.test", "Seu e-mail já está confirmado", true],
      ["logado-enviado", "pending@example.test", "Enviamos a confirmação", true],
    ]) {
      const context = await browser.newContext({ viewport });
      if (logged) {
        const client = createServerClient(api, "fixture-publishable-key", { cookies: { getAll: () => [], setAll: async entries => {
          await context.addCookies(entries.map(({ name, value }) => ({ name, value, url: origin, httpOnly: true, sameSite: "Lax" })));
        } } });
        assert.equal((await client.auth.signInWithPassword({ email, password: "Fixture1!" })).error, null);
      }
      const page = await context.newPage(), errors = [];
      page.on("pageerror", error => errors.push(error.message));
      const before = sends.length;
      await page.goto(`${origin}/conta/confirmar-email?next=%2Fcomecar%2Fconvite`);
      const dialog = page.getByRole("dialog", { name: "Confirmar e-mail", exact: true });
      await expect(dialog).toBeVisible();
      if (logged && email.startsWith("confirmed")) {
        await expect(dialog.getByLabel("E-mail da conta")).toHaveCount(0);
        await expect(dialog.getByRole("button", { name: "Reenviar confirmação" })).toHaveCount(0);
      } else {
        const field = dialog.getByLabel("E-mail da conta");
        if (logged) await expect(field).toHaveValue(email);
        else await field.fill(email);
        await dialog.getByRole("button", { name: "Reenviar confirmação" }).click();
      }
      await expect(dialog.getByRole(scenario.includes("falha") || scenario.includes("inexistente") ? "alert" : "status").filter({ hasText: expected })).toBeVisible();
      if (!(logged && email.startsWith("confirmed"))) await expect(dialog.getByLabel("E-mail da conta")).toHaveValue(email);
      assert.equal(sends.length - before, scenario.endsWith("enviado") || scenario.endsWith("falha-envio") ? 1 : 0);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      assert.deepEqual(errors, []);
      await page.screenshot({ path: path.join(gallery, `app-${scenario}-${name}.png`), animations: "disabled" });
      await dialog.getByRole("button", { name: "Fechar Confirmar e-mail" }).click();
      await expect(dialog).not.toBeVisible();
      await expect(page).toHaveURL(/next=%2Fcomecar%2Fconvite$/);
      await context.close();
    }
    const page = await browser.newPage({ viewport });
    await page.goto(pathToFileURL(path.resolve("Documentacao_Projeto_Nos/wireframes/atlas/index.html")).href);
    await page.evaluate(() => openScreen(1));
    await page.locator("#screen-preview [data-live-access=confirmation]").click();
    const dialog = page.locator("#atlas-live-dialog");
    await dialog.locator('[name="access-email"]').fill("pending@example.test");
    await dialog.getByRole("button", { name: "Reenviar confirmação" }).click();
    await expect(dialog).toContainText("Enviamos a confirmação");
    await page.screenshot({ path: path.join(gallery, `atlas-pendente-${name}.png`), animations: "disabled" });
    await page.keyboard.press("Escape");
    await page.evaluate(() => openScreen(69));
    await page.locator("#screen-preview [data-live-access=confirmation]").click();
    await expect(dialog).toContainText("Seu e-mail já está confirmado");
    await page.screenshot({ path: path.join(gallery, `atlas-confirmado-${name}.png`), animations: "disabled" });
    await page.close();
  }
  console.log("Confirmação: 14 cenários do aplicativo e 4 do Atlas aprovados em desktop/mobile, com transporte isolado e sem e-mails externos.");
} catch (error) {
  console.error(logs);
  throw error;
} finally {
  await browser?.close();
  server.kill();
  service.closeAllConnections();
  await new Promise(resolve => service.close(resolve));
}
