import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowRight, Clock3, MoreHorizontal, Plus } from "lucide-react";
import { respondAgreementProposal } from "@/features/agreements/actions";
import { AgreementsWorkspace } from "@/features/agreements/components/agreements-workspace";
import { AgreementsHowItWorks } from "@/features/agreements/components/agreements-how-it-works";
import { ProposalForm } from "@/features/agreements/components/proposal-form";
import { AgreementAdministration } from "@/features/agreements/components/agreement-administration";
import { HabitMomentForm } from "@/features/agreements/components/habit-moment-form";
import { HabitConsentGuidance } from "@/features/agreements/components/habit-consent-guidance";
import { ActionDialog } from "@/shared/components/ui/action-dialog";
import { DeclineButton } from "@/features/agreements/components/decline-button";
import { isNucleusAuthUnavailable } from "@/features/nuclei/nucleus-access";
import { OnboardingShell } from "@/features/onboarding/components/onboarding-shell";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { routes } from "@/shared/routes";

export const metadata: Metadata = { title: "Acordos do Núcleo" };
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
type Agreement = {
  id: string; category: "habit" | "experience"; title: string; description: string; timing: string;
  frequency: string; trial_days: number | null; status: string; created_at: string; terms_version: number;
  nucleus_agreement_participants: { response: string; accepted_version: number | null }[];
};
const categories = [{ key: "all", label: "Todos" }, { key: "habit", label: "Hábitos" }, { key: "experience", label: "Experiências" }, { key: "essence", label: "Essência" }] as const;
const filters = [{ key: "all", label: "Todos" }, { key: "pending", label: "Aguardando" },
  { key: "testing", label: "Em teste" }, { key: "active", label: "Ativos" }, { key: "declined", label: "Recusados" }, { key: "ended", label: "Encerrados" }] as const;
const statusLabel: Record<string, string> = { active: "Acordo ativo", pending: "Proposta enviada", testing: "Em teste", declined: "Proposta recusada", ended: "Encerrado pela administração" };

