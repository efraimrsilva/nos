import { createPrivateKey, sign, randomUUID } from "node:crypto";
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import type { BrowserContext } from "@playwright/test";
import { test, expect, localSql } from "./fixtures";

async function expireLocalSession(context: BrowserContext, invalidateRefresh = false) {
  const cookies = (await context.cookies()).filter(cookie => /sb-.*-auth-token(?:\.\d+)?$/.test(cookie.name)).sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
  const raw = cookies.map(cookie => cookie.value).join("");
  const session = JSON.parse(Buffer.from(raw.slice(7), "base64url").toString());
  const [header, payload] = session.access_token.split(".");
  const claims = JSON.parse(Buffer.from(payload, "base64url").toString());
  // Somente a chave privada do Auth local antecipa a expiração desta fixture, sem mudar o servidor.
  const tokenHeader = JSON.parse(Buffer.from(header, "base64url").toString());
  expect(tokenHeader.alg).toBe("ES256");
  const key = JSON.parse(process.env.SUPABASE_LOCAL_JWT_KEYS!).find((item: { kid: string }) => item.kid === tokenHeader.kid);
  if (!key?.d) throw new Error("Chave privada local da fixture não disponível.");
  claims.exp = Math.floor(Date.now() / 1000) - 60;
  const encoded = `${header}.${Buffer.from(JSON.stringify(claims)).toString("base64url")}`;
  session.access_token = `${encoded}.${sign("sha256", Buffer.from(encoded), { key: createPrivateKey({ key, format: "jwk" }), dsaEncoding: "ieee-p1363" }).toString("base64url")}`;
  session.expires_at = claims.exp;
  if (invalidateRefresh) session.refresh_token = "invalid-local-refresh-token";
  await context.clearCookies();
  await context.addCookies([{ name: cookies[0].name.replace(/\.\d+$/, ""), value: `base64-${Buffer.from(JSON.stringify(session)).toString("base64url")}`, url: "http://127.0.0.1:3200", httpOnly: true, sameSite: "Lax" }]);
}

test("login sem destino e raiz autenticada abrem Seus Núcleos", async ({ page, context, account }) => {
  await context.clearCookies();
  await page.goto("/conta?modo=login");
  await page.getByLabel("E-mail", { exact: true }).fill(account.email);
  await page.getByLabel("Senha", { exact: true }).fill(account.password);
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await expect(page).toHaveURL(/\/nucleos$/);
  await expect(page.getByRole("status")).toContainText("ainda não participa");
  await page.goto("/");
  await expect(page).toHaveURL(/\/nucleos$/);
});

test("listagem usa associações reais e não revela Núcleos alheios", async ({ page, account }) => {
  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_LOCAL_SERVICE_KEY!, { auth: { persistSession: false } });
  const other = await admin.auth.admin.createUser({ email: `other-${account.id}@example.test`, password: account.password, email_confirm: true });
  if (other.error) throw other.error;
  try {
    const ownId = randomUUID(), externalId = randomUUID();
    localSql(`insert into public.nuclei(id,name,type,purpose,created_by) values('${ownId}','Jardim de teste','familia','Cuidar com respeito.','${account.id}'),('${externalId}','Jardim privado de outra pessoa','amigos','Não deve aparecer.','${other.data.user.id}'); insert into public.nucleus_members(nucleus_id,user_id,role) values('${ownId}','${account.id}','admin');`);
    await page.goto("/nucleos");
    await expect(page.getByRole("heading", { name: "Jardim de teste" })).toBeVisible();
    await expect(page.getByText("Jardim privado de outra pessoa")).toHaveCount(0);
    await page.screenshot({ path: `Documentacao_Projeto_Nos/wireframes/comparacoes/v0.13.0-2026-10-07-sessao-navegacao-tela_01-tela_06-tela_12-tela_13/app-12-${test.info().project.name}.png`, fullPage: true });
    await page.getByRole("link", { name: /Jardim de teste/ }).click();
    await expect(page).toHaveURL(new RegExp(`/nucleos/${ownId}$`));
    await expect(page.getByRole("heading", { name: "Jardim de teste" })).toBeVisible();
    await page.screenshot({ path: `Documentacao_Projeto_Nos/wireframes/comparacoes/v0.13.0-2026-10-07-sessao-navegacao-tela_01-tela_06-tela_12-tela_13/depois-inicio-${test.info().project.name}.png`, fullPage: true });
    await page.getByRole("link", { name: "Voltar a Seus Núcleos" }).click();
    await expect(page).toHaveURL(/\/nucleos$/);
    await page.goto("/conta");
    await expect(page.getByRole("link", { name: "Seus Núcleos", exact: true })).toBeVisible();
    await page.screenshot({ path: `Documentacao_Projeto_Nos/wireframes/comparacoes/v0.13.0-2026-10-07-sessao-navegacao-tela_01-tela_06-tela_12-tela_13/depois-conta-autenticada-${test.info().project.name}.png`, fullPage: true });
    await page.goto(`/nucleos/${externalId}`);
    await expect(page.getByRole("heading", { name: "Jardim privado de outra pessoa" })).toHaveCount(0);
  } finally {
    localSql(`delete from public.nuclei where created_by='${other.data.user.id}';`);
    await admin.auth.admin.deleteUser(other.data.user.id);
  }
});

