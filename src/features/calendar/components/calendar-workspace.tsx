"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { ArrowRight, CalendarDays, Check, ChevronLeft, ChevronRight, Clock3, Pencil, Plus, UsersRound } from "lucide-react";
import { calendarEventLanes } from "../calendar-lanes";
import { formatCalendarEventDate } from "@/features/calendar/event-input";
import { CalendarEventForm } from "./calendar-event-form";
import { CalendarPresenceForm, CalendarRemovalForm } from "./calendar-event-actions";
import { ActionDialog } from "@/shared/components/ui/action-dialog";
import "./calendar-workspace.css";

export type CalendarParticipant = { user_id: string | null; response: string; is_own: boolean; account_deleted?: boolean };
export type CalendarEvent = {
  id: string; title: string; intention: string; starts_at: string; ends_at: string;
  time_zone: string; created_by: string | null; can_manage: boolean; creator_deleted?: boolean;
  nucleus_event_participants: CalendarParticipant[];
};
const dayDuration = 86_400_000;
const clock = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" });
const month = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric", timeZone: "UTC" });
const day = new Intl.DateTimeFormat("pt-BR", { weekday: "short", day: "numeric", timeZone: "UTC" });

function participationLabel(allParticipants: CalendarParticipant[]) {
  const participants = allParticipants.filter(participant => !participant.account_deleted);
  if (participants.some(participant => participant.response === "declined")) return "Precisa de novo horário";
  if (participants.length && participants.every(participant => participant.response === "accepted")) return "Confirmado";
  return "Aguardando respostas";
}

function segmentForDay(event: CalendarEvent, dayStart: number) {
  const start = Math.max(Date.parse(event.starts_at), dayStart);
  const end = Math.min(Date.parse(event.ends_at), dayStart + dayDuration);
  return { start, end, startHour: (start - dayStart) / 3_600_000, endHour: (end - dayStart) / 3_600_000 };
}

