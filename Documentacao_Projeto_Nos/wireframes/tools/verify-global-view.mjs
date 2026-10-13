import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {chromium} from '@playwright/test';

const browser=await chromium.launch();
try {
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  const errors=[],external=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('request',request=>{if(/^https?:/.test(request.url()))external.push(request.url());});
  await page.goto(pathToFileURL(path.resolve('Documentacao_Projeto_Nos/wireframes/atlas/index.html')).href);
  const nav=page.locator('#chapter-nav button');
  assert.match(await nav.nth(1).innerText(),/Visão global/,'Visão global abaixo do MVP e acima de Todas as áreas');
  assert.match(await nav.nth(2).innerText(),/Todas as áreas/);
  await page.locator('#chapter-nav [data-view="global"]').click();
  assert.equal(await page.locator('#global-view').isVisible(),true);
  const inventory=await page.evaluate(()=>screens.map(s=>({id:s.id,title:s.title,status:s.status,actions:s.actions,dependency:s.dependency})));
  assert.equal(await page.locator('#global-view .tile').count(),inventory.length);
  assert.equal(await page.locator('#global-view .tile').first().getAttribute('data-screen-id'),'1');
  assert.equal(await page.locator('#global-view .global-journey').count(),await page.evaluate(()=>journeys.length));
  const transitions=await page.locator('#global-view .global-transition').evaluateAll(nodes=>nodes.map(node=>({from:Number(node.dataset.from),to:Number(node.dataset.to),direct:node.classList.contains('direct')})));
  for(const transition of transitions){
    assert.equal(transition.direct,inventory.find(s=>s.id===transition.from).actions.some(action=>action.to===transition.to),'Saída direta somente quando prevista na ficha');
  }
  for(const screen of inventory){
    const tile=page.locator(`#global-tile-${String(screen.id).padStart(2,'0')}`);
    assert.equal(await tile.locator('.tile-caption h3').innerText(),screen.title);
    assert.ok((await tile.locator('.tile-header').innerText()).includes(screen.status));
    assert.ok((await tile.locator('.tile-caption').innerText()).includes(screen.dependency));
    assert.equal(await tile.locator('[data-destination]').count(),screen.actions.length);
    const globalPhone=await tile.locator('.phone').evaluate(el=>el.querySelector('[data-thumbnail]').innerHTML);
    const atlasPhone=await page.locator(`#tile-${String(screen.id).padStart(2,'0')} .phone`).evaluate(el=>el.querySelector('[data-thumbnail]').innerHTML);
    assert.equal(globalPhone,atlasPhone,`Mesma composição viva ${screen.id}`);
  }
  await page.locator('#global-tile-07 .tile-open').click();
  assert.equal(await page.locator('#screen-spec h2').innerText(),'Tipo de Núcleo');
  await page.locator('#screen-spec [data-view="global"]').click();
  assert.equal(await page.locator('#global-view').isVisible(),true);
  await page.locator('#global-tile-38 .phone').focus();await page.keyboard.press('Enter');
  assert.equal(await page.locator('#screen-spec h2').innerText(),'Nossa Árvore');
  await page.locator('[data-reference="approved"]').click();
  await page.locator('#chapter-nav [data-view="global"]').click();
  assert.doesNotMatch(await page.locator('#global-tile-38 .phone').innerText(),/Nível 7/,'Histórico não contamina a visão viva');
  await page.locator('#status-filter').selectOption('Planejada');
  assert.equal(await page.locator('#global-view .tile').count(),inventory.filter(s=>s.status==='Planejada').length);
  await page.locator('.view-tabs [data-view="atlas"]').click();
  assert.equal(await page.locator('#atlas-view .tile').count(),inventory.filter(s=>s.status==='Planejada').length,'Situação preservada ao alternar visões');
  await page.locator('#chapter-nav [data-view="global"]').click();await page.locator('#status-filter').selectOption('all');await page.locator('#search').fill('Conta');
  const searchCount=await page.locator('#global-view .tile').count();
  await page.locator('.view-tabs [data-view="atlas"]').click();assert.equal(await page.locator('#atlas-view .tile').count(),searchCount,'Busca preservada ao alternar visões');
  await page.locator('#chapter-nav [data-view="global"]').click();await page.locator('#search').fill('zzzz-nao-existe');
  assert.equal(await page.locator('#global-view .tile').count(),0);assert.equal(await page.locator('#global-view .no-results').isVisible(),true);
  await page.locator('#search').fill('');
  // Alterações na fonte e uma tela nova aparecem sem duplicar conteúdo no mapa.
  await page.evaluate(()=>{screens[0].title='Conta sincronizada';screens[0].dependency='Limite alterado';screens[0].actions.push({label:'Novo destino',to:72});screens.push({...screens[0],id:73,chapter:7,title:'Nova tela sincronizada'});renderGlobal();});
  assert.equal(await page.locator('#global-tile-01 .tile-caption h3').innerText(),'Conta sincronizada');
  assert.match(await page.locator('#global-tile-01 .tile-caption').innerText(),/Limite alterado/);
  assert.equal(await page.locator('#global-tile-01 [data-destination="72"]').count(),1);
  assert.equal(await page.locator('#global-tile-73').count(),1);
  await page.reload();await page.locator('#chapter-nav [data-view="global"]').click();
  await page.setViewportSize({width:375,height:812});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'Sem transbordamento em celular');
  await page.locator('#global-view').scrollIntoViewIfNeeded();
  await page.screenshot({path:'artifacts/global-view-mobile.png'});
  await page.setViewportSize({width:1440,height:1000});
  await page.screenshot({path:'artifacts/global-view-desktop.png'});
  await page.goto(pathToFileURL(path.resolve('Documentacao_Projeto_Nos/wireframes/atlas/index.html')).href+'#visao-global');
  assert.equal(await page.locator('#global-view').isVisible(),true,'Endereço direto do mapa');
  await nav.nth(2).click();assert.equal(await page.locator('#atlas-view').isVisible(),true);
  assert.equal(await page.evaluate(()=>location.hash),'','Sair da visão global remove seu endereço direto');
  await page.locator('#chapter-nav [data-view="global"]').click();await page.emulateMedia({media:'print'});
  assert.equal(await page.locator('#global-view').isVisible(),true,'Impressão preserva modo global');
  assert.equal(await page.locator('#atlas-view').isVisible(),false,'Não duplica páginas na impressão');
  assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
  console.log(JSON.stringify({screens:inventory.length,sharedCompositions:true,dynamicSynchronization:true,keyboard:true,mobile:true,hash:true,print:true,errors,external}));
} finally {await browser.close();}
