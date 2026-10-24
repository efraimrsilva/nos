import { test, expect } from "./fixtures";
import type { Page } from "@playwright/test";
import { mkdirSync } from "node:fs";
import path from "node:path";

async function openAppearance(page: Page, mobile: boolean) {
  if (mobile) {
    await page.getByRole("button", { name: "Mais áreas e preferências" }).click();
    await page.getByRole("dialog", { name: "Todos os seus caminhos" }).getByRole("button", { name: "Aparência", exact: true }).click();
  } else await page.getByRole("navigation", { name: "Áreas do Nós" }).getByRole("button", { name: "Aparência", exact: true }).click();
  return page.getByRole("dialog", { name: "Aparência", exact: true });
}

test("Aparência agrupa nove temas, aplica imediatamente e recupera a escolha da conta", async ({ page, context, account }, info) => {
  test.setTimeout(120_000);
  await page.setViewportSize(info.project.name === "mobile" ? { width: 390, height: 844 } : { width: 1440, height: 1000 });
  await page.goto("/nucleos");
  if (info.project.name === "desktop") {
    const nav = page.getByRole("navigation", { name: "Áreas do Nós" });
    const expected = await nav.getByRole("link", { name: "Preferências e ajuda", exact: true }).evaluate(element => {
      const style = getComputedStyle(element);
      return { align: style.textAlign, ink: style.color, background: style.backgroundColor, padding: style.padding, size: style.fontSize, weight: style.fontWeight };
    });
    const actual = await nav.getByRole("button", { name: "Aparência", exact: true }).evaluate(element => {
      const style = getComputedStyle(element);
      return { align: style.textAlign, ink: style.color, background: style.backgroundColor, padding: style.padding, size: style.fontSize, weight: style.fontWeight };
    });
    expect(actual).toEqual(expected);
  }
  if (info.project.name === "mobile") {
    await page.getByRole("button", { name: "Mais áreas e preferências" }).click();
    const menu = page.getByRole("dialog", { name: "Todos os seus caminhos" });
    await expect(menu.getByRole("button", { name: "Aparência", exact: true })).toHaveCount(1);
    const styles = await menu.evaluate(element => {
      const read = (selector: string) => {
        const style = getComputedStyle(element.querySelector(selector)!);
        return { align: style.textAlign, ink: style.color, background: style.backgroundColor, padding: style.padding, size: style.fontSize, weight: style.fontWeight };
      };
      return { reference: read('a[href="/configuracoes"]'), appearance: read("button.navigation-link") };
    });
    expect(styles.appearance).toEqual(styles.reference);
    await menu.getByRole("button", { name: "Aparência", exact: true }).click();
  } else await page.getByRole("navigation", { name: "Áreas do Nós" }).getByRole("button", { name: "Aparência", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Aparência", exact: true });
  await expect(dialog.getByRole("radio")).toHaveCount(9);
  const navigationAccents = new Set<string>();
  for (const [name, id] of [["Escuro — Anoitecer", "dark"], ["Preto — Meia-noite", "black"], ["Rosé — Aurora", "rose"], ["Lilás — Lavanda", "lavender"], ["Azul — Oceano", "ocean"], ["Verde — Floresta", "forest"], ["Solar — Âmbar", "solar"], ["Noturno — Neon", "neon"], ["Claro — Jardim", "light"]]) {
    await dialog.getByRole("radio", { name, exact: true }).check();
    await expect(page.locator("html")).toHaveAttribute("data-theme", id);
    await expect(dialog.getByRole("status")).toHaveText("Tema salvo na sua conta.");
    if (id === "black") await expect(page.locator("body")).toHaveCSS("background-color", "rgb(0, 0, 0)");
    if (["solar", "neon"].includes(id)) {
      await page.reload();
      await expect(page.locator("html")).toHaveAttribute("data-theme", id);
      await page.goto("/boas-vindas");
      await expect(page.locator("body")).toHaveCSS("background-color", "rgb(245, 247, 241)");
      await page.goto("/nucleos");
      await expect(page.locator("html")).toHaveAttribute("data-theme", id);
      await openAppearance(page, info.project.name === "mobile");
    }
    const navigation = page.getByRole("navigation", { name: info.project.name === "mobile" ? "Navegação móvel" : "Áreas do Nós", includeHidden: true });
    const current = navigation.locator('[aria-current="page"]');
    await expect(current).toHaveCount(1);
    await expect(current.locator("svg")).toHaveCSS("color", "rgb(64, 119, 166)");
    await expect(page.locator(".mobile-navigation>button svg")).toHaveCSS("color", "rgb(101, 115, 104)");
    const colors = await current.evaluate(element => {
      const style = getComputedStyle(element);
      return { ink: style.color, accent: getComputedStyle(document.documentElement).getPropertyValue("--navigation-accent").trim(), weight: style.fontWeight,
        indicator: getComputedStyle(element, "::before").backgroundColor, shadow: style.boxShadow };
    });
    navigationAccents.add(colors.accent);
    expect(colors.weight).toBe("700");
    if (info.project.name === "mobile") expect(colors.indicator).toBe(colors.ink);
    else expect(colors.shadow).toContain("inset");
    expect(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
    if (process.env.NOS_THEME_GALLERY) {
      mkdirSync(process.env.NOS_THEME_GALLERY, { recursive: true });
      await dialog.evaluate(element => { element.scrollTop = 0; });
      await page.screenshot({ path: path.join(process.env.NOS_THEME_GALLERY, `${info.project.name}-${id}.png`) });
      await page.keyboard.press("Escape");
      if (info.project.name === "mobile") await page.keyboard.press("Escape");
      await page.screenshot({ path: path.join(process.env.NOS_THEME_GALLERY, `${info.project.name}-${id}-navegacao.png`) });
      await openAppearance(page, info.project.name === "mobile");
    }
  }
  expect(navigationAccents.size).toBe(9);
  await dialog.getByRole("radio", { name: "Lilás — Lavanda", exact: true }).check();
  await expect(dialog.getByRole("status")).toHaveText("Tema salvo na sua conta.");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "lavender");
  await page.goto("/boas-vindas");
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(245, 247, 241)");
  await page.goto("/conta/recuperar");
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(245, 247, 241)");
  await page.goto("/configuracoes");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "lavender");
  if (info.project.name === "mobile") await expect(page.getByRole("button", { name: "Mais áreas e preferências" })).toHaveAttribute("aria-current", "page");
  for (const [route, desktopLabel, mobileLabel] of [["/ajuda", "Preferências e ajuda", "Mais áreas e preferências"], ["/comecar", "Seus Núcleos", "Núcleos"]]) {
    await page.goto(route);
    const nav = page.getByRole("navigation", { name: info.project.name === "mobile" ? "Navegação móvel" : "Áreas do Nós" });
    await expect(nav.getByRole(info.project.name === "mobile" && route === "/ajuda" ? "button" : "link", { name: info.project.name === "mobile" ? mobileLabel : desktopLabel, exact: true })).toHaveAttribute("aria-current", "page");
  }
  // Outra sessão da mesma conta deve obter a preferência do servidor, sem cache local.
  const { createClient } = await import("@supabase/supabase-js");
  const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, { auth: { persistSession: false } });
  const { data, error } = await client.auth.signInWithPassword({ email: account.email, password: account.password });
  expect(error).toBeNull();
  expect(data.user?.user_metadata.appearance_theme).toBe("lavender");
  await client.auth.signOut();
  await context.clearCookies();
  await page.goto("/conta");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("falha informa a pendência, nova tentativa salva e cliques rápidos preservam a última escolha", async ({ page }, info) => {
  test.setTimeout(120_000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/nucleos");
  const dialog = await openAppearance(page, info.project.name === "mobile");
  await page.route("**/nucleos", async route => {
    if (route.request().headers()["next-action"]) await route.abort("failed");
    else await route.continue();
  });
  await dialog.getByRole("radio", { name: "Preto — Meia-noite", exact: true }).check();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "black");
  await expect(dialog.getByRole("alert")).toContainText("conexão falhou");
  await page.unroute("**/nucleos");
  await dialog.getByRole("button", { name: "Tentar salvar novamente" }).click();
  await expect(dialog.getByRole("status")).toHaveText("Tema salvo na sua conta.");
  let release!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  await page.route("**/nucleos", async route => {
    if (route.request().headers()["next-action"]) await gate;
    await route.continue();
  });
  await dialog.getByRole("radio", { name: "Rosé — Aurora", exact: true }).check();
  await dialog.getByRole("radio", { name: "Azul — Oceano", exact: true }).check();
  await dialog.getByRole("radio", { name: "Verde — Floresta", exact: true }).check();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "forest");
  release();
  await expect(dialog.getByRole("status")).toHaveText("Tema salvo na sua conta.");
  await expect(dialog.locator(".theme-option").first()).toHaveCSS("transition-duration", "0s");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "forest");
});