export function CalendarWorkspace({ nucleusId, nucleusName, events, initialWeek, today }: {
  nucleusId: string; nucleusName: string; events: CalendarEvent[]; initialWeek: string; today: string;
}) {
  const [weekStart, setWeekStart] = useState(Date.parse(initialWeek));
  const [selection, setSelection] = useState<string | null>(events[0]?.id ?? null);
  const weekEnd = weekStart + 7 * dayDuration;
  const days = Array.from({ length: 7 }, (_, index) => new Date(weekStart + index * dayDuration));
  // A grade usa UTC explicitamente; o detalhe preserva o fuso original de cada encontro.
  const weekEvents = events.filter(event => Date.parse(event.starts_at) < weekEnd && Date.parse(event.ends_at) > weekStart);
  const selected = events.find(event => event.id === selection);
  // Eventos que atravessam a meia-noite têm um segmento próprio em cada dia da grade.
  const segments = days.flatMap(date => weekEvents.map(event => segmentForDay(event, date.getTime())).filter(segment => segment.end > segment.start));
  const earliestHour = Math.floor(Math.min(9, ...segments.map(segment => segment.startHour)));
  const latestHour = Math.ceil(Math.max(21, ...segments.map(segment => segment.endHour)));
  const range = latestHour - earliestHour;
  const timelineHeight = 385;
  const participants = selected?.nucleus_event_participants ?? [];
  // Respostas históricas permanecem, mas contas excluídas não confirmam presença atual.
  const currentParticipants = participants.filter(participant => !participant.account_deleted);
  const deletedResponses = participants.length - currentParticipants.length;
  const own = participants.find(participant => participant.is_own);
  const selectedStart = selected && formatCalendarEventDate(selected.starts_at, selected.time_zone);
  const selectedEnd = selected && formatCalendarEventDate(selected.ends_at, selected.time_zone);

  useEffect(() => {
    // Links do Início conservam o formato /agenda#evento-ID e abrem o encontro na semana certa.
    let frame = 0;
    function selectFromHash() {
      const event = events.find(item => window.location.hash === `#evento-${item.id}`);
      if (!event) return;
      const date = new Date(event.starts_at);
      date.setUTCHours(0, 0, 0, 0);
      date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 6) % 7);
      setWeekStart(date.getTime());
      setSelection(event.id);
      frame = window.requestAnimationFrame(() => document.getElementById("calendar-detail-heading")?.scrollIntoView({ block: "nearest" }));
    }
    selectFromHash();
    window.addEventListener("hashchange", selectFromHash);
    return () => { window.removeEventListener("hashchange", selectFromHash); window.cancelAnimationFrame(frame); };
  }, [events]);

  function moveWeek(direction: number) {
    const next = weekStart + direction * 7 * dayDuration;
    setWeekStart(next);
    setSelection(events.find(event => Date.parse(event.starts_at) < next + 7 * dayDuration && Date.parse(event.ends_at) > next)?.id ?? null);
  }

  function chooseEvent(event: CalendarEvent) {
    setSelection(event.id);
    if (window.matchMedia("(max-width: 900px)").matches) {
      window.requestAnimationFrame(() => document.getElementById("calendar-detail-heading")?.scrollIntoView({ block: "start" }));
    }
  }

  return <>
    <header className="ui-page-header">
      <div><p className="ui-kicker">Agenda compartilhada</p><h1 className="ui-title">Tempo para o que importa.</h1><p className="ui-copy">Planejem momentos no tempo de vocês. Cada pessoa decide se pode participar.</p></div>
      <ActionDialog trigger={<><Plus size={18} aria-hidden="true" />Novo momento</>} title="Adicionar evento" description="Todos os integrantes atuais receberão um pedido de resposta nesta agenda." size="wide" variant="primary"><CalendarEventForm nucleusId={nucleusId} /></ActionDialog>
    </header>
    <div className="calendar-workspace">
      <section className="calendar-main" aria-label="Agenda do Núcleo">
        <div className="calendar-toolbar">
          <button type="button" className="calendar-nav" aria-label="Semana anterior" onClick={() => moveWeek(-1)}><ChevronLeft size={17} aria-hidden="true" /></button>
          <h2>{month.format(new Date(weekStart))}</h2>
          <button type="button" className="calendar-nav" aria-label="Próxima semana" onClick={() => moveWeek(1)}><ChevronRight size={17} aria-hidden="true" /></button>
          <span className="ui-badge">Semana · UTC</span>
        </div>
        <p className="calendar-date-range" aria-live="polite">{new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long", timeZone: "UTC" }).format(days[0])} — {new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(days[6])}</p>
        <div className="calendar-week" aria-label="Visão semanal em UTC">
          {days.map(date => {
            const key = date.toISOString().slice(0, 10);
            const dayStart = date.getTime();
            const dayEvents = weekEvents.filter(event => Date.parse(event.starts_at) < dayStart + dayDuration && Date.parse(event.ends_at) > dayStart);
            // A colisão considera o intervalo visual completo, inclusive cartões curtos de 100px.
            const positioned = dayEvents.map(event => {
              const segment = segmentForDay(event, dayStart);
              const top = 8 + (segment.startHour - earliestHour) / range * timelineHeight;
              const height = Math.max(100, (segment.endHour - segment.startHour) / range * timelineHeight);
              return { event, segment, top, height };
            });
            const lanes = calendarEventLanes(positioned.map(item => ({ id: item.event.id, start: item.top, end: item.top + item.height })));
            return <section key={key} className={`calendar-day ${key === today ? "calendar-day-current" : ""}`} aria-label={day.format(date)}>
              <h3><time dateTime={key}>{day.format(date).replace(".", "")}</time></h3>
              <div className="calendar-day-schedule">
                {[0, 3, 6, 9, 12, 15, 18, 21].filter(hour => hour >= earliestHour && hour < latestHour).map(hour => <span key={hour} className="calendar-hour" style={{ top: `${8 + (hour - earliestHour) / range * timelineHeight}px` }}>{String(hour).padStart(2, "0")}:00</span>)}
                {positioned.map(({ event, segment, top, height }, index) => {
                  const { lane, total } = lanes.get(event.id)!;
                  const style = { top: `${top}px`, height: `${height}px`, left: `calc(${lane / total * 100}% + 5px)`, width: `calc(${100 / total}% - 10px)` } as CSSProperties;
                  return <button key={event.id} type="button" style={style} aria-label={`${event.title} · ${nucleusName} · ${clock.format(new Date(segment.start))} até ${clock.format(new Date(segment.end))} UTC`} className={`calendar-event calendar-tone-${index % 3} ${selection === event.id ? "calendar-event-selected" : ""}`} onClick={() => chooseEvent(event)} aria-pressed={selection === event.id}>
                    <time dateTime={new Date(segment.start).toISOString()}>{clock.format(new Date(segment.start))}</time><strong>{event.title}</strong><span>{nucleusName}</span>
                    {segment.start > Date.parse(event.starts_at) && <span className="calendar-event-continuation">Continua do dia anterior</span>}
                    {segment.end < Date.parse(event.ends_at) ? <span className="calendar-event-continuation">Continua no dia seguinte</span> : <span>Até {clock.format(new Date(segment.end))}</span>}
                  </button>;
                })}
              </div>
            </section>;
          })}
        </div>
        <div className="calendar-mobile-list">
          {weekEvents.length ? weekEvents.map(event => <button type="button" key={event.id} onClick={() => chooseEvent(event)} className={`calendar-list-event ${selection === event.id ? "is-selected" : ""}`} aria-pressed={selection === event.id}>
            <span className="calendar-date-tile"><strong>{new Date(event.starts_at).getUTCDate()}</strong><small>{new Intl.DateTimeFormat("pt-BR", { month: "short", timeZone: "UTC" }).format(new Date(event.starts_at)).replace(".", "")}</small></span>
            <span><strong>{event.title}</strong><small>{clock.format(new Date(event.starts_at))} UTC · {participationLabel(event.nucleus_event_participants ?? [])}</small></span><ArrowRight size={17} aria-hidden="true" />
          </button>) : <div className="ui-empty"><CalendarDays size={30} aria-hidden="true" /><p>Nenhum momento nesta semana.</p></div>}
        </div>
        <p className="calendar-grid-note">Horários da grade em UTC (Tempo Universal Coordenado). O detalhe mostra o fuso de cada encontro. A navegação considera os eventos desta página.</p>
        {events.length > 0 && <details className="calendar-all-events"><summary>Todos os eventos desta página ({events.length})</summary><div>{events.map(event => <button type="button" key={event.id} onClick={() => { const date = new Date(event.starts_at); date.setUTCHours(0, 0, 0, 0); date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 6) % 7); setWeekStart(date.getTime()); chooseEvent(event); }}><span>{event.title}</span><small>{formatCalendarEventDate(event.starts_at, event.time_zone).text}</small><ArrowRight size={16} aria-hidden="true" /></button>)}</div></details>}
      </section>
      <aside className="ui-panel calendar-detail" aria-labelledby="calendar-detail-heading" aria-live="polite">
        <div className="calendar-detail-label"><h2 id="calendar-detail-heading">{selected ? "Seu próximo momento" : "Um tempo para vocês"}</h2><CalendarDays size={19} aria-hidden="true" /></div>
        {selected && selectedStart && selectedEnd ? <div className="calendar-selected-event" key={selected.id}>
          <p className="ui-kicker"><time dateTime={selected.starts_at}>{day.format(new Date(selected.starts_at))} · {clock.format(new Date(selected.starts_at))} UTC</time></p>
          <h3>{selected.title}</h3>
          {selected.creator_deleted && <p className="ui-copy">Criado por Conta excluída.</p>}
          <p className="ui-copy">{selected.intention || "Um momento para estar presente, do jeito que fizer sentido para vocês."}</p>
          <p className="calendar-detail-time"><Clock3 size={16} aria-hidden="true" /><span>{selectedStart.text} até {selectedEnd.text}<small>{selectedStart.zoneLabel}</small></span></p>
          <p className="calendar-participants"><UsersRound size={19} aria-hidden="true" />{currentParticipants.length} participante(s)<span>{currentParticipants.filter(participant => participant.response === "accepted").length} com presença confirmada</span></p>
          {deletedResponses > 0 && <p className="ui-copy">{deletedResponses} resposta(s) histórica(s) de Conta excluída.</p>}
          <span className={`ui-badge ${own?.response === "pending" ? "calendar-pending" : ""}`}>{participationLabel(participants)}</span>
          {own && <><p className="calendar-own-response"><Check size={15} aria-hidden="true" />Sua resposta: {own.response === "accepted" ? "vou participar" : own.response === "declined" ? "não posso participar" : "ainda não respondi"}.</p><CalendarPresenceForm nucleusId={nucleusId} eventId={selected.id} /></>}
          {selected.can_manage && <div className="calendar-management"><ActionDialog trigger={<><Pencil size={16} aria-hidden="true" />Editar evento</>} title="Editar evento" variant="secondary" size="wide"><CalendarEventForm nucleusId={nucleusId} event={selected} /></ActionDialog><CalendarRemovalForm nucleusId={nucleusId} eventId={selected.id} title={selected.title} /></div>}
        </div> : <div className="calendar-empty-detail"><CalendarDays size={40} aria-hidden="true" /><p>Nada marcado por enquanto. Vocês podem criar um momento quando fizer sentido.</p><p>Escolha um evento na agenda para ver o convite e sua participação.</p></div>}
      </aside>
    </div>
    <details className="calendar-future"><summary>Esboço de funcionalidade · ainda não desenvolvido</summary><p>Navegação mensal e por dia, recorrência, local, escolha de participantes, outras respostas e sincronização com calendários externos estão planejados. Os eventos atuais ficam disponíveis somente nesta agenda.</p></details>
  </>;
}
