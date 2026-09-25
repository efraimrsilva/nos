import { expect, test } from "@playwright/test";

const types = [
  ["Casal", "casal"], ["Família", "familia"], ["Irmãos", "irmaos"],
  ["Pais e Filhos", "pais"], ["Amigos", "amigos"], ["Equipes", "equipes"],
  ["Comunidades", "comunidades"], ["Mentorias", "mentorias"], ["Grupos Religiosos", "grupos-religiosos"],
] as const;

test("exige escolha explícita antes de continuar", async ({ page }) => {
  await page.goto("/comecar/tipo");
  await expect(page.getByRole("radio")).toHaveCount(9);
  await expect(page.locator("input:checked")).toHaveCount(0);
  await page.getByRole("button", { name: "Continuar" }).click();
  await expect(page).toHaveURL(/\/comecar\/tipo$/);
  await expect(page.getByRole("radio", { name: "Casal", exact: true })).toBeFocused();
});

test("todos os tipos chegam ao propósito e preservam a escolha ao voltar", async ({ page }) => {
  for (const [name, id] of types) {
    await page.goto("/comecar/tipo");
    await page.getByRole("radio", { name, exact: true }).check();
    await expect(page.locator("input:checked")).toHaveCount(1);
    await page.getByRole("button", { name: "Continuar" }).click();
    await expect(page).toHaveURL(`/comecar/proposito?tipo=${id}`);
    await expect(page.getByText(`Tipo escolhido: ${name}`, { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Esta etapa está sendo preparada" })).toBeVisible();
    await page.reload();
    await page.getByRole("link", { name: /Voltar/ }).click();
    await expect(page.getByRole("radio", { name, exact: true })).toBeChecked();
  }
});

test("troca a escolha por teclado, cabe em 320px e respeita movimento reduzido", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.setViewportSize({ width: 320, height: 568 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/comecar/tipo");
  await page.getByRole("radio", { name: "Casal", exact: true }).focus();
  await page.keyboard.press("Space");
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("radio", { name: "Família", exact: true })).toBeChecked();
  await expect(page.locator("input:checked")).toHaveCount(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(await page.locator(".type-option").first().evaluate(el => getComputedStyle(el).transitionDuration)).toBe("0s");
  expect(errors).toEqual([]);
});

test("entrada ausente, desconhecida ou repetida não avança o fluxo", async ({ page }) => {
  for (const query of ["", "?tipo=desconhecido", "?tipo=casal&tipo=amigos"]) {
    await page.goto(`/comecar/proposito${query}`);
    await expect(page).toHaveURL(/\/comecar\/tipo$/);
    await expect(page.locator("input:checked")).toHaveCount(0);
  }
  await page.goto("/comecar/tipo?tipo=desconhecido");
  await expect(page.locator("input:checked")).toHaveCount(0);
});
