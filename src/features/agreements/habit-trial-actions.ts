"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { loadHabitContext, uuid } from "./habit-access";
import { parseTrialDays } from "./habit-trial-input";

export type TrialDecision = "propose" | "accepted" | "declined" | "confirm";
export async function submitHabitTrial(nucleusId: string, agreementId: string, trialId: string | null,
  decision: TrialDecision, _previous: { error: string }, form: FormData): Promise<{ error: string }> {
  if (!["propose", "accepted", "declined", "confirm"].includes(decision)) return { error: "Ação inválida." };
  const { supabase, habit } = await loadHabitContext(nucleusId, agreementId);
  if (habit.status !== "testing") return { error: "O Hábito já não está em teste. Atualize a página." };
  const days = parseTrialDays(form.get("trialDays"));
  if (decision === "propose" && days === null) return { error: "Escolha um período inteiro entre 7 e 30 dias." };
  if (decision !== "propose") {
    if (!trialId || !uuid.test(trialId)) return { error: "Ciclo inválido." };
    // IDs vinculados ao formulário não são autorização: conferimos a relação com a rota e a RPC repete as permissões.
    const { data, error } = await supabase.from("nucleus_habit_trials").select("id")
      .eq("id", trialId).eq("agreement_id", agreementId).maybeSingle();
    if (error || !data) return { error: "Não foi possível conferir o ciclo de teste." };
  }
  const result = decision === "propose"
    ? await supabase.rpc("propose_nucleus_habit_trial", { target_agreement: agreementId, trial_days: days })
    : decision === "confirm"
      ? await supabase.rpc("confirm_nucleus_habit_trial", { target_trial: trialId })
      : await supabase.rpc("respond_nucleus_habit_trial", { target_trial: trialId, trial_response: decision });
  if (result.error) return { error: "Não foi possível registrar a decisão. Confira o prazo, a permanência dos participantes e se há revisão ou resposta já registrada. Atualize a página para conferir o estado atual." };
  const base = `/nucleos/${nucleusId}/acordos/${agreementId}`;
  revalidatePath(base, "layout");
  revalidatePath(`/nucleos/${nucleusId}/acordos`);
  redirect(`${base}/confirmar?resultado=${decision === "confirm" ? "confirmacao" : "periodo"}`);
}
