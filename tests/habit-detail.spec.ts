import { expect, test } from "@playwright/test";

test("detalhe do hábito exige uma sessão", async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto("/nucleos/11111111-1111-4111-8111-111111111111/acordos/22222222-2222-4222-8222-222222222222", { waitUntil: "commit" });
  await expect(page).toHaveURL(/\/conta\?modo=login&next=/);
});
