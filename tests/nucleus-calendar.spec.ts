import { expect, test } from "@playwright/test";

test("agenda não expõe eventos sem sessão autenticada", async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto("/nucleos/11111111-1111-4111-8111-111111111111/agenda", { waitUntil: "commit" });
  await expect(page).toHaveURL(/\/conta\?modo=login&next=/);
  await expect(page.getByRole("heading", { name: "Agenda do Núcleo" })).toHaveCount(0);
});
