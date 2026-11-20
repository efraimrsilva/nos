import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import {chromium} from '@playwright/test';

const atlas = pathToFileURL(path.resolve('docs/wireframes/atlas/index.html')).href;
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
    const phases = panel.locator('[data-migration-phase]');
    assert.deepEqual(await phases.evaluateAll(items => items.map(item => item.dataset.migrationPhase)), ['1','2','3','4']);
    assert.equal(await phases.first().getAttribute('open'), '');
    const web = await phases.first().innerText();
    assert.match(web, /paridade 15–16[\s\S]*ensaio hospedado[\s\S]*Publicar o Angular[\s\S]*arquivo\/nextjs\//);
    assert.match(await panel.innerText(), /Próximo passo:\s*paridade visual 15/);
    for (const [index, title] of [[1,/Nx e backend NestJS/],[2,/Decisão de autenticação/],[3,/WebSocket e Capacitor/]]) {
      const summary = phases.nth(index).locator('summary');
      assert.match(await summary.innerText(), title);
      await summary.focus();
      await summary.press('Enter');
      assert.equal(await phases.nth(index).getAttribute('open'), '');
    }
    const closingDeliveries = panel.locator(':scope > details[data-migration-delivery]');
    assert.deepEqual(await closingDeliveries.locator('summary').allTextContents(), [
      '13 · Virada pública · Angular publicado',
      '14 · Arquivamento visual do Next.js',
    ]);
    assert.equal(await panel.locator(':scope > details').count(), 14);
    assert.deepEqual(await phases.first().locator('a[href^="#migracao-passo-"]').evaluateAll(links => links.map(link => link.hash)), ['#migracao-passo-13','#migracao-passo-14']);
    const visual = panel.locator('section[aria-labelledby="migration-visual-title"]');
    assert.equal(await visual.locator('details').count(), 16);
    const ids = await visual.locator('a[href^="#tela-"]').evaluateAll(links =>
      [...new Set(links.map(link => Number(link.getAttribute('href').slice(6))))].sort((a,b) => a-b));
    assert.deepEqual(ids, Array.from({length:73},(_,index)=>index+1));
    const last = visual.locator('details').last();
    await last.locator('summary').focus();
    await last.locator('summary').press('Enter');
    assert.equal(await last.getAttribute('open'), '');
    assert.match(await panel.innerText(), /Planejada/);
    const first = panel.locator(':scope > details').first();
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
