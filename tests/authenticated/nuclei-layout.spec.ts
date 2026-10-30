import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { test, expect } from './fixtures';

test('Núcleos sem painel lateral mantém criação e convite acessíveis', async ({ page }, info) => {
  await page.setViewportSize(info.project.name === 'desktop' ? { width: 1440, height: 1000 } : { width: 390, height: 844 });
  await page.goto('/nucleos');
  await expect(page.getByRole('heading', { name: 'Seus Núcleos', exact: true })).toBeVisible();
  await expect(page.locator('.nuclei-intention')).toHaveCount(0);
  await expect(page.getByRole('link', { name: /Um lugar à mesa/ })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const invitation = page.locator('.nuclei-header-actions').getByRole('link', { name: 'Entrar com convite', exact: true });
  const creation = page.getByRole('button', { name: 'Criar um núcleo', exact: true });
  await expect(invitation).toHaveAttribute('href', '/comecar/convite');
  const left = await invitation.boundingBox(), right = await creation.boundingBox();
  expect(left).not.toBeNull();
  expect(right).not.toBeNull();
  expect(left!.x + left!.width).toBeLessThanOrEqual(right!.x);
  expect(Math.abs(left!.y - right!.y)).toBeLessThan(2);
  // Evidência da rota protegida com conta descartável criada e removida pela fixture local.
  const output = path.resolve('Documentacao_Projeto_Nos/wireframes/comparacoes/v3.3.3-2026-10-30-convites-tela_12-tela_13-tela_66');
  mkdirSync(output, { recursive: true });
  await page.screenshot({ path: path.join(output, `depois-app-${info.project.name}.png`), fullPage: true });
  await page.getByRole('button', { name: 'Criar um núcleo', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
  await invitation.click();
  await expect(page).toHaveURL(/\/comecar\/convite$/);
});


test('convite acessível em Conta e Núcleos na página e no perfil', async ({ page }, info) => {
  await page.setViewportSize(info.project.name === 'desktop' ? { width: 1440, height: 1000 } : { width: 390, height: 844 });
  const output = path.resolve('Documentacao_Projeto_Nos/wireframes/comparacoes/v3.3.3-2026-10-30-convites-tela_12-tela_13-tela_66');
  mkdirSync(output, { recursive: true });
  await page.goto('/conta');
  const section = page.locator('.account-workspace #conta-e-nucleos');
  const invitation = section.getByRole('link', { name: /^Entrar com convite/ });
  await expect(invitation).toBeVisible();
  await expect(invitation).toHaveAttribute('href', '/comecar/convite');
  await section.screenshot({ path: path.join(output, 'depois-app-conta-' + info.project.name + '.png') });
  await invitation.click();
  await expect(page).toHaveURL(/\/comecar\/convite$/);
  if (info.project.name === 'desktop') {
    await page.goto('/nucleos');
    await page.getByRole('button', { name: 'Abrir Conta, Preferências e Ajuda', exact: true }).click();
    const panel = page.locator('.account-popover:popover-open');
    const profileSection = panel.locator('#profile-popover-conta-e-nucleos');
    const profileInvitation = profileSection.getByRole('link', { name: /^Entrar com convite/ });
    await expect(profileInvitation).toBeVisible();
    await profileSection.screenshot({ path: path.join(output, 'depois-app-perfil-desktop.png') });
    await profileInvitation.click();
    await expect(page).toHaveURL(/\/comecar\/convite$/);
    await expect(page.locator('.account-popover:popover-open')).toHaveCount(0);
  }
});
