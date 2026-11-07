import { chromium } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
const output='Documentacao_Projeto_Nos/wireframes/comparacoes/v3.10.1-2026-11-07-resumo-nucleos-tela_12-tela_13';
fs.mkdirSync(output,{recursive:true});
const browser=await chromium.launch();
const page=await browser.newPage({viewport:{width:1600,height:1200},reducedMotion:'reduce'});
await page.goto(pathToFileURL(path.resolve('Documentacao_Projeto_Nos/wireframes/atlas/index.html')).href);
for(const width of ['desktop','mobile'])for(const id of [12,13]){
 await page.evaluate(id=>{document.querySelectorAll('dialog[open]').forEach(d=>d.close());openScreen(id)},id);
 await page.locator(`[data-width="${width}"]`).click();
 await page.locator('#screen-preview .preview-wrap').screenshot({path:`${output}/${process.argv[2]||'antes'}-atlas-${id}-${width}.png`});
}
await browser.close();
