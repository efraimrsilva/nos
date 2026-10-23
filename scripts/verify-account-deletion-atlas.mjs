import assert from "node:assert/strict";
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const gallery = path.resolve("Documentacao_Projeto_Nos/wireframes/comparacoes/v3.1.0-2026-10-23-exclusao-conta");
mkdirSync(gallery, { recursive: true });
const browser = await chromium.launch();
try {
  for (const [name, viewport] of [["desktop", { width: 1440, height: 1000 }], ["mobile", { width: 390, height: 844 }]]) {
    const page = await browser.newPage({ viewport });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(pathToFileURL(path.resolve("Documentacao_Projeto_Nos/wireframes/atlas/index.html")).href);
    await page.evaluate(() => openScreen(69));
    await page.locator("#screen-preview [data-live-delete-account]").first().click();
    const dialog = page.locator("#atlas-live-dialog");
    const button = dialog.locator("[data-live-delete-preview]");
    assert.equal(await button.isDisabled(), true);
    await dialog.locator("[data-live-delete-phrase]").fill("apagar conta");
    assert.equal(await button.isDisabled(), true);
    await dialog.locator("[data-live-delete-phrase]").fill("APAGAR CONTA");
    assert.equal(await button.isEnabled(), true);
    await button.scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(gallery, `atlas-69-confirmacao-${name}.png`), animations: "disabled" });
    await button.click();
    assert.match(await dialog.locator("[data-live-delete-result]").innerText(), /Nenhuma conta ou dado foi alterado/);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    assert.deepEqual(errors, []);
    await page.close();
  }
  console.log("Atlas: frase, cancelamento disponível, simulação sem exclusão e responsividade aprovados em desktop/mobile.");
} finally {
  await browser.close();
}
