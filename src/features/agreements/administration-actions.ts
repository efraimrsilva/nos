"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireControlsSession } from "@/features/controls/access";
import { uuid } from "./habit-access";
import { parseAgreementProposal } from "./proposal-input";
import type { ControlActionState } from "@/features/controls/actions";

export async function administerAgreement(nucleusId: string, agreementId: string,
  operation: "start_test" | "activate" | "end" | "terms", termsVersion: number, _previous: ControlActionState, form: FormData): Promise<ControlActionState> {
  if (!uuid.test(nucleusId) || !uuid.test(agreementId) || !Number.isSafeInteger(termsVersion) || termsVersion < 1 || !["start_test", "activate", "end", "terms"].includes(operation)) return { error: "Ação inválida." };
  if (form.get("confirmed") !== "on") return { error: "Confirme que compreendeu a ação." };
  const path = `/nucleos/${nucleusId}/acordos`;
  const { supabase } = await requireControlsSession(path);
  // Vincula a ação à rota, além das verificações administrativas feitas na função do banco.
  const { data, error: lookupError } = await supabase.from("nucleus_agreements").select("id,category").eq("id", agreementId).eq("nucleus_id", nucleusId).maybeSingle();
  if (lookupError || !data) return { error: "Não foi possível conferir o acordo." };
  let result;
  if (operation === "terms") {
    const input = parseAgreementProposal({ category: "habit", title: String(form.get("title") ?? ""), description: String(form.get("description") ?? ""), timing: String(form.get("timing") ?? ""), frequency: String(form.get("frequency") ?? "") });
    if (!input) return { error: "Preencha os termos dentro dos limites indicados." };
    result = await supabase.rpc("update_nucleus_agreement_terms", { target_agreement: agreementId, agreement_title: input.title, agreement_description: input.description, agreement_timing: input.timing, agreement_frequency: input.frequency, expected_terms_version: termsVersion });
  } else {
    result = await supabase.rpc("manage_nucleus_agreement", { target_agreement: agreementId, agreement_action: operation, expected_terms_version: termsVersion });
  }
  if (result.error) return { error: result.error.message === "agreement terms unchanged" ? "Os termos não mudaram. Altere um campo para publicar uma nova versão." : "Não foi possível concluir. Confira sua permissão e o estado atual do acordo." };
  revalidatePath(`/nucleos/${nucleusId}`, "layout");
  redirect(`${path}?categoria=${data.category}&resultado=gestao`);
}
