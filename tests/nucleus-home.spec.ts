import { expect, test } from "@playwright/test";
import { AuthApiError, AuthRetryableFetchError, AuthSessionMissingError } from "@supabase/supabase-js";
import { isNucleusAuthUnavailable } from "../src/features/nuclei/nucleus-access";
import { getNucleusHomeDetails } from "../src/features/nuclei/nucleus-home-details";

test("a Home identifica o tipo e oferece convite a qualquer administrador", () => {
  expect(getNucleusHomeDetails("familia", "admin", "11111111-1111-4111-8111-111111111111")).toEqual({
    typeLabel: "Família",
    participation: "Você administra este Núcleo",
    invitationHref: "/comecar/convite-inicial/11111111-1111-4111-8111-111111111111",
  });
});

test("um membro recebe seu vínculo sem ação de convite", () => {
  expect(getNucleusHomeDetails("amigos", "member", "22222222-2222-4222-8222-222222222222")).toEqual({
    typeLabel: "Amigos",
    participation: "Você faz parte deste Núcleo",
    invitationHref: null,
  });
});

test("a Home distingue sessão ausente de falha do serviço de autenticação", () => {
  expect(isNucleusAuthUnavailable(new AuthSessionMissingError())).toBe(false);
  for (const code of ["session_expired", "refresh_token_not_found", "refresh_token_already_used", "bad_jwt", "user_not_found", "user_banned", "validation_failed"]) {
    expect(isNucleusAuthUnavailable(new AuthApiError("Sessão expirada", 401, code))).toBe(false);
  }
  expect(isNucleusAuthUnavailable(new AuthRetryableFetchError("Serviço indisponível", 503))).toBe(true);
  expect(isNucleusAuthUnavailable(null)).toBe(false);
});
