import { randomUUID } from "node:crypto";
import { test, expect, localSql } from "./fixtures";

test("proposta pode ser criada sem outro membro; publicação não aceita termos", async ({ page, account }) => {
  const nucleus = randomUUID();
  localSql(`insert into public.nuclei(id,type,name,purpose,created_by) values('${nucleus}','familia','Jardim individual','Cuidar','${account.id}'); insert into public.nucleus_members(nucleus_id,user_id,role) values('${nucleus}','${account.id}','admin');`);
  await page.goto(`/nucleos/${nucleus}/acordos`);
  await page.getByRole("button", { name: "Nova proposta", exact: true }).click();
  await page.getByLabel("O que vamos fazer?").fill("Conversar");
  await page.getByLabel("Como será?").fill("Com atenção");
  await page.getByLabel("Quando?", { exact: true }).fill("Noite");
  await page.getByLabel("Com que frequência?").fill("Semanal");
  await page.getByLabel("Duração do teste (dias)").fill("7");
  await page.getByRole("button", { name: "Conferir proposta", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Confira antes de propor" })).toBeFocused();
  await page.getByRole("button", { name: "Editar proposta", exact: true }).click();
  await expect(page.getByLabel("O que vamos fazer?")).toHaveValue("Conversar");
  await page.getByRole("combobox", { name: "Categoria", exact: true }).selectOption("experience");
  await expect(page.getByLabel("Duração do teste (dias)")).toHaveCount(0);
  await page.getByRole("button", { name: "Conferir proposta", exact: true }).click();
  await page.getByRole("button", { name: "Enviar proposta", exact: true }).click();
  await expect(page).toHaveURL(/categoria=experience/);
  expect(localSql(`select status from public.nucleus_agreements where nucleus_id='${nucleus}'`).trim()).toBe("pending");
  expect(localSql(`select count(*) from public.nucleus_agreement_participants p join public.nucleus_agreements a on a.id=p.agreement_id where a.nucleus_id='${nucleus}' and p.response='accepted'`).trim()).toBe("0");
  // O retorno do servidor limpa o rascunho concluído; reabrir não oferece reenvio da mesma proposta.
  await page.getByRole("button", { name: "Nova proposta", exact: true }).click();
  const freshProposal = page.getByRole("dialog", { name: "Nova proposta", exact: true });
  await expect(freshProposal.getByLabel("O que vamos fazer?")).toHaveValue("");
  await expect(freshProposal.getByRole("button", { name: "Enviar proposta", exact: true })).toHaveCount(0);
  await freshProposal.getByRole("button", { name: "Fechar Nova proposta", exact: true }).click();
  expect(localSql(`select count(*) from public.nucleus_agreements where nucleus_id='${nucleus}'`).trim()).toBe("1");
  await page.getByRole("button", { name: /Conversar/ }).click();
  page.once("dialog", dialog => dialog.accept());
  await page.getByRole("button", { name: "Recusar proposta", exact: true }).click();
  await expect(page).toHaveURL(/resultado=resposta/);
  expect(localSql(`select status from public.nucleus_agreements where nucleus_id='${nucleus}'`).trim()).toBe("pending");
});

test("registros consecutivos renovam o modal sem repetir o momento anterior", async ({ page, account }) => {
  const nucleus = randomUUID(), habit = randomUUID();
  localSql(`insert into public.nuclei(id,type,name,purpose,created_by) values('${nucleus}','familia','Momentos consecutivos','Cuidar','${account.id}'); insert into public.nucleus_members(nucleus_id,user_id,role) values('${nucleus}','${account.id}','admin'); insert into public.nucleus_agreements(id,nucleus_id,created_by,category,title,description,timing,frequency,status,trial_days) values('${habit}','${nucleus}','${account.id}','habit','Uma pausa juntos','Estar perto.','No jantar','Semanal','testing',7); insert into public.nucleus_agreement_participants(agreement_id,user_id,response,accepted_version,responded_at) values('${habit}','${account.id}','accepted',1,now());`);
  try {
    await page.goto(`/nucleos/${nucleus}/acordos/${habit}`);
    for (const note of ["Primeiro encontro", "Segundo encontro"]) {
      await page.getByRole("button", { name: "Registrar momento", exact: true }).click();
      const modal = page.getByRole("dialog", { name: "Registrar momento", exact: true });
      await expect(modal.getByRole("textbox")).toHaveValue("");
      await modal.getByLabel("Bem", { exact: true }).check();
      await modal.getByRole("textbox").fill(note);
      await modal.getByRole("button", { name: "Salvar momento", exact: true }).click();
      await expect(page.getByRole("dialog")).toHaveCount(0);
      await expect(page.getByText(note, { exact: true })).toBeVisible();
    }
    expect(localSql(`select count(*) from public.nucleus_habit_moments where agreement_id='${habit}'`).trim()).toBe("2");
  } finally { localSql(`delete from public.nuclei where id='${nucleus}';`); }
});

test("lista móvel reutiliza os detalhes e a explicação respeita o controle manual", async ({ page, account }) => {
  const nucleus = randomUUID(), habit = randomUUID(), proposal = randomUUID();
  localSql(`insert into public.nuclei(id,type,name,purpose,created_by) values('${nucleus}','familia','Lista de acordos','Cuidar','${account.id}'); insert into public.nucleus_members(nucleus_id,user_id,role) values('${nucleus}','${account.id}','admin'); insert into public.nucleus_agreements(id,nucleus_id,created_by,category,title,description,timing,frequency,status,trial_days) values('${habit}','${nucleus}','${account.id}','habit','Uma refeição com presença','Conversar com atenção.','No jantar','Semanal','testing',7),('${proposal}','${nucleus}','${account.id}','habit','Uma caminhada para conversar','Estar ao ar livre.','Domingo','Semanal','pending',7); insert into public.nucleus_agreement_participants(agreement_id,user_id,response,accepted_version,responded_at) values('${habit}','${account.id}','accepted',1,now()) on conflict(agreement_id,user_id) do update set response='accepted',accepted_version=1,responded_at=now();`);
  try {
    await page.clock.install();
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(`/nucleos/${nucleus}/acordos`);
    await page.getByRole("button", { name: "Kanban · Fluxo", exact: true }).click();
    const how = page.getByRole("button", { name: "Como funciona", exact: true });
    await expect(how).toHaveAttribute("aria-expanded", "true");
    await how.click();
    await how.click();
    await page.clock.fastForward(5100);
    await expect(how).toHaveAttribute("aria-expanded", "true");
    await page.reload();
    await page.getByRole("button", { name: "Kanban · Fluxo", exact: true }).click();
    await expect(how).toHaveAttribute("aria-expanded", "true");
    await page.clock.fastForward(5100);
    await expect(how).toHaveAttribute("aria-expanded", "false");
    await how.click();
    await expect(how).toHaveAttribute("aria-expanded", "true");
    await page.getByRole("button", { name: "Painéis · Lado a lado", exact: true }).click();
    await expect(how).toHaveAttribute("aria-expanded", "true");
    expect(await page.locator(".agreements-how-content").evaluate(element => getComputedStyle(element).transitionDuration)).toBe("0s");

    await page.setViewportSize({ width: 390, height: 844 });
    const list = page.getByRole("list", { name: "Lista de acordos", exact: true });
    await expect(list).toBeVisible();
    await expect(list.getByRole("listitem")).toHaveCount(2);
    await expect(page.locator(".agreements-board")).toHaveCount(0);
    await expect(page.locator(".agreements-panels")).toHaveCount(0);
    await page.getByLabel("Buscar nos acordos desta página").fill("caminhada");
    await expect(list.getByRole("listitem")).toHaveCount(1);
    await page.getByLabel("Buscar nos acordos desta página").fill("");
    await expect(list.getByRole("listitem")).toHaveCount(2);
    // Uma única visualização monta o formulário, inclusive quando o diálogo está fechado.
    await expect(page.locator('input[name="mood"][value="good"]')).toHaveCount(1);
    await list.getByRole("button", { name: /Uma refeição com presença/ }).click();
    const detail = page.getByRole("dialog", { name: "Uma refeição com presença", exact: true });
    await expect(detail).toBeVisible();
    await detail.getByRole("button", { name: "Registrar momento", exact: true }).click();
    await expect(page.getByRole("dialog", { name: "Registrar momento", exact: true })).toBeVisible();
    await expect(page.getByLabel("Bem", { exact: true })).toHaveCount(1);
    expect(localSql(`select count(*) from public.nucleus_habit_moments where agreement_id='${habit}'`).trim()).toBe("0");
  } finally { localSql(`delete from public.nuclei where id='${nucleus}';`); }
});
