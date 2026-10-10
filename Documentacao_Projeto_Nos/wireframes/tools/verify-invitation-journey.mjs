import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

// Navegação demonstrativa do Atlas; persistência e permissões são testadas no backend local.
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [], external = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => { if (/^https?:/.test(request.url())) external.push(request.url()); });
  await page.goto(pathToFileURL(path.resolve('Documentacao_Projeto_Nos/wireframes/atlas/index.html')).href);
  for (const mode of ['flows', 'global']) {
    await page.locator(`[data-view="${mode}"]`).first().click();
    const journey = page.locator(mode === 'flows' ? '.flow-card' : '.global-journey').nth(3);
    if (mode === 'global') await journey.locator('summary').click();
    assert.deepEqual(await journey.locator('.flow-node').evaluateAll(nodes => nodes.map(node => Number(node.dataset.go))), [1, 10, 11, 13, 12]);
    assert.match(await journey.innerText(), /Agora não/);
    assert.match(await journey.innerText(), /QR.*planejados/);
    await journey.locator('.flow-node').first().click();
    assert.equal(await page.locator('#screen-preview [data-auth="login"]').getAttribute('aria-pressed'), 'true');
  }
  for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    await page.evaluate(() => openScreen(10));
    const preview = page.locator('#screen-preview');
    await preview.locator('[name="invitation-code"]').fill('EXEMPLO');
    await preview.getByRole('button', { name: 'Conferir convite', exact: true }).click();
    await assert.doesNotReject(() => preview.locator('.invitation-preview').waitFor({ state: 'visible' }));
    await preview.locator('[name="invitation-code"]').fill('OUTRO');
    assert.equal(await preview.locator('.invitation-preview').isVisible(), false);
    await page.evaluate(() => openScreen(11));
    assert.match(await preview.locator('.invitation-preview').innerText(), /Família/);
    await preview.locator('.invitation-preview').getByRole('button', { name: 'Agora não', exact: true }).click();
    assert.equal(await page.evaluate(() => selectedId), 12);
    for (const state of ['empty', 'loading', 'error', 'blocked', 'success']) {
      await page.evaluate(() => openScreen(10));
      await page.locator(`[data-state="${state}"]`).click();
      assert.equal(await preview.locator('.state-message').count(), 1);
    }
    await page.evaluate(() => openScreen(10));
    assert.match(await page.locator('#screen-spec').innerText(), /QR\/câmera/);
    assert.equal(await preview.getByRole('region', { name: 'Evoluções planejadas do convite' }).isVisible(), true);
  }
  assert.deepEqual(errors, []); assert.deepEqual(external, []);
  console.log(JSON.stringify({ journey: 4, sequence: [1, 10, 11, 13, 12], postpone: true, edit: true, mobile: true, errors, external }));
} finally { await browser.close(); }
