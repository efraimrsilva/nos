import { expect, test } from "@playwright/test";

test("rascunho não é renderizado antes de entrar na conta", async ({ page }) => {
  await page.goto("/comecar/proposito?tipo=familia");
  await expect(page.getByRole("heading", { name: "Sua conta no Nós" })).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Nome do Núcleo" })).toHaveCount(0);
  await expect(page.locator('input[name="next"]')).toHaveValue("/comecar/proposito?tipo=familia");
});

test("convite inicial exige uma conta e um Núcleo real", async ({ page }) => {
  await page.goto("/comecar/convite-inicial/11111111-1111-4111-8111-111111111111");
  await expect(page).toHaveURL(/\/conta\?modo=login&next=/);
  await expect(page.getByRole("heading", { name: "Sua conta no Nós" })).toBeVisible();
});

test("resumo do Núcleo exige uma conta", async ({ page }) => {
  await page.goto("/nucleos/11111111-1111-4111-8111-111111111111");
  await expect(page).toHaveURL(/\/conta\?modo=login&next=/);
});
