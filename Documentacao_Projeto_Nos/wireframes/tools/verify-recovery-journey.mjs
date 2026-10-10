import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

// O Atlas demonstra o percurso offline. A integração real é verificada separadamente no Supabase local.
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [], external = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => { if (/^https?:/.test(request.url())) external.push(request.url()); });
  await page.goto(pathToFileURL(path.resolve('Documentacao_Projeto_Nos/wireframes/atlas/index.html')).href);
  for (const mode of ['flows', 'global']) {
    await page.locator(`[data-view="${mode}"]`).first().click();
    const journey = mode === 'flows' ? page.locator('.flow-card').nth(2) : page.locator('.global-journey').nth(2);
    assert.deepEqual(await journey.locator('.flow-node').evaluateAll(nodes => nodes.map(node => Number(node.dataset.go))), [1, 4, 5, 1, 12]);
    assert.match(await journey.innerText(), /Validar link e salvar nova senha/);
    assert.match(await journey.innerText(), /ativação e entrega externa ainda pendentes/);
    assert.equal(await journey.locator('[data-entry-login]').count(), 2);
    await journey.locator('.flow-node').nth(3).click();
    assert.equal(await page.locator('#screen-preview [data-auth="login"]').getAttribute('aria-pressed'), 'true');
  }
  for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    for (const id of [4, 5]) {
      await page.evaluate(id => openScreen(id), id);
      await page.locator('#screen-preview .product-back').click();
      assert.equal(await page.locator('#screen-preview [data-auth="login"]').getAttribute('aria-pressed'), 'true');
      await page.evaluate(id => openScreen(id), id);
      await page.locator('#screen-preview .contract-outlets [data-go="1"]').last().click();
      assert.equal(await page.locator('#screen-preview [data-auth="login"]').getAttribute('aria-pressed'), 'true');
      await page.evaluate(id => openScreen(id), id);
      await page.locator('[data-state="blocked"]').click();
      assert.match(await page.locator('#screen-preview [role="alert"]').innerText(), id === 5 ? /link de recuperação válido/ : /60 segundos/);
    }
  }
  assert.deepEqual(errors, []); assert.deepEqual(external, []);
  console.log(JSON.stringify({ journey: 3, sequence: [1, 4, 5, 1, 12], loginReturn: true, restart: true, mobile: true, errors, external }));
} finally { await browser.close(); }
