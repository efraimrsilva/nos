import {randomUUID} from 'node:crypto';
import {mkdirSync} from 'node:fs';
import path from 'node:path';
import {test,expect,localSql} from './fixtures';
import {withPeer} from './peer';

const gallery=path.resolve('Documentacao_Projeto_Nos/wireframes/comparacoes/v3.11.0-2026-11-07-nomes-perfil-tela_12-tela_13-tela_66');
test('nome de perfil chega a outra sessão com integrantes e detalhes abertos e lista atualiza após falha',async({page,account},info)=>{
 await withPeer(page,async peer=>{
  const id=randomUUID();
  localSql(`update auth.users set raw_user_meta_data=jsonb_build_object('name','Nome Anterior') where id='${account.id}'; insert into public.nuclei(id,type,name,purpose,created_by) values('${id}','familia','Jardim Compartilhado','Presença','${account.id}'); insert into public.nucleus_members(nucleus_id,user_id,role) values('${id}','${account.id}','admin'),('${id}','${peer.id}','member');`);
  const viewport=info.project.name==='desktop'?{width:1440,height:1000}:{width:390,height:844};await page.setViewportSize(viewport);await peer.page.setViewportSize(viewport);
  await page.goto('/conta');await page.locator('.account-workspace').getByRole('button',{name:/^Dados da conta/}).click();
  const edit=page.getByRole('dialog',{name:'Dados da conta',exact:true});
  await peer.page.goto(`/nucleos/${id}`);await peer.page.getByRole('button',{name:'Ver integrantes',exact:true}).click();
  await peer.page.getByRole('button',{name:'Abrir detalhes de Nome Anterior',exact:true}).click();
  const origin=await peer.page.evaluate(()=>performance.timeOrigin);
  mkdirSync(gallery,{recursive:true});
  const phase=process.env.NOS_PROFILE_SYNC_BEFORE==='1'?'antes':'depois';
  await peer.page.screenshot({path:path.join(gallery,`${phase}-app-13-${info.project.name}.png`),fullPage:true,animations:'disabled',scale:'css'});
  async function rename(value:string){await edit.getByRole('button',{name:'Editar nome do perfil',exact:true}).click();await edit.getByRole('textbox',{name:'Nome do perfil',exact:true}).fill(value);await edit.getByRole('button',{name:'Salvar nome',exact:true}).click();await expect(edit.getByRole('status')).toHaveText('Nome do perfil atualizado.');}
  await rename('Nome Compartilhado');
  await expect(peer.page.getByRole('dialog',{name:'Participação de Nome Compartilhado',exact:true})).toBeVisible({timeout:15000});
  await expect(peer.page.getByRole('dialog',{name:'Integrantes do Núcleo',exact:true})).toBeVisible();
  expect(await peer.page.evaluate(()=>performance.timeOrigin)).toBe(origin);
  await peer.page.screenshot({path:path.join(gallery,`depois-app-detalhes-${info.project.name}.png`),fullPage:true,animations:'disabled',scale:'css'});
  await peer.page.keyboard.press('Escape');await peer.page.keyboard.press('Escape');await peer.page.goto('/nucleos');
  const card=peer.page.locator('.nucleus-space-card').first();await expect(card).toContainText('Nome Compartilhado');
  const listOrigin=await peer.page.evaluate(()=>performance.timeOrigin);
  let failures=0;await peer.page.route('**/*',async route=>{if(route.request().headers()['next-action']){failures++;await route.abort('failed')}else await route.continue()});
  await rename('Nome Atualizado');await expect.poll(()=>failures,{timeout:10000}).toBeGreaterThan(0);await expect(card).toContainText('Nome Compartilhado');
  await peer.page.unrouteAll({behavior:'wait'});await expect(card).toContainText('Nome Atualizado',{timeout:15000});
  expect(await peer.page.evaluate(()=>performance.timeOrigin)).toBe(listOrigin);
  await peer.page.screenshot({path:path.join(gallery,`depois-app-12-${info.project.name}.png`),fullPage:true,animations:'disabled',scale:'css'});
 });
});
