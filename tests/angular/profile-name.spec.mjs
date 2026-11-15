import { randomUUID } from 'node:crypto';
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
      if (results.some(result => result.error)) throw new Error('Não foi possível limpar as contas de teste locais.');
    }
  },
});

async function signIn(page, account) {
  await page.getByLabel('E-mail').fill(account.email);
  await page.getByLabel('Senha', { exact: true }).fill(account.password);
  await page.getByRole('button', { name: 'Entrar na prévia' }).click();
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
  await other.getByRole('button', { name: 'Sair da prévia' }).click();
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
  await expect(page.getByRole('button', { name: 'Entrar na prévia' })).toBeVisible();
  await expect(page.getByRole('alert')).toContainText('Entre novamente');
  const untouched = await accounts.admin.auth.admin.getUserById(first.user.id);
  expect(untouched.data.user?.user_metadata.name).toBe('Pessoa Um');
});
