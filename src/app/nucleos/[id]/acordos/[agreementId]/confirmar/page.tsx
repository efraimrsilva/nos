import type { Metadata } from "next";
import { loadHabitContext } from "@/features/agreements/habit-access";
import { administerAgreement } from "@/features/agreements/administration-actions";
import { HabitConsentGuidance } from "@/features/agreements/components/habit-consent-guidance";
import { ControlActionForm } from "@/features/controls/components/action-form";
import { ControlsShell, ControlSection } from "@/features/controls/components/controls-shell";
export const metadata: Metadata = { title: "Período e administração do hábito" };
export default async function HabitAdministrationPage({ params }: { params: Promise<{ id: string; agreementId: string }> }) {
  const { id, agreementId } = await params;
  const { habit, membership } = await loadHabitContext(id, agreementId, true);
  return <ControlsShell title="Período e administração do hábito" subtitle={habit.title} back={`/nucleos/${id}/acordos/${agreementId}`}>
    <HabitConsentGuidance />
    <ControlSection title="Situação atual"><p>{habit.status === "active" ? "Acordo ativo" : habit.status === "ended" ? "Acordo encerrado" : "Hábito em teste"} · termos versão {habit.terms_version}</p><p>Duração planejada: {habit.trial_days ? `${habit.trial_days} dias` : "Não informada no registro histórico"}.</p>{habit.test_started_at && <p>Início do teste: {new Date(habit.test_started_at).toLocaleString("pt-BR", { timeZone: "UTC" })} UTC.</p>}<p>O teste é concluído por ação explícita de um administrador. As respostas individuais indicam participação e não são votos.</p></ControlSection>
    {membership.role === "admin" && habit.status === "testing" && <ControlSection title="Concluir teste"><ControlActionForm action={administerAgreement.bind(null, id, agreementId, "activate", habit.terms_version)} label="Ativar acordo" confirmation="Concluir o teste e ativar este acordo. Cada pessoa continua decidindo se participa." /></ControlSection>}
    {membership.role === "admin" && habit.status !== "ended" && <ControlSection title="Encerramento"><ControlActionForm action={administerAgreement.bind(null, id, agreementId, "end", habit.terms_version)} label="Encerrar acordo" confirmation="Impedir novos momentos e preservar o histórico deste acordo." /></ControlSection>}
  </ControlsShell>;
}
