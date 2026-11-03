import {chromium} from '@playwright/test';
import {pathToFileURL} from 'node:url';
import fs from 'node:fs';
import path from 'node:path';
const root='Documentacao_Projeto_Nos/wireframes/comparacoes/v3.6.0-2026-11-03-nucleo-tela_13-tela_66-tela_71-tela_73';
fs.mkdirSync(root,{recursive:true});
const browser=await chromium.launch();const page=await browser.newPage({viewport:{width:1600,height:1200},reducedMotion:'reduce'});
await page.goto(pathToFileURL(path.resolve('Documentacao_Projeto_Nos/wireframes/atlas/index.html')).href);
for(const width of ['desktop','mobile'])for(const id of [13,66,71,73]){await page.evaluate(id=>{document.querySelectorAll('dialog[open]').forEach(d=>d.close());openScreen(id)},id);await page.locator('[data-width="'+width+'"]').click();await page.locator('#screen-preview .preview-wrap').screenshot({path:root+'/'+(process.argv[2]||'antes')+'-atlas-'+id+'-'+width+'.png'});}
if(process.argv[2]==='depois')for(const width of ['desktop','mobile'])for(const [id,selector,name] of [[13,'[data-live-identity="name"]','nome'],[13,'[data-live-identity="purpose"]','proposito'],[13,'[data-live-members]','integrantes'],[66,'[data-live-invitation-management]','convites'],[66,'[data-live-choose-nucleus]','saida'],[66,'[data-live-closure]','encerramento']]){await page.evaluate(id=>{document.querySelectorAll('dialog[open]').forEach(d=>d.close());openScreen(id)},id);await page.locator('[data-width="'+width+'"]').click();await page.locator('#screen-preview .current-atlas-main '+selector).click();await page.locator('#atlas-live-dialog').screenshot({path:root+'/depois-atlas-modal-'+name+'-'+width+'.png',animations:'disabled'});await page.keyboard.press('Escape');}
await browser.close();
