import {test,expect} from './fixtures';

test('menu da conta reutiliza animação da página e respeita movimento reduzido',async({page},info)=>{
 test.skip(info.project.name==='mobile','No celular, o perfil abre a página de Conta.');
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.goto('/nucleos');await expect(page.getByRole('heading',{name:'Seus Núcleos',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Abrir Conta, Preferências e Ajuda',exact:true}).click();
 const popover=page.locator('.account-popover:popover-open');
 const first=popover.locator('.account-preferences-sections>.account-panel').first();
 await expect(first).toHaveCSS('animation-name','account-preferences-arrive');
 const menuAnimation=await first.evaluate(node=>({name:getComputedStyle(node).animationName,duration:getComputedStyle(node).animationDuration,delay:getComputedStyle(node).animationDelay}));
 await page.keyboard.press('Escape');
 await page.getByRole('button',{name:'Abrir Conta, Preferências e Ajuda',exact:true}).click();
 await expect(first).toHaveCSS('animation-name','account-preferences-arrive');
 expect(await first.evaluate(node=>node.getAnimations().some(animation=>animation.playState==='running'))).toBe(true);
 await page.emulateMedia({reducedMotion:'reduce'});await expect(first).toHaveCSS('animation-name','none');
 await page.goto('/conta');await page.emulateMedia({reducedMotion:'no-preference'});
 const route=page.locator('.account-workspace .account-preferences-sections>.account-panel').first();
 expect(await route.evaluate(node=>({name:getComputedStyle(node).animationName,duration:getComputedStyle(node).animationDuration,delay:getComputedStyle(node).animationDelay}))).toEqual(menuAnimation);
});

test('Apagar minha conta mantém efeito vermelho radiante em todos os temas',async({page},info)=>{
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.goto('/conta');
 const root=page.locator('.account-workspace');
 const button=root.locator('.account-deletion-trigger');const row=button.locator('.account-row');
 for(const theme of ['light','dark','black','rose','lavender','ocean','forest','solar','neon']){
   await page.evaluate(value=>{document.documentElement.dataset.theme=value},theme);
   await button.hover();await expect(row).toHaveCSS('border-top-color','rgb(255, 40, 70)');
   await expect(row.locator('.account-row-icon')).toHaveCSS('color','rgb(255, 40, 70)');
   await button.focus();await expect(row).toHaveCSS('border-top-color','rgb(255, 40, 70)');
   expect(await row.evaluate(node=>getComputedStyle(node).boxShadow)).toContain('255, 40, 70');
   if(['light','black','neon'].includes(theme))await row.screenshot({path:`artifacts/delete-account-red-${theme}-${info.project.name}.png`});
 }
 await page.emulateMedia({reducedMotion:'reduce'});await expect(row).toHaveCSS('transition-duration','0s');
 await expect(row).toHaveCSS('border-top-color','rgb(255, 40, 70)');
 await expect(root.getByRole('dialog',{name:'Apagar minha conta',exact:true})).not.toBeVisible();
});
