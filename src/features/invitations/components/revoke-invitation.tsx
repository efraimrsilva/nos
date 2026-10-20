"use client";

import { useActionState } from "react";
import { ShieldX } from "lucide-react";
import { revokeInvitation } from "@/features/invitations/actions";
import { ActionDialog } from "@/shared/components/ui/action-dialog";

export function RevokeInvitation({ nucleusId, invitationId }: { nucleusId: string; invitationId: string }) {
  const [state, action, pending] = useActionState(revokeInvitation, { error: "", success: "" });
  return <ActionDialog trigger={<><ShieldX size={17} aria-hidden="true" />Revogar convite</>} title="Revogar convite" variant="secondary" className="invitation-revoke-trigger">
    {state.success ? <p role="status" className="ui-status">{state.success}</p> : <form action={action} className="ui-form-stack" aria-busy={pending}>
      <input type="hidden" name="nucleus_id" value={nucleusId} />
      <input type="hidden" name="invitation_id" value={invitationId} />
      <input type="hidden" name="confirm" value="yes" />
      <p className="ui-copy">Revogar impede novos aceites deste código. Quem já entrou continua participando.</p>
      {state.error && <p role="alert" className="ui-status">{state.error}</p>}
      <div className="invitation-share-actions"><button disabled={pending} className="ui-button invitation-danger">{pending ? "Revogando…" : "Confirmar revogação"}</button><button type="button" disabled={pending} onClick={event => event.currentTarget.closest("dialog")?.close()} className="ui-button-secondary">Cancelar</button></div>
    </form>}
  </ActionDialog>;
}
