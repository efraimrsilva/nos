import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

// Atlas offline: navegação e contratos; persistência é comprovada na suíte local autenticada.
const browser=await chromium.launch();
try {
  const page=await browser.newPage();
  const errors=[],external=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('request',request=>{if(/^https?:/.test(request.url()))external.push(request.url());});
  await page.goto(pathToFileURL(path.resolve('Documentacao_Projeto_Nos/wireframes/atlas/index.html')).href+'#mvp');
  assert.deepEqual(await page.evaluate(()=>mvpPhases.find(p=>p.key==='nucleus').ids),[12,6,7,8,9,58,59,10,11,13]);
  assert.deepEqual(await page.evaluate(()=>journeys[1].ids),[1,12,6,7,8,9,58,59,13]);
  assert.equal(await page.evaluate(()=>byId(59).status),'Recorte existente');
  assert.equal(await page.evaluate(()=>byId(59).route),'/nucleos/[id]/convites');
  for(const viewport of [{width:1440,height:1000},{width:390,height:844}]) {
    await page.setViewportSize(viewport);
    await page.evaluate(()=>openScreen(9));
    const preview=page.locator('#screen-preview .phone');
    await preview.getByRole('button',{name:'Gerenciar convites',exact:true}).click();
    assert.equal(await page.evaluate(()=>selectedId),59);
    assert.match(await preview.innerText(),/Próximas possibilidades · planejadas/);
    assert.match(await preview.innerText(),/não registra esse histórico/);
    assert.equal(await preview.getByRole('button',{name:'Aceitos',exact:true}).count(),0);
    await preview.getByRole('button',{name:'Gerar ou compartilhar convite',exact:true}).click();
    assert.equal(await page.evaluate(()=>selectedId),58);
    assert.match(await preview.innerText(),/Copiar código/);
    for(const state of ['empty','loading','error','blocked','success']) {
      await page.evaluate(()=>openScreen(59));
      await page.locator(`[data-state="${state}"]`).click();
      assert.equal(await preview.locator('.state-message').count(),1);
    }
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  }
  assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
  console.log(JSON.stringify({mvp:2,sequence:[12,6,7,8,9,58,59,10,11,13],management:true,futureReserved:true,mobile:true,errors,external}));
} finally {await browser.close();}
