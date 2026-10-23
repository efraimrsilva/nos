// Execução remota explícita; credenciais ficam apenas na memória deste processo.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { chromium } from "@playwright/test";

if (!process.argv.includes("--production")) throw new Error("Exige --production e autorização de publicação.");
const project = "pyvohqgcwkcfzbtkmbvx";
const site = "https://noslife.netlify.app";
const api = `https://${project}.supabase.co`;
const cli = process.env.SUPABASE_CLI_PATH;
const baselineFile = process.env.NOS_PRODUCTION_BASELINE;
if (!cli || !baselineFile) throw new Error("Defina SUPABASE_CLI_PATH e NOS_PRODUCTION_BASELINE.");
assert.equal(readFileSync("supabase/.temp/project-ref", "utf8").trim(), project);
function cliJson(args) {
  try {
    const value = execFileSync(cli, [...args, "--output-format", "json"], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], windowsHide: true });
    return JSON.parse(value);
  } catch {
    // Erros da CLI podem conter respostas administrativas; não imprimir payloads ou chaves.
    throw new Error(`Falha na CLI Supabase durante ${args.slice(0, 2).join(" ")}.`);
  }
}
function sql(query) {
  return cliJson(["db", "query", "--linked", "--project-ref", project, query]).rows;
}
const responses = new Set(["nucleus_agreement_participants", "nucleus_event_participants", "nucleus_habit_revision_responses", "nucleus_habit_trial_responses"]);
const tables = ["nuclei", "nucleus_members", "nucleus_invitations", "nucleus_events", "nucleus_event_participants", "nucleus_agreements", "nucleus_agreement_participants", "nucleus_habit_moments", "nucleus_habit_revisions", "nucleus_habit_revision_responses", "nucleus_habit_trials", "nucleus_habit_trial_responses", "user_privacy_preferences", "nucleus_admin_nominations", "nucleus_agreement_versions"];
function fingerprint() {
  return sql(tables.map(table => {
    const row = responses.has(table) ? "to_jsonb(t)-'id'" : "to_jsonb(t)";
    return `select '${table}' as name,count(*)::int as count,md5(coalesce(jsonb_agg(${row} order by ${row}),'[]'::jsonb)::text) as hash from public.${table} t`;
  }).join(" union all ") + " order by name");
}
if (process.argv.includes("--snapshot-only")) {
  writeFileSync(baselineFile, JSON.stringify({ project, tables: fingerprint() }));
  console.log("Referência de preservação salva: somente contagens e hashes de 15 tabelas, sem conteúdo pessoal.");
  process.exit(0);
}
const baseline = JSON.parse(readFileSync(baselineFile, "utf8"));
assert.equal(baseline.project, project);
assert.deepEqual(fingerprint(), baseline.tables, "Dados anteriores mudaram desde a referência; conferir antes de criar fixtures.");
const schema = sql("select to_regprocedure('public.delete_my_account(text)') is not null as present,has_function_privilege('authenticated','public.delete_my_account(text)','execute') as authenticated,not has_function_privilege('anon','public.delete_my_account(text)','execute') as anon_denied,(select count(*)::int from supabase_migrations.schema_migrations) as migrations")[0];
assert.equal(schema.present && schema.authenticated && schema.anon_denied, true);
assert.equal(schema.migrations, 10);
const keyResult = cliJson(["projects", "api-keys", "--project-ref", project]);
const keys = Array.isArray(keyResult) ? keyResult : keyResult.keys;
const service = keys.find(key => key.name === "service_role")?.api_key;
const publicKey = keys.find(key => key.name === "anon")?.api_key;
if (!service || !publicKey) throw new Error("Chaves esperadas não disponíveis; nenhum teste destrutivo foi iniciado.");
const admin = createClient(api, service, { auth: { persistSession: false, autoRefreshToken: false } });
const browser = await chromium.launch();
let completed = 0;
let failure;
try {
  for (const [device, viewport] of [["desktop", { width: 1440, height: 1000 }], ["mobile", { width: 390, height: 844 }]]) {
    const users = [];
    const nucleus = randomUUID(), agreement = randomUUID(), event = randomUUID();
    const contexts = [];
    try {
      for (let index = 0; index < 2; index++) {
        const email = `deletion-${randomUUID()}@example.test`, password = `Aa1!${randomUUID()}`;
        const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { name: "Verificacao descartavel" } });
        if (error || !data.user) throw new Error("Falha ao criar conta descartável autorizada.");
        assert.match(data.user.id, /^[0-9a-f-]{36}$/);
        users.push({ id: data.user.id, email, password });
        const context = await browser.newContext({ viewport });
        contexts.push(context);
        let entries = [];
        const ssr = createServerClient(api, publicKey, { cookies: {
          getAll: () => entries,
          setAll: async cookies => {
            entries = cookies;
            await context.addCookies(cookies.map(({ name, value }) => ({ name, value, url: site, secure: true, httpOnly: true, sameSite: "Lax" })));
          },
        } });
        const login = await ssr.auth.signInWithPassword({ email, password });
        if (login.error) throw new Error("Falha ao autenticar conta descartável.");
      }
      const [own, peer] = users;
      sql(`insert into public.nuclei(id,type,name,purpose,created_by) values('${nucleus}','amigos','Verificacao descartavel','Presenca','${own.id}');
        insert into public.nucleus_members(nucleus_id,user_id,role) values('${nucleus}','${own.id}','admin'),('${nucleus}','${peer.id}','member');
        insert into public.nucleus_agreements(id,nucleus_id,created_by,category,title,description,timing,frequency,status) values('${agreement}','${nucleus}','${own.id}','habit','Caminhada descartavel','Presenca','Manha','Diaria','active');
        insert into public.nucleus_habit_moments(agreement_id,author_id,mood,note) values('${agreement}','${own.id}','good','Historia descartavel preservada');
        insert into public.nucleus_events(id,nucleus_id,created_by,title,starts_at,ends_at,time_zone) values('${event}','${nucleus}','${own.id}','Evento descartavel',now()+interval '1 day',now()+interval '1 day 1 hour','UTC');
        insert into public.nucleus_event_participants(event_id,user_id,response) values('${event}','${own.id}','declined'),('${event}','${peer.id}','accepted');`);
      const page = await contexts[0].newPage();
      await page.goto(`${site}/configuracoes/conta`);
      const trigger = page.getByRole("button", { name: /Apagar minha conta Ação definitiva/ });
      await trigger.waitFor();
      assert.equal(await trigger.locator("strong").evaluate(element => getComputedStyle(element).color), "rgb(134, 51, 58)");
      await trigger.click();
      const dialog = page.getByRole("dialog", { name: "Apagar minha conta", exact: true });
      const phrase = dialog.getByLabel("Para confirmar, digite APAGAR CONTA");
      const submit = dialog.getByRole("button", { name: "Apagar minha conta definitivamente", exact: true });
      assert.equal(await submit.isDisabled(), true);
      await phrase.fill("apagar conta");
      assert.equal(await submit.isDisabled(), true);
      await phrase.fill("APAGAR CONTA");
      await dialog.getByRole("button", { name: "Cancelar", exact: true }).click();
      assert.equal(sql(`select count(*)::int as count from auth.users where id='${own.id}'`)[0].count, 1);
      await trigger.click();
      assert.equal(await phrase.inputValue(), "");
      await phrase.fill("APAGAR CONTA");
      await submit.scrollIntoViewIfNeeded();
      const gallery = process.env.NOS_ONLINE_GALLERY;
      if (gallery) {
        mkdirSync(gallery, { recursive: true });
        await page.screenshot({ path: path.join(gallery, `producao-confirmacao-${device}.png`), animations: "disabled" });
      }
      await submit.click();
      await page.waitForURL(`${site}/conta?resultado=conta-excluida`);
      await page.getByRole("status").filter({ hasText: "Sua conta foi apagada" }).waitFor();
      assert.equal(sql(`select count(*)::int as count from auth.users where id='${own.id}'`)[0].count, 0);
      await page.goto(`${site}/configuracoes/conta`);
      assert.match(page.url(), /\/conta\?.*modo=login/);
      const peerPage = await contexts[1].newPage();
      await peerPage.goto(`${site}/nucleos/${nucleus}/acordos/${agreement}`);
      await peerPage.getByText("Historia descartavel preservada", { exact: true }).waitFor();
      assert.match(await peerPage.locator(".agreement-history-author").innerText(), /Conta excluída/);
      await peerPage.goto(`${site}/nucleos/${nucleus}/agenda#evento-${event}`);
      await peerPage.getByText("Criado por Conta excluída.", { exact: true }).waitFor();
      assert.equal(await peerPage.locator(".calendar-detail .ui-badge").innerText(), "Confirmado");
      assert.equal(sql(`select role from public.nucleus_members where nucleus_id='${nucleus}' and user_id='${peer.id}'`)[0].role, "admin");
      completed++;
      console.log(`Produção ${device}: exclusão, confirmação, cancelamento, proteção, sucessão e histórico aprovados.`);
    } finally {
      const cleanupErrors = [];
      const closed = await Promise.allSettled(contexts.map(context => context.close()));
      if (closed.some(result => result.status === "rejected")) cleanupErrors.push("fechamento dos contextos");
      // IDs gerados nesta execução delimitam toda a limpeza; nunca há DELETE abrangente.
      try { sql(`delete from public.nuclei where id='${nucleus}'`); }
      catch { cleanupErrors.push(`Núcleo descartável ${nucleus}`); }
      const removed = await Promise.allSettled(users.map(async user => {
        const { error } = await admin.auth.admin.deleteUser(user.id);
        if (error && error.status !== 404) throw new Error(`conta descartável ${user.id}`);
      }));
      removed.forEach((result, index) => {
        if (result.status === "rejected") cleanupErrors.push(`conta descartável ${users[index].id}`);
      });
      // UUIDs descartáveis permitem recuperação dirigida mesmo se a limpeza SQL falhar.
      if (cleanupErrors.length) throw new Error(`Limpeza requer conferência: ${cleanupErrors.join("; ")}`);
    }
  }
} catch (error) {
  failure = error;
} finally {
  try { await browser.close(); }
  catch { failure ??= new Error("Não foi possível fechar o navegador de verificação."); }
  try { assert.deepEqual(fingerprint(), baseline.tables); }
  catch { failure = new Error(`${failure?.message ?? ""} Dados anteriores diferem da referência ou a comparação falhou; conferir preservação.`); }
}
if (failure) throw failure;
console.log(JSON.stringify({ completed, migrations: schema.migrations, previousDataPreserved: true, disposableUsersRemoved: true }));
