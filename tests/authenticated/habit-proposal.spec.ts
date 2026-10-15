import { randomUUID } from "node:crypto";
import { test, expect, localSql } from "./fixtures";

test("proposta pode ser criada sem outro membro; publicação não aceita termos", async ({ page, account }) => {
  const nucleus = randomUUID();
  localSql(`insert into public.nuclei(id,type,name,purpose,created_by) values('${nucleus}','familia','Jardim individual','Cuidar','${account.id}'); insert into public.nucleus_members(nucleus_id,user_id,role) values('${nucleus}','${account.id}','admin');`);
  await page.goto(`/nucleos/${nucleus}/acordos`);
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
  page.once("dialog", dialog => dialog.accept());
  await page.getByRole("button", { name: "Recusar proposta", exact: true }).click();
  await expect(page).toHaveURL(/resultado=resposta/);
  expect(localSql(`select status from public.nucleus_agreements where nucleus_id='${nucleus}'`).trim()).toBe("pending");
});
