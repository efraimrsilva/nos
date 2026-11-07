import { expect, test } from "@playwright/test";
import type { User } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { stripTypeScriptTypes } from "node:module";
import { runInNewContext } from "node:vm";
import { authAppOrigin, establishSocialSession, socialProvider } from "../src/features/auth/social-session";
import { safeAuthNext, withAuthNext } from "../src/features/auth/input";

const user = (metadata: object) => ({ id: "own-account", user_metadata: metadata }) as User;
const unused = async (): Promise<never> => { throw new Error("Não deve acessar o Auth"); };

test("somente Google e Apple são aceitos; origem exige HTTPS fora do ambiente local", () => {
  expect(socialProvider("google")).toBe("google");
  expect(socialProvider("apple")).toBe("apple");
  for (const value of ["github", "Google", "", null, ["google"]]) expect(socialProvider(value)).toBeNull();
  expect(authAppOrigin("https://nos.example.test")).toBe("https://nos.example.test");
  expect(authAppOrigin("http://127.0.0.1:3000")).toBe("http://127.0.0.1:3000");
  for (const value of [undefined, "javascript:alert(1)", "http://externo.test", "https://u:p@externo.test", "https://externo.test/caminho", "https://externo.test?url=x"]) expect(authAppOrigin(value)).toBeNull();
});

test("credenciais ambíguas, vazias ou misturadas não chegam ao Auth", async () => {
  for (const query of ["", "code=", "code=a&code=b", "code=a&error=access_denied", "code=a&error_description=x", "code=a&token_hash=b", "code=a&type=recovery", "code=%20"]) {
    expect(await establishSocialSession(new URLSearchParams(query), { exchangeCodeForSession: unused, updateUser: unused })).toBe("error");
  }
});

test("código de uso único é trocado e nome existente não é sobrescrito", async () => {
  let exchanged = "";
  expect(await establishSocialSession(new URLSearchParams("code=temporario"), {
    exchangeCodeForSession: async code => { exchanged = code; return { data: { user: user({ name: "Nome escolhido", full_name: "Outro nome" }) }, error: null }; },
    updateUser: unused,
  })).toBe("ready");
  expect(exchanged).toBe("temporario");
});

test("nome recebido do Google é integrado ao campo usado pelo perfil", async () => {
  let payload: unknown;
  expect(await establishSocialSession(new URLSearchParams("code=google"), {
    exchangeCodeForSession: async () => ({ data: { user: user({ full_name: "  Pessoa Google  " }) }, error: null }),
    updateUser: async value => { payload = value; return { data: { user: user({ name: "Pessoa Google" }) }, error: null }; },
  })).toBe("ready");
  expect(payload).toEqual({ data: { name: "Pessoa Google" } });
});

test("Apple sem nome e nomes fora do limite pedem complemento sem inventar identidade", async () => {
  for (const metadata of [{}, { name: "   " }, { full_name: "x".repeat(81) }]) {
    expect(await establishSocialSession(new URLSearchParams("code=apple"), {
      exchangeCodeForSession: async () => ({ data: { user: user(metadata) }, error: null }), updateUser: unused,
    })).toBe("name");
  }
});

test("falha ao integrar nome não afirma que o perfil foi concluído", async () => {
  for (const result of [{ data: { user: null }, error: {} }, { data: { user: user({ name: "divergente" }) }, error: null }]) {
    expect(await establishSocialSession(new URLSearchParams("code=a"), {
      exchangeCodeForSession: async () => ({ data: { user: user({ full_name: "Pessoa" }) }, error: null }), updateUser: async () => result,
    })).toBe("name");
  }
});

test("queda de conexão ao salvar nome mantém a sessão e solicita complemento", async () => {
  expect(await establishSocialSession(new URLSearchParams("code=a"), {
    exchangeCodeForSession: async () => ({ data: { user: user({ full_name: "Pessoa" }) }, error: null }),
    updateUser: async () => { throw new Error("rede após autenticar"); },
  })).toBe("name");
});

test("sessão ausente, código recusado e falha de rede não liberam o destino privado", async () => {
  for (const exchange of [async () => ({ data: { user: null }, error: null }), async () => ({ data: { user: user({ name: "Pessoa" }) }, error: {} }), async () => { throw new Error("rede"); }]) {
    expect(await establishSocialSession(new URLSearchParams("code=a"), { exchangeCodeForSession: exchange, updateUser: unused })).toBe("error");
  }
});

