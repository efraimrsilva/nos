import { randomUUID } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';
import { localSupabaseConfig } from '../../scripts/local-supabase.mjs';

const invitation = '/comecar/convite';
const field = (page, name) => page.getByLabel(name, { exact: true });
const access = page => page.getByRole('form', { name: 'Acesso à conta' });
const accountOrigin = 'http://127.0.0.1:3200';

test('cadastra, confirma pelo e-mail local e recupera a senha', async ({page}, info) => {
  test.setTimeout(70_000);
  const cfg = localSupabaseConfig();
  if (!/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(cfg.INBUCKET_URL)) throw new Error('Caixa de e-mail local indisponível.');
  const admin = createClient(cfg.API_URL, cfg.SERVICE_ROLE_KEY, { auth: { persistSession: false } });
  const email = 'angular-a03-' + randomUUID() + '@example.test';
  const password = 'Aa1!' + randomUUID(), newPassword = 'Bb2!' + randomUUID();
  const box = cfg.INBUCKET_URL;
  const messages = async () => (await (await fetch(box + '/api/v1/search?query=' + encodeURIComponent('to:' + email))).json()).messages ?? [];
  async function openEmail(kind, target = page, exclude = new Set()) {
    let link;
    await expect.poll(async () => {
      for (const item of await messages()) {
        if (exclude.has(item.ID)) continue;
        const message = await (await fetch(box + '/api/v1/message/' + item.ID)).json();
        const href = message.HTML?.match(/href="([^"]*\/auth\/v1\/verify[^"]*)"/)?.[1]?.replaceAll('&amp;', '&');
        if (!href) continue;
        const url = new URL(href);
        if (url.searchParams.get('type') !== kind) continue;
        const redirect = new URL(url.searchParams.get('redirect_to'));
        if (redirect.origin !== accountOrigin || url.origin !== new URL(cfg.API_URL).origin) throw new Error('Retorno fora do ambiente de teste local.');
        link = href;
        return true;
      }
      return false;
    }, { timeout: 12000 }).toBe(true);
    try { await target.goto(link); } catch { throw new Error('Não foi possível abrir o link local.'); }
  }
  try {
    await page.goto('/conta?next=' + encodeURIComponent(invitation));
    await field(page,'Nome').fill('Pessoa de teste');
    await field(page,'E-mail').fill(email);
    await field(page,'Senha').fill(password);
    await access(page).getByRole('button', {name:'Criar conta'}).click();
    await expect(page.getByRole('dialog', { name: 'Confirmar e-mail' })).toBeVisible();
    await expect(page).toHaveURL(/\/conta\/confirmar-email\?next=/);
    const previous = new Set();
    await expect.poll(async () => {
      for (const item of await messages()) previous.add(item.ID);
      return previous.size;
    }).toBe(1);
    const confirmation = page.getByRole('dialog', { name: 'Confirmar e-mail' });
    await expect(field(confirmation, 'E-mail da conta')).toHaveValue(email);
    // O ambiente local aceita outro e-mail após 1 s; a pausa garante que o teste mede reenvio.
    await new Promise(resolve => setTimeout(resolve, 1100));
    await confirmation.getByRole('button', { name: 'Reenviar confirmação' }).click();
    await expect(confirmation.getByRole('status')).toContainText('Enviamos a confirmação');
    await openEmail('signup', page, previous);
    await expect(page).toHaveURL(invitation);
    await page.goto('/configuracoes/conta');
    await expect(page.getByRole('heading',{name:'Pessoa de teste'})).toBeVisible();
    const renewed = page.waitForResponse(response => response.url().includes('grant_type=refresh_token') && response.ok());
    await page.evaluate(() => {
      const key = 'nos-angular-preview-session';
      const session = JSON.parse(localStorage.getItem(key));
      session.expires_at = 1;
      localStorage.setItem(key, JSON.stringify(session));
    });
    await page.reload();
    await renewed;
    await expect(page.getByRole('heading',{name:'Pessoa de teste'})).toBeVisible();
    await page.getByRole('button',{name:'Sair da conta'}).click();
    await expect(field(page,'Senha')).toBeVisible();
    await page.goto('/conta/recuperar?next=' + encodeURIComponent(invitation));
    const dialog = page.getByRole('dialog',{name:'Recuperar acesso'});
    await field(dialog,'E-mail da conta').fill(email);
    await dialog.getByRole('button',{name:'Enviar instruções'}).click();
    await expect(dialog.getByRole('status')).toContainText('Enviamos as instruções');
    const recovery = await page.context().newPage();
    await openEmail('recovery', recovery);
    await expect(recovery).toHaveURL(/\/conta\/nova-senha\?next=/);
    if (process.env.NOS_ACCESS_CAPTURE === '1') {
      mkdirSync('artifacts/angular-a03',{recursive:true});
      await recovery.screenshot({path:'artifacts/angular-a03/redefinir-'+info.project.name+'.png',scale:'css'});
    }
    await field(recovery,'Nova senha').fill(newPassword);
    await field(recovery,'Confirmar senha').fill(newPassword);
    await recovery.getByRole('button',{name:'Salvar nova senha'}).click();
    await expect(recovery.getByRole('status')).toContainText('Senha atualizada');
    await field(recovery,'E-mail').fill(email);
    await field(recovery,'Senha').fill(newPassword);
    await access(recovery).getByRole('button',{name:'Entrar',exact:true}).click();
    await expect(recovery).toHaveURL(invitation);
    await recovery.close();
  } finally {
    const users = (await admin.auth.admin.listUsers({ page: 1, perPage: 1000 })).data?.users ?? [];
    const user = users.find(item => item.email === email);
    if (user && (await admin.auth.admin.deleteUser(user.id)).error) throw new Error('Falha na limpeza da conta de teste.');
    const list = await messages();
    if (list.length) await fetch(box + '/api/v1/messages',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({IDs:list.map(item=>item.ID)})});
  }
});

