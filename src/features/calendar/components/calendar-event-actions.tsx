"use client";

import { Check, MessageCircle, Trash2, X } from "lucide-react";
import { useFormStatus } from "react-dom";
import { deleteCalendarEvent, respondCalendarEvent } from "@/features/calendar/actions";
import { ActionDialog } from "@/shared/components/ui/action-dialog";

function PresenceButtons({ nucleusId, eventId }: { nucleusId: string; eventId: string }) {
  // As duas escolhas compartilham o estado de envio da mesma ação no servidor.
  const { pending } = useFormStatus();
  return <div className="calendar-action-pair">
    <button disabled={pending} formAction={respondCalendarEvent.bind(null, nucleusId, eventId, "accepted")} className="ui-button"><Check size={18} aria-hidden="true" />{pending ? "Registrando…" : "Posso participar"}</button>
    <button disabled={pending} formAction={respondCalendarEvent.bind(null, nucleusId, eventId, "declined")} className="ui-button-secondary"><X size={18} aria-hidden="true" />{pending ? "Registrando…" : "Não posso"}</button>
  </div>;
}

export function CalendarPresenceForm({ nucleusId, eventId }: { nucleusId: string; eventId: string }) {
  return <ActionDialog trigger={<><MessageCircle size={18} aria-hidden="true" />Responder convite</>} title="Sua participação" description="Cada pessoa decide se pode participar. Você pode atualizar sua resposta enquanto o evento estiver disponível.">
    <form><PresenceButtons nucleusId={nucleusId} eventId={eventId} /></form>
  </ActionDialog>;
}

function RemovalButtons() {
  const { pending } = useFormStatus();
  return <div className="calendar-action-pair">
    <button disabled={pending} type="submit" className="ui-button calendar-danger">{pending ? "Removendo…" : "Confirmar remoção"}</button>
    <button disabled={pending} type="button" onClick={event => event.currentTarget.closest("dialog")?.close()} className="ui-button-secondary">Manter evento</button>
  </div>;
}

export function CalendarRemovalForm({ nucleusId, eventId, title }: { nucleusId: string; eventId: string; title: string }) {
  return <ActionDialog trigger={<><Trash2 size={17} aria-hidden="true" />Remover evento</>} title="Confirmar remoção" variant="text" className="calendar-remove-trigger">
    <form action={deleteCalendarEvent.bind(null, nucleusId, eventId)} className="calendar-form">
      <p className="ui-copy">Remover “{title}” apaga o evento e todas as suas respostas de presença. Esta ação não pode ser desfeita.</p>
      {/* O consentimento continua sendo enviado e conferido pela ação no servidor. */}
      <label className="calendar-consent"><input type="checkbox" name="confirmRemoval" value="yes" required /><span>Entendi que o evento e suas respostas serão removidos.</span></label>
      <RemovalButtons />
    </form>
  </ActionDialog>;
}
