import { randomUUID } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { test, expect, localSql } from './fixtures';

const gallery = path.resolve('Documentacao_Projeto_Nos/wireframes/comparacoes/v3.4.2-2026-10-30-barra-lateral-tela_13');
test('barra lateral sem cartão do Núcleo preserva contexto e navegação', async ({ page, account }, info) => {
  const desktop = info.project.name === 'desktop';
  await page.setViewportSize(desktop ? { width: 1440, height: 1000 } : { width: 390, height: 844 });
  const nucleus = randomUUID();
  // Núcleo descartável local permite conferir os links reais sem tocar em contas existentes.
  localSql(`insert into public.nuclei(id,type,name,purpose,created_by) values('${nucleus}','familia','Jardim de teste','Cultivar presença','${account.id}');insert into public.nucleus_members(nucleus_id,user_id,role) values('${nucleus}','${account.id}','admin');`);
  await page.goto(`/nucleos/${nucleus}`);
  await expect(page.getByRole('main').getByRole('heading', { name: 'Jardim de teste', exact: true })).toBeVisible();
  mkdirSync(gallery, { recursive: true });
  const before = process.env.NOS_CAPTURE_BEFORE === '1';
  await page.screenshot({ path: path.join(gallery, `${before ? 'antes' : 'depois'}-app-${info.project.name}.png`), fullPage: true });
  if (before) return;
  await expect(page.locator('.current-nucleus-switch')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  if (desktop) {
    const nav = page.getByRole('navigation', { name: 'Áreas do Nós', exact: true });
    await expect(nav.getByRole('link', { name: 'Início', exact: true })).toHaveAttribute('href', `/nucleos/${nucleus}`);
    await page.getByRole('button', { name: 'Ocultar barra lateral', exact: true }).click();
    await expect(page.locator('.desktop-navigation')).toHaveAttribute('inert', '');
    await page.getByRole('button', { name: 'Mostrar barra lateral', exact: true }).click();
    await nav.getByRole('link', { name: 'Seus Núcleos', exact: true }).click();
  } else {
    await page.getByRole('button', { name: 'Mais áreas e preferências' }).click();
    await page.getByRole('dialog', { name: 'Todos os seus caminhos' }).getByRole('link', { name: 'Seus Núcleos', exact: true }).click();
  }
  await expect(page).toHaveURL(/\/nucleos$/);
});
