import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { test, expect, localSql } from './fixtures';

const gallery = path.resolve('Documentacao_Projeto_Nos/wireframes/comparacoes/v3.4.0-2026-10-30-nome-perfil-tela_13-tela_66');
test('nome do perfil: cancelar, validar, salvar e persistir na própria conta', async ({ page, account }, info) => {
  mkdirSync(gallery, { recursive: true });
  localSql(`update auth.users set raw_user_meta_data=raw_user_meta_data || '{"appearance_theme":"light","profile_name_test":"preservado"}'::jsonb where id='${account.id}'`);
  await page.setViewportSize(info.project.name === 'desktop' ? { width: 1440, height: 1000 } : { width: 390, height: 844 });
  await page.goto('/conta');
  await page.locator('.account-workspace').getByRole('button', { name: /^Dados da conta/ }).click();
  const dialog = page.getByRole('dialog', { name: 'Dados da conta', exact: true });
  if (process.env.NOS_CAPTURE_BEFORE === '1') {
    await dialog.screenshot({ path: path.join(gallery, `antes-app-${info.project.name}.png`) });
    await page.setViewportSize({ width: 390, height: 844 });
    await dialog.screenshot({ path: path.join(gallery, 'antes-app-mobile.png') });
  }
  await expect(dialog.getByRole('button', { name: 'Editar nome do perfil', exact: true })).toBeVisible({ timeout: 5000 });
  await dialog.getByRole('button', { name: 'Editar nome do perfil', exact: true }).click();
  const input = dialog.getByRole('textbox', { name: 'Nome do perfil', exact: true });
  await input.fill('Nome descartado');
  await dialog.getByRole('button', { name: 'Cancelar edição do nome' }).click();
  await expect(input).toHaveCount(0);
  expect(localSql(`select coalesce(raw_user_meta_data->>'name','') from auth.users where id='${account.id}'`).trim()).toBe('');
  await dialog.getByRole('button', { name: 'Editar nome do perfil', exact: true }).click();
  await input.fill('   ');
  await dialog.getByRole('button', { name: 'Salvar nome', exact: true }).click();
  await expect(dialog.getByRole('alert')).toContainText('1 a 80');
  await input.fill('  Nome de Teste  ');
  // Falha de transporte mantém o rascunho e permite tentar novamente sem sucesso falso.
  await page.route('**/conta', async route => {
    if (route.request().method() === 'POST') await route.abort('failed');
    else await route.continue();
  });
  await dialog.getByRole('button', { name: 'Salvar nome', exact: true }).click();
  await expect(dialog.getByRole('alert')).toContainText('Não foi possível salvar');
  await expect(input).toHaveValue('  Nome de Teste  ');
  await expect(dialog.getByRole('status')).toHaveCount(0);
  await dialog.screenshot({ path: path.join(gallery, `erro-app-${info.project.name}.png`) });
  await page.unroute('**/conta');
  await dialog.screenshot({ path: path.join(gallery, `edicao-app-${info.project.name}.png`) });
  await dialog.getByRole('button', { name: 'Salvar nome', exact: true }).click();
  await expect(dialog.getByRole('status')).toHaveText('Nome do perfil atualizado.');
  await expect(dialog.getByRole('button', { name: 'Editar nome do perfil', exact: true })).toBeFocused();
  await expect(dialog.getByText('Nome de Teste', { exact: true })).toBeVisible();
  expect(localSql(`select raw_user_meta_data->>'name' from auth.users where id='${account.id}'`).trim()).toBe('Nome de Teste');
  expect(localSql(`select raw_user_meta_data->>'profile_name_test' from auth.users where id='${account.id}'`).trim()).toBe('preservado');
  await dialog.screenshot({ path: path.join(gallery, `depois-app-${info.project.name}.png`) });
  await page.keyboard.press('Escape');
  await page.reload();
  await expect(page.locator('.account-workspace .account-profile h2')).toHaveText('Nome de Teste');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  if (info.project.name === 'desktop') {
    await page.goto('/nucleos');
    await page.getByRole('button', { name: 'Abrir Conta, Preferências e Ajuda', exact: true }).click();
    const panel = page.locator('.account-popover:popover-open');
    await panel.getByRole('button', { name: /^Dados da conta/ }).click();
    await dialog.getByRole('button', { name: 'Editar nome do perfil', exact: true }).click();
    await input.fill('Outro Nome');
    await dialog.getByRole('button', { name: 'Salvar nome', exact: true }).click();
    await expect(dialog.getByRole('status')).toHaveText('Nome do perfil atualizado.');
    await page.keyboard.press('Escape');
    await expect(panel.locator('.account-profile h2')).toHaveText('Outro Nome');
  }
});
