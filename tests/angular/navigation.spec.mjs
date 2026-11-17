import { mkdirSync } from 'node:fs';
import { test, expect } from '@playwright/test';

test('preserva a estrutura, volta pelo histórico e identifica endereço desconhecido', async ({ page }, info) => {
  await page.goto('/configuracoes/conta?origem=atalho');
  const main = page.getByRole('main');
  const header = page.getByRole('banner');
  const mobile = info.project.name === 'mobile';
  const navigation = page.getByRole('navigation', { name: mobile ? 'Navegação móvel' : 'Áreas do Nós' });
  await expect(main.getByRole('heading', { name: 'Minha conta' })).toBeVisible();
  await expect(navigation.getByRole('link', { name: 'Minha conta' })).toHaveAttribute('aria-current', 'page');
  const marker = await header.elementHandle();
  const skip = page.getByRole('link', { name: 'Pular para o conteúdo' });
  await skip.focus();
  await skip.press('Enter');
  await expect(main).toBeFocused();

  if (!mobile) {
    const toggle = page.getByRole('button', { name: 'Ocultar barra lateral' });
    await toggle.focus();
    await page.keyboard.press('Enter');
    await expect(navigation).toBeHidden();
    const show = page.getByRole('button', { name: 'Mostrar barra lateral' });
    await expect(show).toBeFocused();
    await show.press('Enter');
  }

  await navigation.getByRole('link', { name: 'Início' }).click();
  await expect(main.getByRole('heading', { name: 'Fortalecendo os laços que unem quem você ama.' })).toBeVisible();
  await expect(main.getByRole('heading', { name: 'Fortalecendo os laços que unem quem você ama.' })).toBeFocused();
  expect(await marker.evaluate(element => element.isConnected)).toBe(true);
  await page.goBack();
  await expect(main.getByRole('heading', { name: 'Minha conta' })).toBeFocused();
  await page.goForward();
  await expect(main.getByRole('heading', { name: 'Fortalecendo os laços que unem quem você ama.' })).toBeFocused();
  expect(await marker.evaluate(element => element.isConnected)).toBe(true);
  expect(await page.evaluate(() => performance.getEntriesByType('navigation').length)).toBe(1);

  await page.goto('/endereco-inexistente');
  await expect(page).toHaveURL(/\/endereco-inexistente$/);
  await expect(main.getByRole('heading', { name: 'Página não encontrada' })).toBeVisible();
  await expect(page).toHaveTitle('Página não encontrada · Nós');
  await main.getByRole('link', { name: 'Voltar ao início' }).click();
  await expect(main.getByRole('heading', { name: 'Fortalecendo os laços que unem quem você ama.' })).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

  if (process.env.NOS_SHELL_CAPTURE === '1') {
    mkdirSync('artifacts/angular-a02', { recursive: true });
    await page.screenshot({ path: 'artifacts/angular-a02/inicio-' + info.project.name + '.png', scale: 'css' });
    await navigation.getByRole('link', { name: 'Minha conta' }).click();
    await expect(main.getByRole('heading', { name: 'Acesso à conta' })).toBeVisible();
    await page.screenshot({ path: 'artifacts/angular-a02/conta-' + info.project.name + '.png', scale: 'css' });
  }
});

