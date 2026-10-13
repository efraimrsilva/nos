import { randomUUID } from "node:crypto";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { test, expect, localSql } from "./fixtures";

const gallery = "Documentacao_Projeto_Nos/wireframes/comparacoes/v0.14.0-2026-10-10-proposta-habito-tela_18-tela_19-tela_20-tela_21-tela_22-tela_23-tela_24";

test("Atlas completo preserva referências, categorias e estados após a evolução do percurso", async ({ page, context }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "O comparador já percorre as duas larguras.");
  test.setTimeout(120_000);
  await page.goto("/comecar");
  execFileSync(process.execPath, ["Documentacao_Projeto_Nos/wireframes/tools/verify-fidelity.mjs"], {
    env: { ...process.env, NOS_VERIFY_ORIGIN: "http://127.0.0.1:3200", NOS_VERIFY_COOKIES: JSON.stringify(await context.cookies()) }, stdio: "inherit",
  });
  const atlas = await context.newPage();
  await atlas.goto(pathToFileURL(path.resolve("Documentacao_Projeto_Nos/wireframes/atlas/index.html")).href);
  for (const [label, viewport] of [["desktop", { width: 1440, height: 1000 }], ["mobile", { width: 390, height: 844 }]] as const) {
    await atlas.setViewportSize(viewport);
    await atlas.locator('[data-view="flows"]').first().click();
    await atlas.locator(".flow-card").nth(4).screenshot({ path: `${gallery}/percurso-depois-${label}.png` });
    for (const id of [18, 19, 20, 21, 22, 23, 24]) {
      await atlas.evaluate(id => (window as unknown as { openScreen: (id: number) => void }).openScreen(id), id);
      await atlas.locator("#screen-preview").screenshot({ path: `${gallery}/atlas-${id}-depois-${label}.png` });
    }
  }
  await atlas.close();
});

// Toda gravação desta jornada usa identidades e Núcleos temporários no backend local.
test("conferir e editar não grava; envio, aceite e recusa respeitam o ciclo", async ({ page, account }, testInfo) => {
  test.setTimeout(120_000);
  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_LOCAL_SERVICE_KEY!, { auth: { persistSession: false } });
  const email = `proposal-${randomUUID()}@example.test`, password = `Aa1!${randomUUID()}`;
  const person = await admin.auth.admin.createUser({ email, password, email_confirm: true });
  if (person.error || !person.data.user) throw new Error("Falha ao criar participante local.");
  const memberId = person.data.user.id, nucleusId = randomUUID();
  const memberContext = await page.context().browser()!.newContext({ viewport: page.viewportSize()! });
  try {
    localSql(`insert into public.nuclei(id,type,name,purpose,created_by) values('${nucleusId}','familia','Jardim da proposta','Cultivar presença.','${account.id}');
      insert into public.nucleus_members(nucleus_id,user_id,role) values('${nucleusId}','${account.id}','creator'),('${nucleusId}','${memberId}','member');`);
    const hub = `/nucleos/${nucleusId}/acordos`;
    await page.goto(hub);
    await page.getByLabel("O que vamos fazer?").fill("Conversar após jantar");
    await page.getByLabel("Como será?").fill("Sem telas e sem cobrança");
    await page.getByLabel("Quando?", { exact: true }).fill("Depois do jantar");
    await page.getByLabel("Com que frequência?").fill("Diária");
    await page.getByLabel("Duração do teste (dias)").fill("14");
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `${gallery}/app-formulario-${testInfo.project.name}.png`, fullPage: true });
    await page.getByRole("button", { name: "Conferir proposta", exact: true }).click();
    const review = page.getByRole("region", { name: "Confira antes de propor" });
    await expect(review).toContainText("14 dias");
    await expect(review).toContainText("seu aceite");
    await expect(page.getByRole("heading", { name: "Confira antes de propor" })).toBeFocused();
    expect(localSql(`select count(*) from public.nucleus_agreements where nucleus_id='${nucleusId}';`).trim()).toBe("0");
    await page.getByRole("button", { name: "Editar proposta", exact: true }).click();
    await expect(page.getByLabel("O que vamos fazer?")).toHaveValue("Conversar após jantar");
    await expect(page.getByLabel("O que vamos fazer?")).toBeFocused();
    await page.getByLabel("O que vamos fazer?").fill("Presença após jantar");
    await page.getByRole("button", { name: "Conferir proposta", exact: true }).click();
    await expect(review).toContainText("Presença após jantar");
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `${gallery}/app-conferencia-${testInfo.project.name}.png`, fullPage: true });
    await page.getByRole("button", { name: "Enviar para aprovação", exact: true }).click();
    await expect(page).toHaveURL(/resultado=proposta/);
    expect(localSql(`select status from public.nucleus_agreements where nucleus_id='${nucleusId}';`).trim()).toBe("pending");
    const participant = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
      cookies: { getAll: () => [], setAll: async entries => {
        await memberContext.addCookies(entries.map(({ name, value }) => ({ name, value, url: "http://127.0.0.1:3200", httpOnly: true, sameSite: "Lax" as const })));
      } },
    });
    if ((await participant.auth.signInWithPassword({ email, password })).error) throw new Error("Falha ao autenticar participante.");
    const agreementId = localSql(`select id from public.nucleus_agreements where nucleus_id='${nucleusId}';`).trim();
    const memberPage = await memberContext.newPage();
    await memberPage.goto(hub);
    // A navegação pode renderizar o carregamento; capturar somente a proposta pronta para responder.
    await expect(memberPage.getByText("Teste: 14 dias após o aceite de todos.", { exact: false })).toBeVisible();
    await expect(memberPage.getByRole("button", { name: "Aceitar proposta", exact: true })).toBeVisible();
    await memberPage.evaluate(() => window.scrollTo(0, 0));
    await memberPage.screenshot({ path: `${gallery}/app-respostas-${testInfo.project.name}.png`, fullPage: true });
    await expect(memberPage.getByText("Teste: 14 dias após o aceite de todos.", { exact: false })).toBeVisible();
    await memberPage.getByRole("button", { name: "Aceitar proposta", exact: true }).click();
    await expect(memberPage).toHaveURL(/resultado=resposta/);
    await page.reload();
    await expect(page.getByRole("link", { name: "Ver detalhe do hábito" })).toBeVisible();
    expect(localSql(`select status from public.nucleus_agreements where id='${agreementId}';`).trim()).toBe("testing");
    await page.getByRole("link", { name: "Ver detalhe do hábito" }).click();
    // O título também aparece no hub; URL e marcador exclusivos confirmam a página de detalhe.
    await expect(page).toHaveURL(new RegExp(`/acordos/${agreementId}$`));
    await expect(page.getByRole("heading", { name: "O que vamos experimentar", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Presença após jantar", exact: true })).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `${gallery}/app-detalhe-${testInfo.project.name}.png`, fullPage: true });
    await page.goto(hub);
    await page.getByLabel("O que vamos fazer?").fill("Outra proposta");
    await page.getByLabel("Como será?").fill("Recusa sem penalidade");
    await page.getByLabel("Quando?", { exact: true }).fill("À noite");
    await page.getByLabel("Com que frequência?").fill("Semanal");
    await page.getByLabel("Duração do teste (dias)").fill("7");
    await page.getByRole("button", { name: "Conferir proposta", exact: true }).click();
    await page.getByRole("button", { name: "Enviar para aprovação", exact: true }).click();
    await expect(page).toHaveURL(/resultado=proposta/);
    const declinedId = localSql(`select id from public.nucleus_agreements where nucleus_id='${nucleusId}' and title='Outra proposta';`).trim();
    await memberPage.goto(hub);
    // A recusa usa a confirmação contextual real, sem um voto implícito no cancelamento.
    memberPage.once("dialog", dialog => dialog.dismiss());
    await memberPage.getByRole("button", { name: "Recusar proposta", exact: true }).click();
    expect(localSql(`select status from public.nucleus_agreements where id='${declinedId}';`).trim()).toBe("pending");
    memberPage.once("dialog", dialog => dialog.accept());
    await memberPage.getByRole("button", { name: "Recusar proposta", exact: true }).click();
    await expect(memberPage).toHaveURL(/resultado=resposta/);
    expect(localSql(`select status from public.nucleus_agreements where id='${declinedId}';`).trim()).toBe("declined");
  } finally {
    await memberContext.close();
    localSql(`delete from public.nuclei where id='${nucleusId}';`);
    if ((await admin.auth.admin.deleteUser(memberId)).error) throw new Error("Falha ao limpar participante local.");
  }
});

