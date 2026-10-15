import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, LockKeyhole } from "lucide-react";
import { loadHabitContext } from "@/features/agreements/habit-access";
import { HabitMomentForm } from "@/features/agreements/components/habit-moment-form";
import { OnboardingShell } from "@/features/onboarding/components/onboarding-shell";
import { routes } from "@/shared/routes";

export const metadata: Metadata = { title: "Registrar momento" };

export default async function RecordHabitMomentPage({ params }: {
  params: Promise<{ id: string; agreementId: string }>;
}) {
  const { id, agreementId } = await params;
  const { nucleus, habit } = await loadHabitContext(id, agreementId);
  if (habit.nucleus_agreement_participants?.[0]?.response !== "accepted" || habit.nucleus_agreement_participants?.[0]?.accepted_version !== habit.terms_version) notFound();
  return <OnboardingShell>
    <Link href={`${routes.nucleus}/${id}/acordos/${agreementId}`} className="mb-5 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-leaf underline">
      <ChevronLeft size={16} aria-hidden="true" />Voltar ao hábito
    </Link>
    <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted"><LockKeyhole size={14} aria-hidden="true" />Espaço privado · {nucleus.name}</p>
    <h1 className="mt-3 font-display text-[32px] leading-tight md:text-[42px]">Registrar momento</h1>
    <p className="mt-2 break-words text-sm text-muted">{habit.status === "active" ? "Hábito ativo" : "Hábito em teste"}: {habit.title}</p>
    <section className="mt-6 rounded-[22px] border border-line bg-white p-5 shadow-[0_5px_18px_#52403805] sm:p-7">
      <p className="text-sm leading-7 text-muted">Um registro leve do que vocês viveram. Um momento difícil não reduz pontuação nem cria cobrança.</p>
      <HabitMomentForm nucleusId={id} agreementId={agreementId} />
    </section>
  </OnboardingShell>;
}
