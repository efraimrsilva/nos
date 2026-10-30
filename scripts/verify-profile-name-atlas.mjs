import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from '@playwright/test';

const gallery = path.resolve('Documentacao_Projeto_Nos/wireframes/comparacoes/v3.4.0-2026-10-30-nome-perfil-tela_13-tela_66');
mkdirSync(gallery, { recursive: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(pathToFileURL(path.resolve('Documentacao_Projeto_Nos/wireframes/atlas/index.html')).href + '#tela-66');
  for (const mobile of [false, true]) {
    const device = mobile ? 'mobile' : 'desktop';
    await page.setViewportSize(mobile ? { width: 390, height: 844 } : { width: 1440, height: 1000 });
    await page.evaluate(() => openScreen(66));
    await page.getByRole('button', { name: mobile ? 'Celular' : 'Web', exact: true }).click();
    await page.locator('#screen-preview .current-atlas-main [data-live-account-data]').click();
    const dialog = page.getByRole('dialog', { name: 'Dados da conta', exact: true });
    const before = process.env.NOS_CAPTURE_BEFORE === '1';
    await dialog.screenshot({ path: path.join(gallery, `${before ? 'antes' : 'depois'}-atlas-${device}.png`) });
    if (!before) {
      await dialog.getByRole('button', { name: 'Editar nome do perfil', exact: true }).click();
      await dialog.getByRole('textbox', { name: 'Nome do perfil', exact: true }).fill('Nome ilustrativo');
      await dialog.screenshot({ path: path.join(gallery, `edicao-atlas-${device}.png`) });
      await dialog.getByRole('button', { name: 'Salvar nome', exact: true }).click();
      assert.match(await dialog.textContent(), /Nome ilustrativo/);
      assert.match(await dialog.textContent(), /somente nesta prévia/);
    }
    await page.keyboard.press('Escape');
  }
  assert.deepEqual(errors, []);
  console.log('Atlas Dados da conta: desktop/celular; zero erros de JavaScript.');
} finally { await browser.close(); }
