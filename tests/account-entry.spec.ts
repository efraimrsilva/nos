import { expect, test } from "@playwright/test";

test("entrada raiz apresenta Conta primeiro", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/conta$/);
  await expect(page.getByRole("heading", { name: "Sua conta no Nós" })).toBeVisible();
});

test("entrada afetiva opcional conduz a cadastro e login sem esperar", async ({ page }) => {
  await page.goto("/boas-vindas");
  await expect(page.getByRole("heading", { name: "nós." })).toBeVisible();
  await page.getByRole("link", { name: "Entrar na minha conta" }).click();
  await expect(page.getByRole("button", { name: "Entrar", exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Conheça o Nós" }).click();
  await page.getByRole("link", { name: "Começar agora" }).click();
  await expect(page.locator("form").getByRole("button", { name: "Criar conta", exact: true })).toBeVisible();
});

test("recuperação valida e-mail e informa serviço ausente sem simular envio", async ({ page }) => {
  await page.goto("/conta");
  await page.getByRole("link", { name: "Esqueci minha senha" }).click();
  await expect(page.getByRole("heading", { name: "Recuperar acesso" })).toBeVisible();
  await page.getByRole("button", { name: "Solicitar link" }).click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText("e-mail válido");
  await page.getByLabel("E-mail da conta").fill("ana@example.com");
  await page.getByRole("button", { name: "Solicitar link" }).click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText("autenticação ainda não está configurada");
});

test("nova senha exige prova de recuperação e oferece reiniciar", async ({ page }) => {
  await page.goto("/conta/nova-senha");
  await expect(page.getByRole("heading", { name: "Redefinir senha" })).toBeVisible();
  await expect(page.getByLabel("Nova senha", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("main").getByRole("alert")).toContainText("link de recuperação");
  await page.getByRole("link", { name: "Solicitar outro link" }).click();
  await expect(page).toHaveURL(/\/conta\/recuperar/);
});

test("retorno inválido remove credenciais e não autoriza recuperação", async ({ page }) => {
  await page.goto("/auth/recovery?token_hash=segredo&type=recovery&next=https://example.com");
  await expect(page).toHaveURL(/\/conta\/nova-senha\?erro=link$/);
  expect(page.url()).not.toContain("segredo");
  await expect(page.getByLabel("Nova senha", { exact: true })).toHaveCount(0);
});

test("confirmação visual oferece reenvio validado e retorno para Conta", async ({ page }) => {
  await page.goto("/conta/confirmar-email");
  await expect(page.getByRole("heading", { name: "Confirmar e-mail" })).toBeVisible();
  await page.getByRole("button", { name: "Reenviar confirmação" }).click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText("e-mail válido");
  await page.getByRole("link", { name: "Voltar para Conta" }).click();
  await expect(page).toHaveURL(/\/conta$/);
});

test("retorno de convite acompanha acesso e recuperação sem aceitar automaticamente", async ({ page }) => {
  await page.goto("/conta?next=%2Fcomecar%2Fconvite");
  await expect(page.locator('input[name="next"]')).toHaveValue("/comecar/convite");
  await page.getByRole("link", { name: "Esqueci minha senha" }).click();
  await expect(page.locator('input[name="next"]')).toHaveValue("/comecar/convite");
});
