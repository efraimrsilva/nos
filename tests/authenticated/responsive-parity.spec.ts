import { randomUUID } from 'node:crypto';
import { test, expect, localSql } from './fixtures';

test('navegação preserva destinos e ações com nome máximo em todas as larguras', async ({ page, account }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const id = randomUUID(), name = 'N'.repeat(80);
  localSql(`insert into public.nuclei(id,type,name,purpose,created_by) values('${id}','familia','${name}','Cuidar','${account.id}'); insert into public.nucleus_members(nucleus_id,user_id,role) values('${id}','${account.id}','admin');`);
  await page.goto(`/nucleos/${id}`);
  await expect(page.getByRole('main').getByRole('heading', { level: 1 })).toHaveText(name);
  let desktopDestinations: string[] = [];
  for (const width of [1440, 1024, 768, 701, 700, 600, 390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    if ([1440, 768, 390, 320].includes(width)) await page.screenshot({ path: `artifacts/parity-header-${width}.png`, fullPage: true });
    // Em emulação móvel, overflow pode ampliar innerWidth; comparar com a largura solicitada evita falso positivo.
    expect(await page.evaluate(() => document.documentElement.scrollWidth), `sem rolagem horizontal em ${width}px`).toBeLessThanOrEqual(width);
    const notifications = page.getByRole('button', { name: 'Notificações — esboço' });
    await expect(notifications).toBeInViewport();
    await notifications.click({ timeout: 5000 });
    await expect(page.getByRole('dialog', { name: 'Novidades, no seu tempo.' })).toBeVisible();
    await page.getByRole('button', { name: 'Fechar notificações' }).click();
    if (width > 700) {
      await expect(page.getByRole('button', { name: 'Abrir Conta, Preferências e Ajuda' })).toBeInViewport();
      desktopDestinations = await page.locator('.desktop-navigation nav a').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')!).sort());
    } else {
      await expect(page.getByRole('link', { name: 'Minha conta', exact: true })).toBeInViewport();
      await page.getByRole('button', { name: 'Mais áreas e preferências' }).click();
      const destinations = await page.locator('.mobile-navigation a, .navigation-dialog nav a').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')!).sort());
      expect(destinations).toEqual(desktopDestinations);
      await page.getByRole('button', { name: 'Fechar menu' }).click();
    }
  }
});

test('modal com título longo mantém fechar e ações acessíveis, inclusive acima da área segura', async ({ page, account }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const id = randomUUID(), title = 'A'.repeat(80);
  localSql(`insert into public.nuclei(id,type,name,purpose,created_by) values('${id}','familia','Paridade','Cuidar','${account.id}'); insert into public.nucleus_members(nucleus_id,user_id,role) values('${id}','${account.id}','admin'); insert into public.nucleus_agreements(nucleus_id,created_by,category,title,description,timing,frequency,status,trial_days) values('${id}','${account.id}','habit','${title}','Uma prática','Noite','Semanal','pending',7);`);
  await page.goto(`/nucleos/${id}/acordos`);
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    await page.getByRole('button', { name: new RegExp(title) }).click({ timeout: 5000 });
    const dialog = page.getByRole('dialog', { name: title, exact: true });
    await expect(dialog).toBeVisible();
    await dialog.screenshot({ path: `artifacts/parity-dialog-${width}.png` });
    expect(await dialog.evaluate(node => node.scrollWidth <= node.clientWidth + 1), `modal sem rolagem horizontal em ${width}px`).toBe(true);
    await dialog.getByRole('button', { name: `Fechar ${title}`, exact: true }).click({ timeout: 5000 });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  // Simula a área inferior de aparelhos com indicador de início usando a mesma variável da barra.
  await page.locator('.current-shell').evaluate(node => (node as HTMLElement).style.setProperty('--mobile-safe-area', '34px'));
  await page.getByRole('button', { name: 'Nova proposta', exact: true }).focus();
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  const main = await page.getByRole('main').boundingBox(), nav = await page.locator('.mobile-navigation').boundingBox();
  expect(main!.y + main!.height).toBeLessThanOrEqual(nav!.y);
});
