import { test, expect, localSql } from "./fixtures";
import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import path from "node:path";

const gallery = path.resolve("Documentacao_Projeto_Nos/wireframes/comparacoes/v3.3.1-2026-10-29-conta-perfil-tela_13-tela_66-tela_69");

test("conta preserva o Núcleo e oferece ações diretas no perfil desktop", async ({ page, account }, info) => {
  test.setTimeout(90_000);
  const mobile = info.project.name === "mobile";
  await page.setViewportSize(mobile ? { width: 390, height: 844 } : { width: 1440, height: 1000 });
  const first = randomUUID(), second = randomUUID();
  localSql(`insert into public.nuclei(id,type,name,purpose,created_by) values('${first}','familia','Jardim Aurora','Cuidar juntos','${account.id}'),('${second}','familia','Jardim Horizonte','Cuidar juntos','${account.id}'); insert into public.nucleus_members(nucleus_id,user_id,role) values('${first}','${account.id}','admin'),('${second}','${account.id}','admin');`);
  mkdirSync(gallery, { recursive: true });
  await page.goto(`/nucleos/${first}`);
  await expect(page.getByRole("button", { name: "Buscar uma área", exact: true })).toHaveCount(0);
  if (!mobile) {
    await page.getByRole("button", { name: "Abrir Conta, Preferências e Ajuda", exact: true }).click();
    const panel = page.locator(".account-popover:popover-open");
    await expect(panel.locator(".account-preferences-sections > section")).toHaveCount(6);
    await expect(panel.getByRole("heading", { name: "Notificações", exact: true })).toHaveCount(0);
    await expect(panel.getByRole("heading", { name: "Apagar minha conta", exact: true })).toHaveCount(0);
    await expect(page).toHaveURL(new RegExp(`/nucleos/${first}$`));
    await page.screenshot({ path: path.join(gallery, "app-desktop-perfil.png"), animations: "disabled" });
    await panel.getByRole("button", { name: /Dados da conta/ }).click();
    const details = page.getByRole("dialog", { name: "Dados da conta", exact: true });
    await expect(details).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(details).not.toBeVisible();
    await expect(panel).toBeVisible();
    await panel.getByRole("button", { name: /^Aparência/ }).click();
    const appearance = page.getByRole("dialog", { name: "Aparência", exact: true });
    await expect(appearance).toBeVisible();
    await appearance.getByRole("radio", { name: "Escuro — Anoitecer", exact: true }).check();
    await expect(appearance.getByRole("status")).toHaveText("Tema salvo na sua conta.");
    await page.screenshot({ path: path.join(gallery, "app-desktop-aparencia.png"), animations: "disabled" });
    await page.keyboard.press("Escape");
    await page.keyboard.press("Escape");
    await expect(page.locator(".account-popover:popover-open")).toHaveCount(0);
  } else {
    await expect(page.getByRole("button", { name: "Abrir Conta, Preferências e Ajuda", exact: true })).not.toBeVisible();
    await page.getByRole("link", { name: "Minha conta", exact: true }).click();
  }
  await page.goto("/conta");
  await expect(page.locator(".account-workspace .account-preferences-sections > section")).toHaveCount(8);
  await expect(page.getByRole("button", { name: "Conta e segurança", exact: true })).toHaveCount(0);
  await page.reload();
  const nav = page.getByRole("navigation", { name: mobile ? "Navegação móvel" : "Áreas do Nós", exact: true });
  await expect(nav.getByRole("link", { name: "Início", exact: true })).toHaveAttribute("href", `/nucleos/${first}`);
  await page.screenshot({ path: path.join(gallery, `app-${mobile ? "mobile" : "desktop"}-conta.png`), fullPage: true, animations: "disabled" });
  await page.locator(".account-workspace #apagar-minha-conta").getByRole("button", { name: /Apagar minha conta/ }).click();
  const deletion = page.getByRole("dialog", { name: "Apagar minha conta", exact: true });
  await expect(deletion).toBeVisible();
  await expect(deletion.getByRole("button", { name: "Apagar minha conta definitivamente", exact: true })).toBeDisabled();
  await page.screenshot({ path: path.join(gallery, `app-${mobile ? "mobile" : "desktop"}-exclusao.png`), animations: "disabled" });
  await deletion.getByRole("button", { name: "Cancelar", exact: true }).click();
  await expect(deletion).not.toBeVisible();
  await page.goto(`/nucleos/${second}`);
  // A navegação programática deve aguardar a seleção ser lembrada pela página hidratada.
  await expect.poll(async () => (await page.context().cookies()).find(cookie => cookie.name === `nos-last-nucleus-${account.id}`)?.value).toBe(second);
  await page.goto("/conta");
  await expect(nav.getByRole("link", { name: "Início", exact: true })).toHaveAttribute("href", `/nucleos/${second}`);
  // Simula a perda de associação por outra administração, sem alterar contas reais.
  localSql(`delete from public.nucleus_members where nucleus_id='${second}' and user_id='${account.id}'`);
  await page.reload();
  await expect(nav.getByRole("link", { name: "Início", exact: true })).toHaveCount(0);
  await expect(page.locator(".current-nucleus-switch")).not.toContainText("Jardim Horizonte");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
