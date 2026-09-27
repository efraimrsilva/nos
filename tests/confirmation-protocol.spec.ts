import { expect, test } from "@playwright/test";
import { confirmEmailSession } from "@/features/auth/confirm-email-session";

test("retorno padrão troca o código por sessão", async () => {
  let exchanged = "";
  const result = await confirmEmailSession(new URLSearchParams("code=codigo-temporario"), {
    exchangeCodeForSession: async (code) => { exchanged = code; return { error: null }; },
    verifyOtp: async () => { throw new Error("Não deve verificar token_hash"); },
  });
  expect(result).toBe(true);
  expect(exchanged).toBe("codigo-temporario");
});

test("retorno por token_hash continua aceito", async () => {
  let verified = "";
  const result = await confirmEmailSession(new URLSearchParams("token_hash=token&type=email"), {
    exchangeCodeForSession: async () => { throw new Error("Não deve trocar código"); },
    verifyOtp: async ({ token_hash }) => { verified = token_hash; return { error: null }; },
  });
  expect(result).toBe(true);
  expect(verified).toBe("token");
});

test("retorno sem credencial válida falha", async () => {
  const result = await confirmEmailSession(new URLSearchParams("type=email"), {
    exchangeCodeForSession: async () => { throw new Error("Não deve trocar código"); },
    verifyOtp: async () => { throw new Error("Não deve verificar token_hash"); },
  });
  expect(result).toBe(false);
});