test('permite abrir ajuda, valida o retorno e informa indisponibilidade do Auth', async ({page}, info) => {
  await page.goto('/conta?modo=login&next=' + encodeURIComponent('https://example.test'));
  const recover = page.getByRole('link',{name:'Esqueci minha senha'});
  await recover.click();
  const dialog = page.getByRole('dialog',{name:'Recuperar acesso'});
  await expect(dialog).toBeVisible();
  expect(new URL(page.url()).searchParams.has('next')).toBe(false);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(page).toHaveURL(/\/conta\?modo=login$/);
  await page.route('**/auth/v1/token?grant_type=password',route=>route.fulfill({status:503,body:'Serviço indisponível'}));
  await field(page,'E-mail').fill('indisponivel@example.test');
  await field(page,'Senha').fill('Aa1!exemplo');
  await access(page).getByRole('button',{name:'Entrar',exact:true}).click();
  await expect(page.getByRole('alert')).toContainText('serviço de autenticação');
  await page.goto('/auth/callback?error=access_denied&next=' + encodeURIComponent(invitation));
  await expect(page.getByRole('status').filter({hasText:'acesso foi cancelado'})).toBeVisible();
  expect(new URL(page.url()).searchParams.get('next')).toBe(invitation);
  await page.goto('/conta/nova-senha');
  await expect(page.getByRole('alert')).toContainText('link de recuperação');
  await expect(field(page,'Nova senha')).toHaveCount(0);

  if(process.env.NOS_ACCESS_CAPTURE === '1'){
    const output='artifacts/angular-a03';
    mkdirSync(output,{recursive:true});
    for(const [name,path] of [['criar','/conta'],['entrar','/conta?modo=login'],['confirmar','/conta/confirmar-email'],['recuperar','/conta/recuperar'],['boas-vindas','/boas-vindas']]){
      await page.goto(path);
      await expect(page.getByRole('heading',{level:1})).toBeAttached();
      const modal=page.getByRole('dialog');
      if(['confirmar','recuperar'].includes(name)) await expect(modal).toBeVisible();
      await page.screenshot({path:output+'/'+name+'-'+info.project.name+'.png',scale:'css'});
    }
  }
});
