import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";

const gallery = path.resolve("Documentacao_Projeto_Nos/wireframes/comparacoes/v3.3.1-2026-10-29-conta-perfil-tela_13-tela_66-tela_69");
mkdirSync(gallery, { recursive: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto(pathToFileURL(path.resolve("Documentacao_Projeto_Nos/wireframes/atlas/index.html")).href + "#tela-13");
  await page.getByRole("button", { name: "Web", exact: true }).click();
  await page.locator("#screen-preview .live-profile-trigger").click();
  const panel = page.locator(".live-profile-popover:popover-open");
  assert.equal(await panel.locator(".live-account-preferences > .live-panel").count(), 6);
  assert.equal(await panel.getByRole("heading", { name: "Notificações", exact: true }).count(), 0);
  assert.equal(await panel.getByRole("heading", { name: "Apagar minha conta", exact: true }).count(), 0);
  assert.equal(await page.locator("#screen-preview [data-live-search-dialog]").count(), 0);
  await page.screenshot({ path: path.join(gallery, "atlas-desktop-perfil.png"), animations: "disabled" });
  await panel.locator("[data-live-appearance]").click();
  const appearance = page.getByRole("dialog", { name: "Aparência", exact: true });
  assert.equal(await appearance.isVisible(), true);
  assert.equal(await appearance.locator("[data-live-theme]").count(), 9);
  await page.screenshot({ path: path.join(gallery, "atlas-desktop-aparencia.png"), animations: "disabled" });
  await page.keyboard.press("Escape");
  assert.equal(await panel.isVisible(), true);
  await page.keyboard.press("Escape");
  assert.equal(await page.locator(".live-profile-popover:popover-open").count(), 0);
  for (const mobile of [false, true]) {
    await page.setViewportSize(mobile ? { width: 390, height: 844 } : { width: 1440, height: 1000 });
    await page.evaluate(() => openScreen(66));
    await page.getByRole("button", { name: mobile ? "Celular" : "Web", exact: true }).click();
    assert.equal(await page.locator("#screen-preview .current-atlas-main > .live-account-preferences > .live-panel").count(), 8);
    await page.screenshot({ path: path.join(gallery, `atlas-${mobile ? "mobile" : "desktop"}-conta.png`), animations: "disabled" });
    await page.locator("#screen-preview [data-live-delete-account]").click();
    const deletion = page.getByRole("dialog", { name: "Apagar minha conta", exact: true });
    assert.equal(await deletion.isVisible(), true);
    assert.equal(await deletion.locator("[data-live-delete-preview]").isDisabled(), true);
    await page.screenshot({ path: path.join(gallery, `atlas-${mobile ? "mobile" : "desktop"}-exclusao.png`), animations: "disabled" });
    await page.keyboard.press("Escape");
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  }
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ profileSections: 6, accountSections: 8, themes: 9, desktop: true, mobile: true, errors }));
} finally { await browser.close(); }
