import type { Metadata } from "next";
import Link from "next/link";
import { loadHabitContext } from "@/features/agreements/habit-access";
import { administerAgreement } from "@/features/agreements/administration-actions";
import { ControlActionForm } from "@/features/controls/components/action-form";
import { ControlsShell, ControlSection } from "@/features/controls/components/controls-shell";
export const metadata: Metadata = { title: "Termos e histórico do acordo" };
type Version = { version: number; title: string; description: string; timing: string; frequency: string; changed_at: string };
export default async function HabitTermsPage({ params, searchParams }: { params: Promise<{ id: string; agreementId: string }>; searchParams: Promise<{ versao?: string; legado?: string }> }) {
  const { id, agreementId } = await params;
  const { supabase, habit, membership } = await loadHabitContext(id, agreementId, true, true);
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
  return <ControlsShell title="Termos e histórico do acordo" subtitle={habit.title} back={`/nucleos/${id}/acordos?categoria=${habit.category}`}>
    <ControlSection title="Mudanças claras"><p>Alterar os termos pede novo aceite individual. Os momentos e as versões anteriores permanecem. Ninguém pode aceitar pela outra pessoa.</p></ControlSection>
    {membership.role === "admin" && ["pending", "testing", "active"].includes(habit.status) && <ControlSection title="Alterar termos"><ControlActionForm action={administerAgreement.bind(null, id, agreementId, "terms", habit.terms_version)} label="Publicar novos termos" confirmation="Publicar nova versão e solicitar novo aceite a cada participante.">
      <label className="grid gap-1">O que vamos fazer?<input name="title" required maxLength={100} defaultValue={habit.title} className="min-h-11 rounded-xl border border-line px-3" /></label>
      <label className="grid gap-1">Como será?<textarea name="description" required maxLength={500} defaultValue={habit.description} rows={3} className="rounded-xl border border-line p-3" /></label>
      <label className="grid gap-1">Quando?<input name="timing" required maxLength={120} defaultValue={habit.timing} className="min-h-11 rounded-xl border border-line px-3" /></label>
      <label className="grid gap-1">Com que frequência?<input name="frequency" required maxLength={120} defaultValue={habit.frequency} className="min-h-11 rounded-xl border border-line px-3" /></label>
    </ControlActionForm></ControlSection>}
    <ControlSection title="Histórico dos termos"><ol className="grid gap-3">{visibleVersions.map(version => <li key={version.version} className="rounded-xl border border-line p-3"><h3 className="font-semibold">Versão {version.version} · {version.title}</h3><p className="whitespace-pre-wrap break-words">{version.description}</p><p>{version.timing} · {version.frequency}</p><p className="text-xs">{new Date(version.changed_at).toLocaleString("pt-BR", { timeZone: "UTC" })} UTC</p></li>)}</ol>
      {!visibleVersions.length && <p>Nenhuma versão nesta página.</p>}
      <nav aria-label="Páginas dos termos" className="mt-3 flex gap-4 font-semibold text-leaf">
        {before && <Link href="?" className="inline-flex min-h-11 items-center underline">Versões recentes</Link>}
        {(versions ?? []).length > 20 && <Link href={`?versao=${visibleVersions[visibleVersions.length - 1].version}`} className="inline-flex min-h-11 items-center underline">Versões anteriores</Link>}
      </nav>
    </ControlSection>
    {((legacyRevisions.data ?? []).length > 0 || (legacyTrials.data ?? []).length > 0 || legacyPage > 1) && <ControlSection title="Histórico do modelo anterior">
      <p>Somente consulta. Votações e solicitações antigas não comandam o acordo atual e não são reutilizadas como aceite de novos termos.</p>
      <ol className="mt-3 grid gap-3">{(legacyRevisions.data ?? []).slice(0, 20).map(revision => <li key={revision.id} className="rounded-xl border border-line p-3"><h3 className="font-semibold">{revision.kind === "end" ? "Solicitação antiga de encerramento" : "Ajuste anterior"} · {revision.status === "applied" ? "Aplicado no modelo anterior" : revision.status === "declined" ? "Recusado no modelo anterior" : "Pendente no modelo descontinuado"}</h3>{revision.title && <p>{revision.title}</p>}{revision.description && <p className="whitespace-pre-wrap break-words">{revision.description}</p>}{revision.timing && <p>{revision.timing} · {revision.frequency}</p>}</li>)}</ol>
      <ol className="mt-3 grid gap-3">{(legacyTrials.data ?? []).slice(0, 20).map(trial => <li key={trial.id} className="rounded-xl border border-line p-3"><p>Período anterior · {trial.status}</p>{trial.started_at && <p>{new Date(trial.started_at).toLocaleString("pt-BR", { timeZone: "UTC" })} UTC</p>}</li>)}</ol>
      <nav aria-label="Páginas do histórico anterior" className="mt-3 flex gap-4 font-semibold text-leaf">
        {legacyPage > 1 && <Link href={`?legado=${legacyPage - 1}`} className="inline-flex min-h-11 items-center underline">Histórico anterior: página anterior</Link>}
        {((legacyRevisions.data ?? []).length > 20 || (legacyTrials.data ?? []).length > 20) && <Link href={`?legado=${legacyPage + 1}`} className="inline-flex min-h-11 items-center underline">Histórico anterior: próximos registros</Link>}
      </nav>
    </ControlSection>}
  </ControlsShell>;
}
