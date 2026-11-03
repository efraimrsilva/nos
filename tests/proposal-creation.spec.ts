import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { stripTypeScriptTypes } from "node:module";
import { runInNewContext } from "node:vm";
import { parseAgreementProposal } from "../src/features/agreements/proposal-input";
import { parseTrialDays } from "../src/features/agreements/habit-trial-input";

test("nova proposta segue o início do fluxo mesmo com categoria adulterada", async () => {
  const source = stripTypeScriptTypes(readFileSync("src/features/agreements/actions.ts", "utf8"))
    .replace(/^import .*;\r?\n/gm, "").replace(/export async function/g, "async function");
  let created: Record<string, unknown> | undefined;
  let destination = "";
  const create = runInNewContext(`${source}\ncreateAgreementProposal;`, {
    parseAgreementProposal, parseTrialDays, isNucleusAuthUnavailable: () => false,
    createSupabaseServerClient: async () => ({
      auth: { getUser: async () => ({ data: { user: { id: "member" } }, error: null }) },
      rpc: async (_name: string, input: Record<string, unknown>) => { created = input; return { error: null }; },
    }),
    revalidatePath: () => {}, redirect: (url: string) => { destination = url; },
    routes: { nucleus: "/nucleos" },
  });
  const fields = new FormData();
  for (const [key, value] of Object.entries({ category: "experience", title: "Conversar", description: "Com atenção", timing: "Noite", frequency: "Semanal", trialDays: "7" })) fields.set(key, value);
  await create("12345678-1234-4234-8234-123456789abc", { error: "" }, fields);
  expect(created?.agreement_category).toBe("habit");
  expect(created?.agreement_trial_days).toBe(7);
  expect(destination).toContain("filtro=pending");
});
