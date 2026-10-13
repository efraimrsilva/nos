"use client";

import { useActionState, useState } from "react";
import { revokeInvitation } from "@/features/invitations/actions";

export function RevokeInvitation({ nucleusId, invitationId }: { nucleusId: string; invitationId: string }) {
  const [confirming, setConfirming] = useState(false);
  const [state, action, pending] = useActionState(revokeInvitation, { error: "", success: "" });
  if (state.success) return <p role="status" className="mt-3 text-sm text-leaf">{state.success}</p>;
  return <div className="mt-3">
    {!confirming ? <button onClick={() => setConfirming(true)} className="min-h-11 rounded-xl border border-line px-4 text-sm font-semibold transition-colors hover:bg-canvas">Revogar convite</button> : <form action={action}>
      <input type="hidden" name="nucleus_id" value={nucleusId} />
      <input type="hidden" name="invitation_id" value={invitationId} />
      <input type="hidden" name="confirm" value="yes" />
      <p className="text-sm leading-6 text-muted">Revogar impede novos aceites deste código. Quem já entrou continua participando.</p>
      {state.error && <p role="alert" className="mt-2 text-sm text-[#9a3153]">{state.error}</p>}
      <div className="mt-3 flex flex-wrap gap-2">
        <button disabled={pending} className="continue-button min-h-11 rounded-xl bg-forest px-4 text-sm font-semibold text-white disabled:opacity-60">{pending ? "Revogando…" : "Confirmar revogação"}</button>
        <button type="button" disabled={pending} onClick={() => setConfirming(false)} className="min-h-11 rounded-xl border border-line px-4 text-sm font-semibold">Cancelar</button>
      </div>
    </form>}
  </div>;
}