test("atlas e aplicativo preservam composição e caminhos protegidos", async ({ page, context }) => {
  test.setTimeout(180_000);
  const output = execFileSync(process.execPath, ["Documentacao_Projeto_Nos/wireframes/tools/verify-fidelity.mjs"], {
    env: { ...process.env, NOS_VERIFY_ORIGIN: "http://127.0.0.1:3200", NOS_VERIFY_COOKIES: JSON.stringify(await context.cookies()) }, encoding: "utf8",
  });
  expect(JSON.parse(output.trim()).errors).toEqual([]);
  await page.goto("/nucleos");
  await expect(page.getByRole("status")).toContainText("ainda não participa");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const dir = "Documentacao_Projeto_Nos/wireframes/comparacoes/v0.13.0-2026-10-07-sessao-navegacao-tela_01-tela_06-tela_12-tela_13";
  await page.screenshot({ path: `${dir}/app-12-vazio-${test.info().project.name}.png`, fullPage: true });
  await page.goto("/comecar");
  await page.screenshot({ path: `${dir}/depois-comecar-${test.info().project.name}.png`, fullPage: true });
  await context.clearCookies();
  await page.goto("/comecar");
  await expect(page.getByRole("heading", { name: "Sua conta no Nós" })).toBeVisible();
  await page.screenshot({ path: `${dir}/depois-bloqueio-${test.info().project.name}.png`, fullPage: true });
  await page.goto(pathToFileURL(path.resolve("Documentacao_Projeto_Nos/wireframes/atlas/index.html")).href);
  await page.locator('[data-open="12"]').first().click();
  await page.screenshot({ path: `${dir}/depois-atlas-12-${test.info().project.name}.png`, fullPage: true });
});

test("token expirado renova sessão válida e não exige novo login", async ({ page, context }) => {
  await expireLocalSession(context);
  const response = await page.goto("/nucleos");
  await expect(page.getByRole("heading", { name: "Seus Núcleos", exact: true })).toBeVisible();
  expect(response?.headers()["cache-control"]).toContain("no-store");
  await page.reload();
  await expect(page).toHaveURL(/\/nucleos$/);
});

test("token expirado sem renovação válida bloqueia e permite retomar após login", async ({ page, context, account }) => {
  await expireLocalSession(context, true);
  await page.goto("/comecar/proposito?tipo=familia");
  await expect(page.getByRole("heading", { name: "Sua conta no Nós" })).toBeVisible();
  await expect(page.locator('input[name="next"]')).toHaveValue("/comecar/proposito?tipo=familia");
  await page.getByLabel("E-mail", { exact: true }).fill(account.email);
  await page.getByLabel("Senha", { exact: true }).fill(account.password);
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await expect(page).toHaveURL(/\/comecar\/proposito\?tipo=familia$/);
  await expect(page.getByRole("heading", { name: "Qual o propósito de vocês?" })).toBeVisible();
});

