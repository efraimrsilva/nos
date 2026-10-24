import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { stripTypeScriptTypes } from "node:module";
import { runInNewContext } from "node:vm";
import { isThemeId, resolveTheme } from "../src/features/appearance/themes";

test("entrada sem sessão inicia no tema claro, sem herdar preferência de outra conta", async ({ page }) => {
  await page.goto("/conta");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(245, 247, 241)");
});

test("preferência inválida volta ao padrão e não aceita conteúdo arbitrário", () => {
  for (const value of [null, undefined, "", "DARK", "../dark", "<script>", {}, 1]) {
    expect(isThemeId(value)).toBe(false);
    expect(resolveTheme(value)).toBe("light");
  }
  expect(resolveTheme("black")).toBe("black");
});

test("paletas Solar e Neon são aceitas como preferências da conta", () => {
  expect(resolveTheme("solar")).toBe("solar");
  expect(resolveTheme("neon")).toBe("neon");
});

test("ícones conservam suas cores originais em todos os temas, inclusive na área ativa", async ({ page }) => {
  await page.setContent('<nav><a class="navigation-link" aria-current="page"><svg class="nav-icon tone-blue"></svg><span>Área atual</span></a></nav><div id="icon-colors"><svg class="tone-green"></svg><svg class="tone-blue"></svg><svg class="tone-purple"></svg><svg class="tone-orange"></svg><svg class="tone-amber"></svg><svg class="tone-rose"></svg></div><div class="calendar-detail-label"><svg></svg></div><div class="calendar-detail-time"><svg></svg></div><div class="calendar-participants"><svg></svg></div><div class="calendar-own-response"><svg></svg></div><div class="calendar-all-events"><button><svg></svg></button></div><div class="calendar-list-event"><svg></svg></div><div class="account-deletion-trigger"><span class="account-row"><span class="account-row-icon"><svg></svg></span><svg></svg></span></div><a class="current-brand"><span><svg></svg></span></a><span class="nucleus-letter"><svg></svg></span>');
  for (const file of ["src/app/layout-system.css", "src/features/appearance/themes.css", "src/features/calendar/components/calendar-workspace.css", "src/features/controls/accounts-layout.css"]) {
    await page.addStyleTag({ content: readFileSync(file, "utf8") });
  }
  for (const id of ["light", "dark", "black", "rose", "lavender", "ocean", "forest", "solar", "neon"]) {
    await page.evaluate(theme => { document.documentElement.dataset.theme = theme; }, id);
    const actual = await page.locator("svg").evaluateAll(elements => elements.map(element => getComputedStyle(element).color));
    expect(actual, id).toEqual(["rgb(64, 119, 166)", "rgb(59, 121, 77)", "rgb(64, 119, 166)", "rgb(121, 85, 165)", "rgb(174, 119, 55)", "rgb(174, 119, 55)", "rgb(187, 97, 121)", "rgb(69, 107, 86)", "rgb(66, 110, 139)", "rgb(116, 94, 140)", "rgb(52, 93, 68)", "rgb(52, 93, 68)", "rgb(52, 93, 68)", "rgb(134, 51, 58)", "rgb(134, 51, 58)", "rgb(52, 93, 68)", "rgb(52, 93, 68)"]);
  }
});

// A ação real é executada; somente o transporte externo é isolado para falhas determinísticas.
function themeAction(auth: object, configured = true) {
  const source = stripTypeScriptTypes(readFileSync("src/features/appearance/actions.ts", "utf8"))
    .replace(/^import .*;\r?\n/gm, "").replace(/export async function/g, "async function");
  return runInNewContext(`${source}\nsaveThemePreference;`, {
    isThemeId, createSupabaseServerClient: async () => configured ? { auth } : null,
  }) as (value: unknown, userId: string) => Promise<{ error: string }>;
}

test("ação rejeita tema inválido e sessão de outra pessoa antes de gravar", async () => {
  const noWrite = async () => { throw new Error("Gravação indevida"); };
  expect((await themeAction({ getUser: noWrite, updateUser: noWrite })("inventado", "a")).error).toContain("Escolha");
  const action = themeAction({ getUser: async () => ({ data: { user: { id: "b" } }, error: null }), updateUser: noWrite });
  expect((await action("dark", "a")).error).toContain("sessão mudou");
  expect((await themeAction({ getUser: async () => ({ data: { user: null }, error: null }), updateUser: noWrite })("dark", "a")).error).toContain("sessão mudou");
});

