import { expect, test } from "@playwright/test";
import { safeAuthNext } from "../src/features/auth/input";
const nucleus = "11111111-1111-4111-8111-111111111111";

const destinations = ["/configuracoes", "/configuracoes/privacidade", "/configuracoes/conta", "/ajuda", `/nucleos/${nucleus}/sair`, `/nucleos/${nucleus}/pessoas`];

test("controles preservam apenas destinos implementados, sem parâmetros privados", () => {
  for (const destination of destinations) {
    expect(safeAuthNext(destination)).toBe(destination);
    expect(safeAuthNext(`${destination}?token=segredo`)).toBe("/nucleos");
  }
  expect(safeAuthNext("/configuracoes/excluir")).toBe("/nucleos");
  expect(safeAuthNext(`/nucleos/${nucleus}/pessoas`)).toBe(`/nucleos/${nucleus}/pessoas`);
  expect(safeAuthNext(`/nucleos/${nucleus}/pessoas?role=admin`)).toBe("/nucleos");
});

test("controles exigem login e preservam retorno antes de renderizar", async ({ page }) => {
  for (const destination of destinations) {
    await page.goto(destination);
    await expect(page.getByRole("heading", { name: "Sua conta no Nós" })).toBeVisible();
    await expect(page.locator('input[name="next"]')).toHaveValue(destination);
  }
});
