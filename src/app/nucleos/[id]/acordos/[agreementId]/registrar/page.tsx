import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { loadHabitContext } from "@/features/agreements/habit-access";
import { HabitMomentForm } from "@/features/agreements/components/habit-moment-form";
import { AgreementDetailShell } from "@/features/agreements/components/agreement-detail-shell";
import { routes } from "@/shared/routes";

export const metadata: Metadata = { title: "Registrar momento" };
export default async function RecordHabitMomentPage({ params }: { params: Promise<{ id: string; agreementId: string }> }) {
  const { id, agreementId } = await params;
  const { nucleus, habit } = await loadHabitContext(id, agreementId);
  if (habit.nucleus_agreement_participants?.[0]?.response !== "accepted" || habit.nucleus_agreement_participants?.[0]?.accepted_version !== habit.terms_version) notFound();
  return <AgreementDetailShell backLabel="Voltar ao hábito" nucleusName={nucleus.name} title="Registrar momento" subtitle={habit.title} back={routes.nucleus + "/" + id + "/acordos/" + agreementId}>
    <section className="ui-panel agreement-record-panel"><span className="ui-badge">{habit.status === "active" ? "Hábito ativo" : "Hábito em teste"}</span>
      <p className="ui-copy">Um registro leve do que vocês viveram. Um momento difícil não reduz pontuação nem cria cobrança.</p>
      <HabitMomentForm nucleusId={id} agreementId={agreementId} />
    </section>
  </AgreementDetailShell>;
}
