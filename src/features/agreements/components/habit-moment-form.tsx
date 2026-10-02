"use client";

import { useActionState } from "react";
import { recordHabitMoment } from "@/features/agreements/habit-moment-actions";
import { habitMoodLabels } from "@/features/agreements/habit-moment-input";

export function HabitMomentForm({ nucleusId, agreementId }: { nucleusId: string; agreementId: string }) {
  const [state, action, pending] = useActionState(recordHabitMoment.bind(null, nucleusId, agreementId), { error: "" });
  return <form action={action} className="mt-5 grid gap-5">
    <fieldset>
      <legend className="text-sm font-semibold text-forest">Como foi esse momento?</legend>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {Object.entries(habitMoodLabels).map(([value, label]) => <label key={value} className="cursor-pointer">
          <input type="radio" name="mood" value={value} required className="peer sr-only" />
          <span className="flex min-h-11 items-center justify-center rounded-xl border border-line bg-white px-3 text-sm font-semibold text-leaf transition-colors peer-checked:border-forest peer-checked:bg-[#edf3e5] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-forest motion-reduce:transition-none">{label}</span>
        </label>)}
      </div>
    </fieldset>
    <label className="grid gap-2 text-sm font-semibold text-forest">Quer guardar uma nota? <span className="font-normal text-muted">Opcional; visível para integrantes do Núcleo.</span>
      <textarea name="note" maxLength={500} rows={4} className="rounded-xl border border-line bg-white p-3 font-normal" />
    </label>
    {state.error && <p role="alert" className="text-sm text-red-700">{state.error}</p>}
    <button type="submit" disabled={pending} className="continue-button min-h-11 rounded-xl bg-forest px-5 text-sm font-semibold text-white disabled:opacity-60">
      {pending ? "Salvando…" : "Salvar momento"}
    </button>
  </form>;
}
