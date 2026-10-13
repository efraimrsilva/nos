"use client";

import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { deleteCalendarEvent, respondCalendarEvent } from "@/features/calendar/actions";

function PresenceButtons({ nucleusId, eventId }: { nucleusId: string; eventId: string }) {
  // Dentro do mesmo form, pending bloqueia as duas escolhas durante a Server Action.
  const { pending } = useFormStatus();
  return <>
    <button disabled={pending} formAction={respondCalendarEvent.bind(null, nucleusId, eventId, "accepted")} className="min-h-11 rounded-xl border border-leaf px-4 text-sm font-semibold text-leaf transition-colors hover:bg-[#edf3e5] disabled:opacity-60 motion-reduce:transition-none">{pending ? "Registrando…" : "Posso participar"}</button>
    <button disabled={pending} formAction={respondCalendarEvent.bind(null, nucleusId, eventId, "declined")} className="min-h-11 rounded-xl border border-line px-4 text-sm font-semibold text-muted transition-colors hover:bg-white disabled:opacity-60 motion-reduce:transition-none">{pending ? "Registrando…" : "Não posso"}</button>
  </>;
}

export function CalendarPresenceForm({ nucleusId, eventId }: { nucleusId: string; eventId: string }) {
  return <form className="mt-2 flex flex-wrap gap-2"><PresenceButtons nucleusId={nucleusId} eventId={eventId} /></form>;
}

function RemovalButtons({ onCancel }: { onCancel: () => void }) {
  const { pending } = useFormStatus();
  return <div className="mt-3 flex flex-wrap gap-3">
    <button disabled={pending} type="submit" className="min-h-11 rounded-xl bg-red-700 px-4 text-sm font-semibold text-white disabled:opacity-60">{pending ? "Removendo…" : "Confirmar remoção"}</button>
    <button disabled={pending} type="button" onClick={onCancel} className="min-h-11 px-3 text-sm font-semibold text-leaf underline">Manter evento</button>
  </div>;
}

export function CalendarRemovalForm({ nucleusId, eventId, title }: { nucleusId: string; eventId: string; title: string }) {
  const [confirming, setConfirming] = useState(false);
  const opener = useRef<HTMLButtonElement>(null);
  const confirmation = useRef<HTMLFieldSetElement>(null);
  useEffect(() => { if (confirming) confirmation.current?.focus(); }, [confirming]);

  function cancel() {
    setConfirming(false);
    // Retornar o foco ao botão de origem preserva a orientação de quem usa teclado.
    opener.current?.focus();
  }

  return <div className="mt-4">
    <button ref={opener} type="button" aria-expanded={confirming} onClick={() => setConfirming(true)} className="min-h-11 text-sm font-semibold text-red-700 underline">Remover evento</button>
    {confirming && <form action={deleteCalendarEvent.bind(null, nucleusId, eventId)}>
      <fieldset ref={confirmation} tabIndex={-1} className="mt-3 rounded-xl border border-red-200 bg-red-50 p-4">
        <legend className="px-1 font-semibold">Confirmar remoção</legend>
        <p className="break-words text-sm">Remover “{title}” apaga o evento e todas as suas respostas de presença. Esta ação não pode ser desfeita.</p>
        <label className="mt-3 flex min-h-11 items-center gap-2 text-sm"><input type="checkbox" name="confirmRemoval" value="yes" required />Entendi que o evento e suas respostas serão removidos.</label>
        <RemovalButtons onCancel={cancel} />
      </fieldset>
    </form>}
  </div>;
}
