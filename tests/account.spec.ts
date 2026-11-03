import { expect, test } from "@playwright/test";

test("mostrar senha funciona por toque e reinicia ao trocar o formulário", async ({ page, isMobile }) => {
  await page.goto("/conta?modo=login");
  const password = page.getByLabel("Senha", { exact: true });
  await password.fill("Exemplo1!teste");
  const show = page.getByRole("button", { name: "Mostrar senha", exact: true });
  await expect(show).toBeVisible();
  if (isMobile) await show.tap();
  else await show.click();
  await expect(password).toHaveAttribute("type", "text");
  await expect(password).toHaveValue("Exemplo1!teste");
  await page.getByRole("button", { name: "Ocultar senha", exact: true }).click();
  await expect(password).toHaveAttribute("type", "password");
  await show.click();
  await page.getByRole("button", { name: "Criar conta", exact: true }).first().click();
  await expect(password).toHaveAttribute("type", "password");
  await expect(password).toHaveValue("");
});

test("cadastro valida os campos antes de tentar autenticar", async ({ page }) => {
  await page.goto("/conta");
  await expect(page.getByRole("heading", { name: "Sua conta no Nós" })).toBeVisible();
  await page.locator("form").getByRole("button", { name: "Criar conta" }).click();
  await expect(page.locator("form").getByRole("alert")).toContainText("Informe seu nome, e-mail e uma senha");
  await page.getByRole("textbox", { name: "Nome" }).fill("Ana");
  await page.getByRole("textbox", { name: "E-mail" }).fill("ana@example.com");
  await page.getByLabel("Senha", { exact: true }).fill("senha-curta");
  await page.locator("form").getByRole("button", { name: "Criar conta" }).click();
  await expect(page.locator("form").getByRole("alert")).toContainText("8 caracteres");
});

test("sem serviço configurado, a conta não é simulada", async ({ page }) => {
  await page.goto("/conta");
  await page.getByRole("textbox", { name: "Nome" }).fill("Ana");
  await page.getByRole("textbox", { name: "E-mail" }).fill("ana@example.com");
  await page.getByLabel("Senha", { exact: true }).fill("SenhaSegura1!");
  await page.locator("form").getByRole("button", { name: "Criar conta" }).click();
  await expect(page.locator("form").getByRole("alert")).toContainText("autenticação ainda não está configurada");
  await expect(page).toHaveURL(/\/conta$/);
  await expect(page.getByLabel("Senha", { exact: true })).toHaveValue("");
});

test("alterna para entrada e mantém a página acessível em 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto("/conta");
  await page.getByRole("button", { name: "Já tenho conta" }).click();
  await expect(page.getByRole("button", { name: "Entrar" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("trocar o modo remove mensagens da tentativa anterior", async ({ page }) => {
  await page.goto("/conta");
  await page.locator("form").getByRole("button", { name: "Criar conta" }).click();
  await expect(page.locator("form").getByRole("alert")).toBeVisible();
  await page.getByRole("button", { name: "Já tenho conta" }).click();
  await expect(page.locator("form").getByRole("alert")).toHaveCount(0);
});

test("link de confirmação inválido explica o erro sem expor o token", async ({ page }) => {
  await page.goto("/auth/confirm?token_hash=segredo&type=email");
  await expect(page).toHaveURL(/\/conta\?erro=confirmacao$/);
  await expect(page.getByRole("main").getByRole("alert")).toContainText("Não foi possível confirmar o e-mail");
  await expect(page.getByRole("link", { name: "Solicite outro link de confirmação" })).toBeVisible();
  expect(page.url()).not.toContain("segredo");
});
