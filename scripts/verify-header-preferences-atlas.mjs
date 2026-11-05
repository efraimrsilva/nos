import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";

const gallery = path.resolve("Documentacao_Projeto_Nos/wireframes/comparacoes/v3.7.1-2026-11-05-cabecalho-preferencias-tela_13-tela_14-tela_60-tela_66");
const before = process.env.NOS_UI_BEFORE === "1";
mkdirSync(gallery, { recursive: true });
const browser = await chromium.launch();
try {
  for (const mobile of [false, true]) {
    const page = await browser.newPage({ viewport: mobile ? { width: 430, height: 950 } : { width: 1600, height: 1100 } });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    const url = pathToFileURL(path.resolve("Documentacao_Projeto_Nos/wireframes/atlas/index.html")).href;
    const capture = async name => page.screenshot({ path: path.join(gallery, `${before ? "antes" : "depois"}-atlas-${mobile ? "mobile" : "desktop"}-${name}.png`), animations: "disabled" });
    await page.goto(url + "#tela-66");
    await page.getByRole("button", { name: mobile ? "Celular" : "Web", exact: true }).click();
    await capture("conta");
    for (const [id, name] of [[14, "agenda"], [13, "inicio"]]) {
      await page.goto(url + `#tela-${id}`);
      await expectPreview(page);
      if (!before && id === 14) assert.match(await page.locator("#screen-preview .live-agenda-notice").innerText(), /Agenda em desenvolvimento/);
      await capture(name);
    }
    if (before) {
      await page.locator('#screen-preview [data-live-dialog="60"]').first().click();
    } else {
      const bell = page.locator('#screen-preview [data-live-notifications]');
      await bell.evaluate(element => element.scrollIntoView({ block: "start" }));
      await bell.click();
      const panel = await page.locator('.live-notifications-popover:popover-open').boundingBox();
      assert.ok(panel.x >= 0 && panel.x + panel.width <= (mobile ? 430 : 1600));
      assert.ok(panel.y >= 0 && panel.y + panel.height <= (mobile ? 950 : 1100));
      assert.equal(await page.locator('.live-notifications-popover:popover-open').count(), 1);
      assert.equal(await page.locator('dialog:modal').count(), 0);
    }
    await capture("notificacoes");
    await page.keyboard.press("Escape");
    if (!before) assert.equal(await page.locator('.live-notifications-popover:popover-open').count(), 0);
    await page.locator('#screen-preview [data-live-report]').first().click();
    await capture("relato");
    if (!before) assert.ok((await page.getByRole('dialog').innerText()).includes('Em último caso, o e-mail da conta poderá ser usado para contato.'));
    assert.deepEqual(errors, []);
    await page.close();
  }
  console.log(`Atlas: capturas ${before ? "anteriores" : "finais"} desktop/celular e interações verificadas.`);
} finally { await browser.close(); }

async function expectPreview(page) {
  await page.locator('#screen-preview .current-atlas-shell').waitFor();
}