test("cookie adulterado não libera páginas privadas", async ({ page, context }) => {
  const name = (await context.cookies()).find(cookie => /sb-.*-auth-token/.test(cookie.name))!.name;
  await context.clearCookies();
  await context.addCookies([{ name, value: "base64-adulterado", url: "http://127.0.0.1:3200" }]);
  await page.goto("/nucleos");
  await expect(page.getByRole("heading", { name: "Sua conta no Nós" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Seus Núcleos", exact: true })).toHaveCount(0);
});

test("sessão expirada durante formulário redireciona no envio sem criar Núcleo", async ({ page, context, account }) => {
  await page.goto("/comecar/proposito?tipo=familia");
  await page.getByLabel("Nome do Núcleo").fill("Não deve ser criado");
  await page.getByLabel("Nosso propósito").fill("Formulário aberto antes da expiração.");
  await page.getByRole("button", { name: "Continuar", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Confira seu rascunho" })).toBeVisible();
  await expireLocalSession(context, true);
  await page.getByRole("button", { name: "Criar Núcleo", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Sua conta no Nós" })).toBeVisible();
  await expect(page.locator('input[name="next"]')).toHaveValue("/comecar/proposito?tipo=familia");
  expect(localSql(`select count(*) from public.nuclei where created_by='${account.id}';`).trim()).toBe("0");
});

test("sessão estruturada com assinatura adulterada pede login", async ({ page, context }) => {
  const cookies = (await context.cookies()).filter(cookie => /sb-.*-auth-token(?:\.\d+)?$/.test(cookie.name)).sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
  const session = JSON.parse(Buffer.from(cookies.map(cookie => cookie.value).join("").slice(7), "base64url").toString());
  const parts = session.access_token.split(".");
  parts[2] = parts[2][0] === "A" ? `B${parts[2].slice(1)}` : `A${parts[2].slice(1)}`;
  session.access_token = parts.join(".");
  await context.clearCookies();
  await context.addCookies([{ name: cookies[0].name.replace(/\.\d+$/, ""), value: `base64-${Buffer.from(JSON.stringify(session)).toString("base64url")}`, url: "http://127.0.0.1:3200" }]);
  await page.goto("/nucleos");
  await expect(page.getByRole("heading", { name: "Sua conta no Nós" })).toBeVisible();
});

test("sessão revogada não renova token expirado", async ({ page, context }) => {
  const cookies = (await context.cookies()).filter(cookie => /sb-.*-auth-token(?:\.\d+)?$/.test(cookie.name)).sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
  const session = JSON.parse(Buffer.from(cookies.map(cookie => cookie.value).join("").slice(7), "base64url").toString());
  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_LOCAL_SERVICE_KEY!, { auth: { persistSession: false } });
  const revoked = await admin.auth.admin.signOut(session.access_token, "global");
  if (revoked.error) throw revoked.error;
  await expireLocalSession(context);
  await page.goto("/nucleos");
  await expect(page.getByRole("heading", { name: "Sua conta no Nós" })).toBeVisible();
});

test("paginação da lista permite consultar todos os Núcleos próprios", async ({ page, account }) => {
  const ids = Array.from({ length: 21 }, () => randomUUID());
  localSql(`insert into public.nuclei(id,name,type,purpose,created_by) values ${ids.map((id,index)=>`('${id}','Jardim ${String(index).padStart(2,"0")}','familia','Lista temporária local.','${account.id}')`).join(",")}; insert into public.nucleus_members(nucleus_id,user_id,role) values ${ids.map(id=>`('${id}','${account.id}','admin')`).join(",")};`);
  await page.goto("/nucleos");
  await expect(page.getByRole("navigation", { name: "Seus Núcleos", exact: true }).getByRole("link")).toHaveCount(20);
  await page.getByRole("link", { name: "Próxima página" }).click();
  await expect(page.getByRole("heading", { name: "Jardim 20" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Seus Núcleos", exact: true }).getByRole("link")).toHaveCount(1);
  await page.getByRole("link", { name: "Página anterior" }).click();
  await expect(page.getByRole("heading", { name: "Jardim 00" })).toBeVisible();
});
