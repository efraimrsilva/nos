import { randomUUID } from "node:crypto";
import { spawn } from "node:child_process";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { test, expect, localSql } from "./fixtures";

const gallery = "Documentacao_Projeto_Nos/wireframes/comparacoes/v0.15.0-2026-10-13-mvp-02-tela_09-tela_13-tela_58-tela_59";

async function waitForDatabase(query: string) {
  const deadline = Date.now() + 5_000;
  while (Date.now() < deadline) {
    if (localSql(query).trim() === "t") return;
    await new Promise(resolve => setTimeout(resolve, 30));
  }
  throw new Error("Não foi possível comprovar o estado concorrente no Postgres.");
}

// Outra conexão comprova o bloqueio antes da RPC: stdout do psql -c pode ser buffered.
async function holdInvitationLock(actor: string, query: string) {
  const application = `nos-lock-${randomUUID()}`;
  const child = spawn("docker", ["exec", "supabase_db_nos", "psql", "-U", "postgres", "-d", "postgres", "-v", "ON_ERROR_STOP=1", "-At", "-c", `set application_name='${application}'; begin; set local role authenticated; select set_config('request.jwt.claim.sub','${actor}',true); ${query}; select pg_sleep(3); commit;`], { windowsHide: true });
  const done = new Promise<void>((resolve, reject) => {
    child.on("error", reject);
    child.on("exit", code => code === 0 ? resolve() : reject(new Error("Transação concorrente local falhou.")));
  });
  await waitForDatabase(`select exists(select 1 from pg_stat_activity where application_name='${application}' and wait_event='PgSleep' and xact_start is not null);`);
  return { done };
}

