import type { Metadata } from "next";
import Link from "next/link";
import { loadHabitContext } from "@/features/agreements/habit-access";
import { HabitRevisionForm, RevisionDecision } from "@/features/agreements/components/habit-revision-form";
import { OnboardingShell } from "@/features/onboarding/components/onboarding-shell";

export const metadata: Metadata = { title: "Revisar hábito" };
export default async function HabitRevisionPage({ params, searchParams }: {
  params: Promise<{ id: string; agreementId: string }>;
  searchParams: Promise<{ resultado?: string | string[] }>;
}) {
  const { id, agreementId } = await params;
  const { supabase, habit } = await loadHabitContext(id, agreementId, true);
  const query = await searchParams;
  const { data: revisions, error } = await supabase.from("nucleus_habit_revisions")
    .select("id,kind,title,description,timing,frequency,status,created_at,reflect_until,applied_at,nucleus_habit_revision_responses(response)")
    .eq("agreement_id", agreementId).order("created_at", { ascending: false }).limit(21);
  if (error) throw new Error("Não foi possível consultar as revisões.");
  const pendingRevision = revisions?.find((r) => r.status === "pending");
  // O banco agrega o consenso sem ampliar a leitura dos votos individuais.
  const readiness = pendingRevision ? await supabase.rpc("can_apply_nucleus_habit_revision", { target_revision: pendingRevision.id }) : null;
  if (readiness?.error) throw new Error("Não foi possível conferir o consenso da revisão.");
  const ownAccepted = habit.nucleus_agreement_participants?.[0]?.response === "accepted";
  const date = (value: string) => `${new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }).format(new Date(value))} UTC`;
  const notices: Record<string, string> = { proposta: "Revisão enviada. O combinado atual permanece em vigor durante a decisão.", resposta: "Sua resposta foi registrada.", aplicada: "Revisão aplicada com consentimento após o período de reflexão." };
  return <OnboardingShell>
    <Link href={`/nucleos/${id}/acordos/${agreementId}`} className="inline-flex min-h-11 items-center text-sm font-semibold text-leaf underline">Voltar ao Hábito</Link>
    <h1 className="mt-3 font-display text-[32px]">Revisar hábito</h1>
    <p className="mt-2 break-words font-semibold">{habit.title}</p>
    <p className="mt-3 text-sm leading-7 text-muted">Revisar é cuidar do combinado. Mudanças exigem o sim de todas as pessoas envolvidas e sete dias completos de reflexão desde a solicitação. Depois, uma pessoa participante confirma a aplicação.</p>
    {typeof query.resultado === "string" && notices[query.resultado] && <p role="status" className="mt-4 rounded-xl bg-[#edf3e5] p-3 text-sm text-forest">{notices[query.resultado]}</p>}
    {habit.status === "ended" && <p role="status" className="mt-4 text-sm">Hábito encerrado de comum acordo. O histórico está preservado.</p>}
    <section aria-labelledby="current-habit-heading" className="mt-5 rounded-2xl border border-line bg-white p-5">
      <h2 id="current-habit-heading" className="font-display text-xl">Combinado atual</h2>
      <p className="mt-3 whitespace-pre-wrap break-words text-sm">{habit.description}</p>
      <p className="mt-3 break-words text-sm text-muted">Quando: {habit.timing} · Frequência: {habit.frequency}</p>
    </section>
    {!pendingRevision && habit.status === "testing" && ownAccepted && <section className="mt-5 rounded-2xl border border-line bg-white p-5">
      <h2 className="font-display text-xl">Nova solicitação</h2>
      <HabitRevisionForm nucleusId={id} agreementId={agreementId} habit={habit} />
    </section>}
    <section className="mt-5 rounded-2xl border border-line bg-white p-5">
      <h2 className="font-display text-xl">Solicitações de revisão</h2>
      {!revisions?.length && <p className="mt-3 text-sm text-muted">Ainda não há revisões.</p>}
      <ol className="mt-4 grid gap-4">{revisions?.slice(0, 20).map((r) => {
        const response = r.nucleus_habit_revision_responses?.[0]?.response;
        return <li key={r.id} className="rounded-xl border border-line p-4">
          <h3 className="font-semibold">{r.kind === "end" ? "Encerrar de comum acordo" : "Ajustar o combinado"}</h3>
          <p className="mt-2 text-sm">{r.status === "applied" ? "Aplicada" : r.status === "declined" ? "Recusada · combinado preservado" : "Aguardando consentimento e aplicação"}</p>
          <p className="mt-2 text-xs text-muted">Solicitada em {date(r.created_at)} · Reflexão até {date(r.reflect_until)}</p>
          {r.applied_at && <p className="mt-2 text-xs text-muted">Aplicada em {date(r.applied_at)}</p>}
          {r.kind === "adjust" && <div className="mt-3 grid gap-2 text-sm">
            <p className="break-words font-semibold">{r.title}</p><p className="whitespace-pre-wrap break-words">{r.description}</p>
            <p className="break-words">Quando: {r.timing} · Frequência: {r.frequency}</p>
          </div>}
          {r.status === "pending" && <>
            <p className="mt-3 text-sm text-muted">Sua resposta: {response === "accepted" ? "Aceita" : response === "pending" ? "Aguardando" : "Você não participa desta solicitação"}.</p>
            {response === "pending" && <div className="flex flex-wrap gap-3">
              <RevisionDecision nucleusId={id} agreementId={agreementId} revisionId={r.id} decision="accepted" />
              <RevisionDecision nucleusId={id} agreementId={agreementId} revisionId={r.id} decision="declined" />
            </div>}
            {response === "accepted" && !readiness?.data && <p className="mt-3 text-sm text-muted">Aguardando aceite de todas as pessoas envolvidas e o fim da reflexão. Atualize esta página para conferir.</p>}
            {response === "accepted" && readiness?.data === true && <RevisionDecision nucleusId={id} agreementId={agreementId} revisionId={r.id} decision="apply" />}
          </>}
        </li>;
      })}</ol>
      {(revisions?.length ?? 0) > 20 && <p className="mt-3 text-sm text-muted">Exibindo as vinte revisões mais recentes.</p>}
    </section>
  </OnboardingShell>;
}
