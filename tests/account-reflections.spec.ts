import { expect, test } from "@playwright/test";
import { reflectionPhrases as sourcePhrases } from "../src/features/onboarding/reflection-phrases";

test.beforeEach(async ({ page }) => {
  test.setTimeout(120_000);
  await page.clock.install();
  await page.goto("/conta");
  await expect(page.locator("[data-reflection-phrase]")).toHaveCount(1);
  await page.clock.pauseAt(new Date(Date.now() + 1000));
});

test("Conta percorre todas as frases sem números nem repetição e troca a cada 10 segundos", async ({ page }) => {
  const phrase = page.locator("[data-reflection-phrase]");
  const seen: string[] = [];
  for (let index = 0; index < sourcePhrases.length; index++) {
    const current = await phrase.innerText();
    expect(current).not.toMatch(/^\d{3}\. /);
    seen.push(current);
    if (index < sourcePhrases.length - 1) await page.clock.runFor(10_000);
  }
  expect(new Set(seen).size).toBe(sourcePhrases.length);
  expect([...seen].sort()).toEqual([...sourcePhrases].sort());
  // O segundo ciclo também percorre a lista completa, sem repetir na fronteira.
  const last = seen.at(-1);
  await page.clock.runFor(10_000);
  const nextCycle: string[] = [];
  expect(await phrase.innerText()).not.toBe(last);
  for (let index = 0; index < sourcePhrases.length; index++) {
    nextCycle.push(await phrase.innerText());
    if (index < sourcePhrases.length - 1) await page.clock.runFor(10_000);
  }
  expect(new Set(nextCycle).size).toBe(sourcePhrases.length);
  expect([...nextCycle].sort()).toEqual([...sourcePhrases].sort());
  expect(nextCycle).not.toEqual(seen);
  await expect(phrase).toHaveCount(1);
});

test("a próxima frase só aparece após 10 segundos", async ({ page }) => {
  // Recarregar com o relógio parado inicia um período sem avanço durante a navegação.
  await page.reload();
  const phrase = page.locator("[data-reflection-phrase]");
  await expect(phrase).toHaveCount(1);
  const original = await phrase.innerText();
  await page.clock.runFor(9_999);
  await expect(phrase).toHaveText(original);
  await page.clock.runFor(1);
  await expect(phrase).not.toHaveText(original);
});

test("pausar conserva a frase e o tempo restante do indicador", async ({ page }) => {
  const phrase = page.locator("[data-reflection-phrase]");
  const original = await phrase.innerText();
  await page.getByRole("button", { name: "Pausar frases" }).click();
  await page.clock.runFor(20_000);
  await expect(phrase).toHaveText(original);
  await expect(page.locator(".reflection-progress")).toHaveCSS("animation-play-state", "paused");
  await page.getByRole("button", { name: "Retomar frases" }).click();
  await page.clock.runFor(10_000);
  await expect(phrase).not.toHaveText(original);
});

test("recarregar sorteia uma nova ordem e movimento reduzido remove animações", async ({ page }) => {
  const phrase = page.locator("[data-reflection-phrase]");
  const firstRun: string[] = [];
  for (let index = 0; index < 3; index++) {
    firstRun.push(await phrase.innerText());
    await page.clock.runFor(10_000);
  }
  await page.reload();
  await expect(phrase).toHaveCount(1);
  const secondRun: string[] = [];
  for (let index = 0; index < 3; index++) {
    secondRun.push(await phrase.innerText());
    await page.clock.runFor(10_000);
  }
  expect(secondRun).not.toEqual(firstRun);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(phrase).toHaveCSS("animation-name", "none");
  await expect(page.locator(".reflection-progress")).toHaveCSS("animation-name", "none");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
