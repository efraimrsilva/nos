"use client";

import { useActionState, type ReactNode } from "react";
import type { ControlActionState } from "../actions";

export function ControlActionForm({ action, label, confirmation, children }: {
  action: (state: ControlActionState, form: FormData) => Promise<ControlActionState>;
  label: string; confirmation?: string; children?: ReactNode;
}) {
  const [state, submit, pending] = useActionState(action, { error: "" });
  return <form action={submit} className="mt-3 grid gap-3" aria-busy={pending}>
    <fieldset disabled={pending} className="grid gap-3">
      {children}
      {confirmation && <label className="flex items-start gap-3 text-sm"><input type="checkbox" name="confirmed" required className="mt-1 h-5 w-5 shrink-0" /><span>{confirmation}</span></label>}
      <button className="continue-button min-h-11 rounded-xl bg-forest px-4 text-sm font-semibold text-white disabled:opacity-60" disabled={pending}>{pending ? "Salvando..." : label}</button>
    </fieldset>
    {state.error && <p role="alert" className="text-sm text-red-700">{state.error}</p>}
    {state.success && <p role="status" className="text-sm text-leaf">{state.success}</p>}
  </form>;
}
