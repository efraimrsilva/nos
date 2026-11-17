import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import {chromium} from '@playwright/test';

const atlas = pathToFileURL(path.resolve('Documentacao_Projeto_Nos/wireframes/atlas/index.html')).href;
const browser = await chromium.launch();
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({viewport: {width, height: 900}});
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(atlas);
    const tab = page.getByRole('button', {name: 'Migração', exact: true});
    assert.equal(await tab.count(), 1, 'A guia Migração deve aparecer na navegação');
    await tab.focus();
    await tab.press('Enter');
    const panel = page.locator('#migration-view');
    assert.equal(await panel.isVisible(), true);
    assert.equal(await tab.getAttribute('aria-pressed'), 'true');
    assert.match(page.url(), /#migracao$/);
    assert.equal(await panel.locator(':scope > details').count(), 14);
    const visual = panel.locator('.migration-visual-roadmap');
    assert.equal(await visual.locator('details').count(), 16);
    const ids = await visual.locator('a[href^="#tela-"]').evaluateAll(links =>
      [...new Set(links.map(link => Number(link.getAttribute('href').slice(6))))].sort((a,b) => a-b));
    assert.deepEqual(ids, Array.from({length:73},(_,index)=>index+1));
    const last = visual.locator('details').last();
    await last.locator('summary').focus();
    await last.locator('summary').press('Enter');
    assert.equal(await last.getAttribute('open'), '');
    assert.match(await panel.innerText(), /Planejada/);
    assert.doesNotMatch(await panel.innerText(), /Nest\.?JS/i);
    const first = panel.locator('details').first();
    await first.locator('summary').click();
    assert.equal(await first.getAttribute('open'), '');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await page.reload();
    assert.equal(await panel.isVisible(), true);
    await page.getByRole('button', {name: 'Percursos', exact: true}).click();
    assert.equal(await panel.isVisible(), false);
    assert.doesNotMatch(page.url(), /#migracao$/);
    await page.goto(atlas + '#migracao');
    assert.equal(await panel.isVisible(), true);
    await page.emulateMedia({media: 'print'});
    assert.equal(await page.locator('#atlas-view').isVisible(), false);
    assert.equal(await panel.isVisible(), true);
    assert.deepEqual(errors, []);
    await page.close();
  }
  console.log('Guia Migração conferida em desktop e celular.');
} finally {
  await browser.close();
}
