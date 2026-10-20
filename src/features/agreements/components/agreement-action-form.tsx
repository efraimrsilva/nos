"use client";

import { useActionState, type ReactNode } from "react";
import type { ControlActionState } from "@/features/controls/actions";

// As mesmas ações administrativas verificam permissão, confirmação e versão no servidor.
export function AgreementActionForm({ action, label, confirmation, children, danger = false }: {
  action: (state: ControlActionState, form: FormData) => Promise<ControlActionState>;
  label: string; confirmation: string; children?: ReactNode; danger?: boolean;
}) {
  const [state, submit, pending] = useActionState(action, { error: "" });
  return <form action={submit} className="agreement-action-form" aria-busy={pending}>
    <fieldset disabled={pending}>
      {children}
      <label className="agreement-confirmation"><input type="checkbox" name="confirmed" required /><span>{confirmation}</span></label>
      <button className={`ui-button${danger ? " agreement-danger" : ""}`} disabled={pending}>{pending ? "Salvando..." : label}</button>
    </fieldset>
    {state.error && <p role="alert" className="agreement-error">{state.error}</p>}
    {state.success && <p role="status" className="agreements-feedback">{state.success}</p>}
  </form>;
}
