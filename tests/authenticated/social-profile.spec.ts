import { mkdirSync } from "node:fs";
import path from "node:path";
import { test, expect, localSql } from "./fixtures";

test("conta sem nome completa perfil e retorna ao destino do convite", async ({ page, account }, info) => {
  const gallery = path.resolve("Documentacao_Projeto_Nos/wireframes/comparacoes/v3.9.0-2026-11-06-login-social-tela_01-tela_02");
  mkdirSync(gallery, { recursive: true });
  await page.goto("/conta?completar=nome&next=%2Fcomecar%2Fconvite");
  await expect(page.getByRole("heading", { name: "Como podemos chamar você?" })).toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.screenshot({ path: path.join(gallery, `app-completar-nome-${info.project.name}.png`), fullPage: true });
  await page.getByRole("textbox", { name: "Nome", exact: true }).fill("   ");
  await page.getByRole("button", { name: "Salvar e continuar" }).click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText("1 a 80");
  await page.getByRole("textbox", { name: "Nome", exact: true }).fill("  Pessoa Social  ");
  await page.getByRole("button", { name: "Salvar e continuar" }).click();
  await expect(page).toHaveURL(/\/comecar\/convite$/);
  expect(localSql(`select raw_user_meta_data->>'name' from auth.users where id='${account.id}'`).trim()).toBe("Pessoa Social");
  await page.goto("/conta?completar=nome");
  await expect(page.getByRole("heading", { name: "Como podemos chamar você?" })).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("complemento não salva nome quando o envio chega sem sessão", async ({ page, request, account }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/conta?completar=nome&next=%2Fcomecar%2Fconvite");
  await expect(page.getByRole("heading", { name: "Como podemos chamar você?" })).toBeVisible();
  await page.getByRole("textbox", { name: "Nome", exact: true }).fill("Sem sessão");
  // O contexto HTTP isolado envia o formulário real sem cookies; route.continue
  // não permite sobrescrever o Cookie que o navegador adiciona automaticamente.
  await page.route("**/conta?completar=nome**", async route => {
    const original = route.request();
    if (original.method() !== "POST" || !original.postData()?.includes("Sem sessão")) return route.continue();
    const headers = { ...route.request().headers() };
    delete headers.cookie;
    const result = await request.post(original.url(), { headers, data: original.postDataBuffer()! });
    await route.fulfill({ response: result });
  });
  const response = page.waitForResponse(item => item.request().postData()?.includes("Sem sessão") === true);
  await page.getByRole("button", { name: "Salvar e continuar" }).click();
  await response;
  await expect.poll(async () => await page.getByRole("main").getByRole("alert").filter({ hasText: "sessão" }).isVisible() || await page.getByRole("heading", { name: "Sua conta no Nós" }).isVisible()).toBe(true);
  expect(localSql(`select coalesce(raw_user_meta_data->>'name','') from auth.users where id='${account.id}'`).trim()).toBe("");
});
