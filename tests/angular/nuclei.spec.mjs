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
  const name = page.getByLabel('Nome do Núcleo',{exact:true});
  await name.fill('Jardim de teste');
  await page.getByRole('button',{name:'Usar sugestão'}).click();
  await capture('proposito');
  await page.getByRole('button',{name:'Continuar'}).click();
  await expect(page.getByRole('heading',{name:'Confira seu rascunho'})).toBeVisible();
  expect(new URL(page.url()).searchParams.get('nome')).toBeNull();
  await capture('revisao');
  await page.getByRole('button',{name:'Editar'}).click();
  await expect(name).toHaveValue('Jardim de teste');
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
  const card = page.getByRole('link',{name:'Jardim de teste',exact:true});
  await expect(card).toHaveCount(1);
  await expect(card).toContainText('Pessoa A');
  await capture('lista');
  await card.click();
  await expect(page).toHaveURL(path);
  await page.reload();
  await expect(page.getByRole('heading',{name:'Jardim de teste'})).toBeVisible();
  await page.getByRole('link',{name:'Minha conta',exact:true}).first().click();
  await page.getByRole('link',{name:'Voltar ao Núcleo'}).click();
  await expect(page).toHaveURL(path);

  await page.goto('/configuracoes/conta');
  await page.getByRole('button',{name:'Sair da conta'}).click();
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
    await inspect(first);
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
    await page.keyboard.press('Escape');
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
