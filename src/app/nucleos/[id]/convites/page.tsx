import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { InitialInvitation } from "@/features/invitations/components/initial-invitation";
import { InvitationWorkspace } from "@/features/invitations/components/invitation-workspace";
import { isNucleusAuthUnavailable } from "@/features/nuclei/nucleus-access";
import { OnboardingShell } from "@/features/onboarding/components/onboarding-shell";
import { ActionDialog } from "@/shared/components/ui/action-dialog";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { routes } from "@/shared/routes";
import "@/features/invitations/components/participation-layout.css";

export const metadata: Metadata = { title: "Gerenciar convites" };
const filters = { ativos: "Ativos", expirados: "Expirados", revogados: "Revogados" } as const;
type Filter = keyof typeof filters;

export default async function InvitationsPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ status?: string; pagina?: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) notFound();
  const query = await searchParams;
  const filter: Filter = Object.hasOwn(filters, query.status ?? "") ? query.status as Filter : "ativos";
  const page = /^\d{1,6}$/.test(query.pagina ?? "") ? Math.max(1, Number(query.pagina)) : 1;
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect(routes.account);
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (isNucleusAuthUnavailable(authError)) throw new Error("Não foi possível conferir a sessão agora.");
  if (!user) redirect(routes.account);
  const { data: membership, error: membershipError } = await supabase.from("nucleus_members").select("role").eq("nucleus_id", id).eq("user_id", user.id).maybeSingle();
  if (membershipError) throw new Error("Não foi possível consultar a participação.");
  if (membership?.role !== "admin") notFound();
  const { data: nucleus, error: nucleusError } = await supabase.from("nuclei").select("name").eq("id", id).maybeSingle();
  if (nucleusError) throw new Error("Não foi possível consultar o Núcleo.");
  if (!nucleus) notFound();
  // A consulta continua restrita por RLS (segurança por linha) e nunca transporta códigos para a lista.
  let invitationsQuery = supabase.from("nucleus_invitations").select("id,created_at,expires_at,revoked_at").eq("nucleus_id", id);
  const now = new Date().toISOString();
  if (filter === "revogados") invitationsQuery = invitationsQuery.not("revoked_at", "is", null);
  else {
    invitationsQuery = invitationsQuery.is("revoked_at", null);
    invitationsQuery = filter === "ativos" ? invitationsQuery.gt("expires_at", now) : invitationsQuery.lte("expires_at", now);
  }
  const { data, error } = await invitationsQuery.order("created_at", { ascending: false }).order("id", { ascending: false }).range((page - 1) * 20, page * 20);
  if (error) throw new Error("Não foi possível consultar os convites. Tente novamente.");
  const invitations = data ?? [];
  const href = (targetPage: number) => `/nucleos/${id}/convites?status=${filter}&pagina=${targetPage}`;
  return <OnboardingShell nucleusName={nucleus.name}>
    <header className="ui-page-header"><div><p className="ui-kicker">Pessoas e participação</p><h1 className="ui-title">Um convite para estar perto.</h1><p className="ui-copy">Gerencie os convites de {nucleus.name}, com cuidado e liberdade para escolher.</p></div><ActionDialog trigger={<><Plus size={18} aria-hidden="true" />Preparar convite</>} title="Preparar convite" description="Compartilhe o código com quem você deseja convidar." variant="primary"><InitialInvitation nucleusId={id} initialCode="" showManagementLink={false} /></ActionDialog></header>
    <nav aria-label="Status dos convites" className="invitation-filter-tabs">{Object.entries(filters).map(([key, label]) => <Link key={key} href={`/nucleos/${id}/convites?status=${key}`} aria-current={filter === key ? "page" : undefined}>{label}</Link>)}</nav>
    <InvitationWorkspace nucleusId={id} invitations={invitations.slice(0, 20)} status={filter} key={`${filter}-${page}`} />
    {(page > 1 || invitations.length > 20) && <nav aria-label="Páginas dos convites" className="invitation-pagination">{page > 1 ? <Link href={href(page - 1)} className="ui-button-secondary">Página anterior</Link> : <span />}{invitations.length > 20 && <Link href={href(page + 1)} className="ui-button-secondary">Próxima página</Link>}</nav>}
    <details className="invitation-future"><summary>Esboço de funcionalidade · ainda não desenvolvido</summary><p>QR (código de resposta rápida), leitura por câmera, convites por link, destinatários individuais e histórico de aceites estão planejados. O código atual pode ser usado por mais de uma pessoa.</p></details>
  </OnboardingShell>;
}
