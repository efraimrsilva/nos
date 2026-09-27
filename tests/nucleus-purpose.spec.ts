import { expect, test } from "@playwright/test";

test("oferece uma sugestão do tipo que pode ser editada", async ({ page }) => {
  await page.goto("/comecar/proposito?tipo=mentorias");
  await expect(page.getByRole("heading", { name: "Qual o propósito de vocês?" })).toBeVisible();
  await expect(page.getByText("Tipo escolhido: Mentorias")).toBeVisible();
  await page.getByRole("button", { name: /Usar sugestão/ }).click();
  await expect(page.getByRole("textbox", { name: "Nosso propósito" })).toHaveValue(/Aprender e crescer/);
  await page.getByRole("textbox", { name: "Nosso propósito" }).fill("Aprender com escuta e respeito.");
  await expect(page.getByRole("textbox", { name: "Nosso propósito" })).toHaveValue("Aprender com escuta e respeito.");
});

test("confere o rascunho sem criar Núcleo nem expor os campos na URL", async ({ page }) => {
  await page.goto("/comecar/proposito?tipo=familia");
  await page.getByRole("textbox", { name: "Nome do Núcleo" }).fill("  ");
  await page.getByRole("textbox", { name: "Nosso propósito" }).fill("  ");
  await page.getByRole("button", { name: "Continuar" }).click();
  await expect(page.getByText("Informe o nome e o propósito para conferir o rascunho.")).toBeVisible();
  await page.getByRole("textbox", { name: "Nome do Núcleo" }).fill("Família Aurora");
  await page.getByRole("textbox", { name: "Nosso propósito" }).fill("Cuidar uns dos outros com respeito.");
  await page.getByRole("button", { name: "Continuar" }).click();
  await expect(page.getByRole("heading", { name: "Confira seu rascunho" })).toBeVisible();
  await expect(page.getByText("Família Aurora")).toBeVisible();
  await expect(page.getByText("Cuidar uns dos outros com respeito.")).toBeVisible();
  await expect(page.getByText(/Nenhum Núcleo foi criado/)).toBeVisible();
  expect(new URL(page.url()).pathname + new URL(page.url()).search).toBe("/comecar/proposito?tipo=familia");
  await page.getByRole("button", { name: "Editar" }).click();
  await expect(page.getByRole("textbox", { name: "Nome do Núcleo" })).toHaveValue("Família Aurora");
});

test("mantém o formulário dentro da tela estreita e volta ao tipo", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/comecar/proposito?tipo=amigos");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole("link", { name: /Voltar/ }).click();
  await expect(page.getByRole("radio", { name: "Amigos", exact: true })).toBeChecked();
});
