import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

// O Atlas certifica desenhos e destinos. Banco e consentimento são testados separadamente.
const browser=await chromium.launch();
try {
  const page=await browser.newPage();
  const errors=[],external=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('request',request=>{if(/^https?:/.test(request.url()))external.push(request.url());});
  await page.goto(pathToFileURL(path.resolve('Documentacao_Projeto_Nos/wireframes/atlas/index.html')).href+'#mvp');
  assert.deepEqual(await page.evaluate(()=>mvpPhases.find(p=>p.key==='habit').ids),[18,22,23,24,27,25,28,29,30,31,32,33]);
  assert.match(await page.evaluate(()=>mvpPhases.find(p=>p.key==='habit').features.map(f=>f[1]).join(' ')),/alternativa|alternativas/i);
  assert.deepEqual(await page.evaluate(()=>journeys.find(j=>j.name==='Encerrar com cuidado').ids),[24,28,32,24,18]);
  for(const viewport of [{width:1440,height:1000},{width:390,height:844}]) {
    await page.setViewportSize(viewport);
    for(const id of [18,22,23,24,27,25,28,29,30,31,32,33]) {
      await page.evaluate(id=>openScreen(id),id);
      assert.equal(await page.evaluate(()=>selectedId),id);
      assert.equal(await page.evaluate(id=>byId(id).status,id),'Recorte existente');
      assert.equal(await page.locator('#screen-preview .phone').count(),1);
      for(const state of ['empty','loading','error','blocked','success']) {
        await page.locator(`[data-state="${state}"]`).click();
        assert.equal(await page.locator('#screen-preview .state-message').count(),1);
      }
      await page.locator('[data-state="content"]').click();
    }
    await page.evaluate(()=>openScreen(33));
    assert.match(await page.locator('#screen-preview').innerText(),/Histórico das versões/);
    await page.locator('#screen-preview .phone').getByRole('button',{name:'Voltar ao Hábito',exact:true}).click();
    assert.equal(await page.evaluate(()=>selectedId),24);
    const detail=await page.locator('#screen-preview').innerText();
    assert.match(detail,/Impacto/i);assert.match(detail,/Linguagens de cuidado/i);

    assert.doesNotMatch(detail,/\d+%/);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  }
  assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
  console.log(JSON.stringify({mvp:3,screens:12,states:5,legacyOptional:true,reviewHistory:true,mobile:true,errors,external}));
} finally {await browser.close();}
