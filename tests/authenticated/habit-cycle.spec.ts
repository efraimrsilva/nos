import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { test, expect, localSql } from "./fixtures";

test("revisões antigas têm paginação estável e não escondem a pendência", async ({ page, account }) => {
  const nucleus = randomUUID(), habit = randomUUID(), pending = randomUUID();
  localSql(`insert into public.nuclei(id,type,name,purpose,created_by) values('${nucleus}','familia','Histórico de revisões','Fixture local','${account.id}');
    insert into public.nucleus_members(nucleus_id,user_id,role) values('${nucleus}','${account.id}','creator');
    insert into public.nucleus_agreements(id,nucleus_id,created_by,category,title,description,timing,frequency,status,trial_days)
    values('${habit}','${nucleus}','${account.id}','habit','História preservada','Cuidar','Noite','Diária','testing',7);
    insert into public.nucleus_agreement_participants(agreement_id,user_id,response) values('${habit}','${account.id}','accepted');
    insert into public.nucleus_habit_revisions(id,agreement_id,created_by,kind,status,created_at,reflect_until)
    select gen_random_uuid(),'${habit}','${account.id}','end','declined','2026-01-02T00:00:00Z','2026-01-09T00:00:00Z' from generate_series(1,23);
    insert into public.nucleus_habit_revisions(id,agreement_id,created_by,kind,status,created_at,reflect_until)
    values('${pending}','${habit}','${account.id}','end','pending','2026-01-01T00:00:00Z','2099-01-08T00:00:00Z');
    insert into public.nucleus_habit_revision_responses(revision_id,user_id,response) values('${pending}','${account.id}','accepted');`);
  const base = `/nucleos/${nucleus}/acordos/${habit}/revisar`;
  await page.goto(base);
  const history = page.getByRole("region", { name: "Histórico das revisões" });
  await expect(history.getByRole("listitem")).toHaveCount(20);
  const first = await history.getByRole("listitem").evaluateAll(items => items.map(item => item.getAttribute("data-revision-id")));
  await expect(page.getByRole("region", { name: "Revisão em andamento" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Nova solicitação" })).toHaveCount(0);
  await history.getByRole("link", { name: "Revisões mais antigas" }).click();
  await expect(history.getByRole("listitem")).toHaveCount(3);
  const older = await history.getByRole("listitem").evaluateAll(items => items.map(item => item.getAttribute("data-revision-id")));
  expect(new Set([...first, ...older]).size).toBe(23);
  await expect(page.getByRole("region", { name: "Revisão em andamento" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Nova solicitação" })).toHaveCount(0);
  await history.getByRole("link", { name: "Voltar às revisões recentes" }).click();
  await expect(history.getByRole("listitem")).toHaveCount(20);
  await page.goto(`${base}?antes=invalido`);
  await expect(history.getByRole("listitem")).toHaveCount(20);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("duas pessoas completam teste, confirmação, ajuste e encerramento preservando momentos", async ({ page, account }, testInfo) => {
  test.setTimeout(180_000);
  page.setDefaultTimeout(15_000);
  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_LOCAL_SERVICE_KEY!, { auth: { persistSession: false } });
  const email = `cycle-${randomUUID()}@example.test`, password = `Aa1!${randomUUID()}`;
  const result = await admin.auth.admin.createUser({ email, password, email_confirm: true });
  if (result.error || !result.data.user) throw new Error("Não foi possível criar a segunda conta local.");
  const member = result.data.user.id, nucleus = randomUUID();
  const context = await page.context().browser()!.newContext({ viewport: page.viewportSize()! });
  const gallery = "Documentacao_Projeto_Nos/wireframes/comparacoes/v0.15.1-2026-10-13-mvp-03-tela_24-tela_28-tela_33";
  try {
    const client = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
      cookies: { getAll: () => [], setAll: async entries => {
        await context.addCookies(entries.map(({ name, value }) => ({ name, value, url: "http://127.0.0.1:3200", httpOnly: true, sameSite: "Lax" as const })));
      } },
    });
    if ((await client.auth.signInWithPassword({ email, password })).error) throw new Error("Falha ao autenticar segunda conta local.");
    const other = await context.newPage();
    localSql(`insert into public.nuclei(id,type,name,purpose,created_by) values('${nucleus}','familia','Ciclo de cuidado','Cultivar presença','${account.id}');
      insert into public.nucleus_members(nucleus_id,user_id,role) values('${nucleus}','${account.id}','creator'),('${nucleus}','${member}','member');`);
    const hub = `/nucleos/${nucleus}/acordos`;
    await page.goto(hub);
    await page.getByLabel("O que vamos fazer?").fill("Conversar com presença");
    await page.getByLabel("Como será?").fill("Guardar um tempo sem distrações");
    await page.getByLabel("Quando?", { exact: true }).fill("Depois do jantar");
    await page.getByLabel("Com que frequência?").fill("Diária");
    await page.getByLabel("Duração do teste (dias)").fill("7");
    await page.getByRole("button", { name: "Conferir proposta", exact: true }).click();
    expect(localSql(`select count(*) from public.nucleus_agreements where nucleus_id='${nucleus}'`).trim()).toBe("0");
    await page.getByRole("button", { name: "Enviar para aprovação" }).click();
    await expect(page).toHaveURL(/resultado=proposta/);
    const habit = localSql(`select id from public.nucleus_agreements where nucleus_id='${nucleus}'`).trim();
    const base = `${hub}/${habit}`;
    await other.goto(`http://127.0.0.1:3200${hub}`);
    await other.getByRole("button", { name: "Aceitar proposta", exact: true }).click();
    await expect(other).toHaveURL(/resultado=resposta/);
    expect(localSql(`select status from public.nucleus_agreements where id='${habit}'`).trim()).toBe("testing");
    await page.goto(`${base}/registrar`);
    await page.getByText("Bem", { exact: true }).click();
    await expect(page.getByLabel("Bem", { exact: true })).toBeChecked();
    await page.getByRole("textbox").fill("Um momento que permanece");
    await page.getByRole("button", { name: "Salvar momento", exact: true }).click();
    await expect(page.getByText("Um momento que permanece", { exact: true })).toBeVisible();
    await page.goto(`${base}/confirmar`);
    await expect(page.getByRole("button", { name: "Sim, funcionou para nós" })).toHaveCount(0);
    // Somente fixtures locais avançam o tempo; prazos de produção e consentimento permanecem intactos.
    localSql(`update public.nucleus_habit_trials set started_at=now()-interval '8 days',ends_at=now()-interval '1 day' where agreement_id='${habit}';`);
    await page.reload();
    await page.getByRole("button", { name: "Sim, funcionou para nós" }).click();
    await expect(page.getByText("Você confirmou este ciclo.")).toBeVisible();
    expect(localSql(`select status from public.nucleus_agreements where id='${habit}'`).trim()).toBe("testing");
    await other.goto(`http://127.0.0.1:3200${base}/confirmar`);
    await other.getByRole("button", { name: "Sim, funcionou para nós" }).click();
    await expect(other.getByText(/Acordo ativo desde/)).toBeVisible();
    await other.screenshot({ path: `${gallery}/app-confirmacao-${testInfo.project.name}.png`, fullPage: true });
    await page.goto(`${base}/revisar`);
    await page.getByLabel("O que vamos fazer?").fill("Conversar pela manhã");
    await page.getByRole("button", { name: "Enviar revisão para consentimento" }).click();
    await expect(page).toHaveURL(/resultado=proposta/);
    await other.goto(`http://127.0.0.1:3200${base}/revisar`);
    await other.getByRole("button", { name: "Recusar e manter combinado" }).click();
    await expect(other).toHaveURL(/resultado=resposta/);
    expect(localSql(`select title from public.nucleus_agreements where id='${habit}'`).trim()).toBe("Conversar com presença");
    await page.reload();
    await page.getByLabel("O que vamos fazer?").fill("Conversar pela manhã");
    await page.getByRole("button", { name: "Enviar revisão para consentimento" }).click();
    await expect(page).toHaveURL(/resultado=proposta/);
    await other.reload();
    await other.getByRole("button", { name: "Aceitar revisão", exact: true }).click();
    await expect(other).toHaveURL(/resultado=resposta/);
    await expect(other.getByRole("button", { name: "Confirmar aplicação após consenso" })).toHaveCount(0);
    localSql(`update public.nucleus_habit_revisions set reflect_until=now()-interval '1 second' where agreement_id='${habit}' and status='pending';`);
    await page.reload();
    await page.getByRole("button", { name: "Confirmar aplicação após consenso" }).click();
    await expect(page).toHaveURL(/resultado=aplicada/);
    expect(localSql(`select status from public.nucleus_agreements where id='${habit}'`).trim()).toBe("testing");
    expect(localSql(`select count(*) from public.nucleus_habit_trials where agreement_id='${habit}'`).trim()).toBe("2");
    expect(localSql(`select count(*) from public.nucleus_habit_trial_responses c join public.nucleus_habit_trials t on t.id=c.trial_id where t.agreement_id='${habit}' and t.status='testing' and c.confirmed_at is not null`).trim()).toBe("0");
    await page.getByLabel("O que você propõe?").selectOption("end");
    await page.getByRole("button", { name: "Enviar revisão para consentimento" }).click();
    await expect(page).toHaveURL(/resultado=proposta/);
    await other.reload();
    await other.getByRole("button", { name: "Aceitar revisão", exact: true }).click();
    await expect(other).toHaveURL(/resultado=resposta/);
    localSql(`update public.nucleus_habit_revisions set reflect_until=now()-interval '1 second' where agreement_id='${habit}' and status='pending';`);
    await page.reload();
    await page.getByRole("button", { name: "Confirmar aplicação após consenso" }).click();
    await expect(page).toHaveURL(/resultado=aplicada/);
    await page.screenshot({ path: `${gallery}/app-revisao-${testInfo.project.name}.png`, fullPage: true });
    await page.goto(base);
    await expect(page.getByText("Um momento que permanece", { exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "Registrar momento", exact: true })).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Próximas possibilidades · planejadas" })).toBeVisible();
    await page.screenshot({ path: `${gallery}/app-detalhe-${testInfo.project.name}.png`, fullPage: true });
    expect((await client.rpc("record_nucleus_habit_moment", { target_nucleus: nucleus, target_agreement: habit, moment_mood: "good", moment_note: "Bloqueado após encerrar" })).error).toBeTruthy();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  } finally {
    await context.close();
    localSql(`delete from public.nuclei where id='${nucleus}';`);
    if ((await admin.auth.admin.deleteUser(member)).error) throw new Error("Falha ao limpar segunda conta local.");
  }
});