// Executa a ação de produção e isola apenas os serviços externos e o redirect do Next.
type OAuthStart = (input: { provider: string; options: { redirectTo: string; skipBrowserRedirect: boolean } }) => Promise<{ data: { url: string | null }; error: unknown }>;
type SaveName = (value: unknown, userId: string) => Promise<{ error: string; name?: string }>;
function actions(env: object, signInWithOAuth: OAuthStart = unused, saveProfileName: SaveName = unused) {
  const source = stripTypeScriptTypes(readFileSync("src/features/auth/social-actions.ts", "utf8"))
    .replace(/^import .*;\r?\n/gm, "").replace(/export async function/g, "async function");
  return runInNewContext(`${source}\n({ startSocialLogin, completeSocialProfile });`, {
    process: { env }, URL, socialProvider, authAppOrigin, safeAuthNext, withAuthNext,
    createSupabaseServerClient: async () => ({ auth: { signInWithOAuth } }), saveProfileName,
    redirect: (destination: string) => { throw new Error(`REDIRECT:${destination}`); },
  });
}
const initial = { message: "", success: false, revision: 0 };
async function redirectOf(operation: Promise<unknown>) {
  try { await operation; return "SEM REDIRECT"; }
  catch (error) { return String((error as Error).message); }
}
function fields(provider: string, next = "/comecar/convite") {
  const form = new FormData(); form.set("provider", provider); form.set("next", next); return form;
}

test("provedores desativados e entrada não permitida não iniciam autenticação externa", async () => {
  for (const provider of ["google", "apple", "github"]) {
    expect((await actions({}).startSocialLogin(initial, fields(provider))).success).toBe(false);
  }
});

test("cada provedor habilitado inicia PKCE com retorno próprio e convite preservado", async () => {
  for (const provider of ["google", "apple"]) {
    let payload: unknown;
    const action = actions({ GOOGLE_AUTH_ENABLED: "true", APPLE_AUTH_ENABLED: "true", APP_ORIGIN: "https://nos.example.test" }, async (value: unknown) => {
      payload = value; return { data: { url: "https://auth.example.test/authorize" }, error: null };
    });
    expect(await redirectOf(action.startSocialLogin(initial, fields(provider)))).toBe("REDIRECT:https://auth.example.test/authorize");
    expect(JSON.parse(JSON.stringify(payload))).toEqual({ provider, options: { redirectTo: "https://nos.example.test/auth/callback?next=%2Fcomecar%2Fconvite", skipBrowserRedirect: true } });
  }
});

test("destino externo é descartado antes de enviar o retorno ao provedor", async () => {
  let payload: { options: { redirectTo: string } } | undefined;
  const action = actions({ GOOGLE_AUTH_ENABLED: "true", APP_ORIGIN: "https://nos.example.test" }, async (value: typeof payload) => {
    payload = value; return { data: { url: "https://auth.example.test/authorize" }, error: null };
  });
  expect(await redirectOf(action.startSocialLogin(initial, fields("google", "//externo.test")))).toBe("REDIRECT:https://auth.example.test/authorize");
  expect(payload?.options.redirectTo).toBe("https://nos.example.test/auth/callback");
});

test("falha do provedor não expõe erro externo nem redireciona", async () => {
  const action = actions({ GOOGLE_AUTH_ENABLED: "true", APP_ORIGIN: "https://nos.example.test" }, async () => ({ data: { url: null }, error: { message: "segredo-do-provedor" } }));
  const result = await action.startSocialLogin(initial, fields("google"));
  expect(result.success).toBe(false); expect(result.message).not.toContain("segredo-do-provedor");
});

test("complemento só navega após confirmação da ação autenticada de perfil", async () => {
  const form = new FormData(); form.set("name", "Pessoa"); form.set("userId", "own-account"); form.set("next", "/comecar/convite");
  const save = async () => ({ error: "Sessão expirada" });
  expect((await actions({}, unused, save).completeSocialProfile(initial, form)).message).toBe("Sessão expirada");
  let saved: unknown[] = [];
  expect(await redirectOf(actions({}, unused, async (...args: unknown[]) => { saved = args; return { error: "", name: "Pessoa" }; }).completeSocialProfile(initial, form))).toBe("REDIRECT:/comecar/convite");
  expect(saved).toEqual(["Pessoa", "own-account"]);
});
