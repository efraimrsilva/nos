import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { stripTypeScriptTypes } from "node:module";
import { runInNewContext } from "node:vm";
import { isValidEmail, safeAuthNext, withAuthNext } from "@/features/auth/input";
import { sendAccessEmail } from "@/features/auth/access-email";

// Exercita a ação real. Isola somente transporte, cookies e configuração.
function confirmationRequest({ status = "pending", lookupError = false, lookupThrows = false, sendError = null, sendThrows = false, retryAt = 0, origin = "https://nos.example.test" }: {
  status?: string | null;
  lookupError?: boolean;
  lookupThrows?: boolean;
  sendError?: { status: number } | null;
  sendThrows?: boolean;
  retryAt?: number;
  origin?: string;
} = {}) {
  const source = stripTypeScriptTypes(readFileSync("src/features/auth/access-actions.ts", "utf8"))
    .replace(/^import .*;\r?\n/gm, "")
    .replace(/export async function/g, "async function");
  const queries: unknown[] = [], sends: unknown[] = [], writes: unknown[] = [];
  const request = runInNewContext(`${source}\nrequestAccessEmail;`, {
    isValidEmail, safeAuthNext, withAuthNext, URL, sendAccessEmail,
    process: { env: { APP_ORIGIN: origin } },
    authCookieOptions: {}, recoverySecret: () => "fixture",
    cookies: async () => ({ get: () => ({ value: String(retryAt) }), set: (...args: unknown[]) => writes.push(args) }),
    createSupabaseServerClient: async () => ({
      rpc: async (...args: unknown[]) => {
        queries.push(args);
        if (lookupThrows) throw new Error("Transporte indisponível");
        return { data: status, error: lookupError ? { code: "fixture" } : null };
      },
      auth: {
        resend: async (input: unknown) => {
          sends.push(input);
          if (sendThrows) throw new Error("SMTP indisponível");
          return { error: sendError };
        },
        resetPasswordForEmail: async () => ({ error: null }),
      },
    }),
  });
  const form = new FormData();
  form.set("kind", "confirmation"); form.set("email", " Pessoa@Example.test ");
  form.set("next", "/comecar/convite");
  return { submit: () => request({ message: "", success: false, revision: 4 }, form), form, queries, sends, writes };
}

test("confirmação já concluída responde na mesma tela sem envio nem intervalo", async () => {
  const request = confirmationRequest({ status: "confirmed", retryAt: Date.now() + 60_000, origin: "" });
  expect(await request.submit()).toEqual({ message: "Este e-mail já está confirmado. Você já pode entrar na sua conta.", success: true, revision: 5 });
  expect(request.queries).toEqual([["get_email_confirmation_status", { account_email: "pessoa@example.test" }]]);
  expect(request.sends).toHaveLength(0);
  expect(request.writes).toHaveLength(0);
});

test("confirmação pendente envia e informa sucesso preservando retorno interno", async () => {
  const request = confirmationRequest();
  const result = await request.submit();
  expect(result.success).toBe(true);
  expect(result.message).toBe("Enviamos a confirmação para o seu e-mail. Confira sua caixa de entrada e também o spam.");
  expect(result.retryAt).toBeGreaterThan(Date.now());
  expect(request.sends).toEqual([{ type: "signup", email: "pessoa@example.test", options: { emailRedirectTo: "https://nos.example.test/auth/confirm?next=%2Fcomecar%2Fconvite" } }]);
  expect(request.writes).toHaveLength(1);
});

test("falha de consulta não anuncia confirmação nem tenta enviar", async () => {
  for (const options of [{ lookupError: true }, { lookupThrows: true }, { status: null }, { status: "unexpected" }]) {
    const request = confirmationRequest(options);
    const result = await request.submit();
    expect(result.success).toBe(false);
    expect(result.message).toContain("Não foi possível verificar");
    expect(request.sends).toHaveLength(0);
    expect(request.writes).toHaveLength(0);
  }
});

test("conta inexistente não recebe mensagem de confirmação enviada", async () => {
  const request = confirmationRequest({ status: "missing" });
  expect((await request.submit()).message).toContain("Não encontramos uma conta");
  expect(request.sends).toHaveLength(0);
});

test("falhas SMTP e de transporte não são apresentadas como envio de confirmação", async () => {
  for (const options of [{ sendError: { status: 500 } }, { sendThrows: true }]) {
    const result = await confirmationRequest(options).submit();
    expect(result.success).toBe(false);
    expect(result.message).toBe("Não foi possível enviar a confirmação. Tente novamente em instantes.");
    expect(result.retryAt).toBeGreaterThan(Date.now());
  }
});

test("limite do Auth orienta aguardar sem anunciar envio", async () => {
  const result = await confirmationRequest({ sendError: { status: 429 } }).submit();
  expect(result.success).toBe(false);
  expect(result.message).toContain("Muitas solicitações");
});

test("confirmação pendente respeita intervalo e configuração antes do envio", async () => {
  for (const options of [{ retryAt: Date.now() + 60_000 }, { origin: "" }]) {
    const request = confirmationRequest(options);
    expect((await request.submit()).success).toBe(false);
    expect(request.sends).toHaveLength(0);
  }
});

test("endereço inválido não consulta estado nem envia", async () => {
  const request = confirmationRequest();
  request.form.set("email", "invalido");
  expect((await request.submit()).message).toBe("Informe um e-mail válido.");
  expect(request.queries).toHaveLength(0);
  expect(request.sends).toHaveLength(0);
});

test("recuperação continua neutra e não consulta confirmação", async () => {
  const request = confirmationRequest();
  request.form.set("kind", "recovery");
  expect((await request.submit()).message).toContain("Se houver uma conta");
  expect(request.queries).toHaveLength(0);
});
