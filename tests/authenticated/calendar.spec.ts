import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { test, expect, localSql } from "./fixtures";

test("remoção pede confirmação contextual antes de gravar", async ({ page, account }) => {
  const nucleusId = randomUUID();
  localSql(`insert into public.nuclei(id,type,name,purpose,created_by) values('${nucleusId}','familia','Agenda confirmação','Presença','${account.id}');
    insert into public.nucleus_members(nucleus_id,user_id,role) values('${nucleusId}','${account.id}','admin');
    insert into public.nucleus_events(nucleus_id,created_by,title,starts_at,ends_at,time_zone) values('${nucleusId}','${account.id}','Evento protegido',now()+interval '7 days',now()+interval '7 days 1 hour','UTC');`);
  await page.goto(`/nucleos/${nucleusId}/agenda`);
  await page.getByText("Editar ou remover", { exact: true }).click();
  await page.getByRole("button", { name: "Remover evento", exact: true }).click();
  await expect(page.getByRole("group", { name: "Confirmar remoção" })).toContainText("Evento protegido");
  await expect(page.getByRole("group", { name: "Confirmar remoção" })).toBeFocused();
  expect(localSql(`select count(*) from public.nucleus_events where nucleus_id='${nucleusId}';`).trim()).toBe("1");
  // Remover a validação HTML não dispensa a ciência exigida pela Server Action.
  await page.getByRole("checkbox").evaluate((input: HTMLInputElement) => { input.required = false; });
  await page.getByRole("button", { name: "Confirmar remoção", exact: true }).click();
  await expect(page).toHaveURL(/resultado=erro/);
  expect(localSql(`select count(*) from public.nucleus_events where nucleus_id='${nucleusId}';`).trim()).toBe("1");
});

