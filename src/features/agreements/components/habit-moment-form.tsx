"use client";

import { useActionState } from "react";
import { recordHabitMoment } from "@/features/agreements/habit-moment-actions";
import { habitMoodLabels } from "@/features/agreements/habit-moment-input";

export function HabitMomentForm({ nucleusId, agreementId }: { nucleusId: string; agreementId: string }) {
  const [state, action, pending] = useActionState(recordHabitMoment.bind(null, nucleusId, agreementId), { error: "" });
  return <form action={action} className="agreement-form" aria-busy={pending}>
    <fieldset disabled={pending} className="agreement-form-fields">
      <legend className="agreement-field-legend">Como foi esse momento?</legend>
      <div className="agreement-moods">
        {Object.entries(habitMoodLabels).map(([value, label]) => <label key={value}>
          <input type="radio" name="mood" value={value} required /><span>{label}</span>
        </label>)}
      </div>
      <label className="ui-field">Quer guardar uma nota? <span className="agreement-field-help">Opcional; visível para integrantes do Núcleo.</span>
        <textarea name="note" maxLength={500} rows={4} />
      </label>
    </fieldset>
    {state.error && <p role="alert" className="agreement-error">{state.error}</p>}
    <button type="submit" disabled={pending} className="ui-button">{pending ? "Salvando…" : "Salvar momento"}</button>
  </form>;
}
