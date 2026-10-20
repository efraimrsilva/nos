import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CalendarWorkspace, type CalendarEvent } from "@/features/calendar/components/calendar-workspace";
import { parseCalendarPage } from "@/features/calendar/event-input";
import { isNucleusAuthUnavailable } from "@/features/nuclei/nucleus-access";
import { OnboardingShell } from "@/features/onboarding/components/onboarding-shell";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { routes } from "@/shared/routes";

export const metadata: Metadata = { title: "Agenda do Núcleo" };
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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
  // O RPC mascara autoria após a saída e conserva a autorização real de gestão.
  const { data, error } = await supabase.rpc("get_nucleus_calendar", {
    target_nucleus: id, from_ends_at: new Date().toISOString(), page_offset: offset, page_size: pageSize + 1,
  });
  if (error) throw new Error("Não foi possível consultar a agenda agora.");
  const events = ((data ?? []).slice(0, pageSize)) as CalendarEvent[];
  const hasNextPage = (data ?? []).length > pageSize;
  const weekStart = new Date(events[0]?.starts_at ?? Date.now());
  weekStart.setUTCHours(0, 0, 0, 0);
  weekStart.setUTCDate(weekStart.getUTCDate() - (weekStart.getUTCDay() + 6) % 7);
  const notice: Record<string, string> = {
    erro: "Não foi possível concluir a ação. Tente novamente.", removido: "Evento removido.",
    resposta: "Sua resposta foi registrada.", salvo: "Evento salvo.",
  };
  // Atualizações persistidas renovam os formulários, inclusive quando a URL de retorno é a mesma.
  const calendarVersion = JSON.stringify(events.map(event => [event.id, event.title, event.intention,
    event.starts_at, event.ends_at, (event.nucleus_event_participants ?? []).map(participant => participant.response)]));

  return <OnboardingShell nucleusName={nucleus.name}>
    {resultado && notice[resultado] && <p role="status" className="ui-status">{notice[resultado]}</p>}
    <CalendarWorkspace key={`${page}-${calendarVersion}`} nucleusId={id} nucleusName={nucleus.name} events={events} initialWeek={weekStart.toISOString()} today={new Date().toISOString().slice(0, 10)} />
    {(page > 1 || hasNextPage) && <nav aria-label="Páginas da agenda" className="calendar-pagination">
      {page > 1 ? <Link href={`${routes.nucleus}/${id}/agenda?pagina=${page - 1}`} className="ui-button-secondary">Eventos anteriores</Link> : <span />}
      {hasNextPage && <Link href={`${routes.nucleus}/${id}/agenda?pagina=${page + 1}`} className="ui-button-secondary">Mais eventos</Link>}
    </nav>}
  </OnboardingShell>;
}