test("ação não anuncia sucesso em erro de transporte, serviço ou resposta sem confirmação", async () => {
  const getUser = async () => ({ data: { user: { id: "a" } }, error: null });
  for (const updateUser of [
    async () => { throw new Error("offline"); },
    async () => ({ data: { user: null }, error: { message: "falha" } }),
    async () => ({ data: { user: { id: "a", user_metadata: {} } }, error: null }),
  ]) expect((await themeAction({ getUser, updateUser })("dark", "a")).error).not.toBe("");
  expect((await themeAction({}, false)("dark", "a")).error).not.toBe("");
});

test("ação confirma o tema e limita a atualização ao campo de aparência", async () => {
  const getUser = async () => ({ data: { user: { id: "a", user_metadata: { name: "Nome preservado" } } }, error: null });
  const action = themeAction({ getUser, updateUser: async (payload: unknown) => {
    expect(payload).toEqual({ data: { appearance_theme: "black" } });
    return { data: { user: { id: "a", user_metadata: { name: "Nome preservado", appearance_theme: "black" } } }, error: null };
  } });
  expect(await action("black", "a")).toEqual({ error: "" });
});

test("nove paletas preservam contraste de texto, campos e ações", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/conta");
  // Isola os papéis visuais da área interna; as telas públicas são intencionalmente sempre claras.
  await page.getByRole("button", { name: "Já tenho conta" }).click();
  await expect(page.getByRole("button", { name: "Entrar", exact: true })).toBeVisible();
  await page.evaluate(() => {
    document.querySelector(".public-shell")!.classList.remove("public-shell");
    const panel = document.createElement("section");
    panel.id = "theme-contrast";
    panel.innerHTML = '<div class="ui-panel"><p>Texto secundário</p><button class="ui-button">Confirmar</button><button class="invitation-danger ui-button-danger">Revogar convite</button><label class="ui-field">Nome<input value="Texto no campo"></label></div><p class="ui-status">Sucesso</p><p class="ui-status" role="alert">Erro</p>';
    document.body.append(panel);
  });
  await page.addStyleTag({ content: readFileSync("src/features/invitations/components/participation-layout.css", "utf8") + readFileSync("src/features/controls/accounts-layout.css", "utf8") });
  for (const id of ["light", "dark", "black", "rose", "lavender", "ocean", "forest", "solar", "neon"]) {
    await page.evaluate(theme => { document.documentElement.dataset.theme = theme; }, id);
    if (id === "solar") await expect(page.locator("body")).toHaveCSS("background-color", "rgb(255, 241, 214)");
    if (id === "neon") {
      await expect(page.locator("body")).toHaveCSS("background-color", "rgb(8, 12, 32)");
      await expect(page.locator("html")).toHaveCSS("color-scheme", "dark");
    }
    const pairs = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      const pairs: [string, string][] = [];
      // Resolve as variáveis para RGB pelo navegador, incluindo color-mix e herança.
      for (const [ink, bg] of [["--color-forest", "--color-canvas"], ["--color-muted", "--surface"], ["--color-leaf", "--surface"], ["--on-accent", "--color-leaf"], ["--danger-ink", "--danger-bg"], ["--success-ink", "--success-bg"], ["--warning-ink", "--warning-bg"]]) {
        const element = document.createElement("span");
        element.style.color = root.getPropertyValue(ink); element.style.backgroundColor = root.getPropertyValue(bg);
        document.body.append(element);
        const style = getComputedStyle(element); pairs.push([style.color, style.backgroundColor]); element.remove();
      }
      for (const selector of [".ui-panel p", ".ui-button", ".invitation-danger", ".ui-field input", ".ui-status", '.ui-status[role="alert"]']) {
        const element = document.querySelector(`#theme-contrast ${selector}`)!;
        const style = getComputedStyle(element);
        const background = style.backgroundColor === "rgba(0, 0, 0, 0)" ? getComputedStyle(element.parentElement!).backgroundColor : style.backgroundColor;
        pairs.push([style.color, background]);
      }
      return pairs;
    });
    const luminance = (rgb: string) => {
      const channels = rgb.match(/[\d.]+/g)!.slice(0, 3).map(Number).map(x => x / 255).map(x => x <= .04045 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4);
      return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
    };
    for (const [ink, bg] of pairs) {
      const [a, b] = [luminance(ink), luminance(bg)];
      expect((Math.max(a, b) + .05) / (Math.min(a, b) + .05), `${id}: ${ink} / ${bg}`).toBeGreaterThanOrEqual(4.5);
    }
  }
});