test("falha de criação conserva os termos para editar e tentar novamente", async ({ page, account }) => {
  const nucleusId = randomUUID();
  localSql(`insert into public.nuclei(id,type,name,purpose,created_by) values('${nucleusId}','familia','Jardim individual','Aguardar participante.','${account.id}');
    insert into public.nucleus_members(nucleus_id,user_id,role) values('${nucleusId}','${account.id}','creator');`);
  await page.goto(`/nucleos/${nucleusId}/acordos`);
  await page.getByLabel("O que vamos fazer?").fill("Conversar");
  await page.getByLabel("Como será?").fill("Sem telas");
  await page.getByLabel("Quando?", { exact: true }).fill("À noite");
  await page.getByLabel("Com que frequência?").fill("Semanal");
  await page.getByLabel("Duração do teste (dias)").fill("7");
  await page.getByRole("button", { name: "Conferir proposta", exact: true }).click();
  await page.getByRole("button", { name: "Enviar para aprovação", exact: true }).click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText("ao menos duas pessoas");
  await page.getByRole("button", { name: "Editar proposta", exact: true }).click();
  await expect(page.getByLabel("O que vamos fazer?")).toHaveValue("Conversar");
  await expect(page.getByLabel("Duração do teste (dias)")).toHaveValue("7");
  // Experiência compartilha o formulário, mas não deve herdar o prazo obrigatório do Hábito.
  await page.getByRole("combobox", { name: "Categoria", exact: true }).selectOption("experience");
  await expect(page.getByLabel("Duração do teste (dias)")).toHaveCount(0);
  await page.getByRole("button", { name: "Conferir proposta", exact: true }).click();
  await expect(page.getByRole("region", { name: "Confira antes de propor" })).toContainText("Experiência");
  await expect(page.getByRole("region", { name: "Confira antes de propor" })).not.toContainText("Duração do teste");
});
