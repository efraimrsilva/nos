import { chromium } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

// Antes é extraído do commit de partida, preservando a referência real; somente Atlas offline.
const gallery=path.resolve('Documentacao_Projeto_Nos/wireframes/comparacoes/v0.15.2-2026-10-13-mvp-04-tela_14-tela_16-tela_15-tela_17');
const source=path.resolve('Documentacao_Projeto_Nos/wireframes/atlas');
const baseline=path.resolve('artifacts/mvp04-atlas-baseline');
mkdirSync(gallery,{recursive:true});cpSync(source,baseline,{recursive:true});
for(const file of ['screens.js','mvp-plan.js','global-view.js','product-ui.js','index.html']) {
  writeFileSync(path.join(baseline,file),execFileSync('git',['show',`06edf58:Documentacao_Projeto_Nos/wireframes/atlas/${file}`]));
}
const browser=await chromium.launch();
try {
  const page=await browser.newPage();
  for(const [label,viewport] of [['desktop',{width:1440,height:1000}],['mobile',{width:390,height:844}]]) {
    await page.setViewportSize(viewport);
    for(const [state,root] of [['antes',baseline],['depois',source]]) {
      await page.goto(pathToFileURL(path.join(root,'index.html')).href);
      // Só a captura expande o scroll interno para mostrar todos os espaços reservados.
      await page.addStyleTag({content:'.toolbar{position:static!important}#screen-preview .phone,#screen-preview .approved-stage,#screen-preview .nos-scroll{height:auto!important;max-height:none!important;overflow:visible!important}#screen-preview .nos-scroll{position:relative!important;inset:auto!important}'});
      for(const id of [14,16,15,17]) {
        await page.evaluate(id=>openScreen(id),id);
        const box=await page.locator('#screen-preview .phone').boundingBox();
        if(!box || box.height<500)throw new Error(`Composição incompleta na captura da Tela ${id}.`);
        await page.locator('#screen-preview').screenshot({path:path.join(gallery,`atlas-${id}-${state}-${label}.png`)});
      }
      await page.goto(pathToFileURL(path.join(root,'index.html')).href+'#mvp');
      const phase=page.locator('#mvp-phase-agenda');
      await phase.locator(':scope > summary').click();
      await phase.screenshot({path:path.join(gallery,`mvp-${state}-${label}.png`)});
    }
  }
  console.log('Antes/depois do Atlas e MVP capturados em duas larguras; nenhuma chamada ao backend.');
} finally {await browser.close();}
