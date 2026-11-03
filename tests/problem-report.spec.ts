import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { stripTypeScriptTypes } from "node:module";
import { runInNewContext } from "node:vm";
import { parseProblemReport, reportRoute } from "../src/features/support/input";

function fields(description = "O botão de salvar não respondeu.") {
  const form = new FormData();
  form.set("description", description); form.set("steps", "Abrir e salvar."); form.set("route", "/nucleos?token=secret");
  form.set("to", "attacker@example.test"); form.set("email", "forged@example.test");
  return form;
}

async function action({ loggedIn = true, configured = true, reserved = true, failure = false } = {}) {
  let calls = 0, reservations = 0;
  const deliveries: unknown[][] = [];
  const source = stripTypeScriptTypes(readFileSync("src/features/support/actions.ts", "utf8"))
    .replace(/^import .*;\r?\n/gm, "").replace(/export async function/g, "async function");
  const submit = runInNewContext(`${source}\nsubmitProblemReport;`, {
    parseProblemReport,
    createSupabaseServerClient: async () => ({
      auth: { getUser: async () => ({ data: { user: loggedIn ? { email: "session@example.test", email_confirmed_at: "2026-11-03" } : null }, error: null }) },
      rpc: async () => { reservations++; return { data: reserved, error: null }; },
    }),
    supportMailTransport: () => configured ? {} : null,
    sendProblemReport: async (...args: unknown[]) => { calls++; deliveries.push(args); if (failure) throw Error("SMTP unavailable"); },
  });
  return { submit, calls: () => calls, reservations: () => reservations, deliveries };
}

test("relato valida limites e remove parâmetros/identificadores do contexto", () => {
  expect(parseProblemReport(fields("curto"))).toBeNull();
  expect(parseProblemReport(fields("x".repeat(2001)))).toBeNull();
  const form = fields(); form.set("steps", "x".repeat(1001)); expect(parseProblemReport(form)).toBeNull();
  const optional = fields(); optional.delete("steps"); expect(parseProblemReport(optional)?.steps).toBe("");
  expect(reportRoute("/nucleos/11000000-0000-4000-8000-000000000095/acordos?token=secret#part")).toBe("/nucleos/[id]/acordos");
  expect(reportRoute("https://evil.test/code")).toBe("/");
  expect(reportRoute("//evil.test/code")).toBe("/");
  expect(reportRoute("/comecar/convite-inicial/codigo-SECRETO")).toBe("/comecar/convite-inicial/[id]");
  expect(reportRoute("/comecar/convite-inicial/segredo")).toBe("/comecar/convite-inicial/[id]");
  expect(reportRoute("/nucleos/segredo/acordos/outra-coisa/revisar")).toBe("/nucleos/[id]/acordos/[id]/revisar");
});

test("sessão ausente e configuração ausente impedem envio e reserva", async () => {
  for (const options of [{ loggedIn: false }, { configured: false }]) {
    const runner = await action(options);
    expect((await runner.submit({}, fields())).error).toBeTruthy();
    expect(runner.calls()).toBe(0); expect(runner.reservations()).toBe(0);
  }
});

test("entrada inválida impede efeitos e limite compartilhado impede novo envio", async () => {
  const invalid = await action();
  expect((await invalid.submit({}, fields("curto"))).error).toBeTruthy();
  expect(invalid.reservations()).toBe(0);
  const limited = await action({ reserved: false });
  expect((await limited.submit({}, fields())).error).toContain("Aguarde um minuto");
  expect(limited.calls()).toBe(0);
});

test("falha SMTP nunca confirma sucesso nem expõe erro interno", async () => {
  const runner = await action({ failure: true });
  const result = await runner.submit({}, fields());
  expect(result.success).not.toBe(true);
  expect(result.error).toContain("Seu texto foi mantido");
  expect(result.error).not.toContain("SMTP unavailable");
});

test("confirma envio somente após transporte e usa contato da sessão", async () => {
  const runner = await action();
  expect((await runner.submit({}, fields())).success).toBe(true);
  expect(runner.calls()).toBe(1);
  expect(runner.deliveries[0][2]).toBe("session@example.test");
  expect(runner.deliveries[0][1]).toEqual({ description: "O botão de salvar não respondeu.", steps: "Abrir e salvar.", route: "/nucleos" });
});
