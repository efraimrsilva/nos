import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, LockKeyhole } from "lucide-react";
import { loadHabitContext } from "@/features/agreements/habit-access";
import { HabitConsentGuidance } from "@/features/agreements/components/habit-consent-guidance";
import { habitMoodLabels, parseHabitMomentCursor } from "@/features/agreements/habit-moment-input";
import { OnboardingShell } from "@/features/onboarding/components/onboarding-shell";
import { routes } from "@/shared/routes";

export const metadata: Metadata = { title: "Detalhe do hábito" };
export default async function HabitDetailPage({ params, searchParams }: {
  params: Promise<{ id: string; agreementId: string }>;
  searchParams: Promise<{ resultado?: string | string[]; antes?: string | string[] }>;
}) {
  const { id, agreementId } = await params;
  const { supabase, user, nucleus, habit } = await loadHabitContext(id, agreementId, true);
  const query = await searchParams;
  const cursor = parseHabitMomentCursor(query.antes);
  let request = supabase.from("nucleus_habit_moments")
    .select("id,author_id,mood,note,created_at").eq("agreement_id", agreementId);
  if (cursor) {
    // O par data/ID fixa a travessia mesmo quando outra pessoa registra um momento novo.
    request = request.or(`created_at.lt."${cursor.createdAt}",and(created_at.eq."${cursor.createdAt}",id.lt.${cursor.id})`);
  }
  const { data: moments, error: momentsError } = await request
    .order("created_at", { ascending: false }).order("id", { ascending: false }).limit(21);
  if (momentsError) throw new Error("Não foi possível consultar o histórico do hábito.");
  const visibleMoments = (moments ?? []).slice(0, 20);
  const hasNextPage = (moments ?? []).length > 20;
  const createdAt = `${new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeStyle: "short", timeZone: "UTC" })
    .format(new Date(habit.created_at))} UTC`;
  const formatMomentDate = (date: string) => `${new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" })
    .format(new Date(date))} UTC`;

  return <OnboardingShell>
    <Link href={`${routes.nucleus}/${id}/acordos?categoria=habit`} className="mb-5 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-leaf underline">
      <ChevronLeft size={16} aria-hidden="true" />Voltar a Acordos
    </Link>
    <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted"><LockKeyhole size={14} aria-hidden="true" />Espaço privado · {nucleus.name}</p>
    <h1 className="mt-3 break-words font-display text-[32px] leading-tight md:text-[42px]">{habit.title}</h1>
    <p className="mt-3 inline-flex rounded-full bg-[#edf3e5] px-3 py-1.5 text-xs font-semibold text-forest">{habit.status === "ended" ? "Encerrado de comum acordo" : habit.status === "active" ? "Acordo ativo" : "Em teste com consentimento"}</p>
    <p className="mt-4 text-sm leading-7 text-muted">{habit.status === "ended" ? "O histórico permanece disponível. Este Hábito não recebe novos momentos." : habit.status === "active" ? "Confirmado após o teste com o número de votos exigido. Ajustes e encerramento continuam exigindo nova decisão unânime." : "Todas as pessoas participantes aceitaram experimentar esta proposta. Ela ainda não é um acordo ativo. Ajustes e encerramento exigem nova decisão conjunta."}</p>
    {query.resultado === "momento" && <p role="status" className="mt-4 rounded-xl bg-[#edf3e5] p-3 text-sm text-forest">Momento registrado no histórico do hábito.</p>}
    <HabitConsentGuidance />

    <section aria-labelledby="habit-agreement-heading" className="mt-6 rounded-[22px] border border-line bg-white p-5 shadow-[0_5px_18px_#52403805] sm:p-7">
      <h2 id="habit-agreement-heading" className="font-display text-xl">{habit.status === "ended" ? "O combinado encerrado" : "O que vamos experimentar"}</h2>
      <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-muted">{habit.description}</p>
      <dl className="mt-5 grid gap-3 border-t border-line pt-5 text-sm sm:grid-cols-2">
        <div><dt className="font-semibold text-leaf">Momento combinado</dt><dd className="mt-1 break-words text-muted">{habit.timing}</dd></div>
        <div><dt className="font-semibold text-leaf">Frequência proposta</dt><dd className="mt-1 break-words text-muted">{habit.frequency}</dd></div>
        <div><dt className="font-semibold text-leaf">Proposta criada em</dt><dd className="mt-1 text-muted">{createdAt}</dd></div>
        <div><dt className="font-semibold text-leaf">Sua resposta</dt><dd className="mt-1 text-muted">{habit.nucleus_agreement_participants?.[0]?.response === "accepted" ? "Aceita" : "Indisponível"}</dd></div>
      </dl>
    </section>

    <Link href={`/nucleos/${id}/acordos/${agreementId}/confirmar`} className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-leaf underline">Ver período e confirmação do hábito</Link>
    <section aria-labelledby="habit-history-heading" className="mt-4 rounded-[22px] border border-line bg-white p-5 sm:p-7">
      <h2 id="habit-history-heading" className="font-display text-xl">Momentos registrados</h2>
      <p className="mt-2 text-sm leading-7 text-muted">Os registros são visíveis para integrantes do Núcleo. Eles contam vivências sem medir desempenho.</p>
      {visibleMoments.length ? <ol className="mt-4 grid gap-3">{visibleMoments.map((moment) => <li key={moment.id} className="rounded-xl border border-line bg-[#fbfaf7] p-4">
        <p className="text-xs font-semibold text-leaf">{moment.author_id === user.id ? "Seu registro" : "Registro de outra pessoa"} · {formatMomentDate(moment.created_at)}</p>
        <p className="mt-2 text-sm font-semibold">{habitMoodLabels[moment.mood] ?? "Humor indisponível"}</p>
        {moment.note && <p className="mt-2 whitespace-pre-wrap break-words text-sm text-muted">{moment.note}</p>}
      </li>)}</ol> : <p className="mt-4 text-sm text-muted">{cursor ? "Não há registros mais antigos." : "Ainda não há momentos registrados para este hábito."}</p>}
      {(cursor || hasNextPage) && <nav aria-label="Páginas do histórico" className="mt-4 flex justify-between gap-3 text-sm font-semibold text-leaf">
        {cursor ? <Link href="?" className="min-h-11 content-center underline">Voltar ao início</Link> : <span />}
        {hasNextPage && <Link href={`?antes=${encodeURIComponent(`${visibleMoments[visibleMoments.length - 1].created_at}|${visibleMoments[visibleMoments.length - 1].id}`)}`}
          className="min-h-11 content-center underline">Mais antigos</Link>}
      </nav>}
    </section>

    <section aria-labelledby="habit-next-heading" className="mt-4 rounded-[22px] border border-line bg-white p-5 sm:p-7">
      <h2 id="habit-next-heading" className="font-display text-xl">Outros acompanhamentos</h2>
      <p className="mt-2 text-sm leading-7 text-muted">Reflexões e progresso ainda não estão disponíveis. Esses recursos precisam de regras próprias e dados reais.</p>
      <p className="mt-3 text-sm leading-7 text-muted">A agenda do Núcleo ainda não associa eventos a propostas. Você pode consultá-la separadamente.</p>
      <Link href={`${routes.nucleus}/${id}/agenda`} className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-leaf underline">Abrir agenda do Núcleo</Link>
    </section>
    <nav aria-label="Ações do hábito" className="sticky bottom-3 mt-5 flex gap-3 rounded-2xl border border-line bg-white/95 p-3 shadow-lg backdrop-blur-sm">
      <Link href={`${routes.nucleus}/${id}/acordos/${agreementId}/revisar`} className="flex min-h-11 items-center justify-center rounded-xl border border-line px-4 text-sm font-semibold text-leaf">{habit.status === "ended" ? "Ver revisões" : "Revisar"}</Link>
      {["testing", "active"].includes(habit.status) && habit.nucleus_agreement_participants?.[0]?.response === "accepted" && <Link href={`${routes.nucleus}/${id}/acordos/${agreementId}/registrar`}
        className="flex min-h-11 flex-1 items-center justify-center rounded-xl bg-forest px-4 text-center text-sm font-semibold text-white">Registrar momento</Link>}
    </nav>
  </OnboardingShell>;
}
