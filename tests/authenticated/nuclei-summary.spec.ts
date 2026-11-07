import { randomUUID } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { test, expect, localSql } from './fixtures';
import { withPeer } from './peer';
import { themes } from '../../src/features/appearance/themes';

test('cartões contam somente acordos ativos por Núcleo e identificam o papel atual', async ({ page, account }, info) => {
  await withPeer(page, async peer => {
    const ids = [randomUUID(), randomUUID(), randomUUID()];
    for (const [index, id] of ids.entries()) {
      localSql(`insert into public.nuclei(id,type,name,purpose,created_by) values('${id}','familia','Jardim ${index + 1}','Presença','${account.id}');
        insert into public.nucleus_members(nucleus_id,user_id,role) values('${id}','${account.id}','admin'),('${id}','${peer.id}','member');`);
    }
    for (const [index, statuses] of [['active', 'active', 'pending', 'testing', 'ended', 'declined'], ['active'], []].entries()) {
      for (const status of statuses) localSql(`insert into public.nucleus_agreements(nucleus_id,created_by,category,title,description,timing,frequency,status,trial_days)
        values('${ids[index]}','${account.id}','habit','Prática de teste','Presença','Noite','Semanal','${status}',7);`);
    }
    const gallery = path.resolve('Documentacao_Projeto_Nos/wireframes/comparacoes/v3.10.1-2026-11-07-resumo-nucleos-tela_12-tela_13');
    mkdirSync(gallery, { recursive: true });
    const phase = process.env.NOS_NUCLEI_BEFORE === '1' ? 'antes' : 'depois';
    await page.setViewportSize(info.project.name === 'desktop' ? { width: 1440, height: 1000 } : { width: 390, height: 844 });
    await peer.page.setViewportSize(page.viewportSize()!);
    await page.goto('/nucleos');
    await expect(page.locator('.nucleus-space-card')).toHaveCount(3);
    await expect(page.locator('.nucleus-space-card').first()).toBeVisible();
    await page.screenshot({ path: path.join(gallery, `${phase}-app-12-${info.project.name}.png`), fullPage: true, scale: 'css' });
    await peer.page.goto(`/nucleos/${ids[0]}`);
    await expect(peer.page.getByRole('heading', { name: 'Jardim 1', exact: true })).toBeVisible();
    await peer.page.screenshot({ path: path.join(gallery, `${phase}-app-13-${info.project.name}.png`), fullPage: true, scale: 'css' });
    const participantBadge = peer.page.locator('.ui-page-header .nucleus-role-badge');
    await expect(participantBadge).toHaveText('Você faz parte deste Núcleo.');
    await expect(participantBadge.locator('svg')).toHaveCount(0);
    // Temas podem trocar o destaque principal; participação precisa continuar verde.
    for (const { id: theme } of themes) {
      await peer.page.locator('html').evaluate((element, value) => element.setAttribute('data-theme', value), theme);
      await expect(participantBadge).toHaveCSS('color', 'rgb(22, 112, 58)');
      const sharedBackground = await peer.page.locator('.ui-page-header .ui-badge').last().evaluate(element => getComputedStyle(element).backgroundColor);
      await expect(participantBadge).toHaveCSS('background-color', sharedBackground);
    }
    const nav = page.getByRole('navigation', { name: 'Seus Núcleos', exact: true });
    for (const [index, text] of ['2 acordos ativos', '1 acordo ativo', '0 acordos ativos'].entries()) {
      const card = nav.getByRole('link', { name: `Jardim ${index + 1}`, exact: true });
      await expect(card).toContainText(text);
      await expect(card).toContainText('Você administra este Núcleo.');
    }
    await peer.page.goto('/nucleos');
    await expect(peer.page.locator('.nucleus-space-card').first()).toContainText('Você faz parte deste Núcleo.');
    await expect(peer.page.locator('.nucleus-space-card').first()).toContainText('2 acordos ativos');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.goto(`/nucleos/${ids[0]}`);
    await expect(page.locator('.ui-page-header .nucleus-role-badge svg')).toHaveCount(1);
  });
});
