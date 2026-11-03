import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { test, expect, localSql } from './fixtures';
import { withPeer } from './peer';

test('cartões mostram integrantes, abrem por inteiro e não deixam espaço vazio',async({page,account},info)=>{
 await withPeer(page,async peer=>{
  const ids=Array.from({length:4},()=>randomUUID());
  localSql(`update auth.users set raw_user_meta_data=jsonb_build_object('name','Pessoa Principal') where id='${account.id}'; update auth.users set raw_user_meta_data=jsonb_build_object('name','Pessoa Convidada') where id='${peer.id}';`);
  for(const [index,id] of ids.entries())localSql(`insert into public.nuclei(id,type,name,purpose,created_by) values('${id}','familia','Espaço ${index+1}','Propósito que não vira cartão','${account.id}'); insert into public.nucleus_members(nucleus_id,user_id,role) values('${id}','${account.id}','admin');`);
  localSql(`insert into public.nucleus_members(nucleus_id,user_id,role) values('${ids[0]}','${peer.id}','member');`);
  await page.goto('/nucleos');const cards=page.locator('.nucleus-space-card');await expect(cards).toHaveCount(4);
  const first=page.getByRole('navigation',{name:'Seus Núcleos',exact:true}).getByRole('link',{name:'Espaço 1',exact:true});
  await expect(first).toContainText('Pessoa Principal');await expect(first).toContainText('Pessoa Convidada');
  await expect(page.getByRole('link',{name:'Espaço 2',exact:true})).not.toContainText('Pessoa Convidada');
  await expect(first).not.toContainText('Abrir Núcleo');await expect(first).not.toContainText('Propósito que não vira cartão');
  async function expectCompactCards(){
   const gaps=await cards.evaluateAll(nodes=>nodes.map(card=>{const last=card.querySelector('.nucleus-members-list li:last-child');return last?card.getBoundingClientRect().bottom-last.getBoundingClientRect().bottom:Infinity;}));
   expect(gaps.every(gap=>gap<=28)).toBe(true);
  }
  if(info.project.name==='desktop'){
   const counts:number[]=[];
   for(const width of [1280,1920]){await page.setViewportSize({width,height:1000});const boxes=await cards.evaluateAll(nodes=>nodes.map(node=>{const b=node.getBoundingClientRect();return {x:b.x,y:b.y,width:b.width,height:b.height}}));
    expect(boxes.every(box=>Math.abs(box.width-300)<1)).toBe(true);counts.push(boxes.filter(box=>box.y===boxes[0].y).length);await expectCompactCards();}
   expect(counts[1]).toBeGreaterThan(counts[0]);
   for(const width of [600,700,701,768,1024,1199]){
    await page.setViewportSize({width,height:1000});
    const boxes=await cards.evaluateAll(nodes=>nodes.map(node=>{const b=node.getBoundingClientRect();return {y:b.y,height:b.height}}));
    expect(boxes.filter(box=>Math.abs(box.y-boxes[0].y)<1)).toHaveLength(2);
    await expectCompactCards();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    if(width===768) await page.screenshot({path:'artifacts/nuclei-selection-intermediate.png',fullPage:true});
   }
   await page.setViewportSize({width:1700,height:1000});
  }else{
   for(const width of [320,390,599]){
    await page.setViewportSize({width,height:844});
    const boxes=await cards.evaluateAll(nodes=>nodes.map(node=>{const b=node.getBoundingClientRect();return {y:b.y,height:b.height}}));
    expect(boxes.filter(box=>Math.abs(box.y-boxes[0].y)<1)).toHaveLength(1);
    await expectCompactCards();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
   }
   await page.setViewportSize({width:390,height:844});
  }
  await page.screenshot({path:`artifacts/nuclei-selection-${info.project.name}.png`,fullPage:true});
  await first.click({position:{x:8,y:8}});await expect(page).toHaveURL(new RegExp(`/nucleos/${ids[0]}$`));
  await page.goto('/nucleos');await first.focus();await page.keyboard.press('Enter');await expect(page).toHaveURL(new RegExp(`/nucleos/${ids[0]}$`));
 });
});