test('feedback de carregamento e falha permanece dentro do conteúdo', async ({ page }) => {
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  const handler = async route => {
    await gate;
    await route.abort();
  };
  await page.goto('/configuracoes/conta');
  const deferredChunk = /\/chunk-[\w-]+\.js(?:\?|$)/;
  await page.route(deferredChunk, handler);
  await page.getByRole('navigation', { name: /Áreas do Nós|Navegação móvel/ }).getByRole('link', { name: 'Seus Núcleos' }).click();
  try {
    await expect(page.getByRole('banner')).toBeVisible();
    await expect(page.getByRole('main').getByRole('status').filter({hasText:'Carregando página'})).toBeVisible();
  } finally {
    release();
  }
  await expect(page.getByRole('main').getByRole('alert')).toContainText('Não foi possível abrir');
  await expect(page.getByRole('banner')).toBeVisible();
  // Navegação para uma rota já disponível continua operante após falha ao carregar outro módulo.
  const activeHome = page.getByRole('navigation', { name: /Áreas do Nós|Navegação móvel/ }).getByRole('link', { name: 'Minha conta' });
  await activeHome.click();
  await expect(page.getByRole('main').getByRole('alert')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Minha conta' })).toBeVisible();
  await page.getByRole('navigation', { name: /Áreas do Nós|Navegação móvel/ }).getByRole('link', { name: 'Seus Núcleos' }).click();
  await expect(page.getByRole('main').getByRole('alert')).toBeVisible();
  await page.unroute(deferredChunk, handler);
  await page.getByRole('link', { name: 'Recarregar página' }).click();
  await expect(page.getByRole('form', {name:'Acesso à conta'})).toBeVisible();
  await expect(page).toHaveURL(/\/conta\?modo=login$/);
});

test('Mais fecha por teclado, toque e X e apenas a camada superior fecha', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile', 'Mais é o menu da navegação móvel.');
  await page.goto('/configuracoes/conta');
  const more = page.getByRole('button', { name: 'Mais áreas e preferências' });
  const accountLink = page.getByRole('navigation', { name: 'Navegação móvel' }).getByRole('link', { name: 'Minha conta' });
  const accountPosition = await accountLink.boundingBox();
  await more.focus();
  await more.press('Enter');
  const menu = page.getByRole('dialog', { name: 'Todos os seus caminhos' });
  await expect(menu).toBeVisible();
  const close = menu.getByRole('button', { name: 'Fechar menu' });
  await expect(close).toBeFocused();

  // Cria uma segunda camada nativa para verificar a regra global sem adicionar ações fictícias à prévia.
  await menu.evaluate(parent => {
    const nested = document.createElement('dialog');
    nested.setAttribute('aria-label', 'Diálogo de verificação');
    nested.textContent = 'Segunda camada';
    parent.append(nested);
    nested.showModal();
  });
  await page.touchscreen.tap(2, 2);
  await expect(page.getByRole('dialog', { name: 'Diálogo de verificação' })).toBeHidden();
  await expect(menu).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
  await expect(more).toBeFocused();
  await more.click();
  await page.touchscreen.tap(accountPosition.x + accountPosition.width / 2, accountPosition.y + accountPosition.height / 2);
  await expect(menu).toBeHidden();
  await expect(page).toHaveURL(new URL('/configuracoes/conta', page.url()).href);
  await more.click();
  await close.click();
  await expect(menu).toBeHidden();
  await more.click();
  if (process.env.NOS_SHELL_CAPTURE === '1') {
    await menu.screenshot({ path: 'artifacts/angular-a02/mais-mobile.png', scale: 'css' });
  }
  await menu.getByRole('link', { name: 'Minha conta' }).click();
  await expect(menu).toBeHidden();
  await expect(page.getByRole('heading', { name: 'Minha conta' })).toBeVisible();

  await more.click();
  await menu.getByRole('link', { name: 'Minha conta' }).click();
  await expect(menu).toBeHidden();
});

test('reentrar na Conta durante a conexão compartilha a inicialização', async ({ page }) => {
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  let loads = 0;
  await page.route('**/supabase.json', async route => {
    loads++;
    await gate;
    await route.continue();
  });
  await page.goto('/configuracoes/conta');
  try {
    const navigation = page.getByRole('navigation', { name: /Áreas do Nós|Navegação móvel/ });
    await expect(page.getByRole('status')).toContainText('Carregando sua conta');
    await expect.poll(() => loads).toBe(1);
    await navigation.getByRole('link', { name: 'Início' }).click();
    await expect(page.getByRole('heading', { name: 'Fortalecendo os laços que unem quem você ama.' })).toBeVisible();
    await page.goBack();
    await expect(page.getByRole('status')).toContainText('Carregando sua conta');
  } finally {
    release();
  }
  await expect(page.getByRole('heading', { name: 'Acesso à conta' })).toBeVisible();
  expect(loads).toBe(1);
});
