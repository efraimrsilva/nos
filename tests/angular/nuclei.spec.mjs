import { randomUUID } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { test as base, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';
import { localSupabaseConfig } from '../../scripts/local-supabase.mjs';

const test = base.extend({
  accounts: async ({}, use) => {
    const cfg = localSupabaseConfig();
    const admin = createClient(cfg.API_URL, cfg.SERVICE_ROLE_KEY, {auth:{persistSession:false}});
    const users = [];
    try {
      for (const name of ['Pessoa A', 'Pessoa B']) {
        const email = 'angular-a04-' + randomUUID() + '@example.test';
        const password = 'Aa1!' + randomUUID();
        const result = await admin.auth.admin.createUser({email,password,email_confirm:true,user_metadata:{name}});
        if (result.error || !result.data.user) throw new Error('Falha ao criar fixture local.');
        users.push({id:result.data.user.id,email,password});
      }
      await use(users);
    } finally {
      for (const user of users) {
        if (!/^[a-f0-9-]{36}$/i.test(user.id)) throw new Error('Identificador inválido na limpeza.');
        execFileSync('docker',['exec','supabase_db_nos','psql','-U','postgres','-d','postgres','-v','ON_ERROR_STOP=1','-c',
          "delete from public.nuclei where created_by = '" + user.id + "';"],{stdio:'ignore'});
        if ((await admin.auth.admin.deleteUser(user.id)).error) throw new Error('Falha ao limpar a conta local descartável.');
      }
    }
  },
});

async function signIn(page, account, next = '/nucleos') {
  await page.goto('/conta?modo=login&next=' + encodeURIComponent(next));
  const form = page.getByRole('form',{name:'Acesso à conta'});
  await form.getByLabel('E-mail',{exact:true}).fill(account.email);
  await form.getByLabel('Senha',{exact:true}).fill(account.password);
  await form.getByRole('button',{name:'Entrar',exact:true}).click();
  await expect(page).toHaveURL(next);
}

test('mostra e confirma ações da Conta conforme o vínculo do Núcleo', async ({page, accounts}) => {
  const [owner, other] = accounts;
  const cfg = localSupabaseConfig();
  const api = createClient(cfg.API_URL, cfg.PUBLISHABLE_KEY || cfg.ANON_KEY, {auth:{persistSession:false}});
  const session = await api.auth.signInWithPassword({email:owner.email,password:owner.password});
  if (session.error) throw new Error('Falha na sessão de teste.');
  const name = 'Jardim da Conta';
  const created = await api.rpc('create_nucleus', {
    nucleus_type:'amigos', nucleus_name:name, nucleus_purpose:'Cultivar presença.',
  });
  if (created.error) throw new Error('Falha no Núcleo descartável.');

  await signIn(page, other, '/configuracoes/conta');
  const main = page.getByRole('main');
  await expect(main.getByText('Consultando seus vínculos…')).toBeHidden();
  await expect(main.getByRole('button',{name:/Gerenciar convites|Encerrar Núcleo para todos/})).toHaveCount(0);
  await main.getByRole('button',{name:'Sair da conta'}).click();
  await page.getByRole('button',{name:'Confirmar saída'}).click();
  await expect(page).toHaveURL('/conta?modo=login');

  await signIn(page, owner, '/configuracoes/conta');
  await main.getByRole('button',{name:/Gerenciar convites/}).click();
  await expect(page.getByRole('dialog',{name:'Gerenciar convites'}).getByRole('link',{name}))
    .toHaveAttribute('href', '/nucleos/'+created.data+'/convites');
  await page.keyboard.press('Escape');
  await main.getByRole('button',{name:/Sair de um Núcleo/}).click();
  await expect(page.getByRole('dialog',{name:'Sair de um Núcleo'}).getByRole('link',{name}))
    .toHaveAttribute('href', '/nucleos/'+created.data+'/sair');
  await page.keyboard.press('Escape');

  await main.getByRole('button',{name:/Encerrar Núcleo para todos/}).click();
  const closure = page.getByRole('dialog',{name:'Encerrar Núcleo para todos'});
  await closure.getByRole('textbox',{name:'Nome atual do Núcleo'}).fill(name);
  await closure.getByRole('checkbox').check();
  await page.keyboard.press('Escape');
  await main.getByRole('button',{name:/Encerrar Núcleo para todos/}).click();
  await expect(closure.getByRole('textbox')).toHaveValue('');
  await expect(closure.getByRole('checkbox')).not.toBeChecked();
  await closure.getByRole('textbox').fill(name);
  await closure.getByRole('checkbox').check();
  await closure.getByRole('button',{name:'Confirmar encerramento'}).click();
  await expect(page).toHaveURL('/nucleos?resultado=encerrado');
});

test('porta o ciclo de Hábito com novo aceite e histórico preservado', async ({page,accounts,browser},info) => {
  test.setTimeout(75_000);
  page.setDefaultTimeout(10000);
  const [owner,member] = accounts;
  const cfg = localSupabaseConfig();
  const api = () => createClient(cfg.API_URL,cfg.PUBLISHABLE_KEY || cfg.ANON_KEY,{auth:{persistSession:false}});
  const administrator = api(), participant = api();
  for (const [client,account] of [[administrator,owner],[participant,member]]) {
    if ((await client.auth.signInWithPassword({email:account.email,password:account.password})).error) throw new Error('Falha na sessão de teste.');
  }
  const added = await administrator.rpc('create_nucleus',{nucleus_type:'amigos',nucleus_name:'Jardim de hábitos',nucleus_purpose:'Cultivar presença.'});
  if (added.error) throw new Error('Falha no Núcleo de teste.');
  const id = added.data;
  const invite = await administrator.rpc('create_initial_invitation',{target_nucleus:id});
  if (invite.error || (await participant.rpc('accept_invitation',{invitation_code:invite.data})).error) throw new Error('Falha no vínculo de teste.');
  const created = await administrator.rpc('create_nucleus_agreement',{
    target_nucleus:id,agreement_category:'habit',agreement_title:'Uma conversa com tempo',
    agreement_description:'Uma pausa para escutar.',agreement_timing:'Depois do jantar',agreement_frequency:'Semanal',agreement_trial_days:14,
  });
  if (created.error || !/^[a-f0-9-]{36}$/i.test(created.data)) throw new Error('Falha na proposta de teste.');
  // Dados sintéticos do esquema antigo são inseridos apenas no Núcleo descartável local.
  execFileSync('docker',['exec','supabase_db_nos','psql','-U','postgres','-d','postgres','-v','ON_ERROR_STOP=1','-c',
    `insert into public.nucleus_habit_revisions(agreement_id,created_by,kind,status)
       values ('${created.data}','${owner.id}','end','declined');
     insert into public.nucleus_habit_trials(agreement_id,created_by,days,status,title,description,timing,frequency,participant_count)
       values ('${created.data}','${owner.id}',10,'superseded','Termo legado','Registro anterior','À tarde','Semanal',2);`],{stdio:'ignore'});
  const path = '/nucleos/'+id+'/acordos/'+created.data;
  const capture = async (view,name) => {
    if (process.env.NOS_HABIT_CAPTURE !== '1') return;
    mkdirSync('artifacts/angular-a08',{recursive:true});
    await view.screenshot({path:'artifacts/angular-a08/'+name+'-'+info.project.name+'.png',scale:'css'});
  };
  const second = await browser.newContext(info.project.use);
  try {
    const guest = await second.newPage();
    guest.setDefaultTimeout(10000);
    guest.setDefaultNavigationTimeout(25000);
    await signIn(page,owner,path);
    await page.getByRole('link',{name:'Período e administração do hábito'}).click();
    await expect(page).toHaveURL(path+'/confirmar');
    await expect(page.getByText('14 dias',{exact:true})).toBeVisible();
    await capture(page,'periodo');
    await page.getByRole('button',{name:'Iniciar teste',exact:true}).click();
    const confirm = page.getByRole('dialog',{name:'Administrar o ciclo'});
    await expect(confirm).toBeVisible();
    await capture(page,'administrar');
    if (info.project.name==='mobile') await page.touchscreen.tap(5,5);
    else await page.mouse.click(5,5);
    await expect(confirm).toBeHidden();
    await expect(page.getByText('Proposta enviada',{exact:true})).toBeVisible();
    await page.getByRole('button',{name:'Iniciar teste',exact:true}).click();
    await confirm.getByRole('checkbox').check();
    await confirm.getByRole('button',{name:'Cancelar',exact:true}).click();
    await expect(page.getByRole('button',{name:'Iniciar teste',exact:true})).toBeFocused();
    await page.getByRole('button',{name:'Iniciar teste',exact:true}).click();
    await expect(confirm.getByRole('checkbox')).not.toBeChecked();
    await confirm.getByRole('checkbox').check();
    await confirm.getByRole('button',{name:'Iniciar teste',exact:true}).click();
    await expect(page.getByText('Em teste',{exact:true})).toBeVisible();
    await signIn(guest,member,path+'/registrar');
    await expect(guest.getByRole('heading',{name:'Registro indisponível'})).toBeVisible();
    await guest.goto(path+'/confirmar');
    await expect(guest.getByRole('button',{name:'Ativar acordo'})).toHaveCount(0);
    await guest.goto(path);
    await guest.getByRole('button',{name:'Aceitar proposta'}).click();
    await expect(guest.getByText('Participação aceita · v1',{exact:true})).toBeVisible();
    await expect(guest.getByRole('complementary',{name:'No seu tempo.'})).toContainText('pode registrar um momento');
    await capture(guest,'detalhe');
    await guest.getByRole('button',{name:'Registrar momento',exact:true}).click();
    const moment = guest.getByRole('dialog',{name:'Registrar momento'});
    await expect(moment).toBeVisible();
    await capture(guest,'registrar');
    await moment.getByRole('radio',{name:'Bem',exact:true}).check();
    await moment.getByLabel('Nota opcional').fill('Ouvimos com calma.');
    await moment.getByRole('button',{name:'Salvar momento'}).click();
    await expect(guest.getByText('Ouvimos com calma.',{exact:true})).toBeVisible();
    await expect(guest.getByText('Seu registro',{exact:true})).toBeVisible();
    await guest.getByRole('region',{name:'Momentos registrados'}).scrollIntoViewIfNeeded();
    await capture(guest,'historico');
    await page.goto(path+'/revisar');
    await page.getByRole('button',{name:'Alterar termos'}).click();
    const revision = page.getByRole('dialog',{name:'Alterar termos'});
    const originalTerms = await revision.getByLabel('Como será?').inputValue();
    await revision.getByLabel('Como será?').fill('Rascunho descartado.');
    await revision.getByRole('checkbox').check();
    await revision.getByRole('button',{name:'Cancelar',exact:true}).click();
    await expect(revision).toBeHidden();
    await expect(page.getByRole('button',{name:'Alterar termos'})).toBeFocused();
    await page.getByRole('button',{name:'Alterar termos'}).click();
    await expect(revision.getByLabel('Como será?')).toHaveValue(originalTerms);
    await expect(revision.getByRole('checkbox')).not.toBeChecked();
    await revision.getByLabel('Como será?').fill('Escutar com tempo e sem distrações.');
    expect((await revision.getByRole('checkbox').boundingBox()).width).toBeLessThan(32);
    await capture(page,'revisao');
    await revision.getByRole('checkbox').check();
    await revision.getByRole('button',{name:'Publicar novos termos'}).click();
    await expect(page.getByRole('heading',{name:/Versão 2 · Uma conversa/})).toBeVisible();
    await expect(page.getByRole('heading',{name:/Versão 1 · Uma conversa/})).toBeVisible();
    const versions = page.getByRole('region',{name:'Histórico dos termos'});
    await expect(versions.getByRole('listitem').filter({hasText:'Versão 2 · Uma conversa'})).toContainText('Vigente');
    await expect(versions.getByRole('listitem').filter({hasText:'Versão 1 · Uma conversa'})).toContainText('Anterior');
    const legacy = page.getByRole('region',{name:'Histórico do modelo anterior'});
    await expect(legacy.getByText('Solicitação antiga de encerramento')).toBeVisible();
    await expect(legacy.getByText('Período anterior',{exact:true})).toBeVisible();
    await capture(page,'termos');
    await guest.goto(path+'/registrar');
    await expect(guest.getByRole('heading',{name:'Registro indisponível'})).toBeVisible();
    await guest.goto(path);
    await expect(guest.getByText('Ouvimos com calma.',{exact:true})).toBeVisible();
    await guest.getByRole('button',{name:'Aceitar proposta'}).click();
    await expect(guest.getByText('Participação aceita · v2',{exact:true})).toBeVisible();
    await guest.goto(path+'/registrar');
    await guest.getByRole('radio',{name:'Neutro',exact:true}).check();
    await guest.getByLabel('Nota opcional').fill('Registro após o novo aceite.');
    await guest.getByRole('button',{name:'Salvar momento'}).click();
    await expect(guest).toHaveURL(path);
    await expect(guest.getByText('Registro após o novo aceite.',{exact:true})).toBeVisible();
    await page.getByRole('button',{name:'Alterar termos'}).click();
    await revision.getByLabel('Como será?').fill('Rascunho da versão anterior.');
    await guest.getByRole('button',{name:'Registrar momento',exact:true}).click();
    await moment.getByRole('radio',{name:'Bem',exact:true}).check();
    await moment.getByLabel('Nota opcional').fill('Momento com termos antigos.');
    // Publica e aceita de outra sessão entre a pré-checagem do formulário e a gravação real.
    const recording = '**/rest/v1/rpc/record_nucleus_habit_moment';
    let rejected;
    const rejection = new Promise(resolve => { rejected = resolve; });
    const race = async route => {
      if (route.request().method()!=='POST') { await route.continue(); return; }
      const input = route.request().postDataJSON();
      expect(input.expected_terms_version).toBe(2);
      const newer = await administrator.rpc('update_nucleus_agreement_terms',{
        target_agreement:created.data,agreement_title:'Uma conversa com tempo',agreement_description:'Versão publicada em outra sessão.',
        agreement_timing:'Depois do jantar',agreement_frequency:'Semanal',expected_terms_version:2,
      });
      expect(newer.error).toBeNull();
      const accepted = await participant.rpc('respond_nucleus_agreement',{
        target_agreement:created.data,agreement_response:'accepted',expected_terms_version:3,
      });
      expect(accepted.error).toBeNull();
      // Envia o corpo original ao Supabase como a mesma conta, após a revisão e o novo aceite.
      const result = await participant.rpc('record_nucleus_habit_moment',input).retry(false);
      await route.fulfill({status:result.status || 500,
        headers:{'access-control-allow-origin':info.project.use.baseURL},json:result.error ?? result.data});
      rejected({status:result.status,code:result.error?.code});
    };
    await guest.route(recording,race);
    await moment.getByRole('button',{name:'Salvar momento'}).click();
    expect(await rejection).toEqual({status:409,code:'PT409'});
    await expect(moment.getByRole('alert')).toContainText('Os termos mudaram',{timeout:10000});
    await guest.unroute(recording,race);
    await moment.getByRole('button',{name:'Fechar registro de momento'}).click();
    await expect(guest.getByText('Momento com termos antigos.',{exact:true})).toHaveCount(0);
    await revision.getByRole('checkbox').check();
    await revision.getByRole('button',{name:'Publicar novos termos'}).click();
    await expect(revision.getByRole('alert')).toContainText('O acordo mudou');
    await expect(revision.getByLabel('Como será?')).toHaveValue('Rascunho da versão anterior.');
    await revision.getByRole('button',{name:'Fechar edição de termos'}).click();
    await expect(page.getByRole('region',{name:'Termos vigentes'}).getByText('Versão 3',{exact:true})).toBeVisible();
    await page.getByRole('button',{name:'Alterar termos'}).click();
    await expect(revision.getByLabel('Como será?')).toHaveValue('Versão publicada em outra sessão.');
    await page.keyboard.press('Escape');
    await page.goto(path+'/confirmar');
    await page.getByRole('button',{name:'Ativar acordo'}).click();
    await confirm.getByRole('checkbox').check();
    await confirm.getByRole('button',{name:'Ativar acordo'}).click();
    await expect(page.getByText('Acordo ativo',{exact:true})).toBeVisible();
    await page.getByRole('button',{name:'Encerrar acordo'}).click();
    await capture(page,'encerrar');
    await confirm.getByRole('checkbox').check();
    await confirm.getByRole('button',{name:'Encerrar acordo'}).click();
    await expect(page.getByText('Encerrado pela administração',{exact:true})).toBeVisible();
    await page.goto(path);
    await expect(page.getByText('Ouvimos com calma.',{exact:true})).toBeVisible();
    await expect(page.getByText('Registro de outra pessoa',{exact:true})).toHaveCount(2);
    await page.getByRole('region',{name:'Momentos registrados'}).scrollIntoViewIfNeeded();
    await capture(page,'encerrado');
    await expect(page.getByRole('button',{name:'Registrar momento'})).toHaveCount(0);
  } finally { await second.close(); }
});

test('publica proposta sem aceite e atualiza respostas individuais no Angular', async ({page,accounts,browser},info) => {
  test.setTimeout(75_000);
  page.setDefaultTimeout(8000);
  const [owner, member] = accounts;
  const cfg = localSupabaseConfig();
  const api = () => createClient(cfg.API_URL,cfg.PUBLISHABLE_KEY || cfg.ANON_KEY,{auth:{persistSession:false}});
  const ownerClient = api(), memberClient = api();
  for (const [client,account] of [[ownerClient,owner],[memberClient,member]]) {
    const login = await client.auth.signInWithPassword({email:account.email,password:account.password});
    if (login.error) throw new Error('Falha na sessão de preparação.');
  }
  const fixture = await ownerClient.rpc('create_nucleus',{nucleus_type:'amigos',nucleus_name:'Jardim de propostas',nucleus_purpose:'Cultivar encontros.'});
  if (fixture.error || !/^[a-f0-9-]{36}$/i.test(fixture.data)) throw new Error('Falha no Núcleo de teste.');
  const id = fixture.data;
  const invite = await ownerClient.rpc('create_initial_invitation',{target_nucleus:id});
  if (invite.error) throw new Error('Falha no convite da preparação.');
  const entered = await memberClient.rpc('accept_invitation',{invitation_code:invite.data});
  if (entered.error) throw new Error('Falha no vínculo da preparação.');
  const legacy = randomUUID();
  // Só a preparação local restaura a categoria antiga; o formulário usa o contrato atual.
  execFileSync('docker',['exec','supabase_db_nos','psql','-U','postgres','-d','postgres','-v','ON_ERROR_STOP=1','-c',
    `insert into public.nucleus_agreements(id,nucleus_id,created_by,category,title,description,timing,frequency,status) values
     ('${legacy}','${id}','${owner.id}','experience','Hábito anterior','Termos preservados.','À tarde','Quinzenal','ended');`],{stdio:'ignore'});
  const path = '/nucleos/' + id + '/acordos';
  const capture = async (view,name) => {
    if (process.env.NOS_AGREEMENTS_CAPTURE !== '1') return;
    mkdirSync('artifacts/angular-a07',{recursive:true});
    await view.screenshot({path:'artifacts/angular-a07/'+name+'-'+info.project.name+'.png',scale:'css'});
  };
  const second = await browser.newContext(info.project.use);
  try {
    const guest = await second.newPage();
    guest.setDefaultTimeout(8000);
    await signIn(page,owner,'/nucleos/'+id);
    await page.getByRole('link',{name:'Ver acordos',exact:true}).click();
    await expect(page).toHaveURL(path);
    await page.getByRole('button',{name:'Enviar convite',exact:true}).click();
    await capture(page,'convite');
    await page.keyboard.press('Escape');
    await page.getByRole('button',{name:'Ver esboço de Essência'}).click();
    const essence = page.getByRole('dialog',{name:'Nossa Essência'});
    await expect(essence.getByText('Esboço',{exact:true})).toBeVisible();
    await capture(page,'essencia');
    if (info.project.name === 'mobile') await page.touchscreen.tap(5,5);
    else await page.mouse.click(5,5);
    await expect(essence).toBeHidden();
    await page.getByRole('button',{name:'Nova proposta',exact:true}).click();
    const form = page.getByRole('dialog',{name:'Nova proposta'});
    if (info.project.name === 'mobile') await page.touchscreen.tap(5,5);
    else await page.mouse.click(5,5);
    await expect(form).toBeHidden();
    await expect(page.getByRole('button',{name:'Nova proposta',exact:true})).toBeFocused();
    await page.getByRole('button',{name:'Nova proposta',exact:true}).click();
    await form.getByLabel('O que vamos fazer?').fill('Conversar sem distrações');
    await form.getByLabel('Como será?').fill('Reservar tempo para escutar.');
    await form.getByLabel('Quando?',{exact:true}).fill('Depois do jantar');
    await form.getByLabel('Com que frequência?').fill('Uma vez por semana');
    await form.getByLabel('Duração do teste (dias)').fill('14');
    await capture(page,'proposta');
    const guidance = form.getByRole('group',{name:'Como funcionam as decisões do Hábito'});
    await guidance.getByText('Administração e participação',{exact:true}).click();
    await expect(guidance).toContainText('Silêncio não é aceite.');
    await form.getByRole('button',{name:'Conferir proposta'}).click();
    await expect(form.getByRole('heading',{name:'Confira antes de propor'})).toBeFocused();
    expect((await ownerClient.from('nucleus_agreements').select('id').eq('nucleus_id',id)).data?.length).toBe(1);
    await capture(page,'revisao');
    await form.getByRole('button',{name:'Editar proposta'}).click();
    await expect(form.getByLabel('O que vamos fazer?')).toHaveValue('Conversar sem distrações');
    await form.getByRole('button',{name:'Conferir proposta'}).click();
    await form.getByRole('button',{name:'Enviar proposta'}).click();
    await expect(page.getByText(/Proposta enviada\. Escolha/)).toBeVisible();
    const ownerCard = page.getByRole('button',{name:/Conversar sem distrações/});
    await expect(ownerCard).toContainText('Reservar tempo para escutar.');
    await expect(ownerCard).toContainText('2 a decidir');
    await capture(page,'acordos');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const search = page.getByRole('searchbox',{name:'Buscar nos acordos desta página'});
    await search.fill('nenhum resultado');
    await expect(page.getByText('Nenhuma correspondência. Tente outra palavra ou limpe a busca.')).toBeVisible();
    await search.fill('');
    if (info.project.name === 'desktop') {
      await page.getByRole('button',{name:'Painéis · Lado a lado'}).click();
      await page.getByRole('navigation',{name:'Selecionar acordo'}).getByRole('button',{name:'Hábito anterior'}).click();
      await expect(page.getByRole('region',{name:'Acordo selecionado'}).getByText('Termos preservados.')).toBeVisible();
      await capture(page,'paineis');
      await page.getByRole('button',{name:'Kanban · Fluxo'}).click();
    }
    await ownerCard.click();
    const ownTerms = page.getByRole('dialog',{name:'Conversar sem distrações'});
    await expect(ownTerms.getByText('Participação a decidir',{exact:true})).toBeVisible();
    await capture(page,'respostas');
    await signIn(guest,member,path);
    await expect(guest.getByRole('button',{name:'Enviar convite',exact:true})).toHaveCount(0);
    await guest.getByRole('button',{name:/Conversar sem distrações/}).click();
    const guestTerms = guest.getByRole('dialog',{name:'Conversar sem distrações'});
    await guestTerms.getByRole('button',{name:'Recusar proposta'}).click();
    const decline = guest.getByRole('dialog',{name:'Recusar participação?'});
    await expect(decline).toBeVisible();
    await capture(guest,'recusa');
    await decline.getByRole('button',{name:'Cancelar',exact:true}).click();
    await expect(guestTerms.getByText('Participação a decidir',{exact:true})).toBeVisible();
    await guestTerms.getByRole('button',{name:'Aceitar proposta'}).click();
    await expect(guestTerms.getByText('Participação aceita · v1',{exact:true})).toBeVisible();
    await expect(ownTerms.getByText('1 aceite',{exact:true})).toBeVisible({timeout:12000});
    await expect(ownTerms.getByText('Participação a decidir',{exact:true})).toBeVisible();
    await guestTerms.getByRole('button',{name:'Recusar proposta'}).click();
    await decline.getByRole('button',{name:'Confirmar recusa'}).click();
    await expect(ownTerms.getByText('1 recusa',{exact:true})).toBeVisible({timeout:12000});
    await expect(ownTerms.getByText(/Proposta enviada · termos v1/)).toBeVisible();
    if (info.project.name === 'desktop') {
      await page.keyboard.press('Escape');
      await page.getByRole('button',{name:'Painéis · Lado a lado'}).click();
      const selection = page.getByRole('navigation',{name:'Selecionar acordo'});
      const panel = page.getByRole('region',{name:'Acordo selecionado'});
      await selection.getByRole('button',{name:/Conversar sem distrações/}).click();
      let release;
      const delayed = new Promise(resolve => { release = resolve; });
      let committed;
      const applied = new Promise(resolve => { committed = resolve; });
      await page.route('**/rest/v1/rpc/respond_nucleus_agreement', async route => {
        const result = await route.fetch();
        committed(result.ok());
        await delayed;
        await route.fulfill({response:result});
      }, {times:1});
      try {
        await panel.getByRole('button',{name:'Aceitar proposta'}).click();
        expect(await applied).toBe(true);
        await selection.getByRole('button',{name:/Hábito anterior/}).click();
      } finally { release(); }
      await selection.getByRole('button',{name:/Conversar sem distrações/}).click();
      await expect(panel.getByText('Participação aceita · v1',{exact:true})).toBeVisible();
      await page.getByRole('button',{name:'Kanban · Fluxo'}).click();
      await ownerCard.click();
    }
    const created = await ownerClient.from('nucleus_agreements').select('id').eq('nucleus_id',id).eq('title','Conversar sem distrações').single();
    if (created.error) throw new Error('Proposta de teste indisponível.');
    const updated = await ownerClient.rpc('update_nucleus_agreement_terms',{
      target_agreement:created.data.id,agreement_title:'Conversar sem distrações',agreement_description:'Termos revisados para manter a escolha.',
      agreement_timing:'Depois do jantar',agreement_frequency:'Uma vez por semana',expected_terms_version:1,
    });
    expect(updated.error).toBeNull();
    await expect(ownTerms.getByText('Termos revisados para manter a escolha.')).toBeVisible({timeout:12000});
    await expect(ownTerms.getByText(/Proposta enviada · termos v2/)).toBeVisible();
    await expect(ownTerms.getByText('Participação a decidir',{exact:true})).toBeVisible();
    await ownTerms.getByRole('link',{name:'Abrir detalhe'}).click();
    await expect(page.getByRole('heading',{name:'Conversar sem distrações',exact:true})).toBeVisible();
    await capture(page,'detalhe');
    await page.goto(path+'/'+legacy);
    await expect(page.getByRole('heading',{name:'Hábito anterior'})).toBeVisible();
    await expect(page.getByText('Termos preservados.',{exact:true})).toBeVisible();
    await expect(page.getByRole('button',{name:'Aceitar proposta'})).toHaveCount(0);
    await page.goto(path);
    await page.getByRole('button',{name:'Nova proposta',exact:true}).click();
    await form.getByLabel('O que vamos fazer?').fill('Resposta de envio perdida');
    await form.getByLabel('Como será?').fill('Uma pausa para conversar.');
    await form.getByLabel('Quando?',{exact:true}).fill('Depois do jantar');
    await form.getByLabel('Com que frequência?').fill('Semanalmente');
    await form.getByLabel('Duração do teste (dias)').fill('14');
    let sends = 0;
    await page.route('**/rest/v1/rpc/create_nucleus_agreement',async route => {
      sends++;
      expect((await route.fetch()).ok()).toBe(true);
      await route.abort();
    });
    await form.getByRole('button',{name:'Conferir proposta'}).click();
    await form.getByRole('button',{name:'Enviar proposta'}).click();
    await expect(form.getByRole('alert')).toContainText('O envio não foi confirmado');
    await expect(form.getByRole('button',{name:'Enviar proposta'})).toBeDisabled();
    await form.getByRole('button',{name:'Fechar proposta'}).click();
    await expect(page.getByRole('button',{name:/Resposta de envio perdida/})).toHaveCount(1);
    expect(sends).toBe(1);
    await page.goto('/nucleos/'+randomUUID()+'/acordos/'+legacy);
    await expect(page.getByRole('heading',{name:'Acordo indisponível'})).toBeVisible();
  } finally { await second.close(); }
});

test('muda identidade, aceita nomeação pela própria conta, sai e encerra', async ({page,accounts,browser},info) => {
  test.setTimeout(80_000);
  page.setDefaultTimeout(10000);
  const [owner, member] = accounts;
  const capture = async (view, name) => {
    if (process.env.NOS_PEOPLE_CAPTURE !== '1') return;
    mkdirSync('artifacts/angular-a06',{recursive:true});
    await view.screenshot({path:'artifacts/angular-a06/'+name+'-'+info.project.name+'.png',scale:'css',
      mask:[view.locator('[data-invitation-secret]')]});
  };
  const second = await browser.newContext(info.project.use);
  try {
    const guest = await second.newPage();
    guest.setDefaultTimeout(10000);
    await signIn(page,owner);
    await page.getByRole('button',{name:'Criar um núcleo'}).click();
    await page.getByRole('dialog').getByRole('link',{name:/Criar um núcleo/i}).click();
    await page.getByRole('radio',{name:'Família',exact:true}).check();
    await page.getByRole('button',{name:'Continuar'}).click();
    await page.getByLabel('Nome do Núcleo').fill('Jardim da A06');
    await page.getByLabel('Nosso propósito').fill('Encontros com cuidado.');
    await page.getByRole('button',{name:'Continuar'}).click();
    await page.getByRole('button',{name:'Criar Núcleo',exact:true}).click();
    await page.getByRole('button',{name:'Gerar convite'}).click();
    const code = await page.getByTestId('invitation-code').innerText();
    await page.getByRole('link',{name:'Concluir por enquanto'}).click();
    await expect(page.getByRole('heading',{name:'Jardim da A06',exact:true})).toBeVisible();
    await page.getByRole('button',{name:'Conhecer esta área',exact:true}).click();
    const notifications=page.getByRole('dialog',{name:'Notificações, no seu tempo',exact:true});
    await expect(notifications).toContainText('ainda não consulta nem envia avisos');
    await capture(page,'notificacoes');
    await page.keyboard.press('Escape');
    await expect(notifications).toBeHidden();
    await expect(page.getByRole('button',{name:'Conhecer esta área',exact:true})).toBeFocused();
    await page.getByRole('button',{name:'Conhecer esta área',exact:true}).click();
    if(info.project.name==='mobile') await page.touchscreen.tap(5,5);
    else await page.mouse.click(5,5);
    await expect(notifications).toBeHidden();
    const path = new URL(page.url()).pathname;
    await signIn(guest,member,'/comecar/convite');
    await guest.getByLabel('Código de convite').fill(code);
    await guest.getByRole('button',{name:'Conferir convite'}).click();
    await guest.getByRole('button',{name:'Aceitar convite'}).click();
    await expect(guest).toHaveURL(path);
    await expect(guest.getByRole('button',{name:'Editar nome do Núcleo'})).toHaveCount(0);
    await page.getByRole('button',{name:'Editar nome do Núcleo'}).click();
    await capture(page,'identidade');
    await page.getByLabel('Nome do Núcleo',{exact:true}).fill('Jardim compartilhado');
    await page.getByRole('dialog').getByRole('checkbox').check();
    await page.getByRole('button',{name:'Salvar nome'}).click();
    await expect(guest.getByRole('heading',{name:'Jardim compartilhado',exact:true})).toBeVisible({timeout:12000});
    await expect(page.getByRole('dialog').getByRole('status')).toContainText('Nome atualizado.');
    await page.keyboard.press('Escape');
    await page.goto(path+'/pessoas');
    const people = page.getByRole('dialog',{name:'Integrantes do Núcleo'});
    await expect(people).toBeVisible();
    await capture(page,'integrantes');
    await people.getByRole('button',{name:/Pessoa B/}).click();
    const details = page.getByRole('dialog',{name:'Participação de Pessoa B'});
    await expect(details.getByRole('button',{name:'Fechar participação'})).toBeFocused();
    await capture(page,'participacao');
    await guest.goto(path+'/pessoas');
    await guest.getByRole('button',{name:/Pessoa B/}).click();
    const ownDetails = guest.getByRole('dialog',{name:'Participação de Pessoa B'});
    await expect(ownDetails.getByRole('button',{name:'Aceitar administração'})).toHaveCount(0);
    await details.getByText('Enviar nomeação; a pessoa precisará aceitar.').click();
    await details.getByRole('button',{name:'Convidar para administrar'}).click();
    await expect(details.getByText('Nomeação para administrar aguardando aceite.')).toBeVisible();
    await expect(ownDetails.getByRole('button',{name:'Aceitar administração'})).toBeVisible({timeout:12000});
    await ownDetails.getByText('Desejo assumir a administração deste Núcleo.').click();
    await ownDetails.getByRole('button',{name:'Aceitar administração'}).click();
    await expect(ownDetails.getByText('Cuida dos convites e da organização do Núcleo.')).toBeVisible();
    await guest.keyboard.press('Escape');
    await expect(guest.getByRole('dialog',{name:'Integrantes do Núcleo'})).toBeVisible();
    await guest.keyboard.press('Escape');
    await expect(guest).toHaveURL(path);
    await guest.getByRole('button',{name:'Editar propósito'}).click();
    await guest.getByRole('dialog').getByLabel('Propósito do Núcleo',{exact:true}).fill('Rascunho preservado');
    await capture(guest,'proposito');
    let failRefresh = true;
    await guest.route('**/rest/v1/rpc/get_nucleus_calendar', async route => {
      if (!failRefresh) return route.continue();
      failRefresh = false;
      await route.fulfill({status:500,json:{code:'XX000',message:'Falha temporária de teste.'}});
    });
    await page.goto(path);
    await page.getByRole('button',{name:'Editar propósito'}).click();
    const editPurpose = page.getByRole('dialog');
    await editPurpose.getByLabel('Propósito do Núcleo',{exact:true}).fill('Um encontro por semana.');
    await editPurpose.getByRole('checkbox').check();
    await editPurpose.getByRole('button',{name:'Salvar propósito'}).click();
    await expect(guest.locator('header.nucleus-header').getByText('Um encontro por semana.')).toBeVisible({timeout:12000});
    expect(failRefresh).toBe(false);
    await expect(guest.getByRole('dialog').getByLabel('Propósito do Núcleo',{exact:true})).toHaveValue('Rascunho preservado');
    await guest.keyboard.press('Escape');
    await guest.getByRole('button',{name:'Ver integrantes'}).click();
    await guest.getByRole('button',{name:/Pessoa B/}).click();
    await ownDetails.getByRole('link',{name:'Sair deste Núcleo'}).click();
    await expect(guest.getByText(/autoria dos registros será preservada/i)).toBeVisible();
    await capture(guest,'saida');
    const privacy = guest.getByRole('link',{name:'Conferir minha preferência'});
    await expect(privacy).toHaveAttribute('href','/conta#privacidade');
    await privacy.click();
    await expect(guest).toHaveURL('/conta#privacidade');
    await guest.goBack();
    await guest.getByRole('button',{name:'Revisar minha saída'}).click();
    await capture(guest,'confirmar-saida');
    await guest.getByRole('dialog').getByRole('checkbox').check();
    await guest.getByRole('dialog').getByRole('button',{name:'Sair deste Núcleo'}).click();
    await expect(guest).toHaveURL('/nucleos');
    await guest.goto(path);
    await expect(guest.getByRole('heading',{name:'Núcleo indisponível'})).toBeVisible();
    await page.goto(path);
    await expect(page.getByRole('heading',{name:'Jardim compartilhado',exact:true})).toBeVisible();
    await capture(page,'inicio');
    await page.getByRole('button',{name:'Encerrar Núcleo'}).click();
    const close = page.getByRole('dialog',{name:'Encerrar Núcleo'});
    await capture(page,'encerramento');
    if (info.project.name === 'mobile') await page.touchscreen.tap(5,5);
    else await page.mouse.click(5,5);
    await expect(close).toBeHidden();
    await expect(page.getByRole('heading',{name:'Jardim compartilhado',exact:true})).toBeVisible();
    await page.getByRole('button',{name:'Encerrar Núcleo'}).click();
    await close.getByLabel('Nome atual do Núcleo').fill('Nome incorreto');
    await close.getByRole('checkbox').check();
    await close.getByRole('button',{name:'Confirmar encerramento'}).click();
    await expect(close.getByRole('alert')).toContainText('não corresponde');
    await close.getByLabel('Nome atual do Núcleo').fill('Jardim compartilhado');
    let releaseResponse;
    const delayed = new Promise(resolve => { releaseResponse = resolve; });
    let committed;
    const committedPromise = new Promise(resolve => { committed = resolve; });
    await page.route('**/rest/v1/rpc/close_nucleus', async route => {
      const response = await route.fetch();
      committed(response.ok());
      await delayed;
      await route.fulfill({response});
    });
    try {
      await close.getByRole('button',{name:'Confirmar encerramento'}).click();
      expect(await committedPromise).toBe(true);
      // Avança um ciclo real do sincronizador enquanto o banco já confirmou e a interface ainda aguarda.
      await page.waitForTimeout(3400);
      await expect(close.getByRole('button',{name:'Aguarde…'})).toBeVisible();
    } finally { releaseResponse(); }
    await expect(page).toHaveURL('/nucleos?resultado=encerrado');
    await expect(page.getByRole('status').filter({hasText:'Núcleo encerrado'})).toBeVisible();
  } finally { await second.close(); }
});

test('cria uma vez mesmo após perder a resposta e abre núcleo autorizado', async ({page,accounts},info) => {
  test.setTimeout(60_000);
  const [owner, outsider] = accounts;
  const capture = async name => {
    if(process.env.NOS_NUCLEI_CAPTURE !== '1') return;
    mkdirSync('artifacts/angular-a04',{recursive:true});
    await page.screenshot({path:'artifacts/angular-a04/'+name+'-'+info.project.name+'.png',scale:'css'});
  };
  await signIn(page, owner);
  await expect(page.getByRole('status').filter({hasText:'Você ainda não participa'})).toBeVisible();
  await page.getByRole('button',{name:'Criar um núcleo',exact:true}).click();
  const dialog = page.getByRole('dialog',{name:'Começar com intenção'});
  await expect(dialog).toBeVisible();
  await capture('modal-criar');
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await page.goto('/comecar');
  await expect(page.getByRole('heading',{name:'Como você quer começar?'})).toBeVisible();
  await capture('escolher');
  await page.getByRole('link',{name:/Criar um núcleo/i}).click();
  await page.getByRole('radio',{name:'Amigos',exact:true}).check();
  await capture('tipo');
  await page.getByRole('button',{name:'Continuar'}).click();
  await page.getByRole('link',{name:'Voltar',exact:true}).click();
  await expect(page.getByRole('radio',{name:'Amigos',exact:true})).toBeChecked();
  await page.getByRole('button',{name:'Continuar'}).click();
  const name = page.getByLabel('Nome do Núcleo',{exact:true});
  const purpose = page.getByLabel('Nosso propósito',{exact:true});
  await page.getByRole('button',{name:'Continuar'}).click();
  await expect(name).toHaveAttribute('aria-invalid','true');
  await expect(name).toBeFocused();
  await expect(purpose).toHaveAttribute('aria-invalid','true');
  await name.fill('Jardim de teste');
  await page.getByRole('button',{name:'Usar sugestão'}).click();
  await expect(page.getByRole('alert')).toHaveCount(0);
  const draft = await purpose.inputValue();
  await capture('proposito');
  await page.getByRole('button',{name:'Continuar'}).click();
  await expect(page.getByRole('heading',{name:'Confira seu rascunho'})).toBeVisible();
  expect(new URL(page.url()).searchParams.get('nome')).toBeNull();
  await capture('revisao');
  await page.getByRole('button',{name:'Editar'}).click();
  await expect(name).toHaveValue('Jardim de teste');
  await expect(purpose).toHaveValue(draft);
  await expect(name).toBeFocused();
  await page.getByRole('button',{name:'Continuar'}).click();
  let requests = 0;
  const confirmed = page.getByRole('button',{name:'Criar Núcleo',exact:true});
  await page.route('**/rest/v1/rpc/create_nucleus_once', async route => {
    if (route.request().method() !== 'POST' || ++requests !== 1) return route.continue();
    const response = await route.fetch();
    expect(response.ok()).toBe(true);
    await route.abort();
  });
  await confirmed.click();
  await expect(page.getByRole('alert')).toContainText('Não foi possível confirmar');
  await confirmed.click();
  await expect(page).toHaveURL(/\/comecar\/convite-inicial\/[a-f\d-]+$/i);
  expect(requests).toBe(2);
  await expect(page.getByRole('heading',{name:'Convide quem faz parte'})).toBeVisible();
  await page.getByRole('link',{name:'Concluir por enquanto'}).click();
  await expect(page.getByRole('heading',{name:'Jardim de teste'})).toBeVisible();
  const path = new URL(page.url()).pathname;
  await capture('inicio');
  await page.getByRole('button',{name:'Ver integrantes'}).click();
  const people = page.getByRole('dialog',{name:'Integrantes do Núcleo'});
  await expect(people.getByText('Pessoa A',{exact:true})).toBeVisible();
  await capture('modal-integrantes');
  await page.getByRole('button',{name:'Fechar integrantes'}).click();
  await expect(people).toBeHidden();
  await page.getByRole('link',{name:'Ver Seus Núcleos'}).click();
  const card = page.getByRole('navigation',{name:'Seus Núcleos',exact:true}).getByRole('link',{name:'Jardim de teste',exact:true});
  await expect(card).toHaveCount(1);
  await expect(card).toContainText('Pessoa A');
  await capture('lista');
  await card.click();
  await expect(page).toHaveURL(path);
  await page.reload();
  await expect(page.getByRole('heading',{name:'Jardim de teste'})).toBeVisible();
  const accountNav = info.project.name === 'mobile'
    ? page.getByRole('dialog',{name:'Todos os seus caminhos'})
    : page.getByRole('navigation',{name:'Áreas do Nós'});
  if (info.project.name === 'mobile') await page.getByRole('button',{name:'Mais áreas e preferências'}).click();
  await accountNav.getByRole('link',{name:'Minha conta',exact:true}).click();
  await page.getByRole('link',{name:'Voltar ao Núcleo'}).click();
  await expect(page).toHaveURL(path);

  await page.goto('/configuracoes/conta');
  await page.getByRole('button',{name:'Sair da conta'}).click();
  await page.getByRole('dialog',{name:'Sair da conta'}).getByRole('button',{name:'Confirmar saída'}).click();
  await expect(page).toHaveURL(/\/conta\?modo=login$/);
  await signIn(page, outsider, path);
  await expect(page.getByRole('heading',{name:'Núcleo indisponível'})).toBeVisible();
  await expect(page.getByText('Jardim de teste',{exact:true})).toHaveCount(0);
  await page.getByRole('link',{name:'Ver Seus Núcleos'}).click();
  await expect(page.getByRole('status').filter({hasText:'Você ainda não participa'})).toBeVisible();
  await page.goto('/configuracoes/conta');
  await expect(page.getByRole('heading',{name:'Pessoa B',exact:true})).toBeVisible();
  await expect(page.getByRole('link',{name:'Voltar ao Núcleo'})).toHaveCount(0);
});

test('consulta protegida distingue carregamento, erro e lista vazia', async ({page,accounts}) => {
  await page.goto('/nucleos');
  await expect(page).toHaveURL(/\/conta\?modo=login$/);
  const [account] = accounts;
  const pattern = '**/rest/v1/nuclei?**';
  let release;
  const gate = new Promise(resolve => {release = resolve;});
  const failure = async route => {
    await gate;
    await route.fulfill({status:400,json:{message:'Falha de consulta simulada'}});
  };
  await page.route(pattern,failure);
  try {
    await signIn(page,account);
    await expect(page.getByRole('status').filter({hasText:'Carregando seus Núcleos'})).toBeVisible();
  } finally {release();}
  await expect(page.getByRole('alert')).toContainText('Não foi possível consultar seus Núcleos');
  await page.unroute(pattern,failure);
  await page.getByRole('button',{name:'Tentar novamente'}).click();
  await expect(page.getByRole('status').filter({hasText:'Você ainda não participa'})).toBeVisible();
});

test('convites preservam a escolha, a revogação e o vínculo confirmado', async ({page,browser,accounts}, info) => {
  test.setTimeout(75_000);
  const [owner, guest] = accounts;
  const cfg = localSupabaseConfig();
  const api = createClient(cfg.API_URL,cfg.PUBLISHABLE_KEY || cfg.ANON_KEY,{auth:{persistSession:false}});
  const login = await api.auth.signInWithPassword({email:owner.email,password:owner.password});
  if (login.error) throw new Error('Falha na sessão de preparação.');
  const fixture = await api.rpc('create_nucleus',{nucleus_type:'amigos',
    nucleus_name:'Jardim de convites',nucleus_purpose:'Cuidar do vínculo.'});
  if (fixture.error || typeof fixture.data !== 'string') throw new Error('Falha no Núcleo de teste.');
  const id = fixture.data;
  const home = '/nucleos/' + id;
  const management = home + '/convites';
  const entry = '/comecar/convite';
  const guestContext = await browser.newContext({baseURL:info.project.use.baseURL,viewport:info.project.use.viewport});
  const guestPage = await guestContext.newPage();
  const capture = async (target,name) => {
    if(process.env.NOS_INVITES_CAPTURE !== '1') return;
    mkdirSync('artifacts/angular-a05',{recursive:true});
    await target.screenshot({path:'artifacts/angular-a05/'+name+'-'+info.project.name+'.png',scale:'css',
      mask:[target.locator('[data-invitation-secret]')],maskColor:'#e7ece1'});
  };
  const codeOn = async target => {
    const value = (await target.getByTestId('invitation-code').innerText()).trim();
    expect(/^[0-9a-f]{32}$/.test(value)).toBe(true);
    return value;
  };
  const inspect = async code => {
    await guestPage.getByLabel('Código de convite',{exact:true}).fill('  ' + code.toUpperCase() + '  ');
    await guestPage.getByRole('button',{name:'Conferir convite'}).click();
    await expect(guestPage.getByRole('region',{name:'Prévia do convite'})).toBeVisible();
  };
  const revoke = async () => {
    await page.getByRole('link',{name:'Ativos',exact:true}).click();
    await page.getByRole('button',{name:'Revogar convite',exact:true}).click();
    const dialog = page.getByRole('dialog',{name:'Revogar convite'});
    await expect(dialog).toBeVisible();
    await capture(page,'revogar');
    await dialog.getByRole('button',{name:'Cancelar'}).click();
    await expect(dialog).toBeHidden();
    await page.getByRole('button',{name:'Revogar convite',exact:true}).click();
    await dialog.getByRole('button',{name:'Confirmar revogação'}).click();
    await expect(page.getByRole('status').filter({hasText:'Convite revogado'})).toBeVisible();
    await page.getByRole('link',{name:'Revogados',exact:true}).click();
    await expect(page.getByRole('heading',{name:'Convites revogados'})).toBeVisible();
  };
  try {
    await signIn(page,owner,'/comecar/convite-inicial/'+id);
    await expect(page.getByRole('heading',{name:'Convide quem faz parte'})).toBeVisible();
    await capture(page,'inicial');
    await page.getByRole('button',{name:'Gerar convite'}).click();
    const first = await codeOn(page);
    await expect(page.getByText(/Expira em .* UTC/)).toBeVisible();
    // Confere o envio ao clipboard sem escrever na área de transferência da máquina.
    await page.evaluate(() => Object.defineProperty(navigator.clipboard,'writeText',{
      configurable:true,
      value:async text => { document.body.dataset.copiedInvitation = /^[0-9a-f]{32}$/.test(text) ? 'yes' : 'no'; },
    }));
    await page.getByRole('button',{name:'Copiar código'}).click();
    await expect(page.getByRole('status').filter({hasText:'Código copiado'})).toBeVisible();
    await expect(page.locator('body')).toHaveAttribute('data-copied-invitation','yes');
    await capture(page,'compartilhar');
    await page.reload();
    expect((await codeOn(page)) === first).toBe(true);
    await page.getByRole('link',{name:'Gerenciar convites',exact:true}).click();
    await expect(page).toHaveURL(management);
    await expect(page.getByRole('heading',{name:'Convites ativos'})).toBeVisible();
    await expect(page.getByTestId('invitation-code')).toHaveCount(0);
    await capture(page,'gestao');

    await guestPage.goto(entry);
    await expect(guestPage).toHaveURL(/\/conta\?modo=login&next=/);
    await signIn(guestPage,guest,entry);
    await expect(guestPage.getByRole('heading',{name:'Você recebeu um convite?'})).toBeVisible();
    await capture(guestPage,'inserir');
    await guestPage.getByLabel('Código de convite',{exact:true}).fill('incompleto');
    await guestPage.getByRole('button',{name:'Conferir convite'}).click();
    await expect(guestPage.getByRole('alert')).toContainText('32 caracteres');
    const codeInput = guestPage.getByLabel('Código de convite',{exact:true});
    await expect(codeInput).toHaveAttribute('aria-invalid','true');
    await expect(codeInput).toBeFocused();
    await inspect(first);
    await expect(codeInput).not.toHaveAttribute('aria-invalid','true');
    await expect(guestPage.getByRole('heading',{name:'Jardim de convites'})).toBeFocused();
    await capture(guestPage,'previa');
    await guestPage.getByRole('link',{name:'Agora não'}).click();
    await expect(guestPage.getByRole('status').filter({hasText:'Você ainda não participa'})).toBeVisible();
    await guestPage.goto(entry);
    await inspect(first);
    await revoke();
    await guestPage.getByRole('button',{name:'Aceitar convite'}).click();
    await expect(guestPage.getByRole('alert')).toContainText('Este convite não está mais disponível');
    await guestPage.getByRole('button',{name:'Conferir convite'}).click();
    await expect(guestPage.getByRole('alert')).toContainText('Convite não encontrado');

    await page.getByRole('link',{name:'Ativos',exact:true}).click();
    await expect(page.getByText('Nenhum convite ativo nesta página.')).toBeVisible();
    await page.getByRole('button',{name:'Preparar convite',exact:true}).click();
    const generator = page.getByRole('dialog',{name:'Preparar convite'});
    await expect(generator).toBeVisible();
    let releaseGeneration;
    const gate = new Promise(resolve => { releaseGeneration = resolve; });
    let generatedWhileClosing;
    const intercept = async route => {
      if (route.request().method() !== 'POST') return route.continue();
      const response = await route.fetch();
      generatedWhileClosing = response.ok() ? await response.json() : null;
      await gate;
      await route.fulfill({response});
    };
    const generationPath = '**/rest/v1/rpc/create_initial_invitation';
    await page.route(generationPath,intercept);
    try {
      await generator.getByRole('button',{name:'Gerar convite'}).click();
      await expect.poll(() => typeof generatedWhileClosing === 'string').toBe(true);
      await page.keyboard.press('Escape');
      await expect(generator).toBeHidden();
    } finally { releaseGeneration(); }
    await expect(page.getByRole('button',{name:'Revogar convite',exact:true})).toBeVisible();
    await page.unroute(generationPath,intercept);
    await page.getByRole('button',{name:'Preparar convite',exact:true}).click();
    await expect(generator.getByTestId('invitation-code')).toHaveCount(0);
    await generator.getByRole('button',{name:'Gerar convite'}).click();
    const second = await codeOn(generator);
    expect(second === first).toBe(false);
    expect(second === generatedWhileClosing).toBe(true);
    await capture(page,'preparar');
    // O fundo fecha o diálogo sem revogar ou disparar outra geração.
    if (info.project.use.hasTouch) await page.touchscreen.tap(2,2);
    else await page.mouse.click(2,2);
    await expect(generator).toBeHidden();
    await inspect(second);
    const acceptPath = '**/rest/v1/rpc/accept_invitation';
    await guestPage.route(acceptPath,async route => {
      if (route.request().method() !== 'POST') return route.continue();
      const response = await route.fetch();
      expect(response.ok()).toBe(true);
      await route.abort();
    });
    await guestPage.getByRole('button',{name:'Aceitar convite'}).click();
    await expect(guestPage.getByRole('alert')).toContainText('Não foi possível confirmar o aceite');
    await expect(guestPage.getByRole('region',{name:'Prévia do convite'})).toBeVisible();
    await guestPage.unroute(acceptPath);
    await guestPage.getByRole('button',{name:'Aceitar convite'}).click();
    await expect(guestPage).toHaveURL(home);
    await expect(guestPage.getByRole('heading',{name:'Jardim de convites'})).toBeVisible();
    await guestPage.goto(entry);
    await inspect(second);
    await guestPage.getByRole('button',{name:'Aceitar convite'}).click();
    await expect(guestPage).toHaveURL(home);
    await revoke();
    await guestPage.reload();
    await expect(guestPage.getByRole('heading',{name:'Jardim de convites'})).toBeVisible();
    await guestPage.goto(management);
    await expect(guestPage.getByRole('heading',{name:'Convites indisponíveis'})).toBeVisible();
    await expect(guestPage.getByRole('button',{name:'Preparar convite'})).toHaveCount(0);
    const { data: managementData } = await api.rpc('get_nucleus_management',{target_nucleus:id});
    expect(managementData?.members.length).toBe(2);
  } finally {
    await Promise.allSettled([page.goto('/boas-vindas'),guestContext.close()]);
  }
});

test('protege prévias do Núcleo e descarta o rascunho da Ponte ao navegar', async ({page, accounts, browser}, info) => {
  const capture = async (name) => {
    if (!process.env.NOS_TREE_CAPTURE) return;
    const folder = 'artifacts/tree12-' + process.env.NOS_TREE_CAPTURE;
    mkdirSync(folder,{recursive:true});
    await page.screenshot({path:folder+'/'+name+'-'+info.project.name+'.png',scale:'css'});
  };
  const [owner, outsider] = accounts;
  const cfg = localSupabaseConfig();
  const client = createClient(cfg.API_URL, cfg.ANON_KEY, {auth:{persistSession:false}});
  expect((await client.auth.signInWithPassword({email:owner.email,password:owner.password})).error).toBeNull();
  const id = randomUUID();
  const {data, error} = await client.rpc('create_nucleus_once', {
    nucleus_type: 'familia', nucleus_name: 'Núcleo das prévias', nucleus_purpose: 'Um espaço para olhar os exemplos juntos.',
    request_id: id,
  });
  expect(error).toBeNull();
  expect(data).toBe(id);
  const root = '/nucleos/' + id;
  await signIn(page, owner, root + '/cuidado');
  await expect(page.getByRole('heading',{name:'Conversar também é um cuidado.'})).toBeVisible();
  const nav = page.getByRole('navigation', {name:info.project.name === 'mobile' ? 'Navegação móvel' : 'Áreas do Nós'});
  await expect(nav.getByRole('link',{name:'Seus Núcleos', exact:true})).toHaveAttribute('aria-description', 'Total geral da sua conta: 1');
  await page.getByRole('button',{name:'Notificações — esboço'}).click();
  const notifications = page.getByRole('dialog',{name:'Novidades, no seu tempo.'});
  await expect(notifications.getByRole('link',{name:'Consultar Acordos'})).toHaveAttribute('href', root + '/acordos');
  await page.keyboard.press('Escape');
  await expect(notifications).toBeHidden();
  await page.getByLabel('O que você quer expressar?').fill('Rascunho apenas nesta página.');
  await page.getByRole('button',{name:'Explorar preparação'}).click();
  await expect(page.getByText('Rascunho apenas nesta página.', {exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Escuta',exact:true}).click();
  await expect(page.getByText(/O que gostaria que eu entendesse melhor/)).toBeVisible();
  await capture('ponte');
  await page.getByRole('button',{name:'Pausa',exact:true}).click();
  await expect(page.getByText(/disponibilidade de ambos/)).toBeVisible();
  await nav.getByRole('link',{name:'Nossa Árvore',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Raízes no que vivemos.'})).toBeVisible();
  await page.goBack();
  await expect(page.getByLabel('O que você quer expressar?')).toHaveValue('');
  const draftInput = page.getByLabel('O que você quer expressar?');
  await draftInput.fill('Texto temporário a limpar.');
  await page.getByRole('button',{name:'Explorar preparação'}).click();
  await page.getByRole('button',{name:'Limpar rascunho'}).click();
  await expect(draftInput).toHaveValue('');
  await expect(draftInput).toBeFocused();
  await expect(page.getByRole('region',{name:'Preparação ilustrativa'})).toBeHidden();
  await expect(page.getByRole('link',{name:'Abrir agenda existente'})).toHaveAttribute('href',root+'/agenda');
  await expect(page.getByRole('navigation',{name:'Explorações de funcionalidades futuras'})).toHaveCount(0);
  await expect(nav.getByRole('link',{name:'Perfis afetivos',exact:true})).toHaveCount(0);
  const destinations = [
    ['memorias','Há instantes que ficam.'],
    ['conexoes','Conhecer para cuidar.'],
    ['manifesto','O que escolhemos cultivar.'],
    ['arvore','Raízes no que vivemos.'],
    ['cuidado','Conversar também é um cuidado.'],
  ];
  for (const [destination,title] of destinations) {
    const link = nav.locator('a[href="' + root + '/' + destination + '"]');
    await link.click();
    await expect(link).toHaveAttribute('aria-current','page');
    await expect(page.getByRole('main').getByRole('heading',{name:title,exact:true})).toBeVisible();
    await expect(page.getByRole('main').getByText('Esboço de funcionalidade · ainda não desenvolvido',{exact:true})).toBeVisible();
    if (destination==='arvore') {
      await page.getByRole('button',{name:'Histórias',exact:true}).click();
      await expect(page.getByRole('heading',{name:'O que vivemos também cria raízes.'})).toBeVisible();
      await capture('arvore');
    }
    if (destination==='manifesto') {
      await page.getByText('Escutar com respeito',{exact:true}).click();
      await expect(page.getByText(/Criar espaço para ouvir até o fim/)).toBeVisible();
      await capture('manifesto');
    }
    if (destination==='conexoes') {
      await page.getByRole('button',{name:/Lucas/}).click();
      await page.getByRole('button',{name:'Gostos e afinidades',exact:true}).click();
      await expect(page.getByRole('listitem').filter({hasText:'Música ao vivo'})).toBeVisible();
      await expect(page.getByRole('complementary',{name:/Sobre conexões/}).getByText(/aniversário em março/)).toBeVisible();
      await capture(destination);
      const profileTrigger = page.getByRole('button',{name:'Explorar perfil em detalhe'});
      await profileTrigger.click();
      const profile = page.getByRole('dialog',{name:'Perfil de exemplo · Lucas'});
      await expect(profile).toBeVisible();
      await capture(destination+'-detalhe');
      await page.keyboard.press('Escape');
      await expect(profile).toBeHidden();
      await expect(profileTrigger).toBeFocused();
    }
    if (destination==='memorias') {
      await page.getByRole('button',{name:'Pequenos gestos',exact:true}).click();
      await expect(page.getByRole('heading',{name:'Nossa primeira caminhada',exact:true})).toBeVisible();
      await expect(page.getByRole('button',{name:/O domingo no parque/})).toHaveCount(0);
      await capture('memorias');
      const detailTrigger = page.getByRole('button',{name:'Abrir detalhe da memória'});
      await detailTrigger.click();
      const memory = page.getByRole('dialog',{name:'Nossa primeira caminhada'});
      await expect(memory).toBeVisible();
      await capture('detalhe');
      if (info.project.name==='mobile') await page.touchscreen.tap(5,5);
      else await page.mouse.click(5,5);
      await expect(memory).toBeHidden();
      await expect(detailTrigger).toBeFocused();
    }
  }
  await page.goto(root + '/perfis?origem=atalho#exemplo');
  await expect(page).toHaveURL(new URL(root + '/conexoes?origem=atalho#exemplo', page.url()).href);
  await expect(nav.getByRole('link',{name:'Conexões',exact:true})).toHaveAttribute('aria-current','page');
  await expect(nav.getByRole('link',{name:'Conexões',exact:true})).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const isolated = await browser.newContext();
  try {
    const other = await isolated.newPage();
    await signIn(other, outsider, root + '/cuidado');
    await expect(other.getByRole('heading',{name:'Prévia indisponível'})).toBeVisible();
    await expect(other.getByLabel('O que você quer expressar?')).toHaveCount(0);
    await expect(other.getByText('Núcleo das prévias',{exact:true})).toHaveCount(0);
  } finally { await isolated.close(); }
});
