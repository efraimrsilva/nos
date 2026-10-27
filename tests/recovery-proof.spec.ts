import { expect, test } from "@playwright/test";
import { safeAuthNext, isValidPassword } from "@/features/auth/input";
import { signRecoveryProof, verifyRecoveryProof } from "@/features/auth/recovery-proof";
import { sendAccessEmail } from "@/features/auth/access-email";
import { parseRecoveryCredentials } from "@/features/auth/recovery-credentials";

test("recuperação rejeita parâmetros repetidos, misturados ou de outro tipo antes de consultar Auth", () => {
  for (const query of [
    "code=a&code=b", "token_hash=a&token_hash=b&type=recovery",
    "code=a&token_hash=b&token_hash=c&type=recovery", "code=a&token_hash=",
    "code=&token_hash=a&type=recovery", "code=a&type=recovery&type=recovery",
    "code=a&type=email", "token_hash=a&type=email", "token_hash=a", "type=recovery",
  ]) expect(parseRecoveryCredentials(new URLSearchParams(query))).toBeNull();
  expect(parseRecoveryCredentials(new URLSearchParams("code=a"))).toEqual({ code: "a" });
  expect(parseRecoveryCredentials(new URLSearchParams("token_hash=a&type=recovery"))).toEqual({ tokenHash: "a" });
});

test("erro SMTP exclusivo de conta existente não revela cadastro", async () => {
  for (const kind of ["recovery"] as const) {
    let failures = 0;
    const report = () => { failures++; };
    const missing = await sendAccessEmail(kind, async () => ({ error: null }), report);
    const existingWithSmtpFailure = await sendAccessEmail(kind, async () => ({ error: { status: 500 } }), report);
    const networkFailure = await sendAccessEmail(kind, async () => { throw new Error("Falha de transporte"); }, report);
    expect(existingWithSmtpFailure).toBe(missing);
    expect(networkFailure).toBe(missing);
    expect(failures).toBe(2);
  }
});

test("retornos externos, repetidos e ambiguos não atravessam a autenticação", () => {
  for (const value of ["https://example.com", "//example.com", "/\\example.com", ["/comecar/convite"], "/comecar/convite?next=//example.com", "/conta/nova-senha"]) {
    expect(safeAuthNext(value)).toBe("/nucleos");
  }
  expect(safeAuthNext("/comecar/convite")).toBe("/comecar/convite");
  expect(safeAuthNext("/comecar/proposito?tipo=familia")).toBe("/comecar/proposito?tipo=familia");
});

test("prova assinada exige titular, sessão, assinatura e prazo", () => {
  const key = "segredo-temporario-exclusivo-do-teste";
  const proof = signRecoveryProof("ana", "sessao-1", key, 1000);
  expect(verifyRecoveryProof(proof, "ana", "sessao-1", key, 2000)).toBe(true);
  expect(verifyRecoveryProof(proof, "bia", "sessao-1", key, 2000)).toBe(false);
  expect(verifyRecoveryProof(proof, "ana", "sessao-2", key, 2000)).toBe(false);
  expect(verifyRecoveryProof(proof, "ana", "sessao-1", "outra-chave", 2000)).toBe(false);
  expect(verifyRecoveryProof(`${proof}x`, "ana", "sessao-1", key, 2000)).toBe(false);
  expect(verifyRecoveryProof(proof, "ana", "sessao-1", key, 901000)).toBe(false);
  expect(verifyRecoveryProof(undefined, "ana", "sessao-1", key)).toBe(false);
});

test("cadastro e recuperação compartilham política vigente", () => {
  expect(isValidPassword("SenhaSegura1!")).toBe(true);
  for (const password of ["curta1!", "semsimbolo123", "SemNumero!", "12345678!", "A1!".repeat(44)]) expect(isValidPassword(password)).toBe(false);
});
