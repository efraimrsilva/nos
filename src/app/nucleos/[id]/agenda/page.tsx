import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CalendarDays, ChevronLeft, LockKeyhole } from "lucide-react";
import { CalendarEventForm } from "@/features/calendar/components/calendar-event-form";
import { deleteCalendarEvent, respondCalendarEvent } from "@/features/calendar/actions";
import { formatCalendarEventDate, parseCalendarPage } from "@/features/calendar/event-input";
import { isNucleusAuthUnavailable } from "@/features/nuclei/nucleus-access";
import { OnboardingShell } from "@/features/onboarding/components/onboarding-shell";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { routes } from "@/shared/routes";

export const metadata: Metadata = { title: "Agenda do Núcleo" };
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type Participant = { user_id: string; response: string };
type EventRow = {
  id: string; title: string; intention: string; starts_at: string; ends_at: string;
  time_zone: string; created_by: string; nucleus_event_participants: Participant[];
};

function participationLabel(participants: Participant[]) {
  if (participants.some((participant) => participant.response === "declined")) return "Precisa de novo horário";
  if (participants.length && participants.every((participant) => participant.response === "accepted")) return "Confirmado";
  return "Aguardando respostas";
}

export default async function CalendarPage({ params, searchParams }: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ resultado?: string; pagina?: string }>;
}) {
  const { id } = await params;
  const { resultado, pagina } = await searchParams;
  const page = parseCalendarPage(pagina);
  const pageSize = 50;
  const offset = (page - 1) * pageSize;
  if (!uuid.test(id)) notFound();
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect(routes.account);
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (isNucleusAuthUnavailable(authError)) throw new Error("Não foi possível conferir a sessão agora.");
  if (!user) redirect(routes.account);
  const { data: membership, error: membershipError } = await supabase.from("nucleus_members")
    .select("role").eq("nucleus_id", id).eq("user_id", user.id).maybeSingle();
  if (membershipError) throw new Error("Não foi possível consultar a participação no Núcleo.");
  if (!membership) notFound();
  const { data: nucleus, error: nucleusError } = await supabase.from("nuclei")
    .select("name").eq("id", id).maybeSingle();
  if (nucleusError) throw new Error("Não foi possível consultar o Núcleo.");
  if (!nucleus) notFound();
  // A consulta usa a sessão SSR; a política RLS filtra eventos e respostas pelo Núcleo da pessoa.
  const { data, error } = await supabase.from("nucleus_events")
    .select("id,title,intention,starts_at,ends_at,time_zone,created_by,nucleus_event_participants(user_id,response)")
    .eq("nucleus_id", id).gte("ends_at", new Date().toISOString())
    .order("starts_at").order("id").range(offset, offset + pageSize);
  if (error) throw new Error("Não foi possível consultar a agenda agora.");
  const events = ((data ?? []).slice(0, pageSize)) as EventRow[];
  const hasNextPage = (data ?? []).length > pageSize;
  const notice: Record<string, string> = {
    erro: "Não foi possível concluir a ação. Tente novamente.",
    removido: "Evento removido.",
    resposta: "Sua resposta foi registrada.",
    salvo: "Evento salvo.",
  };

  return <OnboardingShell>
    <Link href={`${routes.nucleus}/${id}`} className="mb-5 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-leaf underline"><ChevronLeft size={16} aria-hidden="true" />Voltar ao Núcleo</Link>
    <div className="flex items-center gap-2 text-xs font-semibold text-muted"><LockKeyhole size={14} aria-hidden="true" />Agenda privada · {nucleus.name}</div>
    <h1 className="mt-3 font-display text-[32px] leading-tight md:text-[42px]">Agenda do Núcleo</h1>
    <p className="mt-2 text-sm leading-7 text-muted">Planejem momentos no tempo de vocês. Cada pessoa decide se pode participar.</p>
    <p className="mt-1 text-xs leading-6 text-muted">Os eventos aparecem apenas aqui no Nós; a sincronização com calendários externos ainda não está disponível.</p>
    {resultado && notice[resultado] && <p role="status" className="mt-4 rounded-xl bg-[#edf3e5] p-3 text-sm text-forest">{notice[resultado]}</p>}

    <section className="mt-6 rounded-[22px] border border-line bg-white p-5 shadow-[0_5px_18px_#52403805] sm:p-7" aria-labelledby="upcoming-heading">
      <div className="flex items-center gap-2.5"><CalendarDays size={21} className="text-leaf" aria-hidden="true" /><h2 id="upcoming-heading" className="font-display text-xl">Próximos momentos</h2></div>
      {events.length === 0 ? <p className="mt-4 text-sm leading-7 text-muted">{page === 1 ? "Nada marcado por enquanto. Vocês podem criar um momento quando fizer sentido." : "Nenhum evento nesta página. Volte aos anteriores."}</p> :
        <ol className="mt-4 grid gap-4">{events.map((event) => {
          const participants = event.nucleus_event_participants ?? [];
          const own = participants.find((participant) => participant.user_id === user.id);
          const canManage = membership.role === "creator" || event.created_by === user.id;
          const start = formatCalendarEventDate(event.starts_at, event.time_zone);
          const end = formatCalendarEventDate(event.ends_at, event.time_zone);
          return <li key={event.id} className="rounded-2xl border border-line bg-[#fbfaf7] p-4">
            <h3 className="break-words font-display text-lg">{event.title}</h3>
            <p className="mt-1 text-sm text-muted">{start.text} até {end.text} ({start.zoneLabel})</p>
            {event.intention && <p className="mt-2 whitespace-pre-wrap break-words text-sm text-muted">{event.intention}</p>}
            <p className="mt-3 text-xs font-semibold text-leaf">{participationLabel(participants)} · {participants.length} participante(s)</p>
            {own && <div className="mt-3">
              <p className="text-xs text-muted">Sua resposta: {own.response === "accepted" ? "vou participar" : own.response === "declined" ? "não posso participar" : "ainda não respondi"}.</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <form action={respondCalendarEvent.bind(null, id, event.id, "accepted")}><button className="min-h-11 rounded-xl border border-leaf px-4 text-sm font-semibold text-leaf">Posso participar</button></form>
                <form action={respondCalendarEvent.bind(null, id, event.id, "declined")}><button className="min-h-11 rounded-xl border border-line px-4 text-sm font-semibold text-muted">Não posso</button></form>
              </div>
            </div>}
            {canManage && <details className="mt-4 border-t border-line pt-3"><summary className="cursor-pointer text-sm font-semibold text-leaf">Editar ou remover</summary>
              <CalendarEventForm nucleusId={id} event={event} />
              <form action={deleteCalendarEvent.bind(null, id, event.id)} className="mt-4"><button className="min-h-11 text-sm font-semibold text-red-700 underline">Remover evento</button></form>
            </details>}
          </li>;
        })}</ol>}
      {(page > 1 || hasNextPage) && <nav aria-label="Páginas da agenda" className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm font-semibold text-leaf">
        {page > 1 ? <Link href={`${routes.nucleus}/${id}/agenda?pagina=${page - 1}`} className="underline">Eventos anteriores</Link> : <span />}
        {hasNextPage && <Link href={`${routes.nucleus}/${id}/agenda?pagina=${page + 1}`} className="underline">Mais eventos</Link>}
      </nav>}
    </section>

    <section className="mt-4 rounded-[22px] border border-line bg-white p-5 sm:p-7" aria-labelledby="create-heading">
      <h2 id="create-heading" className="font-display text-xl">Adicionar evento</h2>
      <p className="mt-2 text-sm text-muted">Todos os integrantes atuais receberão um pedido de resposta nesta agenda.</p>
      <CalendarEventForm nucleusId={id} />
    </section>
  </OnboardingShell>;
}
