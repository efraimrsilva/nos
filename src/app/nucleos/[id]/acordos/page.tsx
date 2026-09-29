import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowRight, ChevronLeft, LockKeyhole } from "lucide-react";
import { respondAgreementProposal } from "@/features/agreements/actions";
import { ProposalForm } from "@/features/agreements/components/proposal-form";
import { DeclineButton } from "@/features/agreements/components/decline-button";
import { isNucleusAuthUnavailable } from "@/features/nuclei/nucleus-access";
import { OnboardingShell } from "@/features/onboarding/components/onboarding-shell";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { routes } from "@/shared/routes";

export const metadata: Metadata = { title: "Acordos do Núcleo" };
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
type Agreement = {
  id: string; category: string; title: string; description: string; timing: string;
  frequency: string; status: string; created_at: string;
  nucleus_agreement_participants: { response: string }[];
};
const categories = [{ key: "habit", label: "Hábitos" }, { key: "experience", label: "Experiências" }, { key: "essence", label: "Essência" }] as const;
const filters = [{ key: "all", label: "Todos" }, { key: "pending", label: "Aguardando" },
  { key: "testing", label: "Em teste" }, { key: "declined", label: "Recusados" }] as const;
const statusLabel: Record<string, string> = { pending: "Aguardando aceite", testing: "Em teste com consentimento", declined: "Proposta recusada" };

export default async function AgreementsPage({ params, searchParams }: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ categoria?: string; filtro?: string; pagina?: string; resultado?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  if (!uuid.test(id)) notFound();
  const category = categories.find((item) => item.key === query.categoria)?.key ?? "habit";
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
      .select("id,category,title,description,timing,frequency,status,created_at,nucleus_agreement_participants(response)")
      .eq("nucleus_id", id).eq("category", category);
    if (filter !== "all") request = request.eq("status", filter);
    const { data, error } = await request.order("created_at", { ascending: false }).order("id")
      .range((safePage - 1) * 50, safePage * 50);
    if (error) throw new Error("Não foi possível consultar os acordos agora.");
    agreements = ((data ?? []).slice(0, 50)) as Agreement[];
    hasNextPage = (data ?? []).length > 50;
  }
  const notice: Record<string, string> = { proposta: "Proposta enviada. Aguarde a resposta das outras pessoas.",
    resposta: "Sua resposta foi registrada.", erro: "Não foi possível registrar a resposta. Atualize a página e tente novamente." };

  return <OnboardingShell>
    <Link href={`${routes.nucleus}/${id}`} className="mb-5 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-leaf underline">
      <ChevronLeft size={16} aria-hidden="true" />Voltar ao Núcleo
    </Link>
    <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted"><LockKeyhole size={14} aria-hidden="true" />Espaço privado · {nucleus.name}</p>
    <h1 className="mt-3 font-display text-[32px] leading-tight md:text-[42px]">Acordos</h1>
    <p className="mt-2 text-sm leading-7 text-muted">Pequenas ações, grandes laços. Cada compromisso começa por uma proposta e pelo sim de quem participa.</p>
    {query.resultado && notice[query.resultado] && <p role="status" className="mt-4 rounded-xl bg-[#edf3e5] p-3 text-sm text-forest">{notice[query.resultado]}</p>}

    <nav aria-label="Categorias dos acordos" className="mt-6 flex flex-wrap gap-2">
      {categories.map((item) => <Link key={item.key} href={href(item.key, "all")}
        aria-current={category === item.key ? "page" : undefined}
        className={`inline-flex min-h-11 items-center rounded-xl px-4 text-sm font-semibold ${category === item.key ? "bg-forest text-white" : "border border-line bg-white text-leaf"}`}>
        {item.label}
      </Link>)}
    </nav>
    {category !== "essence" && <nav aria-label="Estado dos acordos" className="mt-3 flex flex-wrap gap-2">
      {filters.map((item) => <Link key={item.key} href={href(category, item.key)} aria-current={filter === item.key ? "page" : undefined}
        className={`inline-flex min-h-11 items-center rounded-xl px-3 text-xs font-semibold ${filter === item.key ? "bg-[#edf3e5] text-forest" : "text-muted underline"}`}>
        {item.label}
      </Link>)}
    </nav>}

    <section className="mt-5 rounded-[22px] border border-line bg-white p-5 shadow-[0_5px_18px_#52403805] sm:p-7" aria-labelledby="agreements-list-heading">
      <h2 id="agreements-list-heading" className="font-display text-xl">{categories.find((item) => item.key === category)?.label}</h2>
      {category === "essence" ? <p className="mt-4 text-sm leading-7 text-muted">A Essência reunirá práticas consolidadas com consentimento de todos. Essa etapa ainda não está disponível.</p> :
        agreements.length === 0 ? <p className="mt-4 text-sm leading-7 text-muted">{safePage > 1 ? "Nenhuma proposta nesta página. Volte à anterior." :
          filter === "all" ? "Comece por uma necessidade simples. Um acordo nasce melhor quando nasce de uma conversa." : "Nenhuma proposta neste estado por enquanto."}</p> :
          <ol className="mt-4 grid gap-4">{agreements.map((agreement) => {
            const ownResponse = agreement.nucleus_agreement_participants?.[0]?.response;
            return <li key={agreement.id} className="rounded-2xl border border-line bg-[#fbfaf7] p-4">
              <h3 className="break-words font-display text-lg">{agreement.title}</h3>
              <p className="mt-1 text-xs font-semibold text-leaf">{statusLabel[agreement.status] ?? "Estado indisponível"}</p>
              <p className="mt-3 whitespace-pre-wrap break-words text-sm text-muted">{agreement.description}</p>
              <p className="mt-2 text-sm text-muted">Quando: {agreement.timing} · Frequência: {agreement.frequency}</p>
              {agreement.status === "pending" && ownResponse === "pending" && <div className="mt-4 flex flex-wrap gap-2">
                <form action={respondAgreementProposal.bind(null, id, agreement.id, "accepted", category)}><button className="min-h-11 rounded-xl bg-forest px-4 text-sm font-semibold text-white">Aceitar proposta</button></form>
                <form action={respondAgreementProposal.bind(null, id, agreement.id, "declined", category)}><DeclineButton /></form>
              </div>}
              {agreement.status === "pending" && ownResponse === "accepted" && <p className="mt-3 text-xs text-muted">Você aceitou. Aguardando outras respostas.</p>}
            </li>;
          })}</ol>}
      {category !== "essence" && (safePage > 1 || hasNextPage) && <nav aria-label="Páginas dos acordos" className="mt-5 flex flex-wrap justify-between gap-3 text-sm font-semibold text-leaf">
        {safePage > 1 ? <Link href={href(category, filter, safePage - 1)} className="underline">Propostas anteriores</Link> : <span />}
        {hasNextPage && <Link href={href(category, filter, safePage + 1)} className="underline">Mais propostas<ArrowRight size={14} className="ml-1 inline" aria-hidden="true" /></Link>}
      </nav>}
    </section>

    {category !== "essence" && <section className="mt-4 rounded-[22px] border border-line bg-white p-5 sm:p-7" aria-labelledby="new-agreement-heading">
      <h2 id="new-agreement-heading" className="font-display text-xl">Nova proposta</h2>
      <p className="mt-2 text-sm leading-7 text-muted">Conversem sobre a necessidade antes de enviar. Todas as pessoas que já fazem parte do Núcleo poderão responder. É preciso ter ao menos duas pessoas.</p>
      <ProposalForm nucleusId={id} category={category} />
    </section>}
  </OnboardingShell>;
}