test("criação, convite, aceite e revogação preservam vínculo e isolamento", async ({ page, account, browser }, testInfo) => {
  await page.goto("/nucleos");
  await page.getByRole("link", { name: /^Criar um núcleo/ }).click();
  await page.getByRole("radio", { name: "Amigos", exact: true }).check();
  await page.getByRole("button", { name: "Continuar" }).click();
  await page.getByRole("textbox", { name: "Nome do Núcleo" }).fill("Jardim compartilhado");
  await page.getByRole("textbox", { name: "Nosso propósito" }).fill("Cultivar amizade e presença.");
  await page.getByRole("button", { name: "Continuar" }).click();
  expect(localSql(`select count(*) from public.nuclei where created_by='${account.id}';`).trim()).toBe("0");
  await page.getByRole("button", { name: "Criar Núcleo", exact: true }).click();
  await expect(page).toHaveURL(/convite-inicial\/[0-9a-f-]+$/);
  const nucleusId = new URL(page.url()).pathname.split("/").at(-1)!;
  await page.getByRole("button", { name: "Gerar convite", exact: true }).click();
  await expect(page.getByRole("button", { name: "Compartilhar código" })).toBeVisible();
  const code = localSql(`select code from public.nucleus_invitations where nucleus_id='${nucleusId}' and revoked_at is null;`).trim();
  await expect(page.getByText(/Expira em/)).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: `${gallery}/app-convite-${testInfo.project.name}.png`, fullPage: true, mask: [page.locator(".font-mono")], maskColor: "#eff3e6" });
  await page.getByRole("link", { name: "Gerenciar convites", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Gerenciar convites", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Revogar convite", exact: true })).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: `${gallery}/app-gestao-${testInfo.project.name}.png`, fullPage: true });
  await page.getByRole("button", { name: "Revogar convite", exact: true }).click();
  await page.getByRole("button", { name: "Cancelar", exact: true }).click();
  expect(localSql(`select count(*) from public.nucleus_invitations where nucleus_id='${nucleusId}' and revoked_at is null;`).trim()).toBe("1");

  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_LOCAL_SERVICE_KEY!, { auth: { persistSession: false } });
  const email = `member-${randomUUID()}@example.test`, password = `Aa1!${randomUUID()}`;
  const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true });
  if (error || !data.user) throw new Error("Falha ao criar participante local.");
  const context = await browser.newContext();
  try {
    const client = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, { cookies: { getAll: () => [], setAll: async entries => { await context.addCookies(entries.map(({ name, value }) => ({ name, value, url: "http://127.0.0.1:3200", httpOnly: true, sameSite: "Lax" as const }))); } } });
    if ((await client.auth.signInWithPassword({ email, password })).error) throw new Error("Falha ao entrar com participante local.");
    const member = await context.newPage();
    await member.goto(`http://127.0.0.1:3200/nucleos/${nucleusId}`);
    await expect(member.getByRole("heading", { name: "Jardim compartilhado" })).toHaveCount(0);
    await member.goto("http://127.0.0.1:3200/comecar/convite");
    await member.getByLabel("Código de convite").fill(code);
    await member.getByRole("button", { name: "Conferir convite" }).click();
    await expect(member.getByRole("region", { name: "Prévia do convite" })).toContainText("Jardim compartilhado");
    expect(localSql(`select count(*) from public.nucleus_members where nucleus_id='${nucleusId}';`).trim()).toBe("1");
    await member.getByRole("button", { name: "Aceitar convite" }).click();
    await expect(member.getByRole("heading", { name: "Jardim compartilhado" })).toBeVisible();
    await member.reload();
    await expect(member.getByRole("link", { name: "Gerenciar convites" })).toHaveCount(0);
    await member.goto(`http://127.0.0.1:3200/nucleos/${nucleusId}/convites`);
    await expect(member.getByRole("heading", { name: "Gerenciar convites" })).toHaveCount(0);
    await page.getByRole("button", { name: "Revogar convite", exact: true }).click();
    await page.getByRole("button", { name: "Confirmar revogação" }).click();
    await expect(page.getByText("Nenhum convite ativo nesta página.")).toBeVisible();
    await page.getByRole("link", { name: "Revogados", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Convite revogado", exact: true })).toBeVisible();
    await page.screenshot({ path: `${gallery}/app-revogado-${testInfo.project.name}.png`, fullPage: true });
    expect(localSql(`select count(*) from public.nucleus_members where nucleus_id='${nucleusId}';`).trim()).toBe("2");
    await member.goto("http://127.0.0.1:3200/nucleos");
    await expect(member.getByText("Jardim compartilhado", { exact: true })).toBeVisible();
    await page.getByRole("link", { name: "Gerar ou compartilhar convite" }).click();
    await expect(page.getByRole("button", { name: "Gerar convite", exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Gerar convite", exact: true }).click();
    await expect(page.getByRole("button", { name: "Compartilhar código" })).toBeVisible();
    expect(localSql(`select code from public.nucleus_invitations where nucleus_id='${nucleusId}' and revoked_at is null;`).trim()).not.toBe(code);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.getByRole("link", { name: "Concluir por enquanto" }).click();
    await expect(page.getByRole("heading", { name: "Jardim compartilhado" })).toBeVisible();
    await page.screenshot({ path: `${gallery}/app-inicio-${testInfo.project.name}.png`, fullPage: true });
  } finally {
    await context.close();
    localSql(`delete from public.nucleus_members where user_id='${data.user.id}';`);
    if ((await admin.auth.admin.deleteUser(data.user.id)).error) throw new Error("Falha na limpeza do participante local.");
  }
});

test("geração concorrente reutiliza código e gestão pagina sem revelar códigos", async ({ page, account }) => {
  const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, { auth: { persistSession: false } });
  if ((await client.auth.signInWithPassword(account)).error) throw new Error("Falha ao entrar localmente.");
  const nucleus = await client.rpc("create_nucleus", { nucleus_type: "familia", nucleus_name: "Jardim da paginação", nucleus_purpose: "Cuidar juntos." });
  if (nucleus.error || typeof nucleus.data !== "string") throw new Error("Falha ao criar Núcleo local.");
  const id = nucleus.data;
  const results = await Promise.all([client.rpc("create_initial_invitation", { target_nucleus: id }), client.rpc("create_initial_invitation", { target_nucleus: id })]);
  expect(results.map(result => result.error)).toEqual([null, null]);
  expect(results[0].data).toBe(results[1].data);
  expect(localSql(`select count(*) from public.nucleus_invitations where nucleus_id='${id}';`).trim()).toBe("1");
  localSql(`insert into public.nucleus_invitations(nucleus_id,code,created_by,created_at,expires_at) select '${id}',md5(gen_random_uuid()::text),'${account.id}',now()-interval '8 days',now()-interval '1 day' from generate_series(1,21);`);
  await page.goto(`/nucleos/${id}/convites?status=expirados`);
  await expect(page.getByRole("heading", { name: "Convite expirado", exact: true })).toHaveCount(20);
  await expect(page.getByRole("button", { name: "Revogar convite" })).toHaveCount(0);
  await expect(page.getByText(results[0].data, { exact: true })).toHaveCount(0);
  await page.getByRole("link", { name: "Próxima página" }).click();
  await expect(page.getByRole("heading", { name: "Convite expirado", exact: true })).toHaveCount(1);
  await page.getByRole("link", { name: "Página anterior" }).click();
  await expect(page.getByRole("heading", { name: "Convite expirado", exact: true })).toHaveCount(20);
  await page.getByRole("link", { name: "Ativos", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Convite ativo", exact: true })).toHaveCount(1);
  await page.setViewportSize({ width: 320, height: 568 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("aceite e revogação respeitam ambas as ordens do bloqueio", async ({ account }) => {
  const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, { auth: { persistSession: false } });
  if ((await client.auth.signInWithPassword(account)).error) throw new Error("Falha ao entrar localmente.");
  const { data: id, error } = await client.rpc("create_nucleus", { nucleus_type: "amigos", nucleus_name: "Concorrência", nucleus_purpose: "Aceite explícito." });
  if (error || typeof id !== "string") throw new Error("Falha ao criar Núcleo local.");
  const first = await client.rpc("create_initial_invitation", { target_nucleus: id });
  const invitationId = localSql(`select id from public.nucleus_invitations where nucleus_id='${id}' and revoked_at is null;`).trim();
  const revoked = await holdInvitationLock(account.id, `select public.revoke_nucleus_invitation('${id}','${invitationId}')`);
  const acceptancePromise = client.rpc("accept_invitation", { invitation_code: first.data }).then(result => result);
  await waitForDatabase("select exists(select 1 from pg_stat_activity where wait_event_type='Lock' and query like '%accept_invitation%');");
  const acceptance = await acceptancePromise;
  await revoked.done;
  expect(acceptance.error?.code).toBe("P0002");
  const next = await client.rpc("create_initial_invitation", { target_nucleus: id });
  const nextId = localSql(`select id from public.nucleus_invitations where nucleus_id='${id}' and revoked_at is null;`).trim();
  const accepted = await holdInvitationLock(account.id, `select public.accept_invitation('${next.data}')`);
  const revocationPromise = client.rpc("revoke_nucleus_invitation", { target_nucleus: id, target_invitation: nextId }).then(result => result);
  await waitForDatabase("select exists(select 1 from pg_stat_activity where wait_event_type='Lock' and query like '%revoke_nucleus_invitation%');");
  const revocation = await revocationPromise;
  await accepted.done;
  expect(revocation.error).toBeNull();
  expect(localSql(`select count(*) from public.nucleus_members where nucleus_id='${id}' and user_id='${account.id}';`).trim()).toBe("1");
  expect((await client.rpc("accept_invitation", { invitation_code: next.data })).error?.code).toBe("P0002");
});
