import type { Metadata } from "next";
import Link from "next/link";
import { loadHabitContext } from "@/features/agreements/habit-access";
import { parseHabitMomentCursor } from "@/features/agreements/habit-moment-input";
import { HabitTrialForm } from "@/features/agreements/components/habit-trial-form";
import { HabitConsentGuidance } from "@/features/agreements/components/habit-consent-guidance";
import { OnboardingShell } from "@/features/onboarding/components/onboarding-shell";

export const metadata: Metadata = { title: "Confirmar hábito após teste" };
type TrialState = {
  id: string; status: string; days: number; started_at: string | null; ends_at: string | null;
  activated_at: string | null; participants: number; required: number; votes: number;
  own_setup: string | null; own_confirmed: boolean; participants_available: boolean;
  revision_pending: boolean; can_confirm: boolean; can_respond: boolean;
};
const date = (value: string) => `${new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }).format(new Date(value))} UTC`;

export default async function HabitConfirmationPage({ params, searchParams }: {
  params: Promise<{ id: string; agreementId: string }>;
  searchParams: Promise<{ resultado?: string | string[]; antes?: string | string[] }>;
}) {
  const { id, agreementId } = await params;
  const { supabase, habit } = await loadHabitContext(id, agreementId, true);
  const query = await searchParams;
  // A prontidão e a contagem vêm do banco; o relógio do navegador não libera confirmação.
  const { data, error } = await supabase.rpc("get_nucleus_habit_trial_state", { target_agreement: agreementId });
  if (error) throw new Error("Não foi possível conferir o teste do Hábito.");
  const current = data as TrialState | null;
  const { data: revision, error: revisionError } = await supabase.from("nucleus_habit_revisions")
    .select("id").eq("agreement_id", agreementId).eq("status", "pending").maybeSingle();
  if (revisionError) throw new Error("Não foi possível conferir a revisão pendente.");
  const cursor = parseHabitMomentCursor(query.antes);
  let history = supabase.from("nucleus_habit_trials").select("id,status,days,title,created_at,started_at,ends_at,activated_at")
    .eq("agreement_id", agreementId);
  if (cursor) history = history.or(`created_at.lt."${cursor.createdAt}",and(created_at.eq."${cursor.createdAt}",id.lt.${cursor.id})`);
  const { data: cycles, error: historyError } = await history.order("created_at", { ascending: false }).order("id", { ascending: false }).limit(21);
  if (historyError) throw new Error("Não foi possível consultar os ciclos de teste.");
  const visible = (cycles ?? []).slice(0, 20);
  const base = `/nucleos/${id}/acordos/${agreementId}`;
  const ownParticipant = habit.nucleus_agreement_participants?.[0]?.response === "accepted";
  const labels: Record<string, string> = { pending: "Período aguardando consenso", testing: "Em teste", active: "Confirmado com os votos exigidos", declined: "Período recusado", superseded: "Substituído após ajuste", ended: "Encerrado" };
  return <OnboardingShell>
    <Link href={base} className="inline-flex min-h-11 items-center text-sm font-semibold text-leaf underline">Voltar ao Hábito</Link>
    <h1 className="mt-3 font-display text-[32px]">Confirmar hábito após teste</h1>
    <p className="mt-2 break-words font-semibold">{habit.title}</p>
    <p className="mt-3 text-sm leading-7 text-muted">Após o prazo completo, até 150 participantes originais, mais da metade deve responder Sim. Acima de 150, basta um terço, arredondado para cima. Quem não respondeu não conta como concordância. Ajustes e encerramento exigem unanimidade e sete dias de reflexão.</p>
    <HabitConsentGuidance />
    {["confirmacao", "periodo"].includes(typeof query.resultado === "string" ? query.resultado : "") && <p role="status" className="mt-4 rounded-xl bg-[#edf3e5] p-3 text-sm text-forest">Decisão registrada. Confira o estado atualizado abaixo.</p>}
    <section className="mt-5 rounded-2xl border border-line bg-white p-5" aria-labelledby="trial-heading">
      <h2 id="trial-heading" className="font-display text-xl">Período atual</h2>
      {habit.status === "ended" ? <p className="mt-3 text-sm">Hábito encerrado. Os ciclos anteriores permanecem no histórico.</p> : current ? <>
        <p className="mt-3 text-sm font-semibold">{labels[current.status]} · {current.days} dias</p>
        {current.started_at && current.ends_at && <p className="mt-3 text-sm text-muted">Início: {date(current.started_at)} · Término: {date(current.ends_at)}</p>}
        <p className="mt-3 text-sm">Confirmações: {current.votes} de {current.participants}. São necessários {current.required} votos Sim.</p>
        <p className="mt-2 text-sm text-muted">Regra deste ciclo: {current.participants > 150 ? "um terço, arredondado para cima" : "maioria absoluta, mais da metade"}.</p>
        {current.activated_at && <p role="status" className="mt-3 text-sm font-semibold text-forest">Acordo ativo desde {date(current.activated_at)}.</p>}
        {current.status === "pending" && <p className="mt-3 text-sm text-muted">O teste ainda não começou. Sua resposta ao período: {current.own_setup === "accepted" ? "Aceito" : current.own_setup === "pending" ? "Aguardando" : "Você não participa deste ciclo"}.</p>}
        {current.own_confirmed && <p className="mt-3 text-sm text-muted">Você confirmou este ciclo.</p>}
        {!current.participants_available && <p role="status" className="mt-3 text-sm">Há participante original fora do Núcleo. A operação está bloqueada; a maioria exigida não foi reduzida.</p>}
        {revision && <p role="status" className="mt-3 text-sm">Uma revisão está pendente. A confirmação permanece bloqueada até a decisão sobre o combinado.</p>}
        {current.status === "testing" && !current.can_confirm && !current.own_confirmed && !revision && current.participants_available && ownParticipant && <p className="mt-3 text-sm text-muted">A confirmação fica disponível após o término completo do teste. Recarregue a página quando o prazo terminar.</p>}
        {current.can_respond && <div className="flex flex-wrap gap-3">
          <HabitTrialForm nucleusId={id} agreementId={agreementId} trialId={current.id} decision="accepted" />
          <HabitTrialForm nucleusId={id} agreementId={agreementId} trialId={current.id} decision="declined" />
        </div>}
        {current.can_confirm && <><h3 className="mt-5 font-semibold">Este acordo funcionou para nós?</h3>
          <HabitTrialForm nucleusId={id} agreementId={agreementId} trialId={current.id} decision="confirm" />
        </>}
      </> : <>
        <p className="mt-3 text-sm leading-7 text-muted">Este Hábito não tem datas de teste acordadas. O histórico será preservado; nenhuma data antiga será usada como início.</p>
        {habit.status === "testing" && ownParticipant && !revision && <HabitTrialForm nucleusId={id} agreementId={agreementId} decision="propose" />}
        {revision && <p className="mt-3 text-sm">Concluam a revisão pendente antes de propor o período.</p>}
      </>}
      {ownParticipant && ["testing", "active"].includes(habit.status) && <Link href={`${base}/revisar`} className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-leaf underline">Ajustar ou encerrar com consentimento</Link>}
    </section>
    <section className="mt-5 rounded-2xl border border-line bg-white p-5" aria-labelledby="trial-history-heading">
      <h2 id="trial-history-heading" className="font-display text-xl">Histórico dos ciclos</h2>
      {!visible.length && <p className="mt-3 text-sm text-muted">Nenhum ciclo nesta página.</p>}
      <ol className="mt-4 grid gap-3">{visible.map((cycle) => <li key={cycle.id} className="rounded-xl border border-line p-4 text-sm">
        <p className="break-words font-semibold">{cycle.title} · {cycle.days} dias</p>
        <p className="mt-2">{labels[cycle.status]}</p>
        <p className="mt-2 text-muted">Proposto em {date(cycle.created_at)}</p>
        {cycle.started_at && cycle.ends_at && <p className="mt-2 text-muted">De {date(cycle.started_at)} até {date(cycle.ends_at)}</p>}
        {cycle.activated_at && <p className="mt-2 text-muted">Confirmação efetivada em {date(cycle.activated_at)}</p>}
      </li>)}</ol>
      {(cursor || (cycles ?? []).length > 20) && <nav aria-label="Páginas dos ciclos" className="mt-4 flex flex-wrap justify-between gap-3 text-sm font-semibold text-leaf">
        {cursor && <Link href="?" className="min-h-11 content-center underline">Voltar ao início</Link>}
        {(cycles ?? []).length > 20 && <Link href={`?antes=${encodeURIComponent(`${visible[visible.length - 1].created_at}|${visible[visible.length - 1].id}`)}`} className="min-h-11 content-center underline">Ciclos anteriores</Link>}
      </nav>}
    </section>
  </OnboardingShell>;
}
