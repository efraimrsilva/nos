import { expect, test } from "@playwright/test";

test("entrada por convite valida o código e não simula aceite", async ({ page }) => {
  await page.goto("/comecar/convite");
  await expect(page.getByRole("heading", { name: "Você recebeu um convite?" })).toBeVisible();
  await page.getByRole("button", { name: "Conferir convite" }).click();
  await expect(page.locator("form").getByRole("alert")).toContainText("Informe o código");
  await page.getByRole("textbox", { name: "Código de convite" }).fill("abc");
  await page.getByRole("button", { name: "Conferir convite" }).click();
  await expect(page.locator("form").getByRole("alert")).toContainText("código válido");
  await page.getByRole("textbox", { name: "Código de convite" }).fill("a".repeat(32));
  await page.getByRole("button", { name: "Conferir convite" }).click();
  await expect(page.locator("form").getByRole("alert")).toContainText("serviço ainda não está configurado");
  await expect(page).toHaveURL(/\/comecar\/convite$/);
});
