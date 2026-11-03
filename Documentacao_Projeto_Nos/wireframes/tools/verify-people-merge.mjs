import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
const browser=await chromium.launch();
try {
 const page=await browser.newPage({viewport:{width:1600,height:1200}}), errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(pathToFileURL(path.resolve('Documentacao_Projeto_Nos/wireframes/atlas/index.html')).href);
 const open=async(id,width)=>{await page.evaluate(id=>{document.querySelectorAll('dialog[open]').forEach(d=>d.close());openScreen(id)},id);await page.locator(`[data-width="${width}"]`).click();};
 for(const width of ['desktop','mobile']){
  await open(13,width);
  const preview=page.locator('#screen-preview');
  assert.equal(await preview.locator('.current-atlas-nav [data-go="73"],.current-atlas-mobile [data-go="73"]').count(),0);
  assert.deepEqual(await preview.locator('.current-atlas-mobile [data-go]').evaluateAll(nodes=>nodes.map(n=>n.dataset.go)),['13','12','18','14']);
  for(const selector of ['[data-live-identity="name"]','[data-live-identity="purpose"]','[data-live-members]']){await preview.locator(selector).click();await page.locator('#atlas-live-dialog').waitFor({state:'visible'});await page.keyboard.press('Escape');}
  await open(66,width);
  assert.equal(await preview.locator('.live-account-preferences [data-go="10"]').count(),0);
  for(const selector of ['[data-live-invitation-management]','[data-live-choose-nucleus]','[data-live-closure]']){await preview.locator('.current-atlas-main '+selector).click();await page.locator('#atlas-live-dialog').waitFor({state:'visible'});await page.keyboard.press('Escape');}
  if(width==='mobile'){
   await preview.locator('[data-atlas-menu]').click();
   assert.equal(await page.locator('#atlas-live-dialog [data-live-closure]').count(),1);
   await page.keyboard.press('Escape');
  }
 }
 assert.equal(await page.evaluate(()=>screens.length),73);assert.deepEqual(errors,[]);
 console.log(JSON.stringify({identityModals:true,membersModal:true,accountActions:true,mobileOrder:true,noPeopleTab:true,invitationEntryPreserved:true,screens:73,errors}));
}finally{await browser.close();}
