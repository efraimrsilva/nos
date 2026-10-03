"use client";

import { useActionState } from "react";
import { submitHabitTrial, type TrialDecision } from "../habit-trial-actions";

export function HabitTrialForm({ nucleusId, agreementId, trialId = null, decision }: {
  nucleusId: string; agreementId: string; trialId?: string | null; decision: TrialDecision;
}) {
  const [state, action, pending] = useActionState(submitHabitTrial.bind(null, nucleusId, agreementId, trialId, decision), { error: "" });
  const labels = { propose: "Propor período de teste", accepted: "Aceitar período", declined: "Recusar período", confirm: "Sim, funcionou para nós" };
  return <form action={action} className="mt-3 grid gap-3">
    {decision === "propose" && <>
      <label className="grid gap-2 text-sm font-semibold">Duração do teste (dias)
        <input name="trialDays" type="number" required min={7} max={30} step={1} className="min-h-11 rounded-xl border border-line px-3" />
      </label>
      <p className="text-sm leading-7 text-muted">Ao propor, você aceita esta duração. O ciclo só começa quando todos os envolvidos aceitarem, sem contar dias anteriores.</p>
    </>}
    {state.error && <p role="alert" className="text-sm text-red-700">{state.error}</p>}
    <button disabled={pending} className="continue-button min-h-11 rounded-xl bg-forest px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
      {pending ? "Registrando decisão..." : labels[decision]}
    </button>
  </form>;
}
