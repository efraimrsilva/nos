import assert from 'node:assert/strict';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import crypto from 'node:crypto';

// Imagens em SVG não implementam decode(); carregamos seus hrefs explicitamente.
async function verifyImages(page) {
  await page.locator('#screen-preview .phone').evaluate(async el => {
    await Promise.all([...el.querySelectorAll('img')].map(img => img.decode()));
    await Promise.all([...el.querySelectorAll('svg image')].map(node => new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = resolve;
      image.onerror = () => reject(new Error(`Imagem SVG ausente: ${node.getAttribute('href')}`));
      image.src = node.getAttribute('href');
    })));
  });
}

// Compara a referência viva com a aplicação em execução; não realiza cadastro ou envio.
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1080 } });
  const errors=[];const external=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('request',request=>{if(/^https?:/.test(request.url()))external.push(request.url());});
  const app = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await app.goto('http://127.0.0.1:3000/comecar');
  await app.screenshot({ path: 'artifacts/app-comecar-approved.png', fullPage: true });
  const appCanvas = await app.evaluate(() => getComputedStyle(document.body).backgroundColor);
  await page.goto(pathToFileURL(path.resolve('Documentacao_Projeto_Nos/wireframes/atlas/index.html')).href);
  await page.locator('[data-open="1"]').first().focus();await page.keyboard.press('Enter');assert.equal(await page.locator('#screen-spec h2').innerText(),'Conta','Miniatura abre por teclado');
  await page.evaluate(() => openScreen(6));
  assert.equal(await page.locator('#screen-preview .phone').evaluate(el => getComputedStyle(el).backgroundColor), appCanvas, 'Canvas do atlas deve igualar o aplicativo');
  assert.equal(await page.locator('#screen-preview').getByText('Como você quer começar?', { exact: true }).count(), 1);
  assert.equal(await page.locator('#screen-preview .path-card svg').count(), 4, 'Dois ícones e duas setas como no app');
  for(const [id,route] of [[6,'/comecar'],[7,'/comecar/tipo'],[10,'/comecar/convite']]){
    await app.goto(`http://127.0.0.1:3000${route}`);
    await page.evaluate(id=>openScreen(id),id);
    assert.equal(await page.locator('#screen-preview .product-content>h3').innerText(),await app.locator('h1').innerText(),`Título real ${route}`);
    const realColors=await app.evaluate(()=>({canvas:getComputedStyle(document.body).backgroundColor,forest:getComputedStyle(document.querySelector('h1')).color,muted:getComputedStyle(document.querySelector('h1+p')).color,step:getComputedStyle(document.querySelector('.step-label')).color}));
    const atlasColors=await page.evaluate(()=>({canvas:getComputedStyle(document.querySelector('#screen-preview .phone')).backgroundColor,forest:getComputedStyle(document.querySelector('#screen-preview .product-content h3')).color,muted:getComputedStyle(document.querySelector('#screen-preview .product-intro')).color,step:getComputedStyle(document.querySelector('#screen-preview .product-content .product-step')).color}));
    assert.deepEqual(atlasColors,realColors,`Paleta real ${route}`);
    await app.screenshot({path:`artifacts/app-fidelity-${id}.png`,fullPage:true});
    await page.locator('#screen-preview .preview-wrap').screenshot({path:`artifacts/atlas-fidelity-${id}.png`});
  }
  await page.evaluate(()=>openScreen(7));await app.goto('http://127.0.0.1:3000/comecar/tipo');
  assert.equal(await page.locator('#screen-preview .type-option').count(),9);
  assert.deepEqual(await page.locator('#screen-preview .type-option strong').allTextContents(),await app.locator('.type-option [id^="label-"]').allTextContents());
  assert.deepEqual(await page.locator('#screen-preview .type-option small').allTextContents(),await app.locator('.type-option [id^="description-"]').allTextContents());
  const iconPaths=locator=>locator.evaluateAll(nodes=>nodes.map(svg=>[...svg.children].map(node=>node.outerHTML.replace(/ class="[^"]*"/g,'')).join('')));
  assert.deepEqual(await iconPaths(page.locator('#screen-preview .type-icon svg')),await iconPaths(app.locator('.type-icon svg')),'Mesmos SVG dos nove tipos');
  await page.locator('#screen-preview input[value="casal"]').focus();await page.keyboard.press('ArrowDown');assert.equal(await page.locator('#screen-preview input[value="familia"]').isChecked(),true,'Rádios operam por setas');
  await page.locator('#screen-preview input[value="amigos"]').check();
  await page.locator('#screen-preview [data-local-form="type"] button').click();
  assert.equal(await page.locator('#screen-spec h2').innerText(),'Propósito do Núcleo');
  assert.match(await page.locator('#screen-preview .product-selected').innerText(),/Amigos/);
  await page.locator('#screen-preview [name="nucleus-name"]').fill('Nosso vínculo');
  await page.locator('#screen-preview [data-suggestion]').click();
  await page.locator('#screen-preview [data-local-form="purpose"] button[type="submit"]').click();
  assert.equal(await page.locator('#screen-preview .purpose-draft').isVisible(),true,'Conferência antes da criação');
  await page.locator('#screen-preview [data-edit-draft]').click();assert.equal(await page.locator('#screen-preview [name="nucleus-name"]').inputValue(),'Nosso vínculo');
  await page.evaluate(()=>openScreen(7));assert.equal(await page.locator('#screen-preview input[value="amigos"]').isChecked(),true,'Escolha preservada ao voltar');
  await page.evaluate(()=>openScreen(10));assert.equal(await page.locator('#screen-preview .invitation-preview').isVisible(),false);
  await page.locator('#screen-preview [name="invitation-code"]').fill('EXEMPLO');await page.locator('#screen-preview [data-local-form="invitation"] button').click();
  assert.equal(await page.locator('#screen-preview .invitation-preview').isVisible(),true);
  await page.locator('#screen-preview [name="invitation-code"]').fill('OUTRO');assert.equal(await page.locator('#screen-preview .invitation-preview').isVisible(),false,'Prévia antiga removida ao editar código');
  await page.evaluate(()=>openScreen(18));await page.locator('#screen-preview [data-layout="acordos-experiencias"]').click();assert.match(await page.locator('#screen-preview .approved-stage').innerText(),/Jantar romântico/);
  await page.locator('#screen-preview [data-layout="acordos-essencia"]').click();assert.match(await page.locator('#screen-preview .approved-stage').innerText(),/Nenhuma Essência/);
  await page.locator('#screen-preview [data-reference="approved"]').click();await page.locator('#screen-preview [data-layout="acordos-experiencias"]').click();assert.match(await page.locator('#screen-preview .approved-stage').innerText(),/Jantar romântico/,'Abas também funcionam no documento histórico');
  await page.evaluate(()=>openScreen(47));await page.locator('#screen-preview [data-layout="vinculo-amigo"]').click();assert.match(await page.locator('#screen-preview .approved-stage').innerText(),/Cultivar uma amizade/,'Tipos de vínculo mudam a prévia');
  await page.evaluate(()=>openScreen(62));assert.doesNotMatch(await page.locator('#screen-preview .phone').innerText(),/Responder com carinho|Ana · agora|enviado com carinho/);assert.match(await page.locator('#screen-preview .phone').innerText(),/Preparação privada/);
  await page.evaluate(()=>openScreen(44));assert.doesNotMatch(await page.locator('#screen-preview .phone').innerText(),/\bForte\b|\bFortes\b|\bMédio\b|\bFrágil\b/);
  await page.evaluate(()=>openScreen(27));assert.equal(await page.locator('#screen-preview .phone [data-source-action="goHabit"]').first().getAttribute('data-go'),'24');assert.equal(await page.locator('#screen-preview .phone [data-source-action="goHabit"]').last().getAttribute('data-go'),'25');
  await page.evaluate(()=>openScreen(30));assert.doesNotMatch(await page.locator('#screen-preview .phone').innerText(),/maioria das semanas|Manter e promover|duas pessoas/);await page.locator('#screen-preview .phone [data-go="31"]').click();assert.equal(await page.locator('#screen-spec h2').innerText(),'Propor ajuste');
  await page.evaluate(()=>openScreen(49));await page.locator('#screen-preview .phone button').filter({hasText:'Privacidade e visibilidade'}).click();assert.equal(await page.locator('#screen-spec h2').innerText(),'Privacidade e visibilidade');
  await page.evaluate(()=>openScreen(24));await page.locator('#screen-preview .approved-stage [data-source-action="setHHist"]').click();assert.equal(await page.locator('#screen-spec h2').innerText(),'Histórico do Hábito');
  await page.locator('#screen-preview .approved-stage [data-source-action="setHRef"]').click();assert.equal(await page.locator('#screen-spec h2').innerText(),'Reflexões do Hábito');
  await page.evaluate(()=>openScreen(38));assert.doesNotMatch(await page.locator('#screen-preview .phone').innerText(),/\b23\b|\b17\b|\b6\b|550 exp|Nível 7/,'Árvore sem contadores inventados');
  await page.locator('#screen-preview [data-reference="approved"]').click();assert.match(await page.locator('#screen-preview .phone').innerText(),/Nível 7/,'Composição histórica preservada e identificada');
  const sourceHash=crypto.createHash('sha256').update(fs.readFileSync('Documentacao_Projeto_Nos/Telas/Nos_App.dc.html')).digest('hex');
  assert.equal(await page.evaluate(()=>approvedSourceHash),sourceHash,'Layouts rastreáveis ao documento aprovado');
  const inventory=await page.evaluate(()=>screens.map(s=>({id:s.id,title:s.title,actions:s.actions})));
  const layoutDefinitions=await page.evaluate(()=>approvedLayoutDefinitions);
  const documentIds={'document-conta':1,'document-caminho':6,'document-tipo':7,'document-proposito':8,'document-convite-inicial':9,'document-convite-entrada':10};
  for(const key of Object.keys(layoutDefinitions)){
    const id=Number(key)||documentIds[key]||(key.startsWith('vinculo-')?47:key.startsWith('acordos-')?18:40);
    await page.evaluate(({id,key})=>{openScreen(id);referenceMode=true;documentLayoutKey=key;renderPrototype();},{id,key});
    assert.equal(await page.locator('#screen-preview .approved-stage').getAttribute('data-approved'),key,`Layout importado ${key}`);
    assert.equal(await page.locator('#screen-preview .approved-stage').evaluate(el=>el.innerHTML.includes('{{')),false,`Bindings resolvidos ${key}`);
    await verifyImages(page);
  }
  assert.equal(inventory.length,72);
  let states=0,actions=0,references=0;
  for(const screen of inventory){
    await page.evaluate(id=>openScreen(id),screen.id);
    assert.equal(await page.locator('#screen-spec h2').innerText(),screen.title);
    assert.ok((await page.locator('#screen-preview .phone').innerText()).trim().length>20,`Tela preenchida ${screen.id}`);
    await verifyImages(page);
    assert.equal(await page.locator('#screen-preview .phone').evaluate(el=>[...el.querySelectorAll('[data-go]')].every(node=>byId(node.dataset.go))),true,`Destinos da composição ${screen.id}`);
    for(const action of screen.actions){await page.evaluate(id=>openScreen(id),screen.id);await page.locator(`#screen-preview [data-go="${action.to}"]`).last().click();assert.equal(await page.locator('#screen-spec h2').innerText(),inventory.find(s=>s.id===action.to).title);actions++;}
    for(const state of ['empty','loading','error','blocked','success']){await page.evaluate(id=>openScreen(id),screen.id);await page.locator(`[data-state="${state}"]`).click();assert.equal(await page.locator('#screen-preview .phone .state-message').count(),1,`Estado ${screen.id}/${state}`);states++;}
    await page.evaluate(id=>openScreen(id),screen.id);
    if(await page.locator('#screen-preview [data-reference="approved"]').count()){await page.locator('#screen-preview [data-reference="approved"]').click();assert.equal(await page.locator('#screen-preview .approved-stage').count(),1,`Referência ${screen.id}`);references++;}
  }
  await page.evaluate(()=>openScreen(6));await page.locator('[data-width="desktop"]').click();
  assert.equal(await page.locator('#screen-preview .product-garden h4').isVisible(),true,'Composição web com texto ao lado da árvore');
  await page.locator('#screen-preview .preview-wrap').screenshot({path:'artifacts/atlas-fidelity-web.png'});
  await page.setViewportSize({width:375,height:812});await page.locator('[data-width="mobile"]').click();
  for(const screen of inventory){await page.evaluate(id=>openScreen(id),screen.id);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`Sem transbordamento da página ${screen.id}`);}
  await page.evaluate(()=>openScreen(7));await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await page.locator('#screen-preview .product-primary').first().evaluate(el=>getComputedStyle(el).transitionDuration),'0s');
  await page.locator('.view-tabs [data-view="atlas"]').click();assert.equal(await page.locator('.tile').count(),72);
  await page.locator('#status-filter').selectOption('Planejada');assert.equal(await page.locator('.tile').count(),42);await page.locator('#status-filter').selectOption('all');
  await page.locator('#search').fill('recuperar');assert.ok(await page.locator('.tile').count()>0);await page.locator('#search').fill('');
  await page.locator('.view-tabs [data-view="flows"]').click();assert.equal(await page.locator('.flow-card').count(),13);
  await page.locator('.view-tabs [data-view="atlas"]').click();await page.emulateMedia({media:'print'});assert.equal(await page.locator('#atlas-view').isVisible(),true);
  assert.deepEqual(errors,[],'Nenhum erro de execução');assert.deepEqual(external,[],'Atlas funciona sem chamadas HTTP externas');
  const result={screens:inventory.length,actions,states,references,approvedLayouts:Object.keys(layoutDefinitions).length,documentScreens:new Set(Object.values(layoutDefinitions).map(d=>d.screen)).size,paletteRoutes:3,nucleusTypes:9,errors,external};
  fs.writeFileSync('artifacts/fidelity-result.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));
} finally { await browser.close(); }
