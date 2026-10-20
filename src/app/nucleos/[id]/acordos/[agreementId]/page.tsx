import type { Metadata } from "next";
import Link from "next/link";
import { loadHabitContext } from "@/features/agreements/habit-access";
import { HabitConsentGuidance } from "@/features/agreements/components/habit-consent-guidance";
import { habitMoodLabels, parseHabitMomentCursor } from "@/features/agreements/habit-moment-input";
import { AgreementDetailShell } from "@/features/agreements/components/agreement-detail-shell";
import { ActionDialog } from "@/shared/components/ui/action-dialog";
import { HabitMomentForm } from "@/features/agreements/components/habit-moment-form";
import { AgreementAdministration } from "@/features/agreements/components/agreement-administration";
import { routes } from "@/shared/routes";

export const metadata: Metadata = { title: "Detalhe do hábito" };
export default async function HabitDetailPage({ params, searchParams }: {
  params: Promise<{ id: string; agreementId: string }>;
  searchParams: Promise<{ resultado?: string | string[]; antes?: string | string[] }>;
}) {
  const { id, agreementId } = await params;
  const { supabase, user, nucleus, habit, membership } = await loadHabitContext(id, agreementId, true);
  const query = await searchParams;
  const cursor = parseHabitMomentCursor(query.antes);
  // A função devolve apenas autoria permitida; a tabela bruta não pode expor IDs ocultados.
  const { data: momentsData, error: momentsError } = await supabase.rpc("get_nucleus_habit_moments", {
    target_agreement: agreementId, before_created_at: cursor?.createdAt ?? null, before_id: cursor?.id ?? null, page_size: 21,
  });
  const moments = momentsData as { id: string; author_id: string | null; mood: string; note: string | null; created_at: string; authorship_hidden: boolean }[] | null;
  if (momentsError) throw new Error("Não foi possível consultar o histórico do hábito.");
  const visibleMoments = (moments ?? []).slice(0, 20);
  const hasNextPage = (moments ?? []).length > 20;
  const createdAt = `${new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeStyle: "short", timeZone: "UTC" })
    .format(new Date(habit.created_at))} UTC`;
  const formatMomentDate = (date: string) => `${new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" })
    .format(new Date(date))} UTC`;

  const canRecord = ["testing", "active"].includes(habit.status) && habit.nucleus_agreement_participants?.[0]?.response === "accepted" && habit.nucleus_agreement_participants?.[0]?.accepted_version === habit.terms_version;
  return <AgreementDetailShell nucleusName={nucleus.name} title={habit.title} subtitle="Um espaço para cultivar a prática e guardar o que vocês viveram." back={routes.nucleus + "/" + id + "/acordos?categoria=habit"}>
    {query.resultado === "momento" && <p role="status" className="agreements-feedback">Momento registrado no histórico do hábito.</p>}
    <div className="agreement-detail-grid">
      <div className="agreement-detail-main">
        <section aria-labelledby="habit-agreement-heading" className="ui-panel agreement-detail-section">
          <span className="ui-badge">{habit.status === "ended" ? "Encerrado pela administração" : habit.status === "active" ? "Acordo ativo" : "Em teste"}</span>
          <h2 id="habit-agreement-heading">{habit.status === "ended" ? "O combinado encerrado" : "O que vamos experimentar"}</h2>
          <p className="agreement-description">{habit.description}</p>
          <dl className="agreement-facts">
            <div><dt>Momento combinado</dt><dd>{habit.timing}</dd></div>
            <div><dt>Frequência proposta</dt><dd>{habit.frequency}</dd></div>
            <div><dt>Proposta criada em</dt><dd>{createdAt}</dd></div>
            <div><dt>Sua resposta</dt><dd>{habit.nucleus_agreement_participants?.[0]?.response === "accepted" ? habit.nucleus_agreement_participants?.[0]?.accepted_version === habit.terms_version ? "Aceita · termos atuais" : "Aceite de versão anterior" : "A decidir"}</dd></div>
          </dl>
          <HabitConsentGuidance />
        </section>
        <section id="historico" aria-labelledby="habit-history-heading" className="ui-panel agreement-detail-section">
          <p className="ui-kicker">A história deste combinado</p><h2 id="habit-history-heading">Momentos registrados</h2>
          <p className="ui-copy">Vivências compartilhadas com integrantes do Núcleo, sem medir desempenho.</p>
          {visibleMoments.length ? <ol className="agreement-timeline">{visibleMoments.map(moment => <li key={moment.id}>
            <p className="agreement-history-author">{moment.authorship_hidden ? "Autoria oculta" : moment.author_id === user.id ? "Seu registro" : "Registro de outra pessoa"}<span>{formatMomentDate(moment.created_at)}</span></p>
            <h3>{habitMoodLabels[moment.mood] ?? "Humor indisponível"}</h3>
            {moment.note && <p className="agreement-description">{moment.note}</p>}
          </li>)}</ol> : <p className="ui-empty">{cursor ? "Não há registros mais antigos." : "Ainda não há momentos registrados para este hábito."}</p>}
          {(cursor || hasNextPage) && <nav aria-label="Páginas do histórico" className="agreements-pagination">
            {cursor ? <Link href="?" className="ui-button-secondary">Voltar ao início</Link> : <span />}
            {hasNextPage && <Link href={"?antes=" + encodeURIComponent(visibleMoments[visibleMoments.length - 1].created_at + "|" + visibleMoments[visibleMoments.length - 1].id)} className="ui-button-secondary">Mais antigos</Link>}
          </nav>}
        </section>
      </div>
      <aside className="ui-panel agreement-detail-context">
        <p className="ui-kicker">Seu lugar aqui</p><h2>No seu tempo.</h2>
        <p className="ui-copy">{habit.status === "ended" ? "O histórico permanece disponível. Este Hábito não recebe novos momentos." : canRecord ? "Você participa dos termos atuais e pode guardar um momento da prática." : "Confira os termos atuais e sua participação antes de registrar um momento."}</p>
        <dl className="agreement-facts"><div><dt>Termos atuais</dt><dd>Versão {habit.terms_version}</dd></div><div><dt>Teste planejado</dt><dd>{habit.trial_days ? habit.trial_days + " dias" : "Não informado no histórico"}</dd></div></dl>
        <nav aria-label="Ações do hábito" className="agreement-context-actions">
          {/* A identidade persistida renova o formulário mesmo após dois sucessos na mesma URL. */}
          {canRecord && <ActionDialog key={visibleMoments[0]?.id ?? "sem-momentos"} title="Registrar momento" description={habit.title} trigger="Registrar momento" variant="primary"><p className="ui-copy">Um registro leve do que vocês viveram. Um momento difícil não cria cobrança.</p><HabitMomentForm nucleusId={id} agreementId={agreementId} /></ActionDialog>}
          <Link href={routes.nucleus + "/" + id + "/acordos/" + agreementId + "/revisar"} className="ui-button-secondary">{habit.status === "ended" ? "Ver termos anteriores" : "Termos e histórico"}</Link>
          <Link href={routes.nucleus + "/" + id + "/acordos/" + agreementId + "/confirmar"} className="agreement-text-link">Ver período e administração do hábito</Link>
          {membership.role === "admin" && habit.status !== "ended" && <ActionDialog title="Administrar acordo" description={habit.title} trigger="Administrar acordo" variant="secondary"><AgreementAdministration nucleusId={id} agreementId={agreementId} status={habit.status} termsVersion={habit.terms_version} /></ActionDialog>}
        </nav>
        <details className="agreement-consent"><summary>Próximas possibilidades · esboços</summary><div><p>Reflexões, fotos, evolução para Experiência, Essência e Nossa Árvore dependem de critérios de acesso, autoria e consentimento. Nenhuma promoção ou pontuação é gerada por este hábito.</p><p>A agenda ainda não associa eventos a propostas.</p><Link href={routes.nucleus + "/" + id + "/agenda"} className="agreement-text-link">Abrir agenda do Núcleo</Link></div></details>
        <p className="agreements-private-note">Somente as pessoas deste Núcleo têm acesso.</p>
      </aside>
    </div>
  </AgreementDetailShell>;
}
