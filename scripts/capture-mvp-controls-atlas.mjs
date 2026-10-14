import { chromium } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const gallery=path.resolve('Documentacao_Projeto_Nos/wireframes/comparacoes/v0.16.0-2026-10-13-mvp-05-tela_66-tela_67-tela_69-tela_70-tela_71');
const source=path.resolve('Documentacao_Projeto_Nos/wireframes/atlas');
const baseline=path.resolve('artifacts/mvp05-atlas-baseline');
mkdirSync(gallery,{recursive:true});cpSync(source,baseline,{recursive:true});
// O antes vem do commit de partida, sem reconstruir uma interface histórica inexistente.
for(const file of ['screens.js','mvp-plan.js','global-view.js','product-ui.js','index.html']) {
  writeFileSync(path.join(baseline,file),execFileSync('git',['show',`c40594f:Documentacao_Projeto_Nos/wireframes/atlas/${file}`]));
}
const browser=await chromium.launch();
try {
  const page=await browser.newPage();
  for(const [label,viewport] of [['desktop',{width:1440,height:1000}],['mobile',{width:390,height:844}]]) {
    await page.setViewportSize(viewport);
    for(const [state,root] of [['antes',baseline],['depois',source]]) {
      await page.goto(pathToFileURL(path.join(root,'index.html')).href);
      await page.addStyleTag({content:'.toolbar{position:static!important}#screen-preview .phone,#screen-preview .approved-stage,#screen-preview .nos-scroll{height:auto!important;max-height:none!important;overflow:visible!important}#screen-preview .nos-scroll{position:relative!important;inset:auto!important}'});
      for(const id of [12,13,66,67,69,70,71]) {
        await page.evaluate(id=>openScreen(id),id);
        await page.locator('#screen-preview').screenshot({path:path.join(gallery,`atlas-${id}-${state}-${label}.png`)});
      }
      await page.goto(pathToFileURL(path.join(root,'index.html')).href+'#mvp');
      const phase=page.locator('#mvp-phase-controls');
      await phase.locator(':scope > summary').click();
      await phase.screenshot({path:path.join(gallery,`mvp-${state}-${label}.png`)});
    }
  }
  console.log('Atlas e MVP05 antes/depois em desktop/mobile; nenhuma consulta ao backend.');
} finally {await browser.close();}
