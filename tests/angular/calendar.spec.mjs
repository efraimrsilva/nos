import { randomUUID } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';
import { localSupabaseConfig } from '../../scripts/local-supabase.mjs';

test('Agenda: mês, semana, resposta, remarcação e remoção', async ({page,browser},info) => {
  test.setTimeout(90_000);
  const cfg=localSupabaseConfig();
  const admin=createClient(cfg.API_URL,cfg.SERVICE_ROLE_KEY,{auth:{persistSession:false}});
  const users=[];
  let id;
  const context=await browser.newContext(info.project.use);
  const member=await context.newPage();
  page.setDefaultTimeout(9000);
  member.setDefaultTimeout(9000);
  const signIn=async (page,user,path) => {
    await page.goto('/conta?modo=login&next='+encodeURIComponent(path));
    const form=page.getByRole('form',{name:'Acesso à conta'});
    await form.getByLabel('E-mail',{exact:true}).fill(user.email);
    await form.getByLabel('Senha',{exact:true}).fill(user.password);
    await form.getByRole('button',{name:'Entrar',exact:true}).click();
    await expect(page).toHaveURL(path);
  };
  const capture=async (name,target=page) => {
    if (process.env.NOS_AGENDA_CAPTURE !== '1') return;
    mkdirSync('artifacts/angular-a09',{recursive:true});
    await target.screenshot({path:'artifacts/angular-a09/app-'+name+'-'+info.project.name+'.png',scale:'css'});
  };
  const open=(target,name)=>target.getByRole('button',{name,exact:true}).click();
  try {
    for(const name of ['Pessoa A','Pessoa B','Pessoa C']) {
      const email='angular-a09-'+randomUUID()+'@example.test', password='Aa1!'+randomUUID();
      const {data,error}=await admin.auth.admin.createUser({email,password,email_confirm:true,user_metadata:{name}});
      if(error || !data.user) throw new Error('Conta local indisponível.');
      const client=createClient(cfg.API_URL,cfg.PUBLISHABLE_KEY || cfg.ANON_KEY,{auth:{persistSession:false}});
      users.push({id:data.user.id,email,password,client});
      if((await client.auth.signInWithPassword({email,password})).error) throw new Error('Sessão local indisponível.');
    }
    const [owner,guest,outsider]=users;
    const created=await owner.client.rpc('create_nucleus',{nucleus_type:'amigos',nucleus_name:'Jardim da agenda',nucleus_purpose:'Cultivar presença.'});
    if (created.error || !/^[a-f0-9-]{36}$/i.test(created.data)) throw new Error('Núcleo local indisponível.');
    id=created.data;
    const invite=await owner.client.rpc('create_initial_invitation',{target_nucleus:id});
    if(invite.error || (await guest.client.rpc('accept_invitation',{invitation_code:invite.data})).error) throw new Error('Vínculo local indisponível.');
    const path='/nucleos/'+id+'/agenda';
    await signIn(page,owner,path);
    await expect(page.getByRole('heading',{name:'Tempo para o que importa.'})).toBeVisible();
    await expect(page.getByRole('table',{name:'Calendário mensal'})).toBeVisible();
    const year=page.getByLabel('Ano',{exact:true});
    const original=await year.inputValue();
    await expect(year).not.toHaveValue('');
    await year.selectOption('2031');
    await expect(year).toHaveValue('2031');
    const date=page.getByRole('table',{name:'Calendário mensal'}).locator('button[tabindex="0"]');
    await date.focus();
    await page.keyboard.press('ArrowRight');
    await expect(date).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('.agenda-toolbar h2')).toContainText('2031');
    await year.selectOption(original);
    await open(page,'Novo momento');
    const form=page.getByRole('dialog',{name:'Adicionar evento'});
    await expect(form).toBeVisible();
    await capture('criar');
    if (info.project.name==='mobile') await page.touchscreen.tap(5,5);
    else await page.mouse.click(5,5);
    await expect(form).toBeHidden();
    await open(page,'Novo momento');
    const local=(offset,hour)=>{
      const date=new Date();
      date.setDate(date.getDate()+offset);
      date.setHours(hour,0,0,0);
      return new Date(date.getTime()-date.getTimezoneOffset()*60_000).toISOString().slice(0,16);
    };
    await form.getByLabel('Título').fill('Encontro no jardim');
    await form.getByLabel('Início').fill(local(5,14));
    await form.getByLabel('Término').fill(local(5,13));
    await open(form,'Criar evento');
    await expect(form.getByRole('alert')).toContainText('posterior');
    await form.getByLabel('Término').fill(local(5,15));
    await open(form,'Criar evento');
    await expect(page.getByText('Evento salvo.',{exact:true})).toBeVisible();
    const detail=target=>target.getByRole('complementary',{name:'Seu próximo momento'});
    await expect(detail(page).getByRole('heading',{name:'Encontro no jardim'})).toBeVisible();
    await expect(page.getByRole('table',{name:'Calendário mensal'}).getByRole('button',{name:/com evento/})).toHaveCount(1);
    await expect(page.getByRole('link',{name:'Agenda',exact:true})).toHaveAttribute('aria-current','page');
    await expect(page.locator('.calendar-week')).toBeVisible({visible:info.project.name==='desktop'});
    await expect(page.locator('.calendar-mobile-list')).toBeVisible({visible:info.project.name==='mobile'});
    await capture('agenda');
    if(process.env.NOS_AGENDA_CAPTURE==='1') {
      await page.locator(info.project.name==='mobile' ? '.calendar-mobile-list' : '.calendar-week').scrollIntoViewIfNeeded();
      await capture('semana');
    }
    await page.goto('/nucleos/'+id);
    await page.getByRole('link',{name:'Encontro no jardim',exact:true}).click();
    await expect(page).toHaveURL(/#evento-/);
    await expect(detail(page).getByRole('heading',{name:'Encontro no jardim'})).toBeVisible();
    await signIn(member,guest,path);
    await expect(detail(member).getByRole('heading',{name:'Encontro no jardim'})).toBeVisible();
    await expect(detail(member).getByRole('button',{name:'Editar evento'})).toHaveCount(0);
    const yes=detail(member).getByRole('button',{name:'Posso participar',exact:true});
    const no=detail(member).getByRole('button',{name:'Não posso participar',exact:true});
    await expect(yes).toHaveAttribute('aria-pressed','false');
    await expect(no).toHaveAttribute('aria-pressed','false');
    await open(detail(member),'Não posso participar');
    await expect(detail(member).getByText('Precisa de novo horário')).toBeVisible();
    await expect(no).toHaveAttribute('aria-pressed','true');
    await open(detail(member),'Posso participar');
    await expect(detail(member).getByText('Confirmado',{exact:true})).toBeVisible();
    await member.reload();
    await expect(yes).toHaveAttribute('aria-pressed','true');
    await expect(no).toHaveAttribute('aria-pressed','false');
    if(process.env.NOS_AGENDA_CAPTURE==='1') await detail(member).scrollIntoViewIfNeeded();
    await capture('presenca',member);
    await open(detail(page),'Editar evento');
    const edit=page.getByRole('dialog',{name:'Editar evento'});
    await capture('editar');
    await edit.getByLabel('Intenção do momento (opcional)').fill('Escutar com calma.');
    await open(edit,'Salvar alterações');
    await expect(edit).toBeHidden();
    await expect(detail(page).getByText('Confirmado',{exact:true})).toBeVisible();
    await open(detail(page),'Editar evento');
    await edit.getByLabel('Término').fill(local(5,16));
    await open(edit,'Salvar alterações');
    await expect(detail(page).getByText('Aguardando respostas',{exact:true})).toBeVisible();
    await member.reload();
    await expect(detail(member).getByText(/ainda não respondi/)).toBeVisible();
    await open(detail(page),'Remover evento');
    const remove=page.getByRole('dialog',{name:'Remover evento'});
    await expect(remove.getByRole('button',{name:'Confirmar remoção'})).toBeDisabled();
    await capture('remover');
    await open(remove,'Manter evento');
    await expect(detail(page).getByRole('heading',{name:'Encontro no jardim'})).toBeVisible();
    await open(detail(page),'Remover evento');
    await remove.getByRole('checkbox').check();
    await open(remove,'Confirmar remoção');
    await expect(page.getByText('Evento removido.',{exact:true})).toBeVisible();
    await expect(page.getByText(/Nada marcado por enquanto/)).toBeVisible();
    let releaseRead;
    const readGate=new Promise(resolve=>{releaseRead=resolve;});
    await page.route('**/rest/v1/rpc/get_nucleus_calendar',async route=>{
      await readGate;
      await route.fulfill({status:400,json:{message:'Falha de leitura simulada.'}});
    },{times:1});
    try {
      await page.reload();
      await expect(page.getByText('Carregando a agenda…',{exact:true})).toBeVisible();
    } finally { releaseRead(); }
    await expect(page.getByRole('alert')).toContainText('Não foi possível consultar a agenda');
    await page.getByRole('button',{name:'Tentar novamente'}).click();
    await expect(page.getByText(/Nada marcado por enquanto/)).toBeVisible();
    await page.goto(path+'?pagina=2');
    await page.getByRole('link',{name:'Eventos anteriores'}).click();
    await expect(page).toHaveURL(path+'?pagina=1');
    await expect(page.getByText(/Nada marcado por enquanto/)).toBeVisible();
    const outside=await browser.newContext(info.project.use);
    try {
      const stranger=await outside.newPage();
      await signIn(stranger,outsider,path);
      await expect(stranger.getByRole('button',{name:'Novo momento'})).toHaveCount(0);
      await expect(stranger.getByRole('heading',{name:'Página não encontrada'})).toBeVisible();
    } finally { await outside.close(); }
  } finally {
    await context.close();
    if(id) execFileSync('docker',['exec','supabase_db_nos','psql','-U','postgres','-d','postgres','-v','ON_ERROR_STOP=1','-c',
      "delete from public.nuclei where id = '"+id+"';"],{stdio:'ignore'});
    for(const user of users) if((await admin.auth.admin.deleteUser(user.id)).error) throw new Error('Falha na limpeza da conta local.');
  }
});
