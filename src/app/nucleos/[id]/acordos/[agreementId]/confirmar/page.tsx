import type { Metadata } from "next";
import { loadHabitContext } from "@/features/agreements/habit-access";
import { HabitConsentGuidance } from "@/features/agreements/components/habit-consent-guidance";
import { AgreementAdministration } from "@/features/agreements/components/agreement-administration";
import { AgreementDetailShell, AgreementSection } from "@/features/agreements/components/agreement-detail-shell";

export const metadata: Metadata = { title: "Período e administração do hábito" };
export default async function HabitAdministrationPage({ params }: { params: Promise<{ id: string; agreementId: string }> }) {
  const { id, agreementId } = await params;
  const { habit, membership, nucleus } = await loadHabitContext(id, agreementId, true);
  return <AgreementDetailShell backLabel="Voltar ao hábito" nucleusName={nucleus.name} title="Período e administração do hábito" subtitle={habit.title} back={"/nucleos/" + id + "/acordos/" + agreementId}>
    <div className="agreement-admin-grid">
      <AgreementSection title="Situação atual"><span className="ui-badge">{habit.status === "active" ? "Acordo ativo" : habit.status === "ended" ? "Acordo encerrado" : "Hábito em teste"}</span>
        <dl className="agreement-facts"><div><dt>Termos atuais</dt><dd>Versão {habit.terms_version}</dd></div><div><dt>Duração planejada</dt><dd>{habit.trial_days ? habit.trial_days + " dias" : "Não informada no registro histórico"}</dd></div>{habit.test_started_at && <div><dt>Início do teste</dt><dd>{new Date(habit.test_started_at).toLocaleString("pt-BR", { timeZone: "UTC" })} UTC</dd></div>}</dl>
        <p className="ui-copy">O teste é concluído por ação explícita de um administrador. As respostas individuais indicam participação e não são votos.</p><HabitConsentGuidance />
      </AgreementSection>
      {membership.role === "admin" && habit.status !== "ended" && <AgreementSection title="Administrar o ciclo"><AgreementAdministration nucleusId={id} agreementId={agreementId} status={habit.status} termsVersion={habit.terms_version} /></AgreementSection>}
    </div>
  </AgreementDetailShell>;
}
