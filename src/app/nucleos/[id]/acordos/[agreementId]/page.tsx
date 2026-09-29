import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ChevronLeft, LockKeyhole } from "lucide-react";
import { isNucleusAuthUnavailable } from "@/features/nuclei/nucleus-access";
import { OnboardingShell } from "@/features/onboarding/components/onboarding-shell";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { routes } from "@/shared/routes";

export const metadata: Metadata = { title: "Detalhe do hábito" };
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default async function HabitDetailPage({ params }: {
  params: Promise<{ id: string; agreementId: string }>;
}) {
  const { id, agreementId } = await params;
  if (!uuid.test(id) || !uuid.test(agreementId)) notFound();
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

  // O filtro de Núcleo complementa a RLS e impede que o identificador da URL selecione outra proposta.
  const { data: habit, error: habitError } = await supabase.from("nucleus_agreements")
    .select("title,description,timing,frequency,status,created_at,nucleus_agreement_participants(response)")
    .eq("id", agreementId).eq("nucleus_id", id).eq("category", "habit").eq("status", "testing").maybeSingle();
  if (habitError) throw new Error("Não foi possível consultar o hábito agora.");
  if (!habit) notFound();
  const createdAt = `${new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeStyle: "short", timeZone: "UTC" })
    .format(new Date(habit.created_at))} UTC`;

  return <OnboardingShell>
    <Link href={`${routes.nucleus}/${id}/acordos?categoria=habit`} className="mb-5 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-leaf underline">
      <ChevronLeft size={16} aria-hidden="true" />Voltar a Acordos
    </Link>
    <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted"><LockKeyhole size={14} aria-hidden="true" />Espaço privado · {nucleus.name}</p>
    <h1 className="mt-3 break-words font-display text-[32px] leading-tight md:text-[42px]">{habit.title}</h1>
    <p className="mt-3 inline-flex rounded-full bg-[#edf3e5] px-3 py-1.5 text-xs font-semibold text-forest">Em teste com consentimento</p>
    <p className="mt-4 text-sm leading-7 text-muted">Todas as pessoas participantes aceitaram experimentar esta proposta. Ela ainda não é um acordo ativo; a revisão será disponibilizada em outra etapa.</p>

    <section aria-labelledby="habit-agreement-heading" className="mt-6 rounded-[22px] border border-line bg-white p-5 shadow-[0_5px_18px_#52403805] sm:p-7">
      <h2 id="habit-agreement-heading" className="font-display text-xl">O que vamos experimentar</h2>
      <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-muted">{habit.description}</p>
      <dl className="mt-5 grid gap-3 border-t border-line pt-5 text-sm sm:grid-cols-2">
        <div><dt className="font-semibold text-leaf">Momento combinado</dt><dd className="mt-1 break-words text-muted">{habit.timing}</dd></div>
        <div><dt className="font-semibold text-leaf">Frequência proposta</dt><dd className="mt-1 break-words text-muted">{habit.frequency}</dd></div>
        <div><dt className="font-semibold text-leaf">Proposta criada em</dt><dd className="mt-1 text-muted">{createdAt}</dd></div>
        <div><dt className="font-semibold text-leaf">Sua resposta</dt><dd className="mt-1 text-muted">{habit.nucleus_agreement_participants?.[0]?.response === "accepted" ? "Aceita" : "Indisponível"}</dd></div>
      </dl>
    </section>

    <section aria-labelledby="habit-next-heading" className="mt-4 rounded-[22px] border border-line bg-white p-5 sm:p-7">
      <h2 id="habit-next-heading" className="font-display text-xl">Próximos registros</h2>
      <p className="mt-2 text-sm leading-7 text-muted">Registrar práticas, reflexões e revisões ainda não está disponível. O acompanhamento será exibido quando essas ações tiverem dados reais.</p>
      <p className="mt-3 text-sm leading-7 text-muted">A agenda do Núcleo ainda não associa eventos a propostas. Você pode consultá-la separadamente.</p>
      <Link href={`${routes.nucleus}/${id}/agenda`} className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-leaf underline">Abrir agenda do Núcleo</Link>
    </section>
  </OnboardingShell>;
}
