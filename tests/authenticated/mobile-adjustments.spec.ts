import { randomUUID } from 'node:crypto';
import { test, expect, localSql } from './fixtures';
import { withPeer } from './peer';

test('aceite de outra pessoa aparece sem recarregar e preserva rascunho', async ({page,account})=>{
  await withPeer(page,async peer=>{
    const nucleus=randomUUID(),agreement=randomUUID();
    localSql(`insert into public.nuclei(id,type,name,purpose,created_by) values('${nucleus}','familia','Respostas ao vivo','Cuidar','${account.id}'); insert into public.nucleus_members(nucleus_id,user_id,role) values('${nucleus}','${account.id}','admin'),('${nucleus}','${peer.id}','member'); insert into public.nucleus_agreements(id,nucleus_id,created_by,category,title,description,timing,frequency,status,trial_days) values('${agreement}','${nucleus}','${account.id}','habit','Conversar ao vivo','Com atenção','Noite','Semanal','pending',7);`);
    await page.goto(`/nucleos/${nucleus}/acordos`);
    await expect(page.locator('.agreement-responses').first()).toContainText('0 pessoas aceitaram', {timeout:7000});
    await page.getByRole('button',{name:'Nova proposta',exact:true}).click();
    const draft=page.getByRole('dialog',{name:'Nova proposta',exact:true});
    await draft.getByLabel('O que vamos fazer?').fill('Meu rascunho');
    const result=await peer.client.rpc('respond_nucleus_agreement',{target_agreement:agreement,agreement_response:'accepted',expected_terms_version:1});
    // A resposta é dada pela segunda conta, com as mesmas permissões da aplicação.
    expect(result.error).toBeNull();
    await expect(page.locator('.agreement-responses').first()).toContainText('1 pessoa aceitou', {timeout:7000});
    await expect(draft).toBeVisible(); await expect(draft.getByLabel('O que vamos fazer?')).toHaveValue('Meu rascunho');
  });
});

test('calendário mensal completo ultrapassa 2030 e acompanha a semana',async({page,account})=>{
 const id=randomUUID();localSql(`insert into public.nuclei(id,type,name,purpose,created_by) values('${id}','familia','Calendário completo','Cuidar','${account.id}'); insert into public.nucleus_members(nucleus_id,user_id,role) values('${id}','${account.id}','admin');`);
 await page.goto(`/nucleos/${id}/agenda`);
 const calendar=page.locator('.calendar-month-picker');await expect(calendar).toBeVisible();
 await expect(calendar.getByRole('columnheader',{includeHidden:true})).toHaveCount(7);
 await expect(calendar.locator('tbody tr')).toHaveCount(6);
 await calendar.getByRole('combobox',{name:/ano/i}).selectOption('2030');
 await calendar.getByRole('combobox',{name:/mês/i}).selectOption('11');
 await expect(calendar).toContainText('2030');
 await expect(calendar.getByRole('button',{name:/próximo mês/i})).toBeEnabled();
 await calendar.getByRole('button',{name:/próximo mês/i}).click();
 await expect(calendar.getByRole('combobox',{name:/ano/i})).toHaveValue('2031');
 await calendar.getByRole('button',{name:/31 de janeiro de 2031/}).click();
 await page.getByRole('button',{name:'Próxima semana',exact:true}).click();
 await expect(calendar.getByRole('combobox',{name:/mês/i})).toHaveValue('1');
 await page.screenshot({path:'artifacts/calendar-complete-'+test.info().project.name+'.png',fullPage:true});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('convite em Acordos é exclusivo de administrador e cartões antigos foram removidos',async({page,account})=>{
 await withPeer(page,async peer=>{
 const id=randomUUID();localSql(`insert into public.nuclei(id,type,name,purpose,created_by) values('${id}','familia','Convites acessíveis','Cuidar','${account.id}'); insert into public.nucleus_members(nucleus_id,user_id,role) values('${id}','${account.id}','admin'),('${id}','${peer.id}','member');`);
 await page.goto(`/nucleos/${id}/acordos`);
 await page.getByRole('button',{name:'Enviar convite',exact:true}).click();
 const dialog=page.getByRole('dialog',{name:'Enviar convite',exact:true});await expect(dialog.getByRole('button',{name:'Gerar convite',exact:true})).toBeVisible();
 await peer.page.goto(`http://127.0.0.1:3200/nucleos/${id}/acordos`);await expect(peer.page.getByRole('button',{name:'Enviar convite',exact:true})).toHaveCount(0);
 for(const route of ['/nucleos',`/nucleos/${id}/pessoas`]){await page.goto(route);await expect(page.getByRole('heading',{name:'Um lugar à mesa',exact:true})).toHaveCount(0);}
 });
});

test('calendário mantém contraste dos dias e opções nos temas escuros',async({page,account})=>{
 const id=randomUUID();localSql(`insert into public.nuclei(id,type,name,purpose,created_by) values('${id}','familia','Contraste da agenda','Cuidar','${account.id}'); insert into public.nucleus_members(nucleus_id,user_id,role) values('${id}','${account.id}','admin');`);
 await page.goto(`/nucleos/${id}/agenda`);
 const calendar=page.locator('.calendar-month-picker');
 for(const [theme,background] of [['dark','rgb(26, 36, 32)'],['black','rgb(0, 0, 0)'],['neon','rgb(17, 24, 49)']]){
   await page.evaluate(value=>{document.documentElement.dataset.theme=value;},theme);
   const yearOption=calendar.getByRole('combobox',{name:'Ano',exact:true}).locator('option').first();
   await expect(yearOption).toHaveCSS('background-color',background);
   await expect(calendar.locator('.rdp-day:not(.rdp-selected):not(.rdp-outside) .rdp-day_button').first()).toHaveCSS('color','rgb(248, 250, 252)');
   await calendar.screenshot({path:`artifacts/calendar-${theme}-${test.info().project.name}.png`});
 }
});
