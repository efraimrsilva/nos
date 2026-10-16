import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const stage=process.argv[2];
if(!['antes','depois'].includes(stage))throw new Error('Informe antes ou depois.');
const gallery=path.resolve('Documentacao_Projeto_Nos/wireframes/comparacoes/v1.1.0-2026-10-15-encerramento');
mkdirSync(gallery,{recursive:true});
const browser=await chromium.launch();
try {
  const page=await browser.newPage();
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  for(const [label,viewport] of [['desktop',{width:1440,height:1000}],['mobile',{width:390,height:844}]]) {
    await page.setViewportSize(viewport);
    await page.goto(pathToFileURL(path.resolve('Documentacao_Projeto_Nos/wireframes/atlas/index.html')).href+'#tela-73');
    await page.evaluate(()=>document.fonts.ready);
    // Expandir apenas a área de captura permite conferir o formulário completo na galeria.
    await page.addStyleTag({content:'.toolbar{position:static!important}#screen-preview .phone,#screen-preview .extension-scroll{height:auto!important;max-height:none!important;overflow:visible!important}'});
    if(stage==='depois') {
      await page.locator('#screen-preview summary').click();
      if(!await page.locator('#screen-preview input[name="closure-name"]').isVisible())throw new Error('Confirmação ausente no Atlas.');
    }
    await page.locator('#screen-preview').screenshot({path:path.join(gallery,`atlas-73-${stage}-${label}.png`)});
    if(stage==='depois') {
      const form=page.locator('#screen-preview [data-local-form="closure"]');
      await form.locator('input[name="closure-name"]').fill('Nome incorreto');
      await form.locator('input[type="checkbox"]').check();
      await form.getByRole('button',{name:'Encerrar Núcleo · exemplo',exact:true}).click();
      if(!await form.locator('.local-feedback').innerText().then(text=>text.includes('não corresponde')))throw new Error('Nome incorreto não foi rejeitado na prévia.');
      await form.locator('input[name="closure-name"]').fill('Nosso jardim');
      await form.getByRole('button',{name:'Encerrar Núcleo · exemplo',exact:true}).click();
      if(!await form.locator('.local-feedback').innerText().then(text=>text.includes('Nenhum Núcleo real foi alterado')))throw new Error('Confirmação ilustrativa ausente.');
    }
    if(!await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth))throw new Error('Overflow no Atlas.');
    await page.goto(pathToFileURL(path.resolve('Documentacao_Projeto_Nos/wireframes/atlas/index.html')).href+'#mvp');
    const phase=page.locator('#mvp-phase-controls');
    await phase.locator(':scope > summary').click();
    await phase.screenshot({path:path.join(gallery,`mvp-${stage}-${label}.png`)});
  }
  if(errors.length)throw new Error(errors.join('\n'));
  console.log(`Atlas73 e MVP05: ${stage}, desktop/mobile, sem erros ou overflow.`);
} finally {await browser.close();}
