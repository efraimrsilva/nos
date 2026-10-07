import { expect, test } from "@playwright/test";
import { parseAgreementProposal } from "../src/features/agreements/proposal-input";

test("proposta exige categoria, compromisso e momento claros", () => {
  expect(parseAgreementProposal({ category: "habit", title: " Conversar sem distrações ",
    description: " Sem celular ", timing: " Depois do jantar ", frequency: " Três vezes por semana " }))
    .toEqual({ category: "habit", title: "Conversar sem distrações", description: "Sem celular",
      timing: "Depois do jantar", frequency: "Três vezes por semana" });
  expect(parseAgreementProposal({ category: "habit", title: "Conversar", description: "Sem celular", timing: "", frequency: "" })).toBeNull();
  expect(parseAgreementProposal({ category: "essence", title: "X", description: "Y", timing: "Z", frequency: "W" })).toBeNull();
});

test("acordos não expõem propostas sem sessão", async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto("/nucleos/11111111-1111-4111-8111-111111111111/acordos", { waitUntil: "commit" });
  await expect(page).toHaveURL(/\/conta\?modo=login&next=/);
});
