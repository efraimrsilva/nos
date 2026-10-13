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
