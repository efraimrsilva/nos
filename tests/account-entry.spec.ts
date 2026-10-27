import { expect, test } from "@playwright/test";

test("Conta informa falha na consulta de sessão sem atribuí-la às credenciais", async ({ page }) => {
  await page.goto("/conta?modo=login&erro=servico&next=%2Fcomecar%2Fconvite");
  await expect(page.getByRole("main").getByRole("alert")).toContainText("Não foi possível conferir sua sessão");
  await expect(page.locator('form:has(input[name="mode"]) input[name="next"]')).toHaveValue("/comecar/convite");
  await expect(page.getByRole("button", { name: "Entrar", exact: true })).toBeVisible();
});

test("entrada raiz apresenta Conta primeiro", async ({ page }) => {
  // A primeira navegação compila Conta no servidor dev; o volume local pode demorar mais que 30s.
  test.setTimeout(90_000);
  await page.goto("/");
  await expect(page).toHaveURL(/\/conta$/);
  await expect(page.getByRole("heading", { name: "Sua conta no Nós" })).toBeVisible();
});

test("entrada afetiva opcional conduz a cadastro e login sem esperar", async ({ page }) => {
  // Boas-vindas também é compilada na primeira abertura; conserva o orçamento da entrada em Conta.
  test.setTimeout(90_000);
  await page.goto("/boas-vindas");
  await expect(page.getByRole("heading", { name: "Fortalecendo os laços que unem quem você ama." })).toBeVisible();
  await page.getByRole("link", { name: "Entrar na minha conta" }).click();
  await expect(page.getByRole("button", { name: "Entrar", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Conheça o Nós" })).toHaveCount(0);
  await page.getByRole("link", { name: "Voltar às boas-vindas" }).click();
  await page.getByRole("link", { name: "Começar agora" }).click();
  await expect(page.locator("form").getByRole("button", { name: "Criar conta", exact: true })).toBeVisible();
});

test("recuperação valida e-mail e informa serviço ausente sem simular envio", async ({ page }) => {
  await page.goto("/conta");
  await page.getByRole("button", { name: "Esqueci minha senha" }).click();
  const dialog = page.getByRole("dialog", { name: "Recuperar acesso", exact: true });
  await expect(page.getByRole("heading", { name: "Recuperar acesso" })).toBeVisible();
  await page.getByRole("button", { name: "Solicitar link" }).click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText("e-mail válido");
  await dialog.getByLabel("E-mail da conta").fill("ana@example.com");
  await page.getByRole("button", { name: "Solicitar link" }).click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText("autenticação ainda não está configurada");
});

test("nova senha exige prova de recuperação e oferece reiniciar", async ({ page }) => {
  await page.goto("/conta/nova-senha");
  await expect(page.getByRole("heading", { name: "Redefinir senha" })).toBeVisible();
  await expect(page.getByLabel("Nova senha", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("main").getByRole("alert")).toContainText("link de recuperação");
  await page.getByRole("link", { name: "Solicitar outro link" }).click();
  await expect(page.getByRole("dialog", { name: "Recuperar acesso", exact: true })).toBeVisible();
});

test("retorno da recuperação abre login e mantém o destino interno", async ({ page }) => {
  for (const route of ["/conta/recuperar", "/conta/nova-senha"]) {
    await page.goto(`${route}?next=%2Fcomecar%2Fconvite`);
    if (route === "/conta/recuperar") {
      const dialog = page.getByRole("dialog", { name: "Recuperar acesso", exact: true });
      await expect(dialog).toBeVisible();
      await dialog.getByRole("button", { name: "Fechar Recuperar acesso" }).click();
      await expect(dialog).not.toBeVisible();
    } else {
      await page.getByRole("link", { name: "Voltar para Conta" }).click();
    }
    await expect(page).toHaveURL(/\/conta\?modo=login&(?:acesso=recovery&)?next=%2Fcomecar%2Fconvite$/);
    await expect(page.getByRole("button", { name: "Entrar", exact: true })).toBeVisible();
    await expect(page.getByLabel("Nome", { exact: true })).toHaveCount(0);
    await expect(page.locator('form:has(input[name="mode"]) input[name="next"]')).toHaveValue("/comecar/convite");
  }
});

test("retorno inválido remove credenciais e não autoriza recuperação", async ({ page }) => {
  await page.goto("/auth/recovery?token_hash=segredo&type=recovery&next=https://example.com");
  await expect(page).toHaveURL(/\/conta\/nova-senha\?erro=link$/);
  expect(page.url()).not.toContain("segredo");
  await expect(page.getByLabel("Nova senha", { exact: true })).toHaveCount(0);
});

test("confirmação visual verifica o e-mail no modal e preserva retorno para Conta", async ({ page }) => {
  await page.goto("/conta/confirmar-email?next=%2Fcomecar%2Fconvite");
  const dialog = page.getByRole("dialog", { name: "Confirmar e-mail", exact: true });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("Vamos verificar se este e-mail já está confirmado");
  await expect(dialog.locator('input[name="next"]')).toHaveValue("/comecar/convite");
  await dialog.getByRole("button", { name: "Reenviar confirmação" }).click();
  await expect(dialog.getByRole("alert")).toContainText("e-mail válido");
  await dialog.getByRole("button", { name: "Fechar Confirmar e-mail" }).click();
  await expect(dialog).not.toBeVisible();
  await expect(page.getByRole("heading", { name: "Sua conta no Nós" })).toBeVisible();
  await expect(page).toHaveURL(/\/conta\?modo=login&acesso=confirmation&next=%2Fcomecar%2Fconvite$/);
});

test("retorno de convite acompanha acesso e recuperação sem aceitar automaticamente", async ({ page }) => {
  await page.goto("/conta?next=%2Fcomecar%2Fconvite");
  await expect(page.locator('form:has(input[name="mode"]) input[name="next"]')).toHaveValue("/comecar/convite");
  await page.getByRole("button", { name: "Esqueci minha senha" }).click();
  await expect(page.getByRole("dialog", { name: "Recuperar acesso", exact: true }).locator('input[name="next"]')).toHaveValue("/comecar/convite");
});
