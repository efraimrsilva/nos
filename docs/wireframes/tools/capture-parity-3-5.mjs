import {chromium} from '@playwright/test';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
const stage=process.argv[2]||'depois';
const directory='docs/wireframes/comparacoes/v3.5.0-2026-11-03-paridade-tela-01-tela-05-tela-12-tela-13-tela-14-tela-18-tela-66-tela-73';
fs.mkdirSync(directory,{recursive:true});
const browser=await chromium.launch();
const page=await browser.newPage({viewport:{width:1600,height:1200},reducedMotion:'reduce'});
await page.goto(pathToFileURL(path.resolve('docs/wireframes/atlas/index.html')).href);
for(const width of ['mobile','desktop'])for(const id of [1,5,12,13,14,18,66,73]){
await page.evaluate(id=>{document.querySelectorAll('dialog[open]').forEach(d=>d.close());openScreen(id)},id);
await page.locator('[data-width="'+width+'"]').click();
await page.locator('#screen-preview .preview-wrap').screenshot({path:directory+'/'+stage+'-atlas-'+id+'-'+width+'.png'});
}
if(stage==='depois')for(const width of ['mobile','desktop'])for(const [id,trigger,name] of [[18,'data-live-proposal','nova-proposta'],[66,'data-live-delete-account','apagar-conta']]){await page.evaluate(id=>{document.querySelectorAll('dialog[open]').forEach(d=>d.close());openScreen(id)},id);await page.locator('[data-width="'+width+'"]').click();await page.locator('#screen-preview ['+trigger+']').first().click();await page.locator('#atlas-live-dialog').screenshot({path:directory+'/'+stage+'-atlas-modal-'+name+'-'+width+'.png'});await page.keyboard.press('Escape');}
await browser.close();
console.log('Capturas '+stage+': 16');
