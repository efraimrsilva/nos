import { expect, test } from "@playwright/test";
import { parseTrialDays } from "@/features/agreements/habit-trial-input";

test("duração de teste exige inteiro explícito entre 7 e 30 dias", () => {
  expect(parseTrialDays("7")).toBe(7);
  expect(parseTrialDays("30")).toBe(30);
  for (const value of ["", "6", "31", "7.5", "7e0", "7 dias", ["7"], null]) {
    expect(parseTrialDays(value)).toBeNull();
  }
});

test("confirmação do hábito exige sessão", async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto("/nucleos/11111111-1111-4111-8111-111111111111/acordos/22222222-2222-4222-8222-222222222222/confirmar", { waitUntil: "commit" });
  await expect(page).toHaveURL(/\/conta$/);
});
