"use client";

import { useActionState, useState } from "react";
import { submitHabitRevision, decideHabitRevision } from "../habit-revision-actions";

type HabitFields = { title: string; description: string; timing: string; frequency: string; trial_days: number | null };
export function HabitRevisionForm({ nucleusId, agreementId, habit }: {
  nucleusId: string; agreementId: string; habit: HabitFields;
}) {
  const [kind, setKind] = useState("adjust");
  const [state, action, pending] = useActionState(submitHabitRevision.bind(null, nucleusId, agreementId), { error: "" });
  return <form action={action} className="mt-4 grid gap-4">
    <label className="grid gap-2 text-sm font-semibold">O que você propõe?
      <select name="kind" value={kind} onChange={(e) => setKind(e.target.value)} className="min-h-11 rounded-xl border border-line bg-white px-3">
        <option value="adjust">Ajustar o combinado</option><option value="end">Encerrar de comum acordo</option>
      </select>
    </label>
    {kind === "adjust" && <>
      <p className="text-sm leading-7 text-muted">Ao aplicar o ajuste, o Hábito volta a ficar em teste. {habit.trial_days ? `Um novo período de ${habit.trial_days} dias começa nessa aplicação e exige novas confirmações após o prazo.` : "Como não há duração acordada, será necessário propor um período de 7 a 30 dias e obter o aceite de todos para iniciá-lo."} Momentos, ciclos e votos anteriores ficam no histórico; os votos antigos não confirmam o novo combinado.</p>
      <label className="grid gap-2 text-sm font-semibold">O que vamos fazer?<input name="title" required maxLength={100} defaultValue={habit.title} className="min-h-11 rounded-xl border border-line px-3" /></label>
      <label className="grid gap-2 text-sm font-semibold">Como será?<textarea name="description" required maxLength={500} defaultValue={habit.description} rows={3} className="rounded-xl border border-line p-3" /></label>
      <label className="grid gap-2 text-sm font-semibold">Quando?<input name="timing" required maxLength={120} defaultValue={habit.timing} className="min-h-11 rounded-xl border border-line px-3" /></label>
      <label className="grid gap-2 text-sm font-semibold">Com que frequência?<input name="frequency" required maxLength={120} defaultValue={habit.frequency} className="min-h-11 rounded-xl border border-line px-3" /></label>
    </>}
    {kind === "end" && <p className="text-sm leading-7 text-muted">Encerrar preserva os momentos registrados. O estado atual permanece até o aceite de todos, os sete dias de reflexão e a confirmação da aplicação.</p>}
    <p className="text-sm leading-7 text-muted">Ao enviar, você aceita esta solicitação. Ela será visível aos integrantes do Núcleo. As outras pessoas envolvidas respondem individualmente.</p>
    {state.error && <p role="alert" className="text-sm text-red-700">{state.error}</p>}
    <button disabled={pending} className="continue-button min-h-11 rounded-xl bg-forest px-4 text-sm font-semibold text-white disabled:opacity-60">{pending ? "Enviando..." : "Enviar revisão para consentimento"}</button>
  </form>;
}

export function RevisionDecision({ nucleusId, agreementId, revisionId, decision }: {
  nucleusId: string; agreementId: string; revisionId: string; decision: "accepted" | "declined" | "apply";
}) {
  const [state, action, pending] = useActionState(decideHabitRevision.bind(null, nucleusId, agreementId, revisionId, decision), { error: "" });
  return <form action={action} className="mt-3">
    {state.error && <p role="alert" className="mb-2 text-sm text-red-700">{state.error}</p>}
    <button disabled={pending} className="continue-button min-h-11 rounded-xl border border-line bg-white px-4 text-sm font-semibold text-leaf disabled:opacity-60">
      {pending ? "Registrando..." : decision === "apply" ? "Confirmar aplicação após consenso" : decision === "accepted" ? "Aceitar revisão" : "Recusar e manter combinado"}
    </button>
  </form>;
}
