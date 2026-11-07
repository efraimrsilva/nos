import { expect, test } from "@playwright/test";

test("somente Google aparece no cadastro e no login", async ({ page }) => {
  await page.goto("/conta?next=%2Fcomecar%2Fconvite");
  const providers = page.getByRole("group", { name: "Outras formas de acesso" });
  await expect(providers.getByRole("button")).toHaveText(["Continuar com Google"]);
  await page.getByRole("button", { name: "Já tenho conta", exact: true }).click();
  await expect(providers.getByRole("button")).toHaveText(["Continuar com Google"]);
  await expect(page.locator('form:has(input[name="mode"]) input[name="next"]')).toHaveValue("/comecar/convite");
});

test("provedor indisponível informa erro e mantém o destino do convite", async ({ page }) => {
  await page.goto("/conta?next=%2Fcomecar%2Fconvite");
  for (const name of ["Continuar com Google"]) {
    await page.getByRole("button", { name, exact: true }).click();
    await expect(page.getByRole("main").getByRole("alert")).toContainText("ainda não está disponível");
    await expect(page).toHaveURL(/next=%2Fcomecar%2Fconvite/);
  }
});

test("callback cancelado retorna ao login preservando o convite sem refletir erro externo", async ({ request }) => {
  const response = await request.get("/auth/callback?error=access_denied&error_description=conteudo-externo&next=%2Fcomecar%2Fconvite", { maxRedirects: 0 });
  expect(response.status()).toBe(307);
  expect(response.headers().location).toMatch(/\/conta\?modo=login&erro=social-cancelado&next=%2Fcomecar%2Fconvite$/);
  expect(response.headers()["cache-control"]).toContain("no-store");
});

test("callback inválido impede retorno externo e mostra opção de tentar novamente", async ({ page }) => {
  await page.goto("/auth/callback?next=https://example.test");
  await expect(page).toHaveURL(/\/conta\?modo=login&erro=social$/);
  await expect(page.getByRole("alert")).toContainText("Não foi possível concluir");
  await expect(page.getByRole("button", { name: "Continuar com Google" })).toBeVisible();
});