test('Início identifica Núcleo com nome limitado e propósito não ocupa bloco',async({page,account},info)=>{
 const id=randomUUID(),name='Nosso núcleo com um nome bastante longo para testar a navegação';
 localSql(`insert into public.nuclei(id,type,name,purpose,created_by) values('${id}','familia','${name}','Construir um relacionamento presente e carinhoso.','${account.id}'); insert into public.nucleus_members(nucleus_id,user_id,role) values('${id}','${account.id}','admin');`);
 localSql(`insert into public.nucleus_agreements(nucleus_id,created_by,category,title,description,timing,frequency,status,trial_days) values('${id}','${account.id}','habit','Combinado de layout','Uma prática','Noite','Semanal','pending',7);`);
 await page.goto(`/nucleos/${id}`);
 const navigation=info.project.name==='mobile'?page.getByRole('navigation',{name:'Navegação móvel'}):page.locator('.desktop-navigation');
 const home=navigation.getByRole('link',{name:`Início · ${name}`,exact:true});await expect(home).toBeVisible();
 const caption=home.locator('.nav-nucleus-name');await expect(caption).toBeVisible();
 expect(Array.from(await caption.innerText()).length).toBeLessThanOrEqual(info.project.name==='mobile'?12:18);
 await expect(page.getByRole('main')).not.toContainText('Nosso propósito:');
 await expect(page.locator('.home-footer-links')).toHaveCount(0);
 const finalRows=page.locator('.home-overview-grid>.ui-panel>.ui-row:last-child,.home-agreement>.ui-row:last-child');
 await expect(finalRows).toHaveCount(3);
 for(const row of await finalRows.all()) await expect(row).toHaveCSS('border-bottom-width','0px');
 await page.screenshot({path:'artifacts/home-clean-'+info.project.name+'.png',fullPage:true});
 await page.goto(`/nucleos/${id}/pessoas`);await expect(page.locator('.people-purpose')).toHaveCount(0);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('Acordos mantém visão global mesmo com parâmetros antigos',async({page,account})=>{
 const id=randomUUID();localSql(`insert into public.nuclei(id,type,name,purpose,created_by) values('${id}','familia','Todos os combinados','Cuidar','${account.id}'); insert into public.nucleus_members(nucleus_id,user_id,role) values('${id}','${account.id}','admin'); insert into public.nucleus_agreements(nucleus_id,created_by,category,title,description,timing,frequency,status,trial_days) values('${id}','${account.id}','habit','Proposta visível','Com cuidado','Noite','Semanal','pending',7),('${id}','${account.id}','experience','Experiência visível','Com cuidado','Dia','Uma vez','active',null);`);
 await page.goto(`/nucleos/${id}/acordos?categoria=essence&filtro=ended`);
 await expect(page.getByRole('navigation',{name:'Categorias dos acordos'})).toHaveCount(0);
 await expect(page.getByText('Proposta visível',{exact:true}).first()).toBeVisible();
 await expect(page.getByText('Experiência visível',{exact:true}).first()).toBeVisible();
 await expect(page.getByRole('button',{name:'Opções de visualização',exact:true})).toHaveCount(0);
 const header=page.locator('.agreements-heading');
 const proposalButton=header.getByRole('button',{name:'Nova proposta',exact:true});
 const bounds=await header.boundingBox(),buttonBounds=await proposalButton.boundingBox();
 expect(Math.abs(bounds!.x+bounds!.width-buttonBounds!.x-buttonBounds!.width)).toBeLessThan(2);
 if(test.info().project.name==='desktop')expect(Math.abs(bounds!.y-buttonBounds!.y)).toBeLessThan(2);
 await header.screenshot({path:'artifacts/agreements-actions-'+test.info().project.name+'.png'});
});

test('versão exibida acompanha o manifesto na barra lateral e em Mais',async({page},info)=>{
 const {version}=JSON.parse(readFileSync('package.json','utf8'));await page.goto('/nucleos');
 await expect(page.getByRole('heading',{name:'Seus Núcleos',exact:true})).toBeVisible();
 if(info.project.name==='mobile'){
  await page.getByRole('button',{name:'Mais áreas e preferências',exact:true}).click();
  const menu=page.getByRole('dialog',{name:'Todos os seus caminhos',exact:true});
  await expect(menu.locator('[data-navigation-group="account"] .navigation-build-version')).toHaveText('Versão '+version);
 }else {
  const versionText=page.locator('.desktop-navigation [data-navigation-group="account"] .navigation-build-version');
  await expect(versionText).toHaveCount(1);
  await expect(versionText).toHaveText('Versão '+version);
  await expect(page.locator('.desktop-navigation [data-navigation-group="account"]')).toHaveCSS('border-bottom-width','0px');
 }
});