export default async function AgreementsPage({ params, searchParams }: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ categoria?: string; filtro?: string; pagina?: string; resultado?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  if (!uuid.test(id)) notFound();
  const category = categories.find((item) => item.key === query.categoria)?.key ?? "all";
  const filter = filters.find((item) => item.key === query.filtro)?.key ?? "all";
  const page = query.pagina && /^[1-9]\d*$/.test(query.pagina) ? Number(query.pagina) : 1;
  const safePage = Number.isSafeInteger(page) && page <= 1000 ? page : 1;
  const href = (categoryKey: string, filterKey: string, pageNumber = 1) =>
    `${routes.nucleus}/${id}/acordos?categoria=${categoryKey}&filtro=${filterKey}&pagina=${pageNumber}`;
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect(routes.account);
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (isNucleusAuthUnavailable(authError)) throw new Error("Não foi possível conferir a sessão agora.");
  if (!user) redirect(routes.account);
  const { data: membership, error: membershipError } = await supabase.from("nucleus_members")
    .select("role").eq("nucleus_id", id).eq("user_id", user.id).maybeSingle();
  if (membershipError) throw new Error("Não foi possível consultar a participação no Núcleo.");
  if (!membership) notFound();
  const { data: nucleus, error: nucleusError } = await supabase.from("nuclei").select("name").eq("id", id).maybeSingle();
  if (nucleusError) throw new Error("Não foi possível consultar o Núcleo.");
  if (!nucleus) notFound();

  let agreements: Agreement[] = [];
  let hasNextPage = false;
  if (category !== "essence") {
    // RLS filtra por Núcleo e a tabela de respostas expõe apenas a resposta da própria pessoa.
    let request = supabase.from("nucleus_agreements")
      .select("id,category,title,description,timing,frequency,status,trial_days,created_at,terms_version,nucleus_agreement_participants(response,accepted_version)")
      .eq("nucleus_id", id);
    if (category !== "all") request = request.eq("category", category);
    if (filter !== "all") request = request.eq("status", filter);
    const { data, error } = await request.order("created_at", { ascending: false }).order("id")
      .range((safePage - 1) * 50, safePage * 50);
    if (error) throw new Error("Não foi possível consultar os acordos agora.");
    agreements = ((data ?? []).slice(0, 50)) as Agreement[];
    hasNextPage = (data ?? []).length > 50;
  }
  const notice: Record<string, string> = { proposta: "Proposta enviada. Escolha se deseja participar; a administração organiza o próximo passo.",
    resposta: "Sua resposta foi registrada.", gestao: "Gestão do acordo concluída.", erro: "Não foi possível registrar a resposta. Atualize a página e tente novamente." };

  const participates = (agreement: Agreement) => agreement.nucleus_agreement_participants?.[0]?.response === "accepted" && agreement.nucleus_agreement_participants?.[0]?.accepted_version === agreement.terms_version;
  const responseLabel = (agreement: Agreement) => participates(agreement) ? "Participação aceita · v" + agreement.terms_version : agreement.nucleus_agreement_participants?.[0]?.response === "declined" ? "Participação recusada" : agreement.nucleus_agreement_participants?.[0]?.response === "accepted" ? "Novo aceite necessário" : "Participação a decidir";
  const participation = (agreement: Agreement) => <div className="agreement-participation">
    <span className="ui-badge">{responseLabel(agreement)}</span>
    <p className="ui-copy">{["ended", "declined"].includes(agreement.status) ? "Este acordo não recebe novas participações. As decisões e o histórico permanecem disponíveis." : participates(agreement) ? "Você participa dos termos atuais. Sua escolha pode ser revista." : "Conheça os termos e escolha se deseja participar. Silêncio não é aceite."}</p>
    {["pending", "testing", "active"].includes(agreement.status) && <div className="agreement-card-actions">
      {!participates(agreement) && <form action={respondAgreementProposal.bind(null, id, agreement.id, "accepted", agreement.category, agreement.terms_version)}><button className="ui-button">Aceitar proposta</button></form>}
      <form action={respondAgreementProposal.bind(null, id, agreement.id, "declined", agreement.category, agreement.terms_version)}><DeclineButton /></form>
    </div>}
  </div>;
  const revision = (agreement: Agreement) => [agreement.id, agreement.status, agreement.terms_version, agreement.nucleus_agreement_participants?.[0]?.response, agreement.nucleus_agreement_participants?.[0]?.accepted_version].join(":");
  const details = (agreement: Agreement) => <div key={revision(agreement)} className="agreement-summary-detail">
    <span className="ui-badge">{statusLabel[agreement.status] ?? "Estado indisponível"} · termos v{agreement.terms_version}</span>
    <p className="agreement-description">{agreement.description}</p>
    <dl className="agreement-facts">
      <div><dt>Quando</dt><dd>{agreement.timing}</dd></div>
      <div><dt>Frequência</dt><dd>{agreement.frequency}</dd></div>
      {agreement.trial_days && <div><dt>Teste planejado</dt><dd>{agreement.trial_days} dias · início e conclusão pela administração</dd></div>}
    </dl>
    <p className="agreement-form-note"><strong>Evolução individual · esboço.</strong> Hábito e Experiência identificam as categorias dos dados atuais. A passagem entre etapas ainda não está integrada.</p>
    {participation(agreement)}
    <div className="agreement-detail-links">
      {agreement.category === "habit" && ["testing", "active", "ended"].includes(agreement.status) && <Link href={routes.nucleus + "/" + id + "/acordos/" + agreement.id} className="ui-button-secondary">Ver detalhe do hábito<ArrowRight size={15} aria-hidden="true" /></Link>}
      <Link href={routes.nucleus + "/" + id + "/acordos/" + agreement.id + "/revisar"} className="ui-button-secondary">Termos e histórico</Link>
      {agreement.category === "habit" && ["testing", "active"].includes(agreement.status) && participates(agreement) && <ActionDialog title="Registrar momento" description={agreement.title} trigger="Registrar momento" variant="primary"><HabitMomentForm nucleusId={id} agreementId={agreement.id} /></ActionDialog>}
      {membership.role === "admin" && ["pending", "testing", "active"].includes(agreement.status) && <ActionDialog title="Administrar acordo" description={agreement.title} trigger="Administrar acordo" variant="secondary"><AgreementAdministration nucleusId={id} agreementId={agreement.id} status={agreement.status} termsVersion={agreement.terms_version} /></ActionDialog>}
    </div>
    <HabitConsentGuidance />
  </div>;
  const card = (agreement: Agreement, detail: ReturnType<typeof details>) => <ActionDialog key={revision(agreement)} title={agreement.title} description="Confira os termos e sua participação neste combinado." variant="card" size="wide" className="agreement-layout-card" trigger={<>
    <span className="agreement-card-top"><span className="agreement-category-badge">{agreement.status === "pending" ? "Proposta" : agreement.category === "habit" ? "Hábito" : "Experiência"}</span><MoreHorizontal size={18} aria-hidden="true" /></span>
    <span className="agreement-card-title">{agreement.title}</span>
    <span className="agreement-card-description">{agreement.description}</span>
    <span className="agreement-card-time"><Clock3 size={13} aria-hidden="true" />{agreement.timing} · {agreement.frequency}</span>
    <span className="agreement-card-footer"><span>{responseLabel(agreement)}</span><span className="agreement-category-badge">{statusLabel[agreement.status] ?? "Indisponível"}</span></span>
  </>}>{detail}</ActionDialog>;

  const header = <>
    <header className="ui-page-header agreements-heading">
      <div><p className="ui-kicker">Combinados do Núcleo</p><h1 className="ui-title">Cada combinado no seu tempo.</h1>
        <p className="ui-copy">O principal módulo de todo ecossistema. É a partir de Acordos que tudo toma forma.</p>
        <AgreementsHowItWorks><ol>
          <li><span aria-hidden="true">➜</span><span>Comece com uma <strong>Proposta:</strong> apresente a prática e combine seus termos. Cada pessoa escolhe se deseja participar.</span></li>
          <li><span aria-hidden="true">➜</span><span>Da Proposta ao <strong>Hábito:</strong> cultive a prática com o apoio do Núcleo, respeitando os termos e a participação de cada pessoa.</span></li>
          <li><span aria-hidden="true">➜</span><span>Do Hábito à <strong>Experiência:</strong> a continuidade da mesma prática orienta o percurso planejado. A passagem individual ainda será implementada.</span></li>
          <li><span aria-hidden="true">➜</span><span>Da Experiência à <strong>Essência:</strong> o reconhecimento da prática consolidada depende de critérios e consentimentos ainda a definir. Ninguém avança automaticamente pelo tempo.</span></li>
        </ol></AgreementsHowItWorks>
      </div>
      <ActionDialog key={agreements.map(agreement => agreement.id).join(":")} title="Nova proposta" description="Uma conversa pode virar um combinado. Enviar a proposta não registra aceite." trigger={<><Plus size={17} aria-hidden="true" />Nova proposta</>} size="wide" variant="primary">
        <p className="agreement-form-note"><strong>Evolução individual · esboço.</strong> As categorias disponíveis conservam os dados atuais. Cadastrar uma Experiência ainda não registra evolução individual a partir de um Hábito.</p>
        <ProposalForm nucleusId={id} category={category === "experience" ? "experience" : "habit"} />
      </ActionDialog>
    </header>
    {query.resultado && notice[query.resultado] && <p role="status" className="agreements-feedback">{notice[query.resultado]}</p>}
  </>;
  return <OnboardingShell nucleusName={nucleus.name}>
    <div className="agreements-page">
      <AgreementsWorkspace initialStatus={filter} essenceOnly={category === "essence"} header={header}
        categories={<nav aria-label="Categorias dos acordos" className="agreements-category-nav"><Link href={href("all", "all")} aria-current={category === "all" && filter === "all" ? "page" : undefined}>Todos</Link><Link href={href("all", "pending")} aria-current={category === "all" && filter === "pending" ? "page" : undefined}>Propostas</Link>{categories.filter(item => item.key !== "all").map(item => <Link key={item.key} href={href(item.key, "all")} aria-current={category === item.key && filter === "all" ? "page" : undefined}>{item.label}</Link>)}</nav>}
        filters={<nav aria-label="Estado dos acordos" className="agreements-server-filters">{filters.map(item => <Link key={item.key} href={href(category, item.key)} aria-current={filter === item.key ? "page" : undefined}>{item.label}</Link>)}</nav>}
        cards={agreements.map(agreement => {
          // Reutiliza o conteúdo de servidor nas duas visualizações; somente uma é montada.
          const detail = details(agreement);
          return { id: agreement.id, revision: revision(agreement), title: agreement.title, description: agreement.description, timing: agreement.timing, frequency: agreement.frequency, category: agreement.category, status: agreement.status, statusLabel: statusLabel[agreement.status] ?? "Indisponível", participationLabel: responseLabel(agreement), content: card(agreement, detail), detail, context: <><span className="ui-badge">{responseLabel(agreement)}</span><p className="ui-copy">Termos versão {agreement.terms_version}</p><p className="ui-copy">{["ended", "declined"].includes(agreement.status) ? "Este acordo permanece disponível para consulta do histórico." : participates(agreement) ? "Você aceitou participar dos termos atuais." : "Você pode escolher se participa dos termos atuais."}</p><p className="ui-copy">A administração organiza o ciclo e preserva o histórico.</p></> };
        })} />
      <p className="agreements-model-note">As colunas mostram propostas e categorias existentes. O percurso de evolução individual permanece planejado.</p>
      {category !== "essence" && (safePage > 1 || hasNextPage) && <nav aria-label="Páginas dos acordos" className="agreements-pagination">
        {safePage > 1 ? <Link href={href(category, filter, safePage - 1)} className="ui-button-secondary">Propostas anteriores</Link> : <span />}
        <span>Página {safePage}</span>
        {hasNextPage && <Link href={href(category, filter, safePage + 1)} className="ui-button-secondary">Mais propostas<ArrowRight size={15} aria-hidden="true" /></Link>}
      </nav>}
    </div>
  </OnboardingShell>;
}
