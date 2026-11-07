import { expect, test } from "@playwright/test";

test("Conta compacta identifica Google e mantém rodapé na base", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 1400 });
  await page.goto("/conta?modo=login");
  await expect(page.getByRole("heading", { name: "Sua conta no Nós", exact: true })).toHaveCount(0);
  await expect(page.getByText("Crie uma conta ou entre para cuidar dos seus Núcleos com privacidade.", { exact: true })).toHaveCount(0);
  const google = page.getByRole("button", { name: "Continuar com Google", exact: true });
  await expect(google.locator("img")).toBeVisible();
  const footer = await page.locator(".public-footer").boundingBox();
  expect(footer!.y + footer!.height).toBeGreaterThanOrEqual(1399);
  expect(footer!.y + footer!.height).toBeLessThanOrEqual(1401);
  await page.screenshot({ path: "artifacts/conta-compacta-desktop.png", fullPage: true });
});

test("troca de modo anima altura sem perder foco ou destino", async ({ page }) => {
  await page.goto("/conta?next=%2Fcomecar%2Fconvite");
  const region = page.locator(".auth-mode-size");
  await expect(region).toBeVisible();
  const before = await region.evaluate(el => el.getBoundingClientRect().height);
  const login = page.getByRole("button", { name: "Já tenho conta", exact: true });
  await login.click();
  await expect(login).toBeFocused();
  await expect(page.locator('#account-name')).toHaveCount(0);
  await expect(region).toHaveCSS("transition-property", "height");
  await expect.poll(() => region.evaluate(el => el.getBoundingClientRect().height)).toBeLessThan(before - 30);
  await expect(page.locator('input[name="next"]').last()).toHaveValue("/comecar/convite");
  await page.getByRole("button", { name: "Criar conta", exact: true }).first().click();
  await expect(page.locator('#account-name')).toBeVisible();
  await expect.poll(() => region.evaluate(el => el.getBoundingClientRect().height)).toBeGreaterThan(before - 2);
});

test("movimento reduzido e mobile preservam formulário e rodapé", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/conta?modo=login");
  await expect(page.locator(".auth-mode-size")).toHaveCSS("transition-duration", "0s");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const footer = await page.locator(".public-footer").boundingBox();
  const button = await page.getByRole("button", { name: "Entrar", exact: true }).boundingBox();
  expect(footer!.y).toBeGreaterThan(button!.y + button!.height);
  await page.screenshot({ path: "artifacts/conta-compacta-mobile.png", fullPage: true });
});