test("agenda pagina eventos futuros e permite voltar sem criar", async ({ page, account }) => {
  const nucleusId = randomUUID();
  localSql(`insert into public.nuclei(id,type,name,purpose,created_by) values('${nucleusId}','familia','Agenda paginada','Presença','${account.id}');
    insert into public.nucleus_members(nucleus_id,user_id,role) values('${nucleusId}','${account.id}','admin');
    insert into public.nucleus_events(nucleus_id,created_by,title,starts_at,ends_at,time_zone)
      select '${nucleusId}','${account.id}','Momento '||lpad(i::text,2,'0'),now()+i*interval '1 day',now()+i*interval '1 day'+interval '1 hour','UTC' from generate_series(1,51) i;
    insert into public.nucleus_events(nucleus_id,created_by,title,starts_at,ends_at,time_zone) values('${nucleusId}','${account.id}','Passado',now()-interval '2 days',now()-interval '1 day','UTC');`);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`/nucleos/${nucleusId}/agenda`);
  await expect(page.getByRole("listitem")).toHaveCount(50);
  await expect(page.getByRole("heading", { name: "Passado" })).toHaveCount(0);
  await page.getByRole("link", { name: "Mais eventos" }).click();
  await expect(page.getByRole("listitem")).toHaveCount(1);
  await expect(page.getByRole("heading", { name: "Momento 51" })).toBeVisible();
  await page.getByRole("link", { name: "Eventos anteriores" }).click();
  await expect(page.getByRole("listitem")).toHaveCount(50);
  await page.getByRole("link", { name: "Adicionar evento", exact: true }).click();
  await page.getByLabel("Título", { exact: true }).last().fill("Rascunho não enviado");
  await page.getByRole("link", { name: "Voltar aos eventos sem enviar" }).click();
  expect(localSql(`select count(*) from public.nucleus_events where nucleus_id='${nucleusId}';`).trim()).toBe("52");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

// Fixtures são locais; duas sessões reais exercitam o contrato de presença e autoria.
test("agenda: criação, respostas, remarcação e remoção confirmada", async ({ page, account }, testInfo) => {
  test.setTimeout(120_000);
  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_LOCAL_SERVICE_KEY!, { auth: { persistSession: false } });
  const email = `calendar-${randomUUID()}@example.test`, password = `Aa1!${randomUUID()}`;
  const person = await admin.auth.admin.createUser({ email, password, email_confirm: true });
  if (person.error || !person.data.user) throw new Error("Falha ao criar participante local.");
  const memberId = person.data.user.id, nucleusId = randomUUID();
  const context = await page.context().browser()!.newContext({ viewport: page.viewportSize()! });
  const gallery = "Documentacao_Projeto_Nos/wireframes/comparacoes/v0.15.2-2026-10-13-mvp-04-tela_14-tela_16-tela_15-tela_17";
  try {
    localSql(`insert into public.nuclei(id,type,name,purpose,created_by) values('${nucleusId}','familia','Jardim da agenda','Cultivar presença.','${account.id}');
      insert into public.nucleus_members(nucleus_id,user_id,role) values('${nucleusId}','${account.id}','admin'),('${nucleusId}','${memberId}','member');`);
    const hub = `/nucleos/${nucleusId}/agenda`;
    await page.goto(hub);
    await expect(page.getByText("Nada marcado por enquanto.", { exact: false })).toBeVisible();
    await page.getByLabel("Título", { exact: true }).fill("Conversar em família");
    await page.getByLabel("Intenção do momento", { exact: false }).fill("Estar juntos sem pressa");
    // Instantes futuros e válidos, independentes da data de execução.
    const day = new Date(Date.now() + 7 * 86400_000).toISOString().slice(0, 10);
    await page.getByLabel("Início", { exact: true }).fill(`${day}T18:00`);
    await page.getByLabel("Término", { exact: true }).fill(`${day}T17:00`);
    await page.getByRole("button", { name: "Criar evento", exact: true }).click();
    await expect(page.getByRole("alert").filter({ hasText: "posterior ao início" })).toContainText("posterior ao início");
    expect(localSql(`select count(*) from public.nucleus_events where nucleus_id='${nucleusId}';`).trim()).toBe("0");
    await page.getByLabel("Término", { exact: true }).fill(`${day}T19:00`);
    await page.getByRole("button", { name: "Criar evento", exact: true }).click();
    await expect(page).toHaveURL(/resultado=salvo/);
    const eventId = localSql(`select id from public.nucleus_events where nucleus_id='${nucleusId}';`).trim();
    expect(localSql(`select response from public.nucleus_event_participants where event_id='${eventId}' and user_id='${account.id}';`).trim()).toBe("accepted");
    const member = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
      cookies: { getAll: () => [], setAll: async entries => {
        await context.addCookies(entries.map(({ name, value }) => ({ name, value, url: "http://127.0.0.1:3200", httpOnly: true, sameSite: "Lax" as const })));
      } },
    });
    if ((await member.auth.signInWithPassword({ email, password })).error) throw new Error("Falha ao autenticar participante.");
    const memberPage = await context.newPage();
    await memberPage.goto(hub);
    await expect(memberPage.getByText("Aguardando respostas", { exact: false })).toBeVisible();
    await expect(memberPage.getByText("Editar ou remover", { exact: true })).toHaveCount(0);
    await memberPage.getByRole("button", { name: "Não posso", exact: true }).click();
    await expect(memberPage.getByText("Precisa de novo horário", { exact: false })).toBeVisible();
    await memberPage.getByRole("button", { name: "Posso participar", exact: true }).click();
    await expect(memberPage.getByText("Confirmado", { exact: false })).toBeVisible();
    const fields = { target_event: eventId, event_title: "Inválido", event_intention: "", event_starts_at: new Date(Date.now()+86400_000).toISOString(), event_ends_at: new Date(Date.now()+90000_000).toISOString(), event_time_zone: "UTC" };
    expect((await member.rpc("update_nucleus_event", fields)).error?.code).toBe("42501");
    expect((await member.rpc("delete_nucleus_event", { target_event: eventId })).error?.code).toBe("42501");
    const otherNucleus = randomUUID(), otherEvent = randomUUID();
    localSql(`insert into public.nuclei(id,type,name,purpose,created_by) values('${otherNucleus}','familia','Outro jardim','Presença','${account.id}');
      insert into public.nucleus_members(nucleus_id,user_id,role) values('${otherNucleus}','${account.id}','admin');
      insert into public.nucleus_events(id,nucleus_id,created_by,title,starts_at,ends_at,time_zone) values('${otherEvent}','${otherNucleus}','${account.id}','Evento privado',now()+interval '7 days',now()+interval '7 days 1 hour','UTC');`);
    const hidden = await member.from("nucleus_events").select("id").eq("nucleus_id", otherNucleus);
    expect(hidden.error?.code).toBe("42501");
    const hiddenCalendar = await member.rpc("get_nucleus_calendar", { target_nucleus: otherNucleus, from_ends_at: new Date().toISOString(), page_offset: 0, page_size: 51 });
    expect(hiddenCalendar.error?.code).toBe("42501");
    expect((await member.rpc("respond_nucleus_event", { target_event: otherEvent, event_response: "accepted" })).error?.code).toBe("42501");
    await memberPage.goto(`/nucleos/${otherNucleus}/agenda`);
    await expect(memberPage.getByRole("heading", { name: "Agenda do Núcleo" })).toHaveCount(0);
    await page.reload();
    const item = page.getByRole("listitem").filter({ has: page.getByRole("heading", { name: "Conversar em família" }) });
    await item.getByText("Editar ou remover", { exact: true }).click();
    await item.getByLabel("Título", { exact: true }).fill("Encontro em família");
    await item.getByRole("button", { name: "Salvar alterações" }).click();
    await expect(page).toHaveURL(/resultado=salvo/);
    await expect(page.getByRole("heading", { name: "Encontro em família", exact: true })).toBeVisible();
    expect(localSql(`select response from public.nucleus_event_participants where event_id='${eventId}' and user_id='${memberId}';`).trim()).toBe("accepted");
    await page.getByText("Editar ou remover", { exact: true }).click();
    const edited = page.getByRole("listitem");
    await edited.getByLabel("Início", { exact: true }).fill(`${day}T20:00`);
    await edited.getByLabel("Término", { exact: true }).fill(`${day}T21:00`);
    await edited.getByRole("button", { name: "Salvar alterações" }).click();
    await expect(page).toHaveURL(/resultado=salvo/);
    await expect(page.getByText("Aguardando respostas", { exact: false })).toBeVisible();
    expect(localSql(`select response from public.nucleus_event_participants where event_id='${eventId}' and user_id='${memberId}';`).trim()).toBe("pending");
    await page.getByText("Editar ou remover", { exact: true }).click();
    await expect(page.getByRole("listitem").getByLabel("Início", { exact: true })).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `${gallery}/app-edicao-${testInfo.project.name}.png`, fullPage: true });
    // Abrir confirmação e cancelar devem preservar evento e participantes.
    await page.getByRole("button", { name: "Remover evento", exact: true }).click();
    await expect(page.getByRole("group", { name: "Confirmar remoção" })).toContainText("Encontro em família");
    expect(localSql(`select count(*) from public.nucleus_events where id='${eventId}';`).trim()).toBe("1");
    await page.getByRole("button", { name: "Manter evento", exact: true }).click();
    await expect(page.getByRole("group", { name: "Confirmar remoção" })).toHaveCount(0);
    expect(localSql(`select count(*) from public.nucleus_event_participants where event_id='${eventId}';`).trim()).toBe("2");
    await page.getByRole("button", { name: "Remover evento", exact: true }).click();
    await page.getByRole("checkbox", { name: "Entendi que o evento e suas respostas serão removidos." }).check();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `${gallery}/app-confirmacao-${testInfo.project.name}.png`, fullPage: true });
    await page.getByRole("button", { name: "Confirmar remoção", exact: true }).click();
    await expect(page.getByRole("status").filter({ hasText: "Evento removido" })).toContainText("Evento removido");
    expect(localSql(`select count(*) from public.nucleus_events where id='${eventId}';`).trim()).toBe("0");
    expect(localSql(`select count(*) from public.nucleus_event_participants where event_id='${eventId}';`).trim()).toBe("0");
    await expect(page.getByRole("heading", { name: "Próximas possibilidades" })).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `${gallery}/app-vazio-${testInfo.project.name}.png`, fullPage: true });
    await memberPage.goto(`/nucleos/${randomUUID()}/agenda`);
    await expect(memberPage.getByRole("heading", { name: "Agenda do Núcleo" })).toHaveCount(0);
  } finally {
    await context.close();
    localSql(`delete from public.nuclei where id='${nucleusId}';`);
    if ((await admin.auth.admin.deleteUser(memberId)).error) throw new Error("Falha ao limpar participante.");
  }
});
