import { expect, test } from "@playwright/test";

test("revisão do hábito exige sessão", async ({ page }) => {
  await page.goto("/nucleos/11111111-1111-4111-8111-111111111111/acordos/22222222-2222-4222-8222-222222222222/revisar");
  await expect(page).toHaveURL(/\/conta$/);
});
