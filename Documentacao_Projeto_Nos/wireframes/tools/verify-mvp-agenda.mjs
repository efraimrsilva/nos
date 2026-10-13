import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

// Confere referências/desenhos offline; persistência é comprovada pela suíte autenticada.
const browser = await chromium.launch();
try {
  const page = await browser.newPage(), errors = [], external = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => { if (/^https?:/.test(request.url())) external.push(request.url()); });
  await page.goto(pathToFileURL(path.resolve('Documentacao_Projeto_Nos/wireframes/atlas/index.html')).href + '#mvp');
  assert.deepEqual(await page.evaluate(() => mvpPhases.find(p => p.key === 'agenda').ids), [14,16,15,17]);
  assert.deepEqual(await page.evaluate(() => journeys.find(j => j.name === 'Combinar um encontro na agenda interna').ids), [13,14,16,15,17,14]);
  assert.deepEqual(await page.evaluate(() => globalReadingOrder[2]), [13,14,16,15,17]);
  for (const viewport of [{width:1440,height:1000},{width:390,height:844}]) {
    await page.setViewportSize(viewport);
    for (const id of [14,16,15,17]) {
      await page.evaluate(id => openScreen(id), id);
      assert.equal(await page.locator('#screen-preview .phone').count(), 1);
      assert.equal(await page.evaluate(id => byId(id).status, id), 'Recorte existente');
      assert.match(await page.locator('#screen-preview').innerText(), /seção da agenda interna/);
      for (const state of ['empty','loading','error','blocked','success']) {
        await page.locator(`[data-state="${state}"]`).click();
        assert.equal(await page.locator('#screen-preview .state-message').count(), 1);
      }
      await page.locator('[data-state="content"]').click();
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    }
    await page.evaluate(() => openScreen(14));
    assert.match(await page.locator('#screen-preview').innerText(), /Visão mensal\/dia, recorrência/);
    assert.equal(await page.locator('#screen-preview .wire-calendar').count(), 0);
    await page.locator('#screen-preview .phone').getByRole('button', {name:'Criar evento',exact:true}).click();
    assert.equal(await page.evaluate(() => selectedId),16);
    await page.locator('#screen-preview .phone').getByRole('button', {name:'Criar evento · exemplo',exact:true}).click();
    assert.equal(await page.evaluate(() => selectedId),15);
    assert.doesNotMatch(await page.locator('#screen-preview .wire-tabs').innerText(), /Ainda não sei/);
    await page.locator('#screen-preview .phone').getByRole('button', {name:'Editar evento',exact:true}).click();
    assert.equal(await page.evaluate(() => selectedId),17);
    assert.match(await page.locator('#screen-preview').innerText(), /Abrir não remove/);
    assert.match(await page.locator('#screen-preview').innerText(), /nova resposta aos demais/);
  }
  assert.deepEqual(errors, []); assert.deepEqual(external, []);
  console.log(JSON.stringify({mvp:4,screens:4,states:5,sequence:[14,16,15,17],mobile:true,errors,external}));
} finally { await browser.close(); }
