import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import {chromium} from '@playwright/test';

const atlas = pathToFileURL(path.resolve('docs/wireframes/atlas/index.html')).href;
const stack = readFileSync('docs/stack.md', 'utf8');
const plan = readFileSync('docs/andamento/planos/migracao-angular.md', 'utf8');
const roadmap = [
  [/Estabilização da web Angular/, /paridade 16[\s\S]*ensaio hospedado[\s\S]*Angular já publicado[\s\S]*arquivo\/nextjs\//],
  [/Nx e automação/, /lockfiles[\s\S]*GitHub Actions[\s\S]*ensaio Netlify/],
  [/Piloto da API NestJS/, /apps\/api[\s\S]*Supabase Auth[\s\S]*PostgreSQL[\s\S]*sessão expirada/],
  [/Validação de identidade/, /Supabase Auth[\s\S]*tokens próprios[\s\S]*recuperação/],
  [/Tempo real/, /WebSocket no NestJS para a resposta ao convite da Agenda[\s\S]*conta externa[\s\S]*reconexão/],
  [/PWA e limites offline/, /Após a fase 1[\s\S]*recursos públicos[\s\S]*trocar de conta/],
  [/Capacitor em Android e iOS/, /Após a fase 1[\s\S]*apps\/mobile[\s\S]*Android[\s\S]*Depois[\s\S]*iOS/],
];
const phaseNumbers = roadmap.map((_, index) => String(index + 1));
assert.deepEqual([...stack.matchAll(/^\| (\d+)\. /gm)].map(match => match[1]), phaseNumbers);
assert.deepEqual([...plan.matchAll(/^### Fase (\d+) — /gm)].map(match => match[1]), phaseNumbers);
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
    assert.deepEqual(await phases.evaluateAll(items => items.map(item => item.dataset.migrationPhase)), phaseNumbers);
    assert.equal(await phases.first().getAttribute('open'), '');
    assert.match(await panel.locator('h2').innerText(), /Migração para Angular · concluída e validada$/);
    assert.match(await panel.innerText(), /A próxima fase planejada é Nx e automação/);
    assert.equal(await panel.getByRole('link', {name: /Consultar stack e diretórios/}).getAttribute('href'), '../../stack.md');
    for (const [index, [title, acceptance]] of roadmap.entries()) {
      const phase = phases.nth(index);
      const summary = phase.locator('summary');
      assert.match(await summary.innerText(), title);
      assert.match(await summary.innerText(), index ? /· planejada$/ : /· concluída e validada$/);
      if (index) {
        await summary.focus();
        await summary.press('Enter');
      }
      assert.equal(await phase.getAttribute('open'), '');
      assert.match(await phase.innerText(), acceptance);
    }
    const closingDeliveries = panel.locator(':scope > details[data-migration-delivery]');
    assert.deepEqual(await closingDeliveries.locator('summary').allTextContents(), [
      '13 · Virada pública · validada',
      '14 · Arquivamento visual do Next.js · validado',
    ]);
    assert.equal(await panel.locator(':scope > details').count(), 14);
    assert.deepEqual(await phases.first().locator('a[href^="#migracao-passo-"]').evaluateAll(links => links.map(link => link.hash)), ['#migracao-passo-13','#migracao-passo-14']);
    const visual = panel.locator('section[aria-labelledby="migration-visual-title"]');
    assert.match(await visual.locator('h3').innerText(), /Paridade de interface com o Atlas .* · concluída e validada$/);
    assert.equal(await visual.locator('details').count(), 16);
    const ids = await visual.locator('a[href^="#tela-"]').evaluateAll(links =>
      [...new Set(links.map(link => Number(link.getAttribute('href').slice(6))))].sort((a,b) => a-b));
    assert.deepEqual(ids, Array.from({length:73},(_,index)=>index+1));
    const last = visual.locator('details').last();
    await last.locator('summary').focus();
    await last.locator('summary').press('Enter');
    assert.equal(await last.getAttribute('open'), '');
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
