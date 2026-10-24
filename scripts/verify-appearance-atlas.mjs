import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [], external = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("request", request => { if (/^https?:/.test(request.url())) external.push(request.url()); });
  await page.goto(pathToFileURL(path.resolve("Documentacao_Projeto_Nos/wireframes/atlas/index.html")).href + "#tela-66");
  const preview = page.locator("#screen-preview");
  await preview.locator("[data-atlas-menu]").click();
  await page.getByRole("dialog").locator("[data-live-appearance]").click();
  const dialog = page.getByRole("dialog", { name: "Aparência", exact: true });
  assert.equal(await dialog.locator("[data-live-theme]").count(), 9);
  for (const [id, canvas] of [["light", "rgb(245, 247, 241)"], ["dark", "rgb(17, 25, 22)"], ["black", "rgb(0, 0, 0)"], ["rose", "rgb(255, 245, 247)"], ["lavender", "rgb(246, 243, 255)"], ["ocean", "rgb(238, 246, 252)"], ["forest", "rgb(237, 245, 238)"], ["solar", "rgb(255, 241, 214)"], ["neon", "rgb(8, 12, 32)"]]) {
    await dialog.locator(`[data-live-theme="${id}"]`).click();
    assert.equal(await dialog.locator(".atlas-theme-sample").evaluate(element => getComputedStyle(element).backgroundColor), canvas);
    assert.match(await dialog.getByRole("status").innerText(), /nenhuma preferência salva/);
  }
  const gallery = path.resolve("Documentacao_Projeto_Nos/wireframes/comparacoes/v3.2.1-2026-10-23-temas-solar-neon");
  fs.mkdirSync(gallery, { recursive: true });
  await page.screenshot({ path: path.join(gallery, "atlas-66-temas.png") });
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Web", exact: true }).click();
  await preview.locator(".current-atlas-nav [data-live-appearance]").click();
  assert.equal(await dialog.isVisible(), true);
  await page.screenshot({ path: path.join(gallery, "atlas-66-temas-desktop.png") });
  assert.deepEqual(errors, []); assert.deepEqual(external, []);
  console.log(JSON.stringify({ themes: 9, more: true, desktop: true, localPreviewOnly: true, errors, external }));
} finally { await browser.close(); }
