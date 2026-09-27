import { expect, test } from "@playwright/test";

test("escolher caminho leva às próximas etapas e permite voltar", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Como você quer começar?" })).toBeVisible();
  await page.getByRole("link", { name: /Criar um núcleo/ }).click();
  await expect(page).toHaveURL(/\/comecar\/tipo$/);
  await expect(page.getByRole("heading", { name: "Que relação vocês têm?" })).toBeVisible();
  await page.getByRole("link", { name: /Voltar/ }).click();
  await page.getByRole("link", { name: /Entrar com um convite/ }).click();
  await expect(page).toHaveURL(/\/comecar\/convite$/);
  await expect(page.getByRole("heading", { name: "Você recebeu um convite?" })).toBeVisible();
  await page.getByRole("link", { name: /Voltar/ }).click();
  await expect(page.getByRole("heading", { name: "Como você quer começar?" })).toBeVisible();
});

test("primeira tela acessível por teclado e sem rolagem horizontal", async ({ page }) => {
  await page.goto("/comecar");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Pular para o conteúdo" })).toBeFocused();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: /Criar um núcleo/ })).toBeFocused();
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("acomoda telas de 320px e mantém cabeçalhos defensivos", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  const response = await page.goto("/comecar");
  await expect(page.getByRole("link", { name: /Entrar com um convite/ })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  expect(response?.headers()["x-content-type-options"]).toBe("nosniff");
  expect(response?.headers()["x-frame-options"]).toBe("DENY");
  expect(errors).toEqual([]);
});

test("convite abre diretamente sem criar dados nem simular autenticação", async ({ page }) => {
  for (const route of ["/comecar/convite"]) {
    await page.goto(route);
    await expect(page.getByRole("textbox", { name: "Código de convite" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Aceitar convite" })).toHaveCount(0);
    await expect(page.getByRole("link", { name: /Voltar/ })).toHaveAttribute("href", "/comecar");
  }
});
