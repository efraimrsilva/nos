import { randomUUID } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { test as base, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';
import { localSupabaseConfig } from '../../scripts/local-supabase.mjs';

const path = '/configuracoes/conta';
const test = base.extend({
  accounts: async ({}, use) => {
    const config = localSupabaseConfig();
    const admin = createClient(config.API_URL, config.SERVICE_ROLE_KEY, { auth: { persistSession: false } });
    const users = [];
    try {
      for (const name of ['Pessoa Um', 'Pessoa Dois']) {
        const email = 'angular-' + randomUUID() + '@example.test';
        const password = 'Aa1!' + randomUUID();
        const result = await admin.auth.admin.createUser({
          email, password, email_confirm: true, user_metadata: { name, appearance_theme: 'light' },
        });
        if (result.error || !result.data.user) throw new Error('Não foi possível criar a conta local de teste.');
        users.push({ email, password, user: result.data.user });
      }
      await use({ users, admin });
    } finally {
      const results = await Promise.all(users.map(({user}) => admin.auth.admin.deleteUser(user.id)));
      if (results.some(result => result.error && result.error.status !== 404)) {
        throw new Error('Não foi possível limpar as contas de teste locais.');
      }
    }
  },
});

async function signIn(page, account) {
  const entry = page.getByRole('link', { name: 'Entrar na conta' });
  if (new URL(page.url()).pathname === path) await entry.click();
  else if (!page.url().includes('next=')) await page.goto('/conta?modo=login&next=%2Fconfiguracoes%2Fconta');
  await page.getByLabel('E-mail', { exact: true }).fill(account.email);
  await page.getByLabel('Senha', { exact: true }).fill(account.password);
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await expect(page.getByRole('heading', { name: account.user.user_metadata.name })).toBeVisible();
}

test('protege acesso, valida e persiste o nome sem alterar outra conta', async ({page, accounts}, info) => {
  const [first, second] = accounts.users;
  await page.goto(path);
  await expect(page.getByRole('button', { name: 'Dados da conta' })).toHaveCount(0);
  await signIn(page, first);
  const trigger = page.getByRole('button', { name: 'Dados da conta' });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Dados da conta' });
  const edit = dialog.getByRole('button', { name: 'Editar nome do perfil' });
  await edit.click();
  const input = dialog.getByRole('textbox', { name: 'Nome do perfil' });
  await expect(input).toBeFocused();
  await input.fill('Descartar');
  await dialog.getByRole('button', { name: 'Cancelar edição do nome' }).click();
  await expect(input).toBeHidden();
  await expect(edit).toBeFocused();
  await edit.click();
  await input.fill('   ');
  await dialog.getByRole('button', { name: 'Salvar nome' }).click();
  await expect(dialog.getByRole('alert')).toContainText('1 a 80');
  await input.fill('  Nome atualizado  ');
  await page.route('**/auth/v1/user', async route => {
    if (route.request().method() === 'PUT') await route.abort();
    else await route.continue();
  });
  await dialog.getByRole('button', { name: 'Salvar nome' }).click();
  await expect(dialog.getByRole('alert')).toContainText('Não foi possível salvar');
  await expect(input).toHaveValue('  Nome atualizado  ');
  await expect(dialog.getByRole('status')).toHaveCount(0);
  await page.unroute('**/auth/v1/user');
  await input.fill('Nome atualizado');
  await input.fill('  Nome atualizado  ');

  if (process.env.NOS_ANGULAR_CAPTURE === '1') {
    const output = 'artifacts/angular-a01';
    mkdirSync(output, {recursive: true});
    await dialog.screenshot({path: output + '/depois-angular-modal-' + info.project.name + '.png', mask: [dialog.locator('.account-email')], maskColor: '#dce6db', scale: 'css'});
  }
  await dialog.getByRole('button', { name: 'Salvar nome' }).click();
  await expect(dialog.getByRole('status')).toHaveText('Nome do perfil atualizado.');
  await expect(edit).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Nome atualizado' })).toBeVisible();
  await trigger.click();
  const box = await dialog.boundingBox();
  await page.mouse.click(box.x + 8, box.y + 8);
  await expect(dialog).toBeVisible();
  await page.mouse.move(box.x + 8, box.y + 8);
  await page.mouse.down();
  await page.mouse.move(2, 2);
  await page.mouse.up();
  await expect(dialog).toBeVisible();
  if (info.project.name === 'mobile') await page.touchscreen.tap(2, 2);
  else await page.mouse.click(2, 2);
  await expect(dialog).toBeHidden();
  await trigger.click();
  await dialog.getByRole('button', { name: 'Fechar Dados da conta' }).click();
  await expect(dialog).toBeHidden();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

  if (process.env.NOS_ANGULAR_CAPTURE === '1') {
    await page.screenshot({path: 'artifacts/angular-a01/depois-angular-' + info.project.name + '.png', scale: 'css'});
  }

  const updated = await accounts.admin.auth.admin.getUserById(first.user.id);
  expect(updated.data.user?.user_metadata).toMatchObject({name: 'Nome atualizado', appearance_theme: 'light'});
  const untouched = await accounts.admin.auth.admin.getUserById(second.user.id);
  expect(untouched.data.user?.user_metadata.name).toBe('Pessoa Dois');
});

test('descarta rascunho ao trocar de conta em outra aba', async ({page, context, accounts}) => {
  const [first, second] = accounts.users;
  await page.goto(path);
  await signIn(page, first);
  await page.getByRole('button', { name: 'Dados da conta' }).click();
  await page.getByRole('button', { name: 'Editar nome do perfil' }).click();
  await page.getByRole('textbox', { name: 'Nome do perfil' }).fill('Rascunho da primeira conta');
  const other = await context.newPage();
  await other.goto(path);
  await other.getByRole('button', { name: 'Sair da conta' }).click();
  await other.getByRole('button', { name: 'Confirmar saída' }).click();
  await expect(other).toHaveURL(/\/conta\?modo=login$/);
  await signIn(other, second);
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(page.getByRole('heading', { name: 'Pessoa Dois' })).toBeVisible();
  const untouched = await accounts.admin.auth.admin.getUserById(second.user.id);
  expect(untouched.data.user?.user_metadata.name).toBe('Pessoa Dois');
});

test('recusa gravação após revogação e vencimento da sessão', async ({page, accounts}) => {
  const [first] = accounts.users;
  await page.goto(path);
  await signIn(page, first);
  await page.getByRole('button', { name: 'Dados da conta' }).click();
  await page.getByRole('button', { name: 'Editar nome do perfil' }).click();
  await page.getByRole('textbox', { name: 'Nome do perfil' }).fill('Não salvar');

  // Revoga a sessão real e adianta apenas o relógio de expiração guardado pelo cliente.
  const key = 'nos-angular-preview-session';
  const token = await page.evaluate(key => JSON.parse(localStorage.getItem(key)).access_token, key);
  const revoked = await accounts.admin.auth.admin.signOut(token, 'local');
  expect(revoked.error?.code ?? null).toBeNull();
  await page.evaluate(key => {
    const session = JSON.parse(localStorage.getItem(key));
    session.expires_at = 1;
    localStorage.setItem(key, JSON.stringify(session));
  }, key);
  await page.getByRole('button', { name: 'Salvar nome' }).click();
  await expect(page.getByRole('link', { name: 'Entrar na conta' })).toBeVisible();
  await expect(page.getByRole('alert')).toContainText('Entre novamente');
  const untouched = await accounts.admin.auth.admin.getUserById(first.user.id);
  expect(untouched.data.user?.user_metadata.name).toBe('Pessoa Um');
});

test('salva aparência e privacidade para a conta conectada', async ({page, accounts}) => {
  const [first, second] = accounts.users;
  await page.goto(path);
  await signIn(page, first);
  await page.getByRole('button', {name: 'Escolher tema'}).click();
  const appearance = page.getByRole('dialog', {name: 'Aparência'});
  await expect(appearance.getByRole('radio')).toHaveCount(9);
  await expect(appearance.locator('.theme-preview')).toHaveCount(9);
  await appearance.getByRole('radio', {name: /Azul — Oceano/}).check();
  await expect(appearance.getByRole('radio', {name: /Azul — Oceano/})).toBeChecked();
  await expect(appearance.getByRole('status')).toContainText('Tema salvo');
  await page.keyboard.press('Escape');

  await page.goto('/configuracoes/privacidade');
  await expect(page).toHaveURL(/\/conta#privacidade$/);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'ocean');
  await page.getByRole('button', {name: 'Visibilidade das próximas saídas'}).click();
  const privacy = page.getByRole('dialog', {name: 'Privacidade e visibilidade'});
  await privacy.getByRole('checkbox').check();
  await privacy.getByRole('button', {name: 'Salvar preferência'}).click();
  await expect(privacy.getByRole('status')).toContainText('Preferência salva');
  await page.reload();
  await page.getByRole('button', {name: 'Visibilidade das próximas saídas'}).click();
  await expect(privacy.getByRole('checkbox')).toBeChecked();
  await page.keyboard.press('Escape');
  await page.getByRole('button', {name: 'Apagar minha conta', exact: true}).click();
  const removal = page.getByRole('dialog', {name: 'Apagar minha conta'});
  await expect(removal.getByRole('button', {name: 'Confirmar exclusão'})).toBeDisabled();
  await page.keyboard.press('Escape');
  await expect(removal).toBeHidden();
  const unaffected = await accounts.admin.auth.admin.getUserById(second.user.id);
  expect(unaffected.data.user?.user_metadata.appearance_theme).toBe('light');
});

test('confirma a exclusão Angular e preserva o evento para a outra conta', async ({page, accounts, browser}, info) => {
  const [first, second] = accounts.users;
  const nucleus = randomUUID(), event = randomUUID();
  const sql = input => execFileSync('docker', ['exec', '-i', 'supabase_db_nos', 'psql', '-U', 'postgres', '-d', 'postgres',
    '-At', '-v', 'ON_ERROR_STOP=1'], {input, encoding:'utf8'}).trim();
  const peer = await browser.newContext(info.project.use);
  try {
    // Os identificadores são exclusivos desta execução e o evento permanece após apagar o autor.
    sql(`insert into public.nuclei(id,type,name,purpose,created_by)
      values('${nucleus}','amigos','Jardim de teste','Preservar o histórico','${first.user.id}');
      insert into public.nucleus_members(nucleus_id,user_id,role)
      values('${nucleus}','${first.user.id}','admin'),('${nucleus}','${second.user.id}','member');
      insert into public.nucleus_events(id,nucleus_id,created_by,title,starts_at,ends_at,time_zone)
      values('${event}','${nucleus}','${first.user.id}','Encontro preservado',now()+interval '1 day',now()+interval '25 hours','UTC');
      insert into public.nucleus_event_participants(event_id,user_id,response)
      values('${event}','${first.user.id}','declined'),('${event}','${second.user.id}','accepted');`);
    await page.goto(path);
    await signIn(page, first);
    const open = page.getByRole('button', {name:'Apagar minha conta', exact:true});
    await open.click();
    const dialog = page.getByRole('dialog', {name:'Apagar minha conta'});
    const phrase = dialog.getByRole('textbox'), submit = dialog.getByRole('button', {name:'Confirmar exclusão'});
    await phrase.fill('apagar conta');
    await expect(submit).toBeDisabled();
    await phrase.fill('APAGAR CONTA');
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    expect(sql(`select count(*) from auth.users where id='${first.user.id}';`)).toBe('1');
    await open.click();
    await expect(phrase).toHaveValue('');
    await phrase.fill('APAGAR CONTA');
    await submit.click();
    await expect(page).toHaveURL(/\/conta\?resultado=conta-excluida$/);
    expect(sql(`select count(*) from auth.users where id='${first.user.id}';`)).toBe('0');
    const other = await peer.newPage();
    await other.goto(path);
    await signIn(other, second);
    await other.goto('/nucleos/'+nucleus+'/agenda#evento-'+event);
    await expect(other.getByRole('heading', {name:'Encontro preservado'})).toBeVisible();
    await expect(other.getByText('Criado por Conta excluída.', {exact:true})).toBeVisible();
    await expect(other.getByText('1 com presença confirmada', {exact:true})).toBeVisible();
    expect(sql(`select role from public.nucleus_members where nucleus_id='${nucleus}' and user_id='${second.user.id}';`)).toBe('admin');
  } finally {
    await peer.close();
    sql(`delete from public.nuclei where id='${nucleus}';`);
  }
});

test('relata pela Ajuda, confirma o envio e respeita o limite no cabeçalho', async ({page, accounts}) => {
  test.skip(!process.env.NOS_ANGULAR_SUPPORT_SMTP_PORT, 'Requer caixa SMTP descartável em loopback.');
  await page.goto(path);
  await signIn(page, accounts.users[0]);
  await page.goto('/ajuda');
  await expect(page).toHaveURL(/\/conta#ajuda-e-suporte$/);
  const support = page.getByRole('main').getByRole('button', {name:'Relatar um problema'});
  const dialog = page.getByRole('dialog', {name:'Relatar um problema'});
  const description = 'Relato descartável '+randomUUID();
  const fill = async () => {
    await dialog.getByLabel('O que aconteceu?').fill(description);
    await dialog.getByRole('button', {name:'Enviar relato'}).click();
  };
  await support.click();
  await fill();
  await expect(dialog.getByRole('status')).toContainText('Relato enviado.');
  await page.keyboard.press('Escape');
  await page.getByRole('banner').getByRole('button', {name:'Relatar um problema'}).click();
  const limited = page.waitForResponse(response => response.url().endsWith('/api/problem-report') && response.status()===429);
  await fill();
  await limited;
  await expect(dialog.getByRole('alert')).toContainText('Aguarde');
  await expect(dialog.getByLabel('O que aconteceu?')).toHaveValue(description);
});

test('usa os controles incorporados no perfil desktop e no Mais móvel', async ({page, accounts}, info) => {
  await signIn(page, accounts.users[0]);
  const mobile = info.project.name === 'mobile';
  if (mobile) {
    const header = page.getByRole('banner');
    await expect(header.getByRole('link',{name:'Minha conta',exact:true})).toBeVisible();
    await expect(page.getByRole('navigation',{name:'Navegação móvel'}).getByRole('link',{name:'Seus Núcleos',exact:true}).locator('svg')).toBeVisible();
  }
  const profile = page.getByRole('button',{ name: mobile ? 'Mais áreas e preferências' : 'Abrir opções da conta' });
  await profile.click();
  const menu = page.getByRole('dialog',{ name: mobile ? 'Todos os seus caminhos' : 'Conta, Preferências e Ajuda' });
  const controls = menu.getByRole('region',{name:'Preferências da conta'});
  await expect(controls.getByRole('heading')).toHaveText([
    'Perfil','Entrar e recuperar','Conta e Núcleos','Aparência','Privacidade','Ajuda e suporte',
  ]);
  const dataTrigger = controls.getByRole('button',{name:'Dados da conta'});
  await dataTrigger.click();
  const data = page.getByRole('dialog',{name:'Dados da conta'});
  await data.getByRole('button',{name:'Editar nome do perfil'}).click();
  await expect(data.getByRole('textbox',{name:'Nome do perfil'})).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(data).toBeHidden();
  await expect(dataTrigger).toBeFocused();

  await controls.getByRole('button',{name:'Escolher tema'}).click();
  const appearance = page.getByRole('dialog',{name:'Aparência'});
  await expect(appearance).toBeVisible();
  if (mobile) await page.touchscreen.tap(2,2);
  else await page.mouse.click(2,2);
  await expect(appearance).toBeHidden();
  await expect(menu).toBeVisible();
  await controls.getByRole('button',{name:'Sair da conta'}).click();
  await expect(page.getByRole('dialog',{name:'Sair da conta'})).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(menu).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(profile).toBeFocused();
  await profile.click();
  await controls.getByRole('link',{name:/Seus Núcleos/}).click();
  await expect(page).toHaveURL(/\/nucleos$/);
  await expect(menu).toBeHidden();
});

test('expande o relato entre rotas e reinicia o prazo após nova sessão', async ({page, accounts}) => {
  await page.clock.install();
  await signIn(page, accounts.users[0]);
  const banner = page.getByRole('banner');
  const anchor = banner.locator('.problem-report-anchor');
  const report = banner.getByRole('button',{name:'Relatar um problema'});
  await expect(anchor).toHaveAttribute('data-reminder-visible','false');
  await page.clock.fastForward(45_000);
  await page.getByRole('navigation',{name:/Áreas do Nós|Navegação móvel/}).getByRole('link',{name:'Seus Núcleos'}).click();
  await expect(page).toHaveURL(/\/nucleos$/);
  await expect(anchor).toHaveAttribute('data-reminder-visible','false');
  await page.clock.fastForward(15_000);
  await expect(anchor).toHaveAttribute('data-reminder-visible','true');
  await report.click();
  const dialog = page.getByRole('dialog',{name:'Relatar um problema'});
  await expect(dialog.getByLabel('O que aconteceu?')).toBeVisible();
  await expect(anchor).toHaveAttribute('data-reminder-visible','false');
  await page.keyboard.press('Escape');
  await page.goBack();
  await expect(page.getByRole('heading',{name:'Pessoa Um'})).toBeVisible();
  const opener = page.getByRole('button',{name:/Abrir opções da conta|Mais áreas e preferências/}).filter({visible:true});
  await opener.click();
  await page.getByRole('region',{name:'Preferências da conta'}).getByRole('button',{name:'Sair da conta'}).click();
  await page.getByRole('button',{name:'Confirmar saída'}).click();
  await expect(page).toHaveURL(/\/conta\?modo=login$/);
  await signIn(page, accounts.users[0]);
  await expect(anchor).toHaveAttribute('data-reminder-visible','false');
  // Uma aba em segundo plano não deve consumir os dez segundos de leitura.
  await page.evaluate(() => Object.defineProperty(document, 'visibilityState', {configurable:true, value:'hidden'}));
  await page.clock.fastForward(60_000);
  await expect(anchor).toHaveAttribute('data-reminder-visible','false');
  await page.clock.fastForward(15_000);
  await page.evaluate(() => {
    Object.defineProperty(document, 'visibilityState', {configurable:true, value:'visible'});
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect(anchor).toHaveAttribute('data-reminder-visible','true');
  await page.clock.fastForward(10_000);
  await expect(anchor).toHaveAttribute('data-reminder-visible','false');
});
