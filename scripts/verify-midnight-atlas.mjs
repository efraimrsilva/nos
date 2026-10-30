import { chromium, expect } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import { mkdirSync } from 'node:fs';
const dir='Documentacao_Projeto_Nos/wireframes/comparacoes/v3.4.1-2026-10-30-meia-noite-tela_66';
mkdirSync(dir,{recursive:true});
const browser=await chromium.launch();
try {
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(pathToFileURL(process.cwd()+'/Documentacao_Projeto_Nos/wireframes/atlas/index.html').href);
  await page.evaluate(()=>openScreen(66));
  for(const device of ['desktop','mobile']) {
    await page.locator(`[data-width="${device}"]`).click();
    await page.locator('#screen-preview .current-atlas-main [data-live-appearance]').click();
    await page.locator('[data-live-theme="black"]').click();
    await expect(page.locator('#screen-preview .current-atlas-main')).toHaveCSS('background-color','rgb(16, 19, 18)');
    await expect(page.locator('#atlas-live-dialog')).toHaveCSS('background-color','rgb(0, 0, 0)');
    if(device==='desktop') await expect(page.locator('#screen-preview .current-atlas-sidebar')).toHaveCSS('background-color','rgb(0, 0, 0)');
    await page.locator('#atlas-live-dialog').screenshot({path:dir+'/depois-atlas-aparencia-'+device+'.png'});
    await page.keyboard.press('Escape');
    await page.locator('#screen-preview .preview-wrap').screenshot({path:dir+'/depois-atlas-conta-'+device+'.png'});
  }
  expect(errors).toEqual([]);
  console.log('Atlas Meia-noite: fundo cinza, superfícies/coluna lateral pretas, desktop/mobile e zero erros aprovados.');
} finally { await browser.close(); }
