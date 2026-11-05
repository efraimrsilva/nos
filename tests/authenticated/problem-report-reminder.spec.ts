import { test, expect } from "./fixtures";
import { mkdirSync } from "node:fs";
import path from "node:path";

const gallery = path.resolve("Documentacao_Projeto_Nos/wireframes/comparacoes/v3.7.2-2026-11-05-lembrete-suporte-tela_12-tela_66-tela_70");

test("lembrete autenticado preserva o minuto entre telas, expira e abre o relato", async ({ page, account }, info) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const start = new Date();
  await page.clock.install({ time: start });
  await page.clock.pauseAt(new Date(start.getTime() + 1000));
  await page.goto("/conta");
  await expect(page.locator(".account-workspace")).toBeVisible();
  const header = page.locator(".current-header-actions");
  const report = header.getByRole("button", { name: "Relatar um problema", exact: true });
  await expect(report).toBeEnabled();
  mkdirSync(gallery, { recursive: true });
  if (process.env.NOS_REMINDER_BEFORE === "1") {
    await page.screenshot({ path: path.join(gallery, "antes-app-"+info.project.name+".png"), animations: "disabled" });
  } else {
    await page.screenshot({ path: path.join(gallery, "antes-minuto-app-"+info.project.name+".png"), animations: "disabled" });
  }

  // Mede a transição CSS real do botão. O relógio da página controla o lembrete, não a animação.
  async function verifyWidthTransition(expanding: boolean) {
    const widths = await report.evaluate(button => {
      getComputedStyle(button).width;
      const transition = button.getAnimations().find(animation => animation instanceof CSSTransition && animation.transitionProperty === "width");
      if (!transition) return null;
      const duration = Number(transition.effect?.getTiming().duration);
      const sample = (time: number) => {
        transition.currentTime = time;
        return button.getBoundingClientRect().width;
      };
      const widths = [sample(0), sample(duration / 3), sample(duration)];
      transition.finish();
      return widths;
    });
    expect(widths, expanding ? "expansão animada" : "recolhimento animado").not.toBeNull();
    const [start, middle, end] = widths!;
    expect(expanding ? start < middle && middle < end : start > middle && middle > end).toBe(true);
  }

  await page.evaluate(() => window.scrollTo({ top: 300, behavior: "instant" }));
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  expect((await page.locator(".current-header").boundingBox())!.y).toBe(0);

  const expanded = header.locator('.problem-report-anchor[data-reminder-visible="true"]');
  await page.clock.runFor(30_000);
  await expect(expanded).toBeHidden();
  await page.clock.resume();
  await page.goto("/nucleos");
  await expect(report).toBeEnabled();
  const now = await page.evaluate(() => Date.now());
  await page.clock.pauseAt(new Date(now + 100));
  const paused = await page.evaluate(() => Date.now());
  await page.clock.runFor(start.getTime() + 60_999 - paused);
  await expect(expanded).toBeHidden();
  await page.clock.runFor(1);
  await expect(expanded).toBeVisible();
  await verifyWidthTransition(true);
  const box = (await report.boundingBox())!;
  expect(box.width).toBeGreaterThan(180);
  expect(box.x).toBeGreaterThanOrEqual(0);
  await report.focus();
  await page.screenshot({ path: path.join(gallery, "depois-app-"+info.project.name+".png"), animations: "disabled" });
  await page.clock.runFor(9_999);
  await expect(expanded).toBeVisible();
  await page.clock.runFor(1);
  await expect(expanded).toBeHidden();
  await verifyWidthTransition(false);
  await expect(report).toBeFocused();
  expect((await report.boundingBox())!.width).toBe(30);
  await page.clock.resume();
  await page.reload();
  await expect(report).toBeEnabled();
  await page.clock.fastForward(60_000);
  await expect(expanded).toBeHidden();

  // Nova aba com a mesma conta tem uma sessão de navegação própria.
  const other = await page.context().newPage();
  await other.emulateMedia({ reducedMotion: "reduce" });
  await other.clock.install({ time: start });
  await other.clock.pauseAt(new Date(start.getTime() + 1000));
  await other.goto("/conta");
  await expect(other.locator(".current-header-actions").getByRole("button", { name: "Relatar um problema" })).toBeEnabled();
  await other.evaluate(() => {
    Object.defineProperty(document, "visibilityState", { configurable: true, value: "hidden" });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await other.clock.runFor(75_000);
  await expect(other.locator('.problem-report-anchor[data-reminder-visible="true"]')).toHaveCount(0);
  await other.evaluate(() => {
    Reflect.deleteProperty(document, "visibilityState");
    document.dispatchEvent(new Event("visibilitychange"));
  });
  const otherReport = other.locator('.problem-report-anchor[data-reminder-visible="true"]').getByRole("button", { name: "Relatar um problema", exact: true });
  // Retomar o relógio deixa o navegador concluir a transição antes do clique real.
  await other.clock.resume();
  const point = await otherReport.evaluate(button => {
    const rect = button.getBoundingClientRect();
    const x = rect.left + rect.width / 3, y = rect.top + rect.height / 2;
    const hit = document.elementFromPoint(x, y);
    return { x, y, hit: button.contains(hit), element: hit?.className, width: rect.width };
  });
  expect(point.hit, JSON.stringify(point)).toBe(true);
  // Um clique na área do texto comprova que toda a expansão é acionável.
  await other.mouse.click(point.x, point.y);
  const dialog = other.getByRole("dialog", { name: "Relatar um problema", exact: true });
  await expect(dialog.getByLabel("O que aconteceu?", { exact: true })).toBeVisible();
  await dialog.screenshot({ path: path.join(gallery, "depois-modal-app-"+info.project.name+".png"), animations: "disabled" });
  await other.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(other.locator('.problem-report-anchor[data-reminder-visible="true"]')).toHaveCount(0);
  await expect(other.locator(".current-header-actions").getByRole("button", { name: "Relatar um problema", exact: true })).toBeFocused();
  await other.locator(".account-workspace").getByRole("button", { name: /^Sair da conta/ }).click();
  await other.getByRole("dialog", { name: "Sair da conta", exact: true }).locator("form button").click();
  await expect(other.locator(".account-auth-heading")).toBeVisible();
  await expect(other.locator(".problem-report-anchor")).toHaveCount(0);

  await other.goto("/conta?modo=login");
  await other.getByLabel("E-mail", { exact: true }).fill(account.email);
  await other.getByLabel("Senha", { exact: true }).fill(account.password);
  await other.getByRole("button", { name: "Entrar", exact: true }).click();
  await expect(other).toHaveURL(/\/nucleos$/);
  await expect(other.locator(".current-header-actions").getByRole("button", { name: "Relatar um problema" })).toBeEnabled();
  const resumedAt = await other.evaluate(() => Date.now());
  await other.clock.pauseAt(new Date(resumedAt + 100));
  await other.clock.runFor(58_000);
  await expect(otherReport).toBeHidden();
  await other.clock.runFor(2_000);
  await expect(otherReport).toBeVisible();
  await other.close();
});
