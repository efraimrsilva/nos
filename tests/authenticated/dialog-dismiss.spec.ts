import { test, expect } from './fixtures';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
const gallery=path.resolve(process.env.NOS_DIALOG_DISMISS_GALLERY || 'artifacts/regression-captures/dialog-dismiss');
test('notificações, conta e Mais fecham por fora; somente o modal superior é fechado', async ({ page }, info) => {
 mkdirSync(gallery,{recursive:true});
 await page.goto('/nucleos');
 const dismiss=async()=>info.project.name==='mobile'?page.touchscreen.tap(2,2):page.mouse.click(2,2);
 await page.getByRole('button',{name:'Notificações — esboço'}).click();
 const notices=page.getByRole('dialog',{name:'Novidades, no seu tempo.',exact:true});
 await expect(notices).toBeVisible();await dismiss();await expect(notices).toBeHidden();
 await expect(page.getByRole('button',{name:'Notificações — esboço'})).toBeFocused();
 if(info.project.name==='mobile'){
  await page.getByRole('button',{name:'Mais áreas e preferências'}).click();
  const menu=page.getByRole('dialog',{name:'Todos os seus caminhos',exact:true});
  await menu.getByRole('button',{name:/Recuperar acesso/}).click();
  const inner=page.getByRole('dialog',{name:'Recuperar acesso',exact:true});
  await inner.screenshot({path:path.join(gallery,'depois-app-modal-mobile.png'),animations:'disabled'});
  await dismiss();await expect(inner).toBeHidden();await expect(menu).toBeVisible();
  await dismiss();await expect(menu).toBeHidden();
 }else{
  await page.getByRole('button',{name:'Abrir Conta, Preferências e Ajuda'}).click();
  const popover=page.locator('.account-popover:popover-open');
  await popover.getByRole('button',{name:/Recuperar acesso/}).click();
  const inner=page.getByRole('dialog',{name:'Recuperar acesso',exact:true});
  await inner.screenshot({path:path.join(gallery,'depois-app-modal-desktop.png'),animations:'disabled'});
  await dismiss();await expect(inner).toBeHidden();await expect(popover).toBeVisible();
  await dismiss();await expect(popover).toBeHidden();
 }
 await page.goto('/conta');
 const trigger=page.locator('.account-workspace').getByRole('button',{name:/Apagar minha conta/});
 await trigger.click();
 await expect(page.getByRole('dialog',{name:'Apagar minha conta',exact:true})).toBeVisible();
 await dismiss();
 await expect(page.getByRole('dialog',{name:'Apagar minha conta',exact:true})).toBeHidden();
 await expect(trigger).toBeFocused();
});
