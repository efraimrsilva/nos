import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

// Atlas demonstra os destinos; gravação e consentimento são verificados no Supabase local.
const browser=await chromium.launch();
try {
 const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[],external=[];
 page.on('pageerror',error=>errors.push(error.message));
 page.on('request',request=>{if(/^https?:/.test(request.url()))external.push(request.url());});
 await page.goto(pathToFileURL(path.resolve('Documentacao_Projeto_Nos/wireframes/atlas/index.html')).href);
 for(const mode of ['flows','global']) {
  await page.locator(`[data-view="${mode}"]`).first().click();
  const journey=page.locator(mode==='flows'?'.flow-card':'.global-journey').nth(4);
  if(mode==='global')await journey.locator('summary').click();
  assert.deepEqual(await journey.locator(':scope > .flow-path .flow-node').evaluateAll(nodes=>nodes.map(node=>Number(node.dataset.go))),[18,22,23,24]);
  assert.deepEqual(await journey.locator('.future-path .flow-node').evaluateAll(nodes=>nodes.map(node=>Number(node.dataset.go))),[18,19,20,21,22,23,24]);
  assert.match(await journey.innerText(),/último aceite/);
  assert.match(await journey.locator('.future-path').innerText(),/Planejada/);
 }
 for(const viewport of [{width:1440,height:1000},{width:390,height:844}]) {
  await page.setViewportSize(viewport);
  for(const id of [18,19,20,21,22,23,24]) {
   await page.evaluate(id=>openScreen(id),id);
   const screen=await page.evaluate(id=>byId(id),id);
   if([19,20,21].includes(id))assert.equal(screen.status,'Planejada');
   if(id===22)assert.equal(screen.status,'Recorte existente');
   for(const action of screen.actions) {
    await page.evaluate(id=>openScreen(id),id);
    await page.locator(`#screen-preview [data-go="${action.to}"]`).last().click();
    assert.equal(await page.evaluate(()=>selectedId),action.to);
   }
  }
  await page.evaluate(()=>openScreen(22));
  assert.match(await page.locator('#screen-preview').innerText(),/seu aceite/);
  await page.locator('[data-width="desktop"]').click();
  assert.match(await page.locator('.preview-origin').innerText(),/Representação atual/);
  assert.doesNotMatch(await page.locator('.preview-origin').innerText(),/adaptação web ainda/);
  await page.locator('#screen-preview [data-reference="approved"]').click();
  assert.match(await page.locator('.preview-origin').innerText(),/Documento aprovado/);
  await page.locator('#screen-preview [data-reference="current"]').click();
  await page.evaluate(()=>openScreen(23));
  assert.match(await page.locator('#screen-preview').innerText(),/último aceite/);
 }
 assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
 console.log(JSON.stringify({journey:5,sequence:[18,22,23,24],future:[18,19,20,21,22,23,24],mobile:true,errors,external}));
}finally{await browser.close();}
