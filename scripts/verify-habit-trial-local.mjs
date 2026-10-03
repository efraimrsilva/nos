// Jornada temporária e autenticada; dados e relógio de teste nunca alcançam o backend remoto.
import { execFileSync, spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { chromium, expect } from "@playwright/test";

const cli = process.env.SUPABASE_CLI_PATH;
if (!cli) throw new Error("Defina SUPABASE_CLI_PATH com a CLI local.");
const config = JSON.parse(execFileSync(cli, ["status", "-o", "json"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }));
if (!/^http:\/\/(127\.0\.0\.1|localhost):/.test(config.API_URL)) throw new Error("Somente backend local permitido.");
const admin = createClient(config.API_URL, config.SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const checked = (result) => { if (result.error) throw new Error(result.error.message); return result.data; };
const sql = (query) => execFileSync("docker", ["exec", "supabase_db_nos", "psql", "-U", "postgres", "-d", "postgres", "-v", "ON_ERROR_STOP=1", "-c", query], { stdio: "pipe" });
const users = [], people = [];
let nucleusId, browser;
const origin = "http://127.0.0.1:3200";
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "dev", "--hostname", "127.0.0.1", "--port", "3200"], {
  env: { ...process.env, NOS_LOCAL_VERIFY: "1", NEXT_PUBLIC_SUPABASE_URL: config.API_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: config.ANON_KEY, APP_ORIGIN: origin },
  stdio: ["ignore", "pipe", "pipe"], windowsHide: true,
});
let serverLog = "";
for (const stream of [server.stdout, server.stderr]) stream.on("data", (chunk) => { serverLog = (serverLog + chunk).slice(-3000); });
try {
  for (let i = 0; i < 90; i++) {
    if (server.exitCode !== null) throw new Error(`Servidor de validação encerrou: ${serverLog}`);
    try { if ((await fetch(`${origin}/conta`, { signal: AbortSignal.timeout(3000) })).ok) break; } catch {}
    if (i === 89) throw new Error(`Servidor de validação não iniciou: ${serverLog}`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  browser = await chromium.launch();
  for (let i = 0; i < 5; i++) {
    const email = `trial-${randomUUID()}@example.test`, password = `${randomUUID()}Aa1!`;
    users.push(checked(await admin.auth.admin.createUser({ email, password, email_confirm: true })).user.id);
    const jar = [];
    const client = createServerClient(config.API_URL, config.ANON_KEY, { cookies: {
      getAll: () => jar,
      setAll: (items) => { for (const item of items) { const index = jar.findIndex((c) => c.name === item.name); if (index >= 0) jar.splice(index, 1); jar.push(item); } },
    } });
    checked(await client.auth.signInWithPassword({ email, password }));
    const context = await browser.newContext(i === 1 ? { viewport: { width: 390, height: 844 } } : {});
    context.setDefaultNavigationTimeout(90000);
    await context.addCookies(jar.map(({ name, value }) => ({ name, value, url: origin, httpOnly: true, sameSite: "Lax" })));
    people.push({ client, context, page: await context.newPage() });
  }
  nucleusId = randomUUID();
  sql(`insert into public.nuclei(id,type,name,purpose,created_by) values('${nucleusId}','familia','Validação confirmação','Fixture temporária','${users[0]}');
    insert into public.nucleus_members(nucleus_id,user_id,role) values ${users.slice(0, 4).map((id, i) => `('${nucleusId}','${id}','${i === 0 ? "creator" : "member"}')`).join(",")};`);
  const [a, b, c, d, outsider] = people;
  const hub = `${origin}/nucleos/${nucleusId}/acordos`;
  await a.page.goto(hub);
  await expect(a.page.getByRole("complementary", { name: "Como funcionam as decisões do Hábito" })).toBeVisible();
  await a.page.getByLabel("O que vamos fazer?").fill("Conversar após jantar");
  await a.page.getByLabel("Como será?").fill("Sem telas e sem cobrança");
  await a.page.getByLabel("Quando?", { exact: true }).fill("Depois do jantar");
  await a.page.getByLabel("Com que frequência?").fill("Diária");
  await a.page.getByLabel("Duração do teste (dias)").fill("14");
  await a.page.getByRole("button", { name: "Enviar para aprovação" }).click();
  await expect(a.page).toHaveURL(/resultado=proposta/);
  const [habit] = checked(await a.client.from("nucleus_agreements").select("id,trial_days").eq("nucleus_id", nucleusId).eq("title", "Conversar após jantar"));
  expect(habit.trial_days).toBe(14);
  await b.page.goto(hub);
  await expect(b.page.getByText(/Teste: 14 dias após o aceite de todos/)).toBeVisible();
  await b.page.getByRole("button", { name: "Aceitar proposta", exact: true }).click();
  await expect(b.page).toHaveURL(/resultado=resposta/);
  checked(await c.client.rpc("respond_nucleus_agreement", { target_agreement: habit.id, agreement_response: "accepted" }));
  checked(await d.client.rpc("respond_nucleus_agreement", { target_agreement: habit.id, agreement_response: "accepted" }));
  const base = `${hub}/${habit.id}`, confirm = `${base}/confirmar`;
  const state = async () => checked(await a.client.rpc("get_nucleus_habit_trial_state", { target_agreement: habit.id }));
  let trial = await state();
  expect(trial.required).toBe(3);
  expect(new Date(trial.ends_at) - new Date(trial.started_at)).toBe(14 * 86400000);
  await a.page.goto(confirm);
  await expect(a.page.getByRole("button", { name: "Sim, funcionou para nós" })).toHaveCount(0);
  expect((await a.client.rpc("confirm_nucleus_habit_trial", { target_trial: trial.id })).error).toBeTruthy();
  await outsider.page.goto(confirm);
  // Com streaming, Next pode enviar HTTP 200 antes do notFound; validar a negativa renderizada e o banco.
  await expect(outsider.page.getByRole("heading", { name: "404" })).toBeVisible();
  await expect(outsider.page.getByRole("heading", { name: "Confirmar hábito após teste" })).toHaveCount(0);
  expect(checked(await outsider.client.from("nucleus_habit_trials").select("id"))).toEqual([]);
  // Entrada posterior permite leitura, sem aumentar participantes ou conceder voto no ciclo.
  sql(`insert into public.nucleus_members(nucleus_id,user_id,role) values('${nucleusId}','${users[4]}','member');`);
  await outsider.page.goto(confirm);
  await expect(outsider.page.getByRole("heading", { name: "Confirmar hábito após teste" })).toBeVisible();
  expect((await state()).participants).toBe(4);
  sql(`update public.nucleus_habit_trials set started_at=now()-interval '15 days',ends_at=now()-interval '1 day' where id='${trial.id}';`);
  expect((await outsider.client.rpc("confirm_nucleus_habit_trial", { target_trial: trial.id })).error).toBeTruthy();
  // Duas confirmações simultâneas representam metade, ainda insuficiente para quatro participantes.
  (await Promise.all([a.client, b.client].map((client) => client.rpc("confirm_nucleus_habit_trial", { target_trial: trial.id })))).forEach(checked);
  expect((await state()).status).toBe("testing");
  expect((await state()).votes).toBe(2);
  await c.page.goto(confirm);
  await c.page.getByRole("button", { name: "Sim, funcionou para nós" }).click();
  await expect(c.page.getByText(/Acordo ativo desde/)).toBeVisible();
  expect((await state()).votes).toBe(3);
  await b.page.goto(confirm);
  await expect(b.page.getByText("Confirmações: 3 de 4. São necessários 3 votos Sim.")).toBeVisible();
  expect(await b.page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  mkdirSync("artifacts", { recursive: true });
  await b.page.screenshot({ path: "artifacts/habit-confirmation-mobile.png", fullPage: true });
  await a.page.goto(`${hub}?categoria=habit&filtro=active`);
  await expect(a.page.getByRole("link", { name: "Ver detalhe do hábito" })).toBeVisible();
  await a.page.goto(`${base}/registrar`);
  await expect(a.page.getByRole("heading", { name: "Registrar momento" })).toBeVisible();
  checked(await a.client.rpc("record_nucleus_habit_moment", { target_nucleus: nucleusId, target_agreement: habit.id, moment_mood: "good", moment_note: "Memória em ativo" }));
  const revision = checked(await a.client.rpc("create_nucleus_habit_revision", { target_agreement: habit.id, revision_kind: "adjust", revision_title: "Conversar pela manhã", revision_description: "Mesmo cuidado", revision_timing: "Manhã", revision_frequency: "Diária" }));
  for (const person of [b, c, d]) checked(await person.client.rpc("respond_nucleus_habit_revision", { target_revision: revision, revision_response: "accepted" }));
  sql(`update public.nucleus_habit_revisions set reflect_until=now()-interval '1 second' where id='${revision}';`);
  checked(await a.client.rpc("apply_nucleus_habit_revision", { target_revision: revision }));
  trial = await state();
  expect(trial.status).toBe("testing"); expect(trial.votes).toBe(0);
  const cycles = checked(await a.client.from("nucleus_habit_trials").select("id,status").eq("agreement_id", habit.id));
  expect(cycles).toHaveLength(2); expect(cycles.some((cycle) => cycle.status === "superseded")).toBe(true);
  await a.page.goto(base);
  await expect(a.page.getByText("Memória em ativo", { exact: true })).toBeVisible();
  // Legado sem datas: quatro aceites explícitos antes de iniciar um novo prazo.
  const legacy = randomUUID();
  sql(`insert into public.nucleus_agreements(id,nucleus_id,created_by,category,title,description,timing,frequency,status,created_at)
    values('${legacy}','${nucleusId}','${users[0]}','habit','Hábito legado','Preservado','Noite','Semanal','testing',now()-interval '60 days');
    insert into public.nucleus_agreement_participants(agreement_id,user_id,response,responded_at)
    values ${users.slice(0,4).map((id) => `('${legacy}','${id}','accepted',now()-interval '59 days')`).join(",")};`);
  const legacyUrl = `${hub}/${legacy}/confirmar`;
  await a.page.goto(legacyUrl);
  await a.page.getByLabel("Duração do teste (dias)").fill("7");
  await a.page.getByRole("button", { name: "Propor período de teste" }).click();
  await expect(a.page.getByText("Período aguardando consenso · 7 dias")).toBeVisible();
  const legacyState = async () => checked(await a.client.rpc("get_nucleus_habit_trial_state", { target_agreement: legacy }));
  const legacyTrial = await legacyState();
  expect(legacyTrial.started_at).toBeNull();
  for (const person of [b, c, d]) checked(await person.client.rpc("respond_nucleus_habit_trial", { target_trial: legacyTrial.id, trial_response: "accepted" }));
  expect((await legacyState()).status).toBe("testing");
  expect(Date.now() - new Date((await legacyState()).started_at).getTime()).toBeLessThan(10000);
  await b.page.goto(legacyUrl);
  await expect(b.page.getByText("Confirmações: 0 de 4. São necessários 3 votos Sim.")).toBeVisible();
  console.log("PASS: criação pela interface, prazo, maioria 3/4, concorrência, isolamento, entrada posterior, ativo, ciclos, legado e layout móvel.");
} finally {
  const cleanupErrors = [];
  const attempt = async (label, operation) => {
    try { await operation(); } catch (error) { cleanupErrors.push(new Error(`${label}: ${error.message}`)); }
  };
  try {
    // Uma falha não impede limpar as demais fixtures; só remover IDs criados nesta execução.
    for (const person of people) await attempt("Fechar contexto", () => person.context.close());
    await attempt("Fechar navegador", () => browser?.close());
    if (nucleusId) await attempt("Remover Núcleo temporário", () => sql(`delete from public.nuclei where id='${nucleusId}';`));
    for (const id of users) await attempt(`Remover conta temporária ${id}`, async () => checked(await admin.auth.admin.deleteUser(id)));
  } finally {
    // O processo sempre é encerrado, mesmo quando banco ou navegador falham durante a limpeza.
    if (process.platform === "win32") {
      try { execFileSync("taskkill", ["/pid", String(server.pid), "/t", "/f"], { stdio: "ignore", windowsHide: true }); } catch {}
    } else server.kill();
  }
  if (cleanupErrors.length) throw new AggregateError(cleanupErrors, "Limpeza incompleta; servidor de validação encerrado.");
  console.log("Dados temporários removidos e servidor de validação encerrado.");
}
