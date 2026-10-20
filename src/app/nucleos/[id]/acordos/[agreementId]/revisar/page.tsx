import type { Metadata } from "next";
import Link from "next/link";
import { loadHabitContext } from "@/features/agreements/habit-access";
import { administerAgreement } from "@/features/agreements/administration-actions";
import { AgreementActionForm } from "@/features/agreements/components/agreement-action-form";
import { ActionDialog } from "@/shared/components/ui/action-dialog";
import { AgreementDetailShell, AgreementSection } from "@/features/agreements/components/agreement-detail-shell";
export const metadata: Metadata = { title: "Termos e histórico do acordo" };
type Version = { version: number; title: string; description: string; timing: string; frequency: string; changed_at: string };
export default async function HabitTermsPage({ params, searchParams }: { params: Promise<{ id: string; agreementId: string }>; searchParams: Promise<{ versao?: string; legado?: string }> }) {
  const { id, agreementId } = await params;
  const { supabase, habit, membership, nucleus } = await loadHabitContext(id, agreementId, true, true);
  const query = await searchParams;
  const legacyPage = query.legado && /^[1-9]\d{0,3}$/.test(query.legado) ? Number(query.legado) : 1;
  const before = query.versao && /^[1-9]\d{0,8}$/.test(query.versao) ? Number(query.versao) : null;
  let request = supabase.from("nucleus_agreement_versions").select("version,title,description,timing,frequency,changed_at").eq("agreement_id", agreementId);
  if (before) request = request.lt("version", before);
  const { data: versions, error } = await request.order("version", { ascending: false }).limit(21);
  if (error) throw new Error("Não foi possível consultar as versões dos termos.");
  const visibleVersions = ((versions ?? []) as Version[]).slice(0, 20);
  // Dados anteriores continuam consultáveis, sem reativar votos ou mutações do modelo substituído.
  const [legacyRevisions, legacyTrials] = await Promise.all([
    supabase.from("nucleus_habit_revisions").select("id,kind,status,title,description,timing,frequency,created_at").eq("agreement_id", agreementId).order("created_at", { ascending: false }).order("id", { ascending: false }).range((legacyPage - 1) * 20, legacyPage * 20),
    supabase.from("nucleus_habit_trials").select("id,status,started_at,ends_at,created_at").eq("agreement_id", agreementId).order("created_at", { ascending: false }).order("id", { ascending: false }).range((legacyPage - 1) * 20, legacyPage * 20),
  ]);
  if (legacyRevisions.error || legacyTrials.error) throw new Error("Não foi possível consultar o histórico anterior.");
  return <AgreementDetailShell nucleusName={nucleus.name} title="Termos e histórico do acordo" subtitle={habit.title} back={"/nucleos/" + id + "/acordos?categoria=" + habit.category}>
    <section className="agreement-terms-intro">
      <div><span className="ui-badge">Termos atuais · versão {habit.terms_version}</span><p className="ui-copy">Alterar os termos pede novo aceite individual. Os momentos e as versões anteriores permanecem. Ninguém pode aceitar pela outra pessoa.</p></div>
      {membership.role === "admin" && ["pending", "testing", "active"].includes(habit.status) && <ActionDialog key={habit.terms_version} title="Alterar termos" description="Publicar uma nova versão solicita um novo aceite individual, preservando os registros anteriores." trigger="Alterar termos" size="wide" variant="primary">
        <AgreementActionForm action={administerAgreement.bind(null, id, agreementId, "terms", habit.terms_version)} label="Publicar novos termos" confirmation="Publicar nova versão e solicitar novo aceite a cada participante.">
          <label className="ui-field">O que vamos fazer?<input name="title" required maxLength={100} defaultValue={habit.title} /></label>
          <label className="ui-field">Como será?<textarea name="description" required maxLength={500} defaultValue={habit.description} rows={3} /></label>
          <label className="ui-field">Quando?<input name="timing" required maxLength={120} defaultValue={habit.timing} /></label>
          <label className="ui-field">Com que frequência?<input name="frequency" required maxLength={120} defaultValue={habit.frequency} /></label>
        </AgreementActionForm>
      </ActionDialog>}
    </section>
    <AgreementSection title="Histórico dos termos">
      {visibleVersions.length ? <ol className="agreement-version-list">{visibleVersions.map(version => <li key={version.version}>
        <div className="agreement-version-heading"><span className="ui-badge">Versão {version.version}</span><time>{new Date(version.changed_at).toLocaleString("pt-BR", { timeZone: "UTC" })} UTC</time></div>
        <h3>Versão {version.version} · {version.title}</h3><p className="agreement-description">{version.description}</p>
        <dl className="agreement-facts"><div><dt>Quando</dt><dd>{version.timing}</dd></div><div><dt>Frequência</dt><dd>{version.frequency}</dd></div></dl>
      </li>)}</ol> : <p className="ui-empty">Nenhuma versão nesta página.</p>}
      <nav aria-label="Páginas dos termos" className="agreements-pagination">
        {before ? <Link href="?" className="ui-button-secondary">Versões recentes</Link> : <span />}
        {(versions ?? []).length > 20 && <Link href={"?versao=" + visibleVersions[visibleVersions.length - 1].version} className="ui-button-secondary">Versões anteriores</Link>}
      </nav>
    </AgreementSection>
    {((legacyRevisions.data ?? []).length > 0 || (legacyTrials.data ?? []).length > 0 || legacyPage > 1) && <AgreementSection title="Histórico do modelo anterior">
      <p className="ui-copy">Somente consulta. Votações e solicitações antigas não comandam o acordo atual e não são reutilizadas como aceite de novos termos.</p>
      <ol className="agreement-version-list">{(legacyRevisions.data ?? []).slice(0, 20).map(revision => <li key={revision.id}>
        <span className="ui-badge">{revision.status === "applied" ? "Aplicado no modelo anterior" : revision.status === "declined" ? "Recusado no modelo anterior" : "Pendente no modelo descontinuado"}</span>
        <h3>{revision.kind === "end" ? "Solicitação antiga de encerramento" : "Ajuste anterior"}</h3>
        {revision.title && <p>{revision.title}</p>}{revision.description && <p className="agreement-description">{revision.description}</p>}{revision.timing && <p className="ui-copy">{revision.timing} · {revision.frequency}</p>}
      </li>)}</ol>
      <ol className="agreement-version-list">{(legacyTrials.data ?? []).slice(0, 20).map(trial => <li key={trial.id}><h3>Período anterior · {trial.status}</h3>{trial.started_at && <p className="ui-copy">{new Date(trial.started_at).toLocaleString("pt-BR", { timeZone: "UTC" })} UTC</p>}</li>)}</ol>
      <nav aria-label="Páginas do histórico anterior" className="agreements-pagination">
        {legacyPage > 1 ? <Link href={"?legado=" + (legacyPage - 1)} className="ui-button-secondary">Histórico anterior: página anterior</Link> : <span />}
        {((legacyRevisions.data ?? []).length > 20 || (legacyTrials.data ?? []).length > 20) && <Link href={"?legado=" + (legacyPage + 1)} className="ui-button-secondary">Histórico anterior: próximos registros</Link>}
      </nav>
    </AgreementSection>}
  </AgreementDetailShell>;
}
