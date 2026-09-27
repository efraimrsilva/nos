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

  return <form action={action} onSubmit={prepareSubmission} className="mt-4 grid gap-4">
    <label className="grid gap-1.5 text-sm font-semibold">Título
      <input name="title" required maxLength={100} defaultValue={event?.title} className="min-h-11 rounded-xl border border-line bg-white px-3 font-normal" />
    </label>
    <label className="grid gap-1.5 text-sm font-semibold">Intenção do momento <span className="font-normal text-muted">(opcional)</span>
      <textarea name="intention" maxLength={500} defaultValue={event?.intention} rows={3} className="rounded-xl border border-line bg-white p-3 font-normal" />
    </label>
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="grid gap-1.5 text-sm font-semibold">Início
        <input type="datetime-local" required value={start} onChange={(e) => setStart(e.target.value)} className="min-h-11 w-full rounded-xl border border-line bg-white px-3 font-normal" />
      </label>
      <label className="grid gap-1.5 text-sm font-semibold">Término
        <input type="datetime-local" required value={end} onChange={(e) => setEnd(e.target.value)} className="min-h-11 w-full rounded-xl border border-line bg-white px-3 font-normal" />
      </label>
    </div>
    <p className="text-xs text-muted">Horários no fuso deste dispositivo: {timeZone || "identificando…"}. Todos os integrantes atuais serão convidados.</p>
    <input type="hidden" name="startsAt" /><input type="hidden" name="endsAt" />
    <input type="hidden" name="timeZone" value={timeZone} />
    {(clientError || state.error) && <p role="alert" className="text-sm text-red-700">{clientError || state.error}</p>}
    <button disabled={pending || !timeZone} type="submit" className="continue-button min-h-11 rounded-xl bg-forest px-5 text-sm font-semibold text-white disabled:opacity-60">
      {pending ? "Salvando…" : event ? "Salvar alterações" : "Criar evento"}
    </button>
  </form>;
}
