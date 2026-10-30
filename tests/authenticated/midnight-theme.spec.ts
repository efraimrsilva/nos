import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { test, expect } from './fixtures';

const gallery = path.resolve('Documentacao_Projeto_Nos/wireframes/comparacoes/v3.4.1-2026-10-30-meia-noite-tela_66');
test('Meia-noite apresenta superfícies pretas sobre fundo cinza escuro', async ({ page }, info) => {
  await page.setViewportSize(info.project.name === 'desktop' ? { width: 1440, height: 1000 } : { width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/conta');
  await page.locator('.account-workspace').getByRole('button', { name: /^Aparência/ }).click();
  const dialog = page.getByRole('dialog', { name: 'Aparência', exact: true });
  await dialog.getByRole('radio', { name: 'Preto — Meia-noite', exact: true }).check();
  await expect(dialog.getByRole('status')).toHaveText('Tema salvo na sua conta.');
  mkdirSync(gallery, { recursive: true });
  const phase = process.env.NOS_CAPTURE_BEFORE === '1' ? 'antes' : 'depois';
  await dialog.screenshot({ path: path.join(gallery, `${phase}-app-aparencia-${info.project.name}.png`) });
  await page.keyboard.press('Escape');
  await page.screenshot({ path: path.join(gallery, `${phase}-app-conta-${info.project.name}.png`), fullPage: true });
  if (phase === 'antes') return;
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(16, 19, 18)');
  await expect(page.locator('.account-workspace .account-panel').first()).toHaveCSS('background-color', 'rgb(0, 0, 0)');
  if (info.project.name === 'desktop') await expect(page.locator('.desktop-navigation')).toHaveCSS('background-color', 'rgb(0, 0, 0)');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'black');
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(16, 19, 18)');
});
