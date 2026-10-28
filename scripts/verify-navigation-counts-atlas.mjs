import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";

const gallery = path.resolve("Documentacao_Projeto_Nos/wireframes/comparacoes/v3.3.0-2026-10-24-totais-navegacao");
fs.mkdirSync(gallery, { recursive: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [], external = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("request", request => { if (/^https?:/.test(request.url())) external.push(request.url()); });
  await page.goto(pathToFileURL(path.resolve("Documentacao_Projeto_Nos/wireframes/atlas/index.html")).href + "#tela-13");
  const preview = page.locator("#screen-preview");
  assert.equal(await preview.locator(".current-atlas-mobile .live-nav-count").count(), 3);
  assert.equal(await preview.locator(".current-atlas-mobile .live-nav-count").first().getAttribute("title"), "Total geral nos seus Núcleos · exemplo");
  await page.screenshot({ path: path.join(gallery, "atlas-mobile.png") });
  await preview.locator("[data-atlas-menu]").click();
  assert.match(await page.getByRole("dialog").innerText(), /2 Núcleos atuais · total geral de exemplo/);
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Web", exact: true }).click();
  assert.equal(await preview.locator(".current-atlas-nav .live-nav-count").count(), 4);
  await page.screenshot({ path: path.join(gallery, "atlas-desktop.png") });
  assert.deepEqual(errors, []); assert.deepEqual(external, []);
  console.log(JSON.stringify({ desktop: 4, mobile: 3, moreNuclei: 2, illustrativeOnly: true, errors, external }));
} finally { await browser.close(); }
