import { expect, test } from "@playwright/test";
import { isAccountDeletionConfirmed } from "../src/features/controls/account-deletion-input";

test("exclusão exige a frase exata de duas palavras", () => {
  expect(isAccountDeletionConfirmed("APAGAR CONTA")).toBe(true);
  for (const value of [null, "", "APAGAR", "CONTA", "apagar conta", "APAGAR  CONTA", " APAGAR CONTA", "APAGAR CONTA ", "APAGAR CONTA AGORA", new File([], "APAGAR CONTA")]) {
    expect(isAccountDeletionConfirmed(value)).toBe(false);
  }
});
