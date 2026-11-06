import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import { test, expect, localSql } from "./fixtures";

// Rodadas futuras não sobrescrevem uma galeria histórica; a entrega escolhe seu destino explicitamente.
const gallery = process.env.NOS_HABIT_GALLERY || "artifacts/regression-captures/habit-model";

test("três colunas, legado no Hábito comum e Essência somente esboço", async ({ page, account }, info) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const nucleus = randomUUID(), agreement = randomUUID();
  localSql(`insert into public.nuclei(id,type,name,purpose,created_by) values('${nucleus}','familia','Nosso jardim','Cuidar','${account.id}');
    insert into public.nucleus_members(nucleus_id,user_id,role) values('${nucleus}','${account.id}','admin');
    insert into public.nucleus_agreements(id,nucleus_id,created_by,category,title,description,timing,frequency,status,terms_version) values('${agreement}','${nucleus}','${account.id}','experience','Jantar mensal','Um tempo de presença','Noite','Mensal','active',2);
    insert into public.nucleus_agreement_versions(agreement_id,version,title,description,timing,frequency) values('${agreement}',2,'Jantar mensal','Um tempo de presença','Noite','Mensal');
    insert into public.nucleus_agreement_participants(agreement_id,user_id,response,accepted_version) values('${agreement}','${account.id}','accepted',2);`);
  await page.goto(`/nucleos/${nucleus}/acordos?categoria=experience`);
  await expect(page.getByRole("heading", { name: "Cada combinado no seu tempo." })).toBeVisible();
  mkdirSync(gallery, { recursive: true });
  const phase = process.env.NOS_HABIT_CAPTURE_PHASE === "antes" ? "antes" : "depois";
  await page.screenshot({ path: `${gallery}/app-18-${phase}-${info.project.name}.png`, fullPage: true, animations: "disabled" });
  if (info.project.name === "desktop") {
    await expect(page.locator(".agreements-column")).toHaveCount(3);
    await expect(page.locator("#column-habit")).toHaveText("Hábitos");
    await expect(page.locator(".agreements-tone-habit")).toContainText("Jantar mensal");
  }
  await expect(page.getByRole("main")).not.toContainText("Experiência");
  await page.getByRole("button", { name: "Ver esboço de Essência", exact: true }).click();
  const sketch = page.getByRole("dialog", { name: "Nossa Essência", exact: true });
  await expect(sketch).toContainText("Esboço de funcionalidade · ainda não desenvolvido");
  await expect(sketch).toContainText("nada é salvo, enviado ou publicado");
  await sketch.screenshot({ path: `${gallery}/app-36-${phase}-${info.project.name}.png`, animations: "disabled" });
  await page.keyboard.press("Escape");
  await expect(sketch).toBeHidden();
  await page.getByRole("button", { name: "Ver esboço de Essência", exact: true }).click();
  await sketch.getByRole("button", { name: "Fechar Nossa Essência", exact: true }).click();
  await expect(sketch).toBeHidden();
  await page.getByRole("button", { name: "Ver esboço de Essência", exact: true }).click();
  if (info.project.name === "mobile") await page.touchscreen.tap(2, 2);
  else await page.mouse.click(2, 2);
  await expect(sketch).toBeHidden();
  if (info.project.name === "desktop") {
    await page.getByRole("button", { name: "Painéis · Lado a lado", exact: true }).click();
    await expect(page.locator(".agreements-selected")).toContainText("Jantar mensal");
    await expect(page.locator(".agreements-selection")).toContainText("Hábito");
    await page.getByLabel("Buscar nos acordos desta página").fill("sem-correspondencia");
    await expect(page.getByText("Nenhuma correspondência. Tente outra palavra ou limpe a busca.")).toBeVisible();
    await page.getByLabel("Buscar nos acordos desta página").fill("");
    await page.screenshot({ path: `${gallery}/app-18-paineis-depois-desktop.png`, fullPage: true, animations: "disabled" });
  }
  for (const width of info.project.name === "desktop" ? [768, 1440] : [320, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  // O detalhe comum deve funcionar inclusive para um endereço salvo antes da adequação.
  await page.goto(`/nucleos/${nucleus}/acordos/${agreement}`);
  await expect(page.getByRole("heading", { name: "Jantar mensal", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Registrar momento", exact: true }).click();
  const moment = page.getByRole("dialog", { name: "Registrar momento", exact: true });
  await moment.getByRole("radio", { name: "Bem", exact: true }).check();
  await moment.locator('textarea[name="note"]').fill("Foi bom estar presente.");
  await moment.getByRole("button", { name: "Salvar momento", exact: true }).click();
  await expect(page.getByRole("status").filter({ hasText: "Momento registrado" })).toBeVisible();
  await expect(page.getByText("Foi bom estar presente.", { exact: true })).toBeVisible();
  await page.screenshot({ path: `${gallery}/app-24-${phase}-${info.project.name}.png`, fullPage: true, animations: "disabled" });
  expect(localSql(`select category||':'||terms_version||':'||coalesce(trial_days::text,'null') from public.nucleus_agreements where id='${agreement}';`).trim()).toBe("experience:2:null");
  expect(localSql(`select count(*) from public.nucleus_habit_moments where agreement_id='${agreement}';`).trim()).toBe("1");
});
