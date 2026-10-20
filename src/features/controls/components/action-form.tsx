"use client";

import { useActionState, type ReactNode } from "react";
import type { ControlActionState } from "../actions";

export function ControlActionForm({ action, label, confirmation, children, danger = false, pendingLabel = "Salvando..." }: {
  action: (state: ControlActionState, form: FormData) => Promise<ControlActionState>;
  label: string; confirmation?: string; children?: ReactNode;
  danger?: boolean; pendingLabel?: string;
}) {
  const [state, submit, pending] = useActionState(action, { error: "" });
  return <form action={submit} className="control-form" aria-busy={pending}>
    <fieldset disabled={pending}>
      {children}
      {confirmation && <label className="control-check"><input type="checkbox" name="confirmed" required /><span>{confirmation}</span></label>}
      <button className={`ui-button${danger ? " ui-button-danger" : ""}`} disabled={pending}>{pending ? pendingLabel : label}</button>
    </fieldset>
    {state.error && <p role="alert" className="ui-feedback">{state.error}</p>}
    {state.success && <p role="status" className="ui-feedback">{state.success}</p>}
  </form>;
}
