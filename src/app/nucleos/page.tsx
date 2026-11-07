import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Heart, House, Plus, Sprout, UsersRound } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isNucleusAuthUnavailable } from "@/features/nuclei/nucleus-access";
import { profileLetters } from "@/shared/profile-letters";
import { findNucleusType } from "@/features/nuclei/nucleus-types";
import { OnboardingShell } from "@/features/onboarding/components/onboarding-shell";
import { ActionDialog } from "@/shared/components/ui/action-dialog";
import { routes } from "@/shared/routes";
import { NucleusRoleBadge } from "@/features/nuclei/components/nucleus-role-badge";

export const metadata: Metadata = { title: "Seus Núcleos" };

export default async function NucleiPage({ searchParams }: { searchParams: Promise<{ pagina?: string | string[]; resultado?: string }> }) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect(routes.account);
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (isNucleusAuthUnavailable(authError)) throw new Error("Não foi possível conferir a sessão agora.");
  if (!user) redirect(routes.account);
  const { pagina, resultado } = await searchParams;
  const page = typeof pagina === "string" && /^[1-9]\d{0,3}$/.test(pagina) ? Number(pagina) : 1;
  const start = (page - 1) * 20;
  // A RLS retorna somente Núcleos com associação própria; ordenação estável evita misturar contextos.
  const { data, error } = await supabase.from("nuclei").select("id,name,type,purpose").order("name").order("id").range(start, start + 20);
  if (error) throw new Error("Não foi possível consultar seus Núcleos.");
  const nuclei = (data ?? []).slice(0, 20);
  // A RPC devolve nomes e papéis dos integrantes autorizados. A contagem respeita a mesma RLS
  // e não baixa acordos nem depende de paginação/aceite individual; no máximo 20 cartões.
  const spaces = await Promise.all(nuclei.map(async nucleus => {
    const [{ data: management, error: membersError }, { count, error: agreementsError }] = await Promise.all([
      supabase.rpc("get_nucleus_management", { target_nucleus: nucleus.id }),
      supabase.from("nucleus_agreements").select("id", { count: "exact", head: true }).eq("nucleus_id", nucleus.id).eq("status", "active"),
    ]);
    if (membersError) throw new Error("Não foi possível consultar os integrantes dos Núcleos.");
    if (agreementsError || count === null) throw new Error("Não foi possível consultar os acordos ativos dos Núcleos.");
    const members = (management?.members ?? []) as { user_id: string; display_name: string; role: string }[];
    const membership = members.find(person => person.user_id === user.id);
    if (!membership) throw new Error("Não foi possível conferir sua participação nos Núcleos.");
    return { ...nucleus, members, isAdmin: membership.role === "admin", activeAgreements: count };
  }));
  return <OnboardingShell>
    <header className="ui-page-header"><div><p className="ui-kicker">SEUS VÍNCULOS</p><h1 className="ui-title">Seus Núcleos</h1><p className="ui-copy">Vários laços. Seu próprio ritmo. Escolha o espaço que quer cuidar agora.</p></div><div className="nuclei-header-actions"><Link href={routes.invitation} className="ui-button-secondary">Entrar com convite</Link><ActionDialog trigger={<><Plus size={17} aria-hidden="true" />Criar um núcleo</>} title="Começar com intenção" variant="primary"><p className="ui-copy">Cada espaço começa com o vínculo e o propósito de vocês.</p><div className="ui-form-stack mt-6"><Link href={routes.nucleusType} className="ui-row"><span className="color-icon tone-green"><Sprout size={20} aria-hidden="true" /></span><span><strong>Criar um núcleo</strong><small>Escolher vínculo, nome e propósito</small></span><ArrowRight size={17} /></Link><Link href={routes.invitation} className="ui-row"><span className="color-icon tone-blue"><UsersRound size={20} aria-hidden="true" /></span><span><strong>Entrar com um convite</strong><small>Abrir um espaço que já existe</small></span><ArrowRight size={17} /></Link></div></ActionDialog></div></header>
    {resultado === "encerrado" && <p role="status" className="ui-status">Núcleo encerrado. Todos perderam acesso, os convites foram revogados e o histórico permanece armazenado.</p>}
    <div className="nuclei-workspace"><nav aria-label="Seus Núcleos" className="nuclei-cards">
      {spaces.map(nucleus => <Link key={nucleus.id} href={routes.nucleus + "/" + nucleus.id} aria-label={nucleus.name} className="ui-panel nucleus-space-card">
        <div className={"nucleus-cover nucleus-cover-" + nucleus.type}>{nucleus.type === "casal" ? <Heart size={30} aria-hidden="true" /> : nucleus.type === "familia" ? <House size={30} aria-hidden="true" /> : <UsersRound size={30} aria-hidden="true" />}</div>
        <span className="ui-badge">{findNucleusType(nucleus.type)?.label ?? "Núcleo"}</span>
        <h2 title={nucleus.name}>{nucleus.name}</h2>
        <NucleusRoleBadge isAdmin={nucleus.isAdmin} />
        <p className="nucleus-active-agreements">{nucleus.activeAgreements.toLocaleString("pt-BR")} {nucleus.activeAgreements === 1 ? "acordo ativo" : "acordos ativos"}</p>
        <p className="nucleus-members-heading">{nucleus.members.length} {nucleus.members.length === 1 ? "pessoa" : "pessoas"}</p>
        <ul className="nucleus-members-list" aria-label="Pessoas deste Núcleo">{nucleus.members.map(person => <li key={person.user_id}><span className="ui-avatar" aria-hidden="true">{profileLetters(person.display_name)}</span><span title={person.display_name}>{person.display_name}</span></li>)}</ul>
      </Link>)}
      {!nuclei.length && <div role="status" className="ui-empty"><Sprout size={35} aria-hidden="true" />{page===1?"Você ainda não participa de um Núcleo. Crie um espaço ou entre com um convite quando fizer sentido.":"Não há Núcleos nesta página. Volte à página anterior."}</div>}
    </nav></div>
    {(page>1 || (data??[]).length>20) && <nav className="ui-pagination" aria-label="Páginas de Núcleos">{page>1 && <Link className="ui-button-secondary" href={'/nucleos?pagina='+(page-1)}>Página anterior</Link>}{(data??[]).length>20 && <Link className="ui-button-secondary" href={'/nucleos?pagina='+(page+1)}>Próxima página</Link>}</nav>}
  </OnboardingShell>;
}
