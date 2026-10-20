"use client";

import { useActionState, useEffect, useState, type FormEvent } from "react";
import { saveCalendarEvent } from "@/features/calendar/actions";

type EditableEvent = { id: string; title: string; intention: string; starts_at: string; ends_at: string };

function localDateTime(value: string) {
  const date = new Date(value);
  const pad = (part: number) => String(part).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function CalendarEventForm({ nucleusId, event }: { nucleusId: string; event?: EditableEvent }) {
  const [state, action, pending] = useActionState(saveCalendarEvent.bind(null, nucleusId, event?.id ?? null), { error: "" });
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [timeZone, setTimeZone] = useState("");
  const [clientError, setClientError] = useState("");

  useEffect(() => {
    // A edição mostra os instantes no fuso do dispositivo; o banco conserva os instantes em UTC.
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");
    if (event) {
      setStart(localDateTime(event.starts_at));
      setEnd(localDateTime(event.ends_at));
    }
  }, [event]);

  function prepareSubmission(e: FormEvent<HTMLFormElement>) {
    if (!start || !end || !Number.isFinite(Date.parse(start)) || !Number.isFinite(Date.parse(end)) || Date.parse(start) >= Date.parse(end)) {
      e.preventDefault();
      setClientError("O término precisa ser posterior ao início.");
      return;
    }
    const form = e.currentTarget;
    (form.elements.namedItem("startsAt") as HTMLInputElement).value = new Date(start).toISOString();
    (form.elements.namedItem("endsAt") as HTMLInputElement).value = new Date(end).toISOString();
    setClientError("");
  }

  return <form action={action} onSubmit={prepareSubmission} className="calendar-form" aria-busy={pending}>
    <label className="ui-field">Título
      <input name="title" required maxLength={100} defaultValue={event?.title} />
    </label>
    <label className="ui-field">Intenção do momento (opcional)
      <textarea name="intention" maxLength={500} defaultValue={event?.intention} rows={3} />
    </label>
    <div className="calendar-form-dates">
      <label className="ui-field">Início
        <input type="datetime-local" required value={start} onChange={(e) => setStart(e.target.value)} />
      </label>
      <label className="ui-field">Término
        <input type="datetime-local" required value={end} onChange={(e) => setEnd(e.target.value)} />
      </label>
    </div>
    <p className="calendar-form-note">Horários no fuso deste dispositivo: {timeZone || "identificando…"}. {event ? "A edição mantém o conjunto de participantes do evento." : "Todos os integrantes atuais serão convidados."}</p>
    {event ? <p className="calendar-form-note">Alterar título ou intenção mantém as respostas. Mudar o início ou término pede nova resposta aos demais participantes; a sua resposta é preservada.</p> : <p className="calendar-form-note">Ao criar, você confirma sua própria presença. Os demais integrantes atuais ficam aguardando resposta; ninguém é confirmado automaticamente por você.</p>}
    <input type="hidden" name="startsAt" /><input type="hidden" name="endsAt" />
    <input type="hidden" name="timeZone" value={timeZone} />
    {(clientError || state.error) && <p role="alert" className="calendar-form-error">{clientError || state.error}</p>}
    <button disabled={pending || !timeZone} type="submit" className="ui-button">
      {pending ? "Salvando…" : event ? "Salvar alterações" : "Criar evento"}
    </button>
  </form>;
}
