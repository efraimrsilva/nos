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
  await page.getByRole("button", { name: "Remover evento", exact: true }).click();
  const removal = page.getByRole("dialog", { name: "Confirmar remoção", exact: true });
  await expect(removal).toContainText("Evento protegido");
  await expect(removal.getByRole("button", { name: "Fechar Confirmar remoção", exact: true })).toBeFocused();
  expect(localSql(`select count(*) from public.nucleus_events where nucleus_id='${nucleusId}';`).trim()).toBe("1");
  // Remover a validação HTML não dispensa a ciência exigida pela Server Action.
  await removal.getByRole("checkbox").evaluate((input: HTMLInputElement) => { input.required = false; });
  await removal.getByRole("button", { name: "Confirmar remoção", exact: true }).click();
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
  const loadedEvents = page.locator(".calendar-all-events");
  await loadedEvents.locator("summary").click();
  await expect(loadedEvents.getByRole("button")).toHaveCount(50);
  await expect(loadedEvents.getByRole("button").filter({ hasText: "Passado" })).toHaveCount(0);
  await page.getByRole("link", { name: "Mais eventos" }).click();
  await expect(loadedEvents.locator("summary")).toContainText("(1)");
  if (await loadedEvents.getAttribute("open") === null) await loadedEvents.locator("summary").click();
  await expect(loadedEvents.getByRole("button")).toHaveCount(1);
  await expect(page.getByRole("heading", { name: "Momento 51", exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Eventos anteriores" }).click();
  await expect(loadedEvents.locator("summary")).toContainText("(50)");
  if (await loadedEvents.getAttribute("open") === null) await loadedEvents.locator("summary").click();
  await expect(loadedEvents.getByRole("button")).toHaveCount(50);
  await page.getByRole("button", { name: "Novo momento", exact: true }).click();
  const creation = page.getByRole("dialog", { name: "Adicionar evento", exact: true });
  await creation.getByLabel("Título", { exact: true }).fill("Rascunho não enviado");
  await creation.getByRole("button", { name: "Fechar Adicionar evento", exact: true }).click();
  await expect(creation).toBeHidden();
  expect(localSql(`select count(*) from public.nucleus_events where nucleus_id='${nucleusId}';`).trim()).toBe("52");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("grade recorta encontros que continuam depois da meia-noite", async ({ page, account }) => {
  const nucleusId = randomUUID(), eventId = randomUUID();
  const start = new Date(Date.now() + 14 * 86_400_000);
  start.setUTCDate(start.getUTCDate() - (start.getUTCDay() + 6) % 7);
  start.setUTCHours(23, 0, 0, 0);
  const end = new Date(start.getTime() + 3 * 3_600_000);
  localSql(`insert into public.nuclei(id,type,name,purpose,created_by) values('${nucleusId}','familia','Encontro entre dias','Presença','${account.id}');
    insert into public.nucleus_members(nucleus_id,user_id,role) values('${nucleusId}','${account.id}','admin');
    insert into public.nucleus_events(id,nucleus_id,created_by,title,starts_at,ends_at,time_zone) values('${eventId}','${nucleusId}','${account.id}','Uma noite juntos','${start.toISOString()}','${end.toISOString()}','UTC');`);
  await page.goto(`/nucleos/${nucleusId}/agenda`);
  // A grade permanece no documento também no celular, onde a lista é a apresentação visível.
  const days = page.locator(".calendar-week .calendar-day");
  const firstDay = days.nth(0).locator(".calendar-event");
  const continuation = days.nth(1).locator(".calendar-event");
  await expect(firstDay.locator("time")).toHaveText("23:00");
  await expect(firstDay).toContainText("Continua no dia seguinte");
  await expect(continuation.locator("time")).toHaveText("00:00");
  await expect(continuation).toContainText("Continua do dia anterior");
  await expect(continuation).toContainText("Até 02:00");
  expect(await continuation.evaluate(element => Number.parseFloat((element as HTMLElement).style.top)))
    .toBeLessThan(await firstDay.evaluate(element => Number.parseFloat((element as HTMLElement).style.top)));
  expect(localSql(`select starts_at='${start.toISOString()}'::timestamptz and ends_at='${end.toISOString()}'::timestamptz from public.nucleus_events where id='${eventId}';`).trim()).toBe("t");
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
  const gallery = "artifacts/regression-captures/v0.15.2-2026-10-13-mvp-04-tela_14-tela_16-tela_15-tela_17";
  try {
    localSql(`insert into public.nuclei(id,type,name,purpose,created_by) values('${nucleusId}','familia','Jardim da agenda','Cultivar presença.','${account.id}');
      insert into public.nucleus_members(nucleus_id,user_id,role) values('${nucleusId}','${account.id}','admin'),('${nucleusId}','${memberId}','member');`);
    const hub = `/nucleos/${nucleusId}/agenda`;
    await page.goto(hub);
    await expect(page.getByText("Nada marcado por enquanto.", { exact: false })).toBeVisible();
    await page.getByRole("button", { name: "Novo momento", exact: true }).click();
    const creation = page.getByRole("dialog", { name: "Adicionar evento", exact: true });
    await creation.getByLabel("Título", { exact: true }).fill("Conversar em família");
    await creation.getByLabel("Intenção do momento", { exact: false }).fill("Estar juntos sem pressa");
    // Instantes futuros e válidos, independentes da data de execução.
    const day = new Date(Date.now() + 7 * 86400_000).toISOString().slice(0, 10);
    await creation.getByLabel("Início", { exact: true }).fill(`${day}T18:00`);
    await creation.getByLabel("Término", { exact: true }).fill(`${day}T17:00`);
    await creation.getByRole("button", { name: "Criar evento", exact: true }).click();
    await expect(creation.getByRole("alert").filter({ hasText: "posterior ao início" })).toContainText("posterior ao início");
    expect(localSql(`select count(*) from public.nucleus_events where nucleus_id='${nucleusId}';`).trim()).toBe("0");
    await creation.getByLabel("Término", { exact: true }).fill(`${day}T19:00`);
    await creation.getByRole("button", { name: "Criar evento", exact: true }).click();
    await expect(page).toHaveURL(/resultado=salvo/);
    await expect(creation).toBeHidden();
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
    const memberDetail = memberPage.locator(".calendar-detail");
    await expect(memberDetail.getByText("Aguardando respostas", { exact: true })).toBeVisible();
    await expect(memberPage.getByRole("button", { name: "Editar evento", exact: true })).toHaveCount(0);
    await memberPage.getByRole("button", { name: "Responder convite", exact: true }).click();
    await memberPage.getByRole("dialog", { name: "Sua participação", exact: true }).getByRole("button", { name: "Não posso", exact: true }).click();
    await expect(memberDetail.getByText("Precisa de novo horário", { exact: true })).toBeVisible();
    await memberPage.getByRole("button", { name: "Responder convite", exact: true }).click();
    await memberPage.getByRole("dialog", { name: "Sua participação", exact: true }).getByRole("button", { name: "Posso participar", exact: true }).click();
    await expect(memberDetail.getByText("Confirmado", { exact: true })).toBeVisible();
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
    await expect(memberPage.getByRole("heading", { name: "Tempo para o que importa.", exact: true })).toHaveCount(0);
    await page.reload();
    await page.getByRole("button", { name: "Editar evento", exact: true }).click();
    const editing = page.getByRole("dialog", { name: "Editar evento", exact: true });
    await editing.getByLabel("Título", { exact: true }).fill("Encontro em família");
    await editing.getByRole("button", { name: "Salvar alterações" }).click();
    await expect(page).toHaveURL(/resultado=salvo/);
    await expect(editing).toBeHidden();
    await expect(page.getByRole("heading", { name: "Encontro em família", exact: true })).toBeVisible();
    expect(localSql(`select response from public.nucleus_event_participants where event_id='${eventId}' and user_id='${memberId}';`).trim()).toBe("accepted");
    await page.getByRole("button", { name: "Editar evento", exact: true }).click();
    await editing.getByLabel("Início", { exact: true }).fill(`${day}T20:00`);
    await editing.getByLabel("Término", { exact: true }).fill(`${day}T21:00`);
    await editing.getByRole("button", { name: "Salvar alterações" }).click();
    await expect(page).toHaveURL(/resultado=salvo/);
    await expect(editing).toBeHidden();
    await expect(page.locator(".calendar-detail").getByText("Aguardando respostas", { exact: true })).toBeVisible();
    expect(localSql(`select response from public.nucleus_event_participants where event_id='${eventId}' and user_id='${memberId}';`).trim()).toBe("pending");
    await page.getByRole("button", { name: "Editar evento", exact: true }).click();
    await expect(editing.getByLabel("Início", { exact: true })).toBeVisible();
    await page.screenshot({ path: `${gallery}/app-edicao-${testInfo.project.name}.png`, fullPage: true });
    await editing.getByRole("button", { name: "Fechar Editar evento", exact: true }).click();
    // Abrir confirmação e cancelar devem preservar evento e participantes.
    await page.getByRole("button", { name: "Remover evento", exact: true }).click();
    const removal = page.getByRole("dialog", { name: "Confirmar remoção", exact: true });
    await expect(removal).toContainText("Encontro em família");
    expect(localSql(`select count(*) from public.nucleus_events where id='${eventId}';`).trim()).toBe("1");
    await removal.getByRole("button", { name: "Manter evento", exact: true }).click();
    await expect(removal).toBeHidden();
    await expect(page.getByRole("button", { name: "Remover evento", exact: true })).toBeFocused();
    expect(localSql(`select count(*) from public.nucleus_event_participants where event_id='${eventId}';`).trim()).toBe("2");
    await page.getByRole("button", { name: "Remover evento", exact: true }).click();
    await removal.getByRole("checkbox", { name: "Entendi que o evento e suas respostas serão removidos." }).check();
    await page.screenshot({ path: `${gallery}/app-confirmacao-${testInfo.project.name}.png`, fullPage: true });
    await removal.getByRole("button", { name: "Confirmar remoção", exact: true }).click();
    await expect(page.getByRole("status").filter({ hasText: "Evento removido" })).toContainText("Evento removido");
    expect(localSql(`select count(*) from public.nucleus_events where id='${eventId}';`).trim()).toBe("0");
    expect(localSql(`select count(*) from public.nucleus_event_participants where event_id='${eventId}';`).trim()).toBe("0");
    await expect(page.locator(".calendar-future summary")).toHaveText("Esboço de funcionalidade · ainda não desenvolvido");
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `${gallery}/app-vazio-${testInfo.project.name}.png`, fullPage: true });
    await memberPage.goto(`/nucleos/${randomUUID()}/agenda`);
    await expect(memberPage.getByRole("heading", { name: "Tempo para o que importa.", exact: true })).toHaveCount(0);
  } finally {
    await context.close();
    localSql(`delete from public.nuclei where id='${nucleusId}';`);
    if ((await admin.auth.admin.deleteUser(memberId)).error) throw new Error("Falha ao limpar participante.");
  }
});
