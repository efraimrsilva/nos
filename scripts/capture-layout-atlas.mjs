// Registra a composição viva e seus modais; o manifesto impede publicar capturas antigas sobrantes.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium, expect } from "@playwright/test";

const output = "artifacts/layout-rebuild-atlas";
fs.mkdirSync(output, { recursive: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1080 }, reducedMotion: "reduce" });
  await page.goto(pathToFileURL(path.resolve("Documentacao_Projeto_Nos/wireframes/atlas/index.html")).href);
  const inventory = await page.evaluate(() => screens.map(screen => ({ id: screen.id, title: screen.title })));
  const captures = [];
  await page.evaluate(() => openScreen(1));
  for (const device of ["desktop", "mobile"]) {
    await page.locator(`[data-width="${device}"]`).click();
    for (const screen of inventory.filter(screen => device === "desktop" || [1,7,12,13,14,18,24,38,44,55,66,69,73].includes(screen.id))) {
      await page.evaluate(id => { document.querySelectorAll("dialog[open]").forEach(dialog => dialog.close()); openScreen(id); }, screen.id);
      const preview = page.locator("#screen-preview .preview-wrap");
      await expect(preview.locator('[data-atlas-revision="3"]')).toHaveCount(1);
      const name = `tela_${String(screen.id).padStart(2,"0")}-${device}.png`;
      await preview.screenshot({ path: path.join(output,name) });
      captures.push({ name, title: screen.title, screen: screen.id, device, modal: false });
      const controls = page.locator('#screen-preview .current-atlas-main [data-atlas-modal]:not([inert] *):visible');
      const count = await controls.count();
      for (let index = 0; index < count; index++) {
        const trigger = controls.nth(index);
        const triggerName = (await trigger.innerText()).trim();
        await trigger.click();
        const dialog = page.locator("#atlas-live-dialog");
        await expect(dialog).toBeVisible();
        const name = `tela_${String(screen.id).padStart(2,"0")}-modal-${index+1}-${device}.png`;
        const title = await dialog.locator("#atlas-live-dialog-title").innerText();
        await dialog.screenshot({ path: path.join(output,name) });
        captures.push({ name, title, trigger: triggerName, screen: screen.id, device, modal: true });
        await page.keyboard.press("Escape");
        await expect(dialog).toBeHidden();
      }
      if (screen.id === 13) {
        const globalControls = page.locator('#screen-preview [data-atlas-modal]:not(.current-atlas-main *):visible');
        for (let index = 0; index < await globalControls.count(); index++) {
          const trigger = globalControls.nth(index), triggerName = (await trigger.getAttribute("aria-label")) || (await trigger.innerText()).trim();
          await trigger.click();
          const dialog = page.locator("#atlas-live-dialog");
          await expect(dialog).toBeVisible();
          const name = `global-modal-${index+1}-${device}.png`, title = await dialog.locator("#atlas-live-dialog-title").innerText();
          await dialog.screenshot({ path: path.join(output,name) });
          captures.push({ name, title, trigger: triggerName, screen: screen.id, device, modal: true });
          await page.keyboard.press("Escape");
        }
      }
    }
  }
  fs.writeFileSync(path.join(output,"manifest.json"), JSON.stringify(captures,null,2));
  console.log(JSON.stringify({ captures: captures.length, screens: captures.filter(item => !item.modal).length, modals: captures.filter(item => item.modal).length }));
} finally { await browser.close(); }
