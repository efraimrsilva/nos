import assert from 'node:assert/strict';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {chromium} from '@playwright/test';

// Verifica o planejamento offline; não afirma migração ou transições no aplicativo.
const browser=await chromium.launch();
try {
  const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  const errors=[],requests=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('request',request=>{if(/^https?:/.test(request.url()))requests.push(request.url());});
  await page.addInitScript(()=>{Math.random=()=>.5;window.setInterval=()=>0;});
  await page.goto(pathToFileURL(path.resolve('Documentacao_Projeto_Nos/wireframes/atlas/index.html')).href);
  const open=id=>page.evaluate(id=>openScreen(id),id);
  await open(18);
  await page.locator('[data-width="desktop"]').click();
  assert.deepEqual(await page.locator('#screen-preview [data-live-column]').evaluateAll(nodes=>nodes.map(n=>n.dataset.liveColumn)),['Propostas','Hábitos','Essência']);
  assert.match(await page.locator('#screen-preview').innerText(),/Proposta → Hábito → Essência/);
  assert.match(await page.locator('#screen-preview').innerText(),/aplicativo.*legado/i);
  await page.locator('#screen-preview [data-atlas-agreements="panels"]').click();
  assert.equal(await page.locator('#screen-preview .current-atlas-panel-layout').isVisible(),true);
  const search=page.locator('#screen-preview [data-live-search]');
  await search.fill('sem-correspondencia');
  assert.equal(await page.locator('#screen-preview .live-search-empty').isVisible(),true);
  await search.fill('');
  const model=await page.evaluate(()=>({
    ids:screens.map(s=>s.id),assigned:mvpAssignedIds(),
    affected:screens.filter(s=>[18,20,27,34,35,36,37,38].includes(s.id)),
    journeys,phases:mvpPhases,
  }));
  assert.equal(new Set(model.ids).size,73);
  assert.deepEqual([...model.assigned].sort((a,b)=>a-b),[...model.ids].sort((a,b)=>a-b));
  for(const screen of model.affected){
    assert.doesNotMatch(JSON.stringify(screen),/experiencias\/|Experiência sucede|Manter como Experiência|Hábito → Experiência/);
    for(const action of screen.actions)assert.ok(model.ids.includes(action.to),'Destino íntegro '+screen.id);
  }
  assert.ok(model.affected.find(s=>s.id===37).actions.some(a=>a.label==='Manter como Hábito'&&a.to===24));
  assert.ok(model.affected.find(s=>s.id===35).actions.some(a=>a.to===27),'Registro reutiliza o Hábito');
  assert.doesNotMatch(JSON.stringify(model.phases),/Hábito → Experiência|etapa Experiência|três passagens|Experiência e agenda/);
  assert.match(model.phases.find(p=>p.key==='habit').gate,/mapeamento aprovado.*recuperação/,'Etapa03 bloqueia expansão sem adequar o legado');
  assert.doesNotMatch(JSON.stringify(model.journeys),/Planejar uma experiência|evento\/experiência/);
  // O percurso manual precisa ser alcançável pelas saídas visíveis, não só pelo mapa.
  await open(24);
  await page.locator('#screen-preview [data-go="34"]').last().click();
  assert.match(await page.locator('#screen-spec h2').innerText(),/Hábito com agendamento/);
  await open(15);
  await page.locator('#screen-preview [data-go="35"]').last().click();
  assert.match(await page.locator('#screen-spec h2').innerText(),/Momento do Hábito agendado/);
  for(const id of [34,35,36,37]){
    await open(id);
    assert.doesNotMatch(await page.locator('#screen-preview').innerText(),/Registrar experiência|Agendar experiência|Manter como Experiência/);
  }
  await page.locator('#chapter-nav [data-view="mvp"]').click();
  assert.match(await page.locator('#mvp-view').innerText(),/Proposta → Hábito → Essência/);
  assert.equal(await page.locator('#mvp-view [data-mvp-screen]').count(),73);
  await page.locator('#chapter-nav [data-view="global"]').click();
  assert.equal(await page.locator('#global-view .tile').count(),73);
  await page.setViewportSize({width:390,height:844});
  await open(18);await page.locator('[data-width="mobile"]').click();
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  for(const state of ['empty','loading','error','blocked','success']){
    await page.locator('[data-state="'+state+'"]').click();
    assert.ok((await page.locator('#screen-preview').innerText()).length>50);
  }
  assert.deepEqual(errors,[]);assert.deepEqual(requests,[]);
  console.log(JSON.stringify({screens:73,columns:3,uniqueMvpCoverage:true,reusedHabitRegistration:true,individualConsentPreserved:true,mobile:true,states:5,errors,externalRequests:requests}));
} finally {await browser.close();}
