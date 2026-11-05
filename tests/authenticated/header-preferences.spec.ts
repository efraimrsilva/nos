import { test, expect, localSql } from "./fixtures";
import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import path from "node:path";

const gallery = path.resolve("Documentacao_Projeto_Nos/wireframes/comparacoes/v3.7.1-2026-11-05-cabecalho-preferencias-tela_13-tela_14-tela_60-tela_66");

test("cabeçalho e preferências mantêm os atalhos e usam notificações suspensas", async ({ page, account }, info) => {
  test.setTimeout(120_000);
  const mobile = info.project.name === "mobile", before = process.env.NOS_UI_BEFORE === "1";
  await page.setViewportSize(mobile ? { width: 390, height: 844 } : { width: 1440, height: 1000 });
  const nucleus = randomUUID();
  localSql(`insert into public.nuclei(id,type,name,purpose,created_by) values('${nucleus}','familia','Jardim de exemplo','Cuidar juntos','${account.id}'); insert into public.nucleus_members(nucleus_id,user_id,role) values('${nucleus}','${account.id}','admin');`);
  mkdirSync(gallery, { recursive: true });
  const capture = async (name: string) => page.screenshot({ path: path.join(gallery, `${before ? "antes" : "depois"}-app-${info.project.name}-${name}.png`), animations: "disabled", fullPage: true });
  await page.goto("/conta");
  const appearance = page.locator(".account-workspace #aparencia");
  await expect(appearance).toBeAttached();
  await capture("conta");
  if (!before) {
    await expect(page.locator(".current-footer")).toHaveCount(0);
    await expect(appearance.locator(":scope > .settings-copy")).toHaveCount(0);
    await expect(appearance.getByRole("button")).toContainText("Escolha as cores do seu espaço");
  }
  const header = page.locator(".current-header-actions");
  await header.getByRole("button", { name: "Relatar um problema", exact: true }).click();
  const report = page.getByRole("dialog", { name: "Relatar um problema", exact: true });
  await capture("relato");
  if (!before) await expect(report).toContainText("Em último caso, o e-mail da conta poderá ser usado para contato.");
  await page.keyboard.press("Escape");
  await page.goto(`/nucleos/${nucleus}/agenda`);
  await expect(page.getByRole("heading", { name: "Tempo para o que importa.", exact: true })).toBeVisible();
  await capture("agenda");
  if (!before) {
    await expect(page.getByRole("note")).toContainText("Esboço de funcionalidade · Agenda em desenvolvimento");
    const navigation = page.getByRole("navigation", { name: mobile ? "Navegação móvel" : "Áreas do Nós" });
    await expect(navigation.getByRole("link", { name: "Agenda", exact: true })).toHaveAccessibleDescription(/Esboço de funcionalidade/);
  }
  await page.goto(`/nucleos/${nucleus}/acordos`);
  if (!before) {
    await page.getByRole("button", { name: "Enviar convite", exact: true }).click();
    await expect(page.getByRole("dialog", { name: "Enviar convite", exact: true })).toBeVisible();
    await page.keyboard.press("Escape");
  }
  const bell = header.getByRole("button", { name: "Notificações — esboço" });
  await bell.click();
  await capture("notificacoes");
  const panel = page.locator(".notifications-popover:popover-open");
  // Este é o comportamento novo: o painel não bloqueia o restante da página.
  await expect(panel).toBeVisible();
  await expect(page.locator("dialog:modal")).toHaveCount(0);
  await expect(panel).toContainText("Esboço de funcionalidade");
  const box = await panel.boundingBox();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(mobile ? 390 : 1440);
  await page.keyboard.press("Escape");
  await expect(panel).toHaveCount(0);
  await expect(bell).toBeFocused();
  await bell.click();
  await page.mouse.click(2, 2);
  await expect(panel).toHaveCount(0);
  await bell.click();
  await page.getByRole("button", { name: "Fechar notificações" }).click();
  await expect(panel).toHaveCount(0);
  if (!mobile) {
    await bell.click();
    await page.getByRole("button", { name: "Abrir Conta, Preferências e Ajuda" }).click();
    await expect(panel).toHaveCount(0);
    await expect(page.locator(".account-popover:popover-open")).toBeVisible();
    await bell.click();
    await expect(page.locator(".account-popover:popover-open")).toHaveCount(0);
  } else await bell.click();
  await panel.getByRole("link", { name: /Consultar Acordos/ }).click();
  await expect(panel).toHaveCount(0);
  const bugBox = await header.locator(".problem-report-header svg").boundingBox();
  const bellBox = await bell.locator("svg").boundingBox();
  expect(Math.abs((bugBox!.y + bugBox!.height / 2) - (bellBox!.y + bellBox!.height / 2))).toBeLessThan(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
