import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from '@playwright/test';

const browser=await chromium.launch();
try {
  const page=await browser.newPage({viewport:{width:1440,height:1080},reducedMotion:'reduce'});
  const errors=[],external=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('request',request=>{if(/^https?:/.test(request.url()))external.push(request.url());});
  await page.goto(pathToFileURL(path.resolve('Documentacao_Projeto_Nos/wireframes/atlas/index.html')).href);
  const inventory=await page.evaluate(()=>screens.map(s=>({id:s.id,title:s.title,status:s.status,actions:s.actions})));
  assert.equal(inventory.length,73);
  let states=0,actions=0,references=0,modals=0;
  const open=async id=>{await page.evaluate(id=>{document.querySelectorAll('dialog[open]').forEach(dialog=>dialog.close());openScreen(id);},id);};
  for(const screen of inventory){
    await open(screen.id);
    assert.equal(await page.locator('#screen-spec h2').innerText(),screen.title);
    const phone=page.locator('#screen-preview .phone');
    assert.equal(await phone.getAttribute('data-atlas-revision'),'3','Composição nova '+screen.id);
    assert.equal(await phone.locator('.product-onboarding,.product-welcome,.extension-scroll,.extension-blocks,.garden-art').count(),0,'Sem composição antiga ativa '+screen.id);
    assert.ok((await phone.innerText()).trim().length>30);
    if(screen.status==='Planejada')assert.match(await phone.innerText(),/Esboço de funcionalidade · ainda não desenvolvido/);
    assert.equal(await phone.evaluate(el=>[...el.querySelectorAll('[data-go]')].every(node=>byId(node.dataset.go))),true,'Destinos válidos '+screen.id);
    for(const action of screen.actions){
      await open(screen.id);
      const target=page.locator('#screen-preview [data-go="'+action.to+'"]').last();
      assert.equal(await target.count(),1,'Ação documentada '+screen.id+'→'+action.to);
      await target.click();
      assert.equal(await page.locator('#screen-spec h2').innerText(),inventory.find(item=>item.id===action.to).title);
      actions++;
    }
    for(const state of ['empty','loading','error','blocked','success']){
      await open(screen.id);await page.locator('[data-state="'+state+'"]').click();
      assert.equal(await page.locator('#screen-preview .live-state').count(),1,'Estado '+screen.id+'/'+state);states++;
    }
    await open(screen.id);
    const triggers=page.locator('#screen-preview .current-atlas-main [data-atlas-modal]:not([inert] *):visible');
    if(await triggers.count()){
      const modalIdentification=await triggers.first().evaluate(el=>el.textContent+' '+el.getAttribute('aria-label')+' '+getComputedStyle(el,'::after').content);
      assert.match(modalIdentification,/modal/i,'Gatilho identifica modalidade '+screen.id);
      await triggers.first().click();
      const dialog=page.locator('#atlas-live-dialog');
      assert.equal(await dialog.isVisible(),true,'Modal no contexto '+screen.id);
      assert.match(await dialog.innerText(),/modal/i);
      assert.equal(await dialog.getAttribute('aria-labelledby'),'atlas-live-dialog-title');
      await page.keyboard.press('Escape');assert.equal(await dialog.isVisible(),false);modals++;
    }
    await open(screen.id);
    if(await page.locator('#screen-preview [data-reference="approved"]').count()){
      await page.locator('#screen-preview [data-reference="approved"]').click();
      assert.equal(await page.locator('#screen-preview .approved-stage').count(),1);references++;
    }
  }
  for(const width of [375,640,1440]){
    await page.setViewportSize({width,height:1000});
    await open(6);await page.locator('[data-width="'+(width>700?'desktop':'mobile')+'"]').click();
    for(const screen of inventory){await open(screen.id);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'Sem overflow '+screen.id+' / '+width);}
  }
  await page.setViewportSize({width:1440,height:1080});await open(18);await page.locator('[data-width="desktop"]').click();
  await page.locator('#screen-preview .preview-wrap').screenshot({path:'artifacts/atlas-fidelity-web.png'});
  await page.locator('.view-tabs [data-view="atlas"]').click();assert.equal(await page.locator('.tile').count(),73);
  await page.locator('#status-filter').selectOption('Planejada');assert.equal(await page.locator('.tile').count(),34);await page.locator('#status-filter').selectOption('all');
  await page.locator('#search').fill('recuperar');assert.ok(await page.locator('.tile').count()>0);await page.locator('#search').fill('');
  let paletteRoutes=0;
  if(process.env.NOS_VERIFY_COOKIES){
    const app=await browser.newPage({viewport:{width:390,height:844}});
    const origin=process.env.NOS_VERIFY_ORIGIN||'http://127.0.0.1:3200';
    const localOrigin = new URL(origin);
    if(localOrigin.protocol !== 'http:' || !['127.0.0.1','localhost'].includes(localOrigin.hostname))throw Error('Aplicativo de comparação deve ser local');
    await app.context().addCookies(JSON.parse(process.env.NOS_VERIFY_COOKIES));
    for(const [id,route,title]of [[6,'/comecar','Como você quer começar?'],[7,'/comecar/tipo','Que relação vocês têm?'],[10,'/comecar/convite','Você recebeu um convite?']]){
      await app.goto(origin+route);await app.getByRole('heading',{level:1,name:title,exact:true}).waitFor();await open(id);
      assert.equal(await page.locator('#screen-preview .live-page-heading h3').first().innerText(),title);
      assert.equal(await app.locator('[data-layout-revision="3"]').count(),1);
      assert.equal(await app.evaluate(()=>getComputedStyle(document.body).backgroundColor),'rgb(245, 247, 241)');paletteRoutes++;
    }
    await app.close();
  }
  assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
  const result={screens:inventory.length,actions,states,references,modalContexts:modals,paletteRoutes,errors,external};
  fs.writeFileSync('artifacts/fidelity-result.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));
} finally { await browser.close(); }
