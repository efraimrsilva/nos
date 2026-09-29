"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { parseAgreementProposal } from "@/features/agreements/proposal-input";
import { isNucleusAuthUnavailable } from "@/features/nuclei/nucleus-access";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { routes } from "@/shared/routes";

export type AgreementActionState = { error: string };
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function authenticatedClient() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { client: null, authUnavailable: false };
  const { data: { user }, error } = await supabase.auth.getUser();
  return { client: error || !user ? null : supabase, authUnavailable: isNucleusAuthUnavailable(error) };
}

export async function createAgreementProposal(nucleusId: string, _previous: AgreementActionState,
  formData: FormData): Promise<AgreementActionState> {
  if (!uuid.test(nucleusId)) return { error: "Núcleo inválido." };
  const input = parseAgreementProposal({
    category: String(formData.get("category") ?? ""),
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    timing: String(formData.get("timing") ?? ""),
    frequency: String(formData.get("frequency") ?? ""),
  });
  if (!input) return { error: "Preencha categoria, compromisso, descrição, momento e frequência." };
  const { client: supabase, authUnavailable } = await authenticatedClient();
  if (!supabase) return { error: authUnavailable ? "Não foi possível conferir a sessão agora." : "Entre na sua conta novamente." };
  // A RPC confere participação e registra o aceite do autor junto às respostas pendentes.
  const { error } = await supabase.rpc("create_nucleus_agreement", {
    target_nucleus: nucleusId, agreement_category: input.category, agreement_title: input.title,
    agreement_description: input.description, agreement_timing: input.timing,
    agreement_frequency: input.frequency,
  });
  if (error) return { error: "Não foi possível criar a proposta. Confira se há ao menos duas pessoas no Núcleo e tente novamente." };
  revalidatePath(`${routes.nucleus}/${nucleusId}/acordos`);
  redirect(`${routes.nucleus}/${nucleusId}/acordos?categoria=${input.category}&filtro=all&resultado=proposta`);
}

export async function respondAgreementProposal(nucleusId: string, agreementId: string,
  response: "accepted" | "declined", category: "habit" | "experience") {
  if (!uuid.test(nucleusId) || !uuid.test(agreementId)
    || !["accepted", "declined"].includes(response)
    || !["habit", "experience"].includes(category)) return;
  const { client: supabase, authUnavailable } = await authenticatedClient();
  if (!supabase) redirect(authUnavailable ? `${routes.nucleus}/${nucleusId}/acordos?categoria=${category}&resultado=erro` : routes.account);
  const { error } = await supabase.rpc("respond_nucleus_agreement", {
    target_agreement: agreementId, agreement_response: response,
  });
  revalidatePath(`${routes.nucleus}/${nucleusId}/acordos`);
  redirect(`${routes.nucleus}/${nucleusId}/acordos?categoria=${category}&filtro=all&resultado=${error ? "erro" : "resposta"}`);
}
