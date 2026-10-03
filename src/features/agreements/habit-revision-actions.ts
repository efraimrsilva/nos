"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { loadHabitContext, uuid } from "./habit-access";
import { parseAgreementProposal } from "./proposal-input";

export type RevisionState = { error: string };

export async function submitHabitRevision(nucleusId: string, agreementId: string,
  _previous: RevisionState, form: FormData): Promise<RevisionState> {
  const { supabase, habit } = await loadHabitContext(nucleusId, agreementId);
  const kind = String(form.get("kind") ?? "");
  if (!["testing", "active"].includes(habit.status) || !["adjust", "end"].includes(kind)) return { error: "Revisão indisponível." };
  const input = parseAgreementProposal({ category: "habit", title: String(form.get("title") ?? ""),
    description: String(form.get("description") ?? ""), timing: String(form.get("timing") ?? ""),
    frequency: String(form.get("frequency") ?? "") });
  if (kind === "adjust" && !input) return { error: "Preencha todos os campos do combinado dentro dos limites indicados." };
  // O aceite do autor, a fotografia dos envolvidos e o prazo são gravados na mesma transação.
  const { error } = await supabase.rpc("create_nucleus_habit_revision", {
    target_agreement: agreementId, revision_kind: kind,
    revision_title: kind === "adjust" ? input!.title : null,
    revision_description: kind === "adjust" ? input!.description : null,
    revision_timing: kind === "adjust" ? input!.timing : null,
    revision_frequency: kind === "adjust" ? input!.frequency : null,
  });
  if (error) return { error: "Não foi possível propor a revisão. Confira se há mudanças, se todos os envolvidos permanecem no Núcleo e se já existe uma revisão pendente." };
  refresh(nucleusId, agreementId);
  redirect(`${path(nucleusId, agreementId)}/revisar?resultado=proposta`);
}

export async function decideHabitRevision(nucleusId: string, agreementId: string, revisionId: string,
  decision: "accepted" | "declined" | "apply", _previous: RevisionState): Promise<RevisionState> {
  if (!uuid.test(revisionId) || !["accepted", "declined", "apply"].includes(decision)) return { error: "Resposta inválida." };
  const { supabase } = await loadHabitContext(nucleusId, agreementId);
  // A relação com a rota é conferida além da autorização que a RPC aplica no banco.
  const { data, error: lookupError } = await supabase.from("nucleus_habit_revisions")
    .select("id").eq("id", revisionId).eq("agreement_id", agreementId).maybeSingle();
  if (lookupError || !data) return { error: "Não foi possível conferir a revisão." };
  const { error } = decision === "apply"
    ? await supabase.rpc("apply_nucleus_habit_revision", { target_revision: revisionId })
    : await supabase.rpc("respond_nucleus_habit_revision", { target_revision: revisionId, revision_response: decision });
  if (error) return { error: decision === "apply"
    ? "A aplicação exige sete dias completos, aceite de todos e permanência dos envolvidos no Núcleo. Atualize a página para conferir a solicitação."
    : "Não foi possível responder. A solicitação pode ter sido respondida ou concluída; atualize a página." };
  refresh(nucleusId, agreementId);
  redirect(`${path(nucleusId, agreementId)}/revisar?resultado=${decision === "apply" ? "aplicada" : "resposta"}`);
}

function path(nucleusId: string, agreementId: string) { return `/nucleos/${nucleusId}/acordos/${agreementId}`; }
function refresh(nucleusId: string, agreementId: string) {
  revalidatePath(path(nucleusId, agreementId));
  revalidatePath(`${path(nucleusId, agreementId)}/revisar`);
  revalidatePath(`/nucleos/${nucleusId}/acordos`);
}
