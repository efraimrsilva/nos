import { expect, test } from '@playwright/test';

test('modal fecha por clique ou toque externo, preserva conteúdo e retorna foco', async ({ page, isMobile }) => {
  await page.goto('/conta');
  const trigger = page.getByRole('button', { name: 'Esqueci minha senha', exact: true });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Recuperar acesso', exact: true });
  await dialog.getByLabel('E-mail da conta').fill('teste@example.test');
  const box = (await dialog.boundingBox())!;
  // O padding faz parte do modal; seleção iniciada dentro também deve permanecer nele.
  await page.mouse.click(box.x + 6, box.y + 6);
  await expect(dialog).toBeVisible();
  if (!isMobile) {
    await page.mouse.move(box.x + 6, box.y + 6);
    await page.mouse.down();
    await page.mouse.move(2, 2);
    await page.mouse.up();
    await expect(dialog).toBeVisible();
  }
  if (isMobile) await page.touchscreen.tap(2, 2);
  else await page.mouse.click(2, 2);
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await expect(dialog.getByLabel('E-mail da conta')).toHaveValue('teste@example.test');
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});

test('diálogos futuros e aninhados recebem o mesmo fechamento sem inscrição individual', async ({ page, isMobile }) => {
  await page.goto('/conta');
  // Representa um novo modal criado depois da hidratação, fora dos componentes atuais.
  await page.evaluate(() => {
    const parent = document.createElement('dialog');
    parent.id = 'future-parent'; parent.innerHTML = '<h2>Modal futuro</h2><button id="future-trigger">Abrir filho</button><dialog id="future-child"><h2>Modal filho</h2><input aria-label="Rascunho do filho"></dialog>';
    document.body.append(parent); parent.showModal();
    const button = parent.querySelector<HTMLButtonElement>('#future-trigger')!;
    button.onclick = () => parent.querySelector<HTMLDialogElement>('#future-child')!.showModal();
  });
  const parent = page.locator('#future-parent'), child = page.locator('#future-child');
  await page.getByRole('button', { name: 'Abrir filho' }).click();
  await expect(child).toBeVisible();
  if (isMobile) await page.touchscreen.tap(2, 2);
  else await page.mouse.click(2, 2);
  await expect(child).toBeHidden();
  await expect(parent).toBeVisible();
  await expect(page.getByRole('button', { name: 'Abrir filho' })).toBeFocused();
  if (isMobile) await page.touchscreen.tap(2, 2);
  else await page.mouse.click(2, 2);
  await expect(parent).toBeHidden();
});
