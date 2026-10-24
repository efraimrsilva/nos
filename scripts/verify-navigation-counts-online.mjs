// Uso somente após autorização de produção; segredos permanecem na memória do processo.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { chromium, expect } from "@playwright/test";

if (!process.argv.includes("--production")) throw new Error("Exige autorização e --production.");
const project = "pyvohqgcwkcfzbtkmbvx", site = "https://noslife.netlify.app";
assert.equal(readFileSync("supabase/.temp/project-ref", "utf8").trim(), project);
const cli = process.env.SUPABASE_CLI_PATH, baselineFile = process.env.NOS_PRODUCTION_BASELINE;
if (!cli || !baselineFile) throw new Error("Defina CLI e caminho da referência de preservação.");
function cliJson(args) {
  try { return JSON.parse(execFileSync(cli, [...args, "--output-format", "json"], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], windowsHide: true })); }
  catch { throw new Error(`Falha Supabase: ${args.slice(0, 2).join(" ")}.`); }
}
const sql = query => cliJson(["db", "query", "--linked", "--project-ref", project, query]).rows;
const tables = ["nuclei", "nucleus_members", "nucleus_invitations", "nucleus_events", "nucleus_event_participants", "nucleus_agreements", "nucleus_agreement_participants", "nucleus_habit_moments", "nucleus_habit_revisions", "nucleus_habit_revision_responses", "nucleus_habit_trials", "nucleus_habit_trial_responses", "user_privacy_preferences", "nucleus_admin_nominations", "nucleus_agreement_versions"];
const fingerprint = () => sql(tables.map(table => `select '${table}' as name,count(*)::int as count,md5(coalesce(jsonb_agg(to_jsonb(t) order by to_jsonb(t)),'[]'::jsonb)::text) as hash from public.${table} t`).join(" union all ") + " order by name");
if (process.argv.includes("--snapshot-only")) {
  writeFileSync(baselineFile, JSON.stringify({ project, tables: fingerprint() }));
  console.log("Referência salva: contagens/hashes de 15 tabelas, sem conteúdo pessoal.");
  process.exit(0);
}
const baseline = JSON.parse(readFileSync(baselineFile, "utf8"));
assert.equal(baseline.project, project);
assert.deepEqual(fingerprint(), baseline.tables, "Conferir mudança concorrente antes de iniciar fixtures.");
const schema = sql("select to_regprocedure('public.get_navigation_counts()') is not null as present, has_function_privilege('authenticated','public.get_navigation_counts()','execute') as authenticated, not has_function_privilege('anon','public.get_navigation_counts()','execute') as anon_denied,(select count(*)::int from supabase_migrations.schema_migrations) as migrations")[0];
assert.equal(schema.present && schema.authenticated && schema.anon_denied, true);
const keyData = cliJson(["projects", "api-keys", "--project-ref", project]);
const keys = Array.isArray(keyData) ? keyData : keyData.keys;
const service = keys.find(key => key.name === "service_role")?.api_key, publicKey = keys.find(key => key.name === "anon")?.api_key;
if (!service || !publicKey) throw new Error("Credenciais administrativas indisponíveis.");
const api = `https://${project}.supabase.co`;
const admin = createClient(api, service, { auth: { persistSession: false, autoRefreshToken: false } });
const browser = await chromium.launch();
const users = [], contexts = [], nuclei = [randomUUID(), randomUUID()];
let completed = 0;
try {
  for (let i = 0; i < 2; i++) {
    const email = `counts-${randomUUID()}@example.test`, password = `Aa1!${randomUUID()}`;
    const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true });
    if (error || !data.user) throw new Error("Falha ao criar conta descartável.");
    users.push({ id: data.user.id, email, password });
  }
  const [own, peer] = users, [a, b] = nuclei, agreement = randomUUID(), event = randomUUID();
  sql(`insert into public.nuclei(id,type,name,purpose,created_by) values('${a}','amigos','Verificação de totais','Convivência','${own.id}'),('${b}','amigos','Outro espaço de teste','Presença','${own.id}');
    insert into public.nucleus_members(nucleus_id,user_id,role) values('${a}','${own.id}','admin'),('${b}','${own.id}','admin'),('${a}','${peer.id}','member'),('${b}','${peer.id}','member');
    insert into public.nucleus_agreements(id,nucleus_id,created_by,category,title,description,timing,frequency,status,terms_version) values('${agreement}','${b}','${own.id}','habit','Acordo descartável','Presença','Manhã','Diária','active',1);
    insert into public.nucleus_agreement_participants(agreement_id,user_id,response,accepted_version) values('${agreement}','${own.id}','accepted',1);
    insert into public.nucleus_events(id,nucleus_id,created_by,title,starts_at,ends_at,time_zone) values('${event}','${b}','${own.id}','Evento descartável',now()+interval '1 hour',now()+interval '2 hours','UTC');
    insert into public.nucleus_event_participants(event_id,user_id,response) values('${event}','${own.id}','pending');`);
  for (const [device, viewport] of [["desktop", { width: 1440, height: 1000 }], ["mobile", { width: 390, height: 844 }]]) {
    const context = await browser.newContext({ viewport }); contexts.push(context);
    let entries = [];
    const client = createServerClient(api, publicKey, { cookies: { getAll: () => entries, setAll: async cookies => {
      entries = cookies;
      await context.addCookies(cookies.map(({ name, value }) => ({ name, value, url: site, secure: true, httpOnly: true, sameSite: "Lax" })));
    } } });
    assert.equal((await client.auth.signInWithPassword({ email: own.email, password: own.password })).error, null);
    assert.deepEqual((await client.rpc("get_navigation_counts")).data, { nuclei: 2, agreements: 1, events: 1, people: 1 });
    const page = await context.newPage();
    await page.goto(`${site}/nucleos/${a}`);
    const nav = page.locator(device === "desktop" ? ".desktop-navigation" : ".mobile-navigation");
    for (const key of ["agreements", "events", "people"]) await expect(nav.locator(`[data-count=${key}]`)).toHaveText("1");
    await expect(nav.getByRole("link", { name: "Acordos", exact: true })).toHaveAccessibleDescription(/todos os seus Núcleos/);
    const gallery = process.env.NOS_ONLINE_GALLERY;
    if (gallery) { mkdirSync(gallery, { recursive: true }); await page.screenshot({ path: path.join(gallery, `producao-${device}.png`), fullPage: true }); }
    if (device === "mobile") {
      await nav.getByRole("button", { name: "Mais áreas e preferências" }).click();
      await expect(page.getByRole("dialog").locator("[data-count=nuclei]")).toHaveText("2");
      await page.keyboard.press("Escape");
    } else await expect(nav.locator("[data-count=nuclei]")).toHaveText("2");
    await nav.getByRole("link", { name: "Acordos", exact: true }).click();
    await expect(page).toHaveURL(`${site}/nucleos/${a}/acordos`);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    completed++;
    console.log(`Produção ${device}: totais gerais, navegação, deduplicação e descrição acessível aprovados.`);
  }
} finally {
  const cleanupErrors = [];
  const closed = await Promise.allSettled(contexts.map(context => context.close()));
  if (closed.some(result => result.status === "rejected")) cleanupErrors.push("contextos de navegador");
  try { await browser.close(); } catch { cleanupErrors.push("navegador"); }
  // Cada tentativa independe da anterior; UUIDs permitem recuperar a limpeza sem expor credenciais.
  for (const nucleus of nuclei) {
    try { sql(`delete from public.nuclei where id='${nucleus}'`); }
    catch { cleanupErrors.push(`Núcleo descartável ${nucleus}`); }
  }
  for (const user of users) {
    try {
      const { error } = await admin.auth.admin.deleteUser(user.id);
      if (error && error.status !== 404) throw new Error("Falha na limpeza de conta descartável.");
    } catch { cleanupErrors.push(`conta descartável ${user.id}`); }
  }
  try { assert.deepEqual(fingerprint(), baseline.tables); }
  catch { cleanupErrors.push("comparação dos dados anteriores: conferir concorrência/preservação"); }
  if (cleanupErrors.length) throw new Error(`Limpeza/conferência requer atenção: ${cleanupErrors.join("; ")}`);
}
console.log(JSON.stringify({ completed, migrations: schema.migrations, previousDataPreserved: true, disposableUsersRemoved: true }));
