import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

// Evidência visual sem acesso ao Auth. Formulário protegido da Tela 05 é testado na jornada local.
const browser=await chromium.launch();
fs.mkdirSync('artifacts',{recursive:true});
try{
  const atlas=await browser.newPage({viewport:{width:1440,height:1200}});
  const app=await browser.newPage({viewport:{width:390,height:844}});
  const errors=[];atlas.on('pageerror',e=>errors.push(e.message));
  await atlas.goto(pathToFileURL(path.resolve('Documentacao_Projeto_Nos/wireframes/atlas/index.html')).href);
  for(const [id,slug,route] of [[1,'account','/conta'],[2,'signup','/conta'],[3,'confirmation','/conta/confirmar-email'],[4,'recovery','/conta/recuperar'],[5,'invalid-link','/conta/nova-senha']]){
    await app.goto('http://127.0.0.1:3000'+route);
    await atlas.evaluate(id=>openScreen(id),id);
    if(id===5)await atlas.locator('[data-state="blocked"]').click();
    assert.equal(await atlas.locator('#screen-preview .product-content>h3').innerText(),await app.locator('h1').innerText());
    assert.deepEqual(await atlas.locator('#screen-preview .product-field label').allTextContents(),await app.locator('main label').allTextContents());
    assert.equal(await atlas.locator('#screen-preview .product-intro').innerText(),await app.locator('h1+p').innerText());
    for(const mode of ['mobile','desktop']){
      await atlas.locator(`[data-width="${mode}"]`).click();
      await app.setViewportSize(mode==='mobile'?{width:390,height:844}:{width:1440,height:1000});
      await app.addStyleTag({content:'nextjs-portal{display:none}'});
      await app.screenshot({path:`artifacts/${slug}-${mode}.png`,fullPage:true});
      await atlas.locator('#screen-preview .phone').evaluate(el=>{el.style.height='auto';el.style.maxHeight='none';el.querySelector('.product-onboarding').style.overflow='visible';});
      await atlas.locator('#screen-preview .phone').screenshot({path:`artifacts/atlas-account-after-${id}-${mode}.png`});
      const colors=async(page,selector)=>page.locator(selector).evaluate(el=>({color:getComputedStyle(el).color,font:getComputedStyle(el).fontFamily}));
      assert.deepEqual(await colors(atlas,'#screen-preview .product-content h3'),await colors(app,'h1'));
      assert.ok(await app.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    }
  }
  await atlas.evaluate(()=>openScreen(5));
  assert.deepEqual(await atlas.locator('#screen-preview .product-field label').allTextContents(),['Nova senha','Confirmar nova senha']);
  await atlas.locator('[data-width="mobile"]').click();
  await atlas.locator('#screen-preview .phone').evaluate(el=>{el.style.height='auto';el.style.maxHeight='none';});
  await atlas.locator('#screen-preview .phone').screenshot({path:'artifacts/atlas-account-after-5-authorized-mobile.png'});
  await atlas.evaluate(()=>openScreen(72));
  await app.goto('http://127.0.0.1:3000/boas-vindas');
  assert.equal(await atlas.locator('#screen-preview h3').innerText(),await app.locator('h1').innerText());
  assert.deepEqual(await atlas.locator('#screen-preview .welcome-entry-actions button').allTextContents(),await app.locator('main a').allTextContents());
  for(const mode of ['mobile','desktop']){
    await atlas.locator(`[data-width="${mode}"]`).click();
    await app.setViewportSize(mode==='mobile'?{width:390,height:844}:{width:1440,height:1000});
    await app.addStyleTag({content:'nextjs-portal{display:none}'});
    await app.screenshot({path:`artifacts/welcome-${mode}.png`,fullPage:true});
    await atlas.locator('#screen-preview .phone').evaluate(el=>{el.style.height='auto';el.style.maxHeight='none';});
    await atlas.locator('#screen-preview .phone').screenshot({path:`artifacts/atlas-account-after-72-${mode}.png`});
  }
  await atlas.locator('#screen-preview [data-entry-login]').click();
  assert.equal(await atlas.locator('#screen-preview [data-auth="login"]').getAttribute('aria-pressed'),'true');
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({screens:6,viewports:2,labels:'iguais',headings:'iguais',subtitles:'iguais',titleColorsAndFonts:'iguais',horizontalOverflow:false,errors}));
}finally{await browser.close();}
