import { expect, test } from "@playwright/test";

test("rascunho só oferece criação protegida e não cria sem serviço", async ({ page }) => {
  await page.goto("/comecar/proposito?tipo=familia");
  await page.getByRole("textbox", { name: "Nome do Núcleo" }).fill("Família Aurora");
  await page.getByRole("textbox", { name: "Nosso propósito" }).fill("Cuidar com respeito.");
  await page.getByRole("button", { name: "Continuar" }).click();
  await page.getByRole("button", { name: "Criar Núcleo" }).click();
  await expect(page.locator("form").getByRole("alert")).toContainText("serviço ainda não está configurado");
  await expect(page.getByRole("heading", { name: "Confira seu rascunho" })).toBeVisible();
  await expect(page).toHaveURL(/\/comecar\/proposito\?tipo=familia$/);
});

test("convite inicial exige uma conta e um Núcleo real", async ({ page }) => {
  await page.goto("/comecar/convite-inicial/11111111-1111-4111-8111-111111111111");
  await expect(page).toHaveURL(/\/conta$/);
  await expect(page.getByRole("heading", { name: "Sua conta no Nós" })).toBeVisible();
});

test("resumo do Núcleo exige uma conta", async ({ page }) => {
  await page.goto("/nucleos/11111111-1111-4111-8111-111111111111");
  await expect(page).toHaveURL(/\/conta$/);
});
