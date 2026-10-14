import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const browser=await chromium.launch();
try {
  const page=await browser.newPage(), errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(pathToFileURL(path.resolve('Documentacao_Projeto_Nos/wireframes/atlas/index.html')).href+'#mvp');
  assert.deepEqual(await page.evaluate(()=>mvpPhases.find(p=>p.key==='controls').ids),[66,67,69,70,71]);
  assert.deepEqual(await page.evaluate(()=>globalReadingOrder[7]),[66,67,69,70,71,68]);
  assert.equal(await page.evaluate(()=>screens.filter(s=>s.status==='Recorte existente').length),38);
  await page.evaluate(()=>openScreen(12));
  await page.locator('#screen-preview .phone [data-go="66"]').click();
  assert.equal(await page.evaluate(()=>selectedId),66);
  await page.evaluate(()=>openScreen(13));
  await page.locator('#screen-preview .phone [data-go="71"]').click();
  assert.equal(await page.evaluate(()=>selectedId),71);
  await page.locator('#screen-preview .phone [data-go="13"]').first().click();
  assert.equal(await page.evaluate(()=>selectedId),13);
  for(const viewport of [{width:1440,height:1000},{width:390,height:844}]) {
    await page.setViewportSize(viewport);
    for(const id of [66,67,69,70,71]) {
      await page.evaluate(id=>openScreen(id),id);
      assert.equal(await page.evaluate(id=>byId(id).status,id),'Recorte existente');
      assert.equal(await page.locator('#screen-preview input[type=checkbox]').count(),0);
      assert.match(await page.locator('#screen-preview').innerText(),/planejad|pendent|indisponível/i);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    }
  }
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({screens:72,existing:38,planned:34,controls:5,logicalOrder:true,noFakeToggles:true,mobile:true,errors}));
} finally {await browser.close();}
