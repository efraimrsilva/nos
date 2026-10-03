// Verificação autenticada isolada: nunca usa credenciais ou dados do projeto remoto.
import { execFileSync, spawn } from "node:child_process";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { chromium, expect } from "@playwright/test";
import { randomUUID } from "node:crypto";

const cli = process.env.SUPABASE_CLI_PATH;
if (!cli) throw new Error("Defina SUPABASE_CLI_PATH com o executável local da CLI.");
const config = JSON.parse(execFileSync(cli, ["status", "-o", "json"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }));
if (!/^http:\/\/(127\.0\.0\.1|localhost):/.test(config.API_URL)) throw new Error("Somente Supabase local permitido.");
const admin = createClient(config.API_URL, config.SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const users = [], contexts = [];
let nucleusId, browser;
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "dev", "--hostname", "127.0.0.1", "--port", "3200"], {
  env: { ...process.env, NOS_LOCAL_VERIFY: "1", NEXT_PUBLIC_SUPABASE_URL: config.API_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: config.ANON_KEY, APP_ORIGIN: "http://127.0.0.1:3200" },
  stdio: "ignore",
});
const checked = (result) => { if (result.error) throw new Error(result.error.message); return result.data; };
const sql = (query) => execFileSync("docker", ["exec", "supabase_db_nos", "psql", "-U", "postgres", "-d", "postgres", "-v", "ON_ERROR_STOP=1", "-c", query], { stdio: "pipe" });
try {
  for (let i = 0; i < 90; i++) {
    try { if ((await fetch("http://127.0.0.1:3200/conta")).ok) break; } catch {}
    if (i === 89) throw new Error("Servidor local não iniciou.");
    await new Promise((r) => setTimeout(r, 1000));
  }
  browser = await chromium.launch();
  for (let i = 0; i < 3; i++) {
    const email = `revision-${randomUUID()}@example.test`, password = `${randomUUID()}Aa1!`;
    const created = checked(await admin.auth.admin.createUser({ email, password, email_confirm: true }));
    users.push(created.user.id);
    const jar = [];
    const client = createServerClient(config.API_URL, config.ANON_KEY, { cookies: {
      getAll: () => jar,
      setAll: (items) => { for (const item of items) { const old = jar.findIndex((c) => c.name === item.name); if (old >= 0) jar.splice(old, 1); jar.push(item); } },
    } });
    checked(await client.auth.signInWithPassword({ email, password }));
    const context = await browser.newContext(i === 1 ? { viewport: { width: 390, height: 844 } } : {});
    context.setDefaultNavigationTimeout(90000);
    await context.addCookies(jar.map(({ name, value }) => ({ name, value, url: "http://127.0.0.1:3200", httpOnly: true, sameSite: "Lax" })));
    contexts.push({ client, context, page: await context.newPage() });
  }
  // Fixture administrativa local; cada escrita funcional passa depois pela conta participante.
  nucleusId = randomUUID();
  sql(`insert into public.nuclei(id,type,name,purpose,created_by) values('${nucleusId}','casal','Validação da revisão','Teste local temporário','${users[0]}');
    insert into public.nucleus_members(nucleus_id,user_id,role) values('${nucleusId}','${users[0]}','creator'),('${nucleusId}','${users[1]}','member');`);
  const [a, b, outsider] = contexts;
  const h = checked(await a.client.rpc("create_nucleus_agreement", { target_nucleus: nucleusId, agreement_category: "habit", agreement_title: "Conversar", agreement_description: "Sem telas", agreement_timing: "Noite", agreement_frequency: "Semanal", agreement_trial_days: 7 }));
  checked(await b.client.rpc("respond_nucleus_agreement", { target_agreement: h, agreement_response: "accepted" }));
  checked(await a.client.rpc("record_nucleus_habit_moment", { target_nucleus: nucleusId, target_agreement: h, moment_mood: "good", moment_note: "Registro preservado" }));
  const url = `http://127.0.0.1:3200/nucleos/${nucleusId}/acordos/${h}/revisar`;
  console.log("Contas e Hábito temporários preparados; iniciando interface.");
  await a.page.goto(url);
  await a.page.getByLabel("Quando?", { exact: true }).fill("Manhã");
  await a.page.getByRole("button", { name: "Enviar revisão para consentimento" }).click();
  await expect(a.page.getByRole("status")).toContainText("Revisão enviada", { timeout: 15000 });
  const initial = checked(await a.client.from("nucleus_habit_revisions").select("id").eq("agreement_id", h).eq("status", "pending"));
  sql(`update public.nucleus_habit_revisions set reflect_until=now()-interval '1 second' where id='${initial[0].id}'`);
  await a.page.reload();
  await expect(a.page.getByRole("button", { name: "Confirmar aplicação após consenso" })).toHaveCount(0);
  if (!(await a.client.rpc("apply_nucleus_habit_revision", { target_revision: initial[0].id })).error) throw new Error("Aplicação sem consenso aceita.");
  sql(`update public.nucleus_habit_revisions set reflect_until=now()+interval '7 days' where id='${initial[0].id}'`);
  await b.page.goto(url);
  await b.page.getByRole("button", { name: "Aceitar revisão", exact: true }).click();
  await expect(b.page.getByRole("status")).toContainText("Sua resposta", { timeout: 15000 });
  await expect(b.page.getByRole("button", { name: "Confirmar aplicação após consenso" })).toHaveCount(0);
  let revisions = checked(await a.client.from("nucleus_habit_revisions").select("id").eq("agreement_id", h).eq("status", "pending"));
  const first = revisions[0].id;
  const early = await a.client.rpc("apply_nucleus_habit_revision", { target_revision: first });
  if (!early.error) throw new Error("Aplicação antecipada aceita.");
  sql(`update public.nucleus_habit_revisions set reflect_until=now()-interval '1 second' where id='${first}'`);
  await a.page.reload();
  await a.page.getByRole("button", { name: "Confirmar aplicação após consenso" }).click();
  await expect(a.page.getByRole("status")).toContainText("Revisão aplicada", { timeout: 15000 });
  const changed = checked(await a.client.from("nucleus_agreements").select("timing").eq("id", h).single());
  if (changed.timing !== "Manhã") throw new Error("Ajuste não persistiu.");
  await outsider.page.goto(url);
  await expect(outsider.page.getByText("This page could not be found.")).toBeVisible();
  // Duas solicitações simultâneas: a trava do Hábito e índice parcial aceitam somente uma.
  const args = { target_agreement: h, revision_kind: "end", revision_title: null, revision_description: null, revision_timing: null, revision_frequency: null };
  const concurrent = await Promise.all([a.client.rpc("create_nucleus_habit_revision", args), b.client.rpc("create_nucleus_habit_revision", args)]);
  if (concurrent.filter((r) => !r.error).length !== 1) throw new Error("Concorrência criou revisões duplicadas.");
  const winner = concurrent.findIndex((r) => !r.error), revisionId = concurrent[winner].data;
  checked(await contexts[1 - winner].client.rpc("respond_nucleus_habit_revision", { target_revision: revisionId, revision_response: "declined" }));
  const ending = checked(await a.client.rpc("create_nucleus_habit_revision", args));
  checked(await b.client.rpc("respond_nucleus_habit_revision", { target_revision: ending, revision_response: "accepted" }));
  sql(`update public.nucleus_habit_revisions set reflect_until=now()-interval '1 second' where id='${ending}'`);
  const applications = await Promise.all([a.client.rpc("apply_nucleus_habit_revision", { target_revision: ending }), b.client.rpc("apply_nucleus_habit_revision", { target_revision: ending })]);
  if (applications.filter((r) => !r.error).length !== 1) throw new Error("Aplicação duplicada aceita.");
  await b.page.goto(url.replace("/revisar", ""));
  await expect(b.page.getByText("Encerrado de comum acordo", { exact: true })).toBeVisible();
  await expect(b.page.getByText("Registro preservado", { exact: true })).toBeVisible();
  await expect(b.page.getByRole("link", { name: "Registrar momento" })).toHaveCount(0);
  if (await b.page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) throw new Error("Layout móvel transborda.");
  await b.page.screenshot({ path: "test-results/revision-ended-mobile.png", fullPage: true });
  console.log("PASS: fluxo autenticado, ajuste, reflexão, recusa, encerramento, histórico, isolamento e concorrência; desktop e móvel.");
} finally {
  for (const { context } of contexts) await context.close();
  await browser?.close();
  if (nucleusId) sql(`delete from public.nuclei where id='${nucleusId}'`);
  for (const id of users) checked(await admin.auth.admin.deleteUser(id));
  server.kill();
  console.log("Limpeza local concluída.");
}
