import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { stripTypeScriptTypes } from "node:module";
import { runInNewContext } from "node:vm";
import { AuthApiError, AuthRetryableFetchError, isAuthRetryableFetchError } from "@supabase/supabase-js";
import { isValidEmail, isValidPassword, safeAuthNext, withAuthNext } from "../src/features/auth/input";

// Executa a ação real com o transporte Auth isolado; cookies/redirecionamento
// não podem ser usados quando uma tentativa de login falha.
async function failedLogin(error: AuthApiError | AuthRetryableFetchError) {
  const source = stripTypeScriptTypes(readFileSync("src/features/auth/actions.ts", "utf8"))
    .replace(/^import .*;\r?\n/gm, "")
    .replace(/export async function/g, "async function");
  const submit = runInNewContext(`${source}\nsubmitAuth;`, {
    isValidEmail, isValidPassword, safeAuthNext, withAuthNext, isAuthRetryableFetchError,
    createSupabaseServerClient: async () => ({ auth: { signInWithPassword: async () => ({ error }) } }),
    cookies: () => { throw new Error("Login falho não deve alterar cookies."); },
    redirect: () => { throw new Error("Login falho não deve redirecionar."); },
  });
  const fields = new FormData();
  fields.set("mode", "login"); fields.set("email", "pessoa@example.test"); fields.set("password", "Aa1!senha");
  return submit({ message: "", success: false, revision: 0 }, fields);
}

test("login distingue serviço indisponível de credenciais incorretas", async () => {
  for (const error of [new AuthRetryableFetchError("Transporte falhou", 0), new AuthApiError("Falha interna", 500, "unexpected_failure")]) {
    expect((await failedLogin(error)).message).toBe("Não foi possível acessar o serviço de autenticação. Tente novamente em instantes.");
  }
});

test("login orienta aguardar quando o Auth limita tentativas", async () => {
  expect((await failedLogin(new AuthApiError("Limite", 429, "over_request_rate_limit"))).message)
    .toBe("Muitas tentativas de acesso. Aguarde um pouco antes de tentar novamente.");
});

test("login mantém resposta genérica para credenciais inválidas", async () => {
  const result = await failedLogin(new AuthApiError("Credenciais inválidas", 400, "invalid_credentials"));
  expect(result.message).toBe("Não foi possível entrar. Confira o e-mail e a senha.");
  expect(result.success).toBe(false);
});

// Isola somente o serviço externo: validação, decisões e destinos são da ação real.
async function signupResult(data: object, error: AuthApiError | null = null) {
  const source = stripTypeScriptTypes(readFileSync("src/features/auth/actions.ts", "utf8"))
    .replace(/^import .*;\r?\n/gm, "")
    .replace(/export async function/g, "async function");
  const calls: unknown[] = [];
  const submit = runInNewContext(`${source}\nsubmitAuth;`, {
    isValidEmail, isValidPassword, safeAuthNext, withAuthNext, isAuthRetryableFetchError,
    URL, recoveryCookie: "recovery-fixture", process: { env: { APP_ORIGIN: "https://nos.example.test" } },
    createSupabaseServerClient: async () => ({ auth: { signUp: async (input: unknown) => { calls.push(input); return { data, error }; } } }),
    cookies: async () => ({ delete: () => {} }),
    redirect: (destination: string) => { throw new Error(`REDIRECT:${destination}`); },
  });
  const fields = new FormData();
  fields.set("mode", "signup"); fields.set("name", "Pessoa");
  fields.set("email", " Pessoa@Example.test "); fields.set("password", "Aa1!senha");
  fields.set("next", "/comecar/convite");
  const result = await submit({ message: "", success: false, revision: 2 }, fields);
  return { result, calls };
}

const existingAccountMessage = "Este e-mail já possui uma conta. Use ‘Já tenho conta’ para entrar ou ‘Esqueci minha senha’ para recuperar o acesso.";

test("cadastro de conta existente não promete confirmação na resposta ofuscada", async () => {
  const { result, calls } = await signupResult({ user: { identities: [] }, session: null });
  expect(result).toEqual({ message: existingAccountMessage, success: false, revision: 3 });
  expect(calls).toEqual([{ email: "pessoa@example.test", password: "Aa1!senha", options: {
    data: { name: "Pessoa" }, emailRedirectTo: "https://nos.example.test/auth/confirm?next=%2Fcomecar%2Fconvite",
  } }]);
});

test("cadastro reconhece códigos explícitos de e-mail existente", async () => {
  for (const code of ["user_already_exists", "email_exists"]) {
    const { result } = await signupResult({ user: null, session: null }, new AuthApiError("Already registered", 422, code));
    expect(result.message).toBe(existingAccountMessage);
    expect(result.success).toBe(false);
  }
});

test("cadastro válido ou ainda não confirmado segue para confirmação preservando convite", async () => {
  await expect(signupResult({ user: { identities: [{ provider: "email" }] }, session: null }))
    .rejects.toThrow("REDIRECT:/conta/confirmar-email?next=%2Fcomecar%2Fconvite");
});

test("cadastro com sessão segue para destino protegido", async () => {
  await expect(signupResult({ user: { identities: [{ provider: "email" }] }, session: { access_token: "fixture" } }))
    .rejects.toThrow("REDIRECT:/comecar/convite");
});

test("cadastro não trata resposta sem usuário como confirmação enviada", async () => {
  const { result } = await signupResult({ user: null, session: null });
  expect(result.success).toBe(false);
  expect(result.message).toBe("Não foi possível criar a conta agora. Confira os dados e tente novamente.");
});

test("outros erros de cadastro não são apresentados como conta existente", async () => {
  const { result } = await signupResult({ user: null, session: null }, new AuthApiError("Failure", 500, "unexpected_failure"));
  expect(result.message).toBe("Não foi possível criar a conta agora. Confira os dados e tente novamente.");
});
