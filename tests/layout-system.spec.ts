import { test, expect } from "@playwright/test";

test("entrada usa a identidade nova e mantém acesso, ajuda e teclado", async ({ page }) => {
  await page.goto("/conta");
  await expect(page.locator("[data-layout='current']")).toBeVisible();
  await expect(page.locator("[data-layout-revision='3']")).toBeVisible();
  await expect(page.locator("main h1")).toHaveCSS("font-family", "Arial, Helvetica, sans-serif");
  await expect(page.locator(".garden-art,.path-card,.surface-panel")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Sua conta no Nós" })).toBeVisible();
  const tree = page.getByRole("img", { name: "Árvore com troncos entrelaçados, símbolo dos vínculos que cultivamos" });
  await expect(tree).toBeVisible();
  expect(await tree.evaluate(image => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  await page.getByRole("button", { name: "Já tenho conta" }).click();
  await expect(page.getByRole("button", { name: "Entrar", exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Esqueci minha senha" }).click();
  await expect(page).toHaveURL(/\/conta\/recuperar/);
  await expect(page.locator("[data-layout='current']")).toBeVisible();
  await expect(page.getByRole("main")).toHaveCount(1);
  await expect(tree).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("nova composição respeita movimento reduzido sem esconder conteúdo", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/boas-vindas");
  await expect(page.locator("[data-layout='current']")).toBeVisible();
  await expect(page.getByRole("link", { name: "Começar agora" })).toBeVisible();
  await expect(page.locator(".account-tree")).toHaveCount(0);
  expect(await page.locator("main").evaluate(el => getComputedStyle(el).animationName)).toBe("none");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
