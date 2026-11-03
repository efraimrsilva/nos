import { test, expect, localSql } from "./fixtures";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const gallery = path.resolve(process.env.NOS_SUPPORT_GALLERY || "artifacts/regression-captures/support");

test("Ajuda oferece relato objetivo sem mostrar destinatário", async ({ page }, info) => {
  await page.goto("/conta");
  mkdirSync(gallery, { recursive: true });
  await page.locator(".account-workspace #ajuda-e-suporte").screenshot({ path: path.join(gallery, `depois-ajuda-${info.project.name}.png`) });
  await page.locator(".account-workspace #ajuda-e-suporte").getByRole("button", { name: /^Relatar um problema/ }).click();
  const dialog = page.getByRole("dialog", { name: "Relatar um problema", exact: true });
  await expect(dialog.getByLabel("O que aconteceu?", { exact: true })).toBeVisible();
  await expect(dialog.getByRole("textbox")).toHaveCount(2);
  await dialog.screenshot({ path: path.join(gallery, `depois-modal-${info.project.name}.png`) });
  await expect(page.locator("body")).not.toContainText("sintagmasoftware@gmail.com");
  expect(await page.locator('[href^="mailto:"]').count()).toBe(0);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
});

test("falha SMTP preserva texto e não apresenta sucesso", async ({ page }) => {
  const container = process.env.NOS_SUPPORT_TEST_CONTAINER;
  test.skip(!container, "Executar com npm run test:problem-reports para isolar a caixa SMTP.");
  if (!/^nos-support-test-\d+$/.test(container!)) throw Error("Contêiner de teste inválido.");
  await page.goto("/conta");
  await page.locator(".account-workspace #ajuda-e-suporte").getByRole("button", { name: /^Relatar um problema/ }).click();
  const dialog = page.getByRole("dialog", { name: "Relatar um problema", exact: true });
  await dialog.getByLabel("O que aconteceu?", { exact: true }).fill("Meu texto deve continuar aqui após uma falha.");
  execFileSync("docker", ["pause", container!], { stdio: "ignore", windowsHide: true });
  try {
    await dialog.getByRole("button", { name: "Enviar relato", exact: true }).click();
    await expect(dialog.getByRole("button", { name: "Enviando…", exact: true })).toBeDisabled();
    await expect(dialog.getByRole("alert")).toContainText("Não foi possível confirmar o envio", { timeout: 30_000 });
    await expect(dialog.getByLabel("O que aconteceu?", { exact: true })).toHaveValue("Meu texto deve continuar aqui após uma falha.");
    await expect(dialog.getByRole("status")).toHaveCount(0);
  } finally { execFileSync("docker", ["unpause", container!], { stdio: "ignore", windowsHide: true }); }
});

test("perfil e Mais oferecem o mesmo formulário e cabeçalho cabe em tela estreita", async ({ page }, info) => {
  await page.goto("/nucleos");
  if (info.project.name === "mobile") await page.getByRole("button", { name: "Mais áreas e preferências" }).click();
  else await page.getByRole("button", { name: "Abrir Conta, Preferências e Ajuda" }).click();
  const menu = info.project.name === "mobile" ? page.locator(".navigation-dialog[open]") : page.locator(".account-popover:popover-open");
  await menu.getByRole("button", { name: /^Relatar um problema/ }).click();
  const dialog = page.getByRole("dialog", { name: "Relatar um problema", exact: true });
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeVisible();
  await page.keyboard.press("Escape");
  if (info.project.name === "mobile") {
    await page.setViewportSize({ width: 320, height: 740 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const box = await page.locator(".current-header-actions .problem-report-header").boundingBox();
    expect(box).toBeTruthy(); expect(box!.x + box!.width).toBeLessThanOrEqual(320);
  }
});

test("cabeçalho envia relato pelo SMTP local e bloqueia nova tentativa por conta", async ({ page, account }) => {
  const text = `Relato temporário de teste ${account.id}`;
  await page.goto("/nucleos?codigo=segredo-que-nao-deve-sair");
  await page.locator(".current-header-actions").getByRole("button", { name: "Relatar um problema", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Relatar um problema", exact: true });
  await dialog.getByLabel("O que aconteceu?", { exact: true }).fill(text);
  await dialog.getByLabel("Como repetir o problema? (opcional)", { exact: true }).fill("Abrir a lista e tentar novamente.");
  const origin = await page.evaluate(() => performance.timeOrigin);
  await dialog.getByRole("button", { name: "Enviar relato", exact: true }).click();
  await expect(dialog.getByRole("status")).toContainText("Relato enviado à equipe.");
  expect(await page.evaluate(() => performance.timeOrigin)).toBe(origin);
  const search = await fetch(`http://127.0.0.1:8026/api/v1/search?query=${encodeURIComponent(account.email)}`).then(response => response.json());
  const message = search.messages.find((item: { Subject: string }) => item.Subject.includes("Relato de problema"));
  expect(message).toBeTruthy();
  const mail = await fetch(`http://127.0.0.1:8026/api/v1/message/${message.ID}`).then(response => response.json());
  expect(mail.Text).toContain(text);
  expect(mail.Text).toContain("Tela: /nucleos");
  expect(mail.Text).not.toContain("segredo-que-nao-deve-sair");
  expect(mail.To[0].Address).toBe("sintagmasoftware@gmail.com");
  expect(mail.ReplyTo[0].Address).toBe(account.email);
  await page.keyboard.press("Escape");
  await page.locator(".current-header-actions").getByRole("button", { name: "Relatar um problema", exact: true }).click();
  await dialog.getByLabel("O que aconteceu?", { exact: true }).fill("Outra tentativa dentro do intervalo.");
  await dialog.getByRole("button", { name: "Enviar relato", exact: true }).click();
  await expect(dialog.getByRole("alert")).toContainText("Aguarde um minuto");
  await expect(dialog.getByLabel("O que aconteceu?", { exact: true })).toHaveValue("Outra tentativa dentro do intervalo.");
  expect(localSql(`select count(*) from public.problem_report_rate_limits where user_id='${account.id}'`).trim()).toBe("1");
});

test("orientação abre modal aninhado; cancelamento fecha só relato e não envia", async ({ page }) => {
  await page.goto("/conta");
  await page.locator(".account-workspace #ajuda-e-suporte").getByRole("button", { name: /^Preciso de orientação/ }).click();
  const help = page.getByRole("dialog", { name: "Ajuda e suporte", exact: true });
  await help.getByRole("button", { name: "Relatar um problema", exact: true }).click();
  const report = page.getByRole("dialog", { name: "Relatar um problema", exact: true });
  await report.getByLabel("O que aconteceu?", { exact: true }).fill("Texto que será cancelado, sem enviar.");
  await page.mouse.click(1, 1);
  await expect(report).not.toBeVisible();
  await expect(help).toBeVisible();
  await help.getByRole("button", { name: "Relatar um problema", exact: true }).click();
  await expect(report.getByLabel("O que aconteceu?", { exact: true })).toHaveValue("");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
