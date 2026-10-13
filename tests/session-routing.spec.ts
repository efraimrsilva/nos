import { expect, test } from "@playwright/test";
import { safeAuthNext } from "../src/features/auth/input";

const nucleus = "11111111-1111-4111-8111-111111111111";
const habit = "22222222-2222-4222-8222-222222222222";

test("páginas privadas pedem login antes de renderizar e preservam o destino", async ({ page }) => {
  test.setTimeout(90_000);
  for (const destination of ["/comecar", "/comecar/tipo", "/comecar/proposito?tipo=familia", "/comecar/convite", "/nucleos", `/nucleos/${nucleus}/acordos/${habit}/registrar`]) {
    await page.goto(destination);
    await expect(page.getByRole("heading", { name: "Sua conta no Nós" })).toBeVisible();
    const url = new URL(page.url());
    expect(url.pathname).toBe("/conta");
    expect(url.searchParams.get("modo")).toBe("login");
    await expect(page.locator('input[name="next"]')).toHaveValue(destination);
    await expect(page.getByRole("button", { name: "Entrar", exact: true })).toBeVisible();
  }
});

test("retorno aceita rotas privadas implementadas e rejeita URLs ou parâmetros arbitrários", () => {
  expect(safeAuthNext(`/nucleos/${nucleus}/convites?status=revogados&pagina=2`)).toBe(`/nucleos/${nucleus}/convites?status=revogados&pagina=2`);
  expect(safeAuthNext(`/nucleos/${nucleus}/convites?code=segredo`)).toBe("/nucleos");
  expect(safeAuthNext(`/nucleos/${nucleus}/convites?status=ativos&status=revogados`)).toBe("/nucleos");
  for (const destination of ["/nucleos", `/comecar/convite-inicial/${nucleus}`, `/nucleos/${nucleus}/acordos/${habit}`, `/nucleos/${nucleus}/acordos/${habit}/confirmar`, `/nucleos/${nucleus}/acordos?categoria=habit`, `/comecar/tipo?tipo=familia`]) {
    expect(safeAuthNext(destination)).toBe(destination);
  }
  for (const destination of [undefined, ["/comecar"], "https://example.com", "//example.com", "/nucleos?token=segredo", "/nucleos/../../conta", `/nucleos/${nucleus}/arvore`, `/comecar/proposito?tipo=familia&tipo=casal`]) {
    expect(safeAuthNext(destination)).toBe("/nucleos");
  }
});
