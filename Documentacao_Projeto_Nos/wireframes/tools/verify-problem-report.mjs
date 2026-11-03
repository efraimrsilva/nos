import assert from "node:assert/strict";
import { chromium } from "@playwright/test";
import { pathToFileURL } from "node:url";
import path from "node:path";
import fs from "node:fs";

const root = process.env.NOS_SUPPORT_GALLERY || "artifacts/regression-captures/support-atlas";
fs.mkdirSync(root, { recursive: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1600, height: 1200 }, reducedMotion: "reduce" });
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto(pathToFileURL(path.resolve("Documentacao_Projeto_Nos/wireframes/atlas/index.html")).href);
  for (const mode of ["desktop", "mobile"]) {
    await page.evaluate(() => openScreen(66));
    await page.locator(`[data-width="${mode}"]`).click();
    await page.locator("#screen-preview .preview-wrap").screenshot({ path: `${root}/depois-atlas-conta-${mode}.png` });
    await page.locator("#screen-preview .current-atlas-main .live-account-preferences [data-live-report]").click();
    const dialog = page.locator("#atlas-live-dialog");
    assert.equal(await dialog.locator("textarea").count(), 2);
    assert.equal(await dialog.getByRole("heading", { name: "Relatar um problema", exact: true }).count(), 1);
    await dialog.screenshot({ path: `${root}/depois-atlas-modal-${mode}.png` });
    await dialog.getByLabel("O que aconteceu?", { exact: true }).fill("O formulário de exemplo abre corretamente.");
    await dialog.getByRole("button", { name: "Enviar relato · exemplo", exact: true }).click();
    assert.match(await dialog.locator("[data-live-report-result]").innerText(), /Nenhum e-mail foi enviado/);
    assert.doesNotMatch(await dialog.innerText(), /sintagmasoftware@gmail/);
    await page.mouse.click(2, 2);
    assert.equal(await dialog.isVisible(), false);
    await page.locator("#screen-preview .current-atlas-header .live-icon-button[data-live-report]").click();
    assert.equal(await dialog.isVisible(), true);
    await page.keyboard.press("Escape");
  }
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ supportModal: true, twoFields: true, hiddenRecipient: true, offlineOnly: true, desktop: true, mobile: true, errors }));
} finally { await browser.close(); }
