import { test, expect } from '@playwright/test';
test('luzes da Conta aparecem no celular e respeitam movimento reduzido',async({page})=>{
 await page.emulateMedia({reducedMotion:'no-preference'});await page.goto('/conta');
 const lights=page.locator('.account-light-flight');await expect(lights).toHaveCount(8);
 // Ciclos defasados já devem ter luz visível, sem esperar a primeira subida completa.
 await expect.poll(async()=>lights.evaluateAll(nodes=>nodes.some(node=>Number(getComputedStyle(node).opacity)>.3))).toBe(true);
 expect(await lights.first().evaluate(node=>parseFloat(getComputedStyle(node).animationDelay))).toBeLessThan(0);
 await page.locator('.public-story').evaluate(node=>node.getAnimations().forEach(animation=>animation.finish()));
 await page.locator('.account-tree').evaluate(node=>node.getAnimations().forEach(animation=>animation.finish()));
 await page.locator('.account-tree').screenshot({path:`artifacts/account-fireflies-${test.info().project.name}.png`});
 await page.emulateMedia({reducedMotion:'reduce'});await expect(lights.first()).toHaveCSS('animation-name','none');
});
