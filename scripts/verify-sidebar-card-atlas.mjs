import { chromium, expect } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import { mkdirSync } from 'node:fs';
const dir='Documentacao_Projeto_Nos/wireframes/comparacoes/v3.4.2-2026-10-30-barra-lateral-tela_13';mkdirSync(dir,{recursive:true});
const browser=await chromium.launch();
try {
 const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto(pathToFileURL(process.cwd()+'/Documentacao_Projeto_Nos/wireframes/atlas/index.html').href);
 await page.evaluate(()=>openScreen(13));
 for(const device of ['desktop','mobile']){
   await page.locator(`[data-width="${device}"]`).click();
   await expect(page.locator('#screen-preview .current-atlas-switch')).toHaveCount(0);
   await expect(page.locator('#screen-preview .current-atlas-sidebar [data-go="12"]')).toHaveCount(1);
   await page.locator('#screen-preview .preview-wrap').screenshot({path:dir+'/depois-atlas-'+device+'.png'});
 }
 expect(errors).toEqual([]);console.log('Atlas: cartão removido, link Seus Núcleos preservado; desktop/mobile e zero erros aprovados.');
}finally{await browser.close();}
