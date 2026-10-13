import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { RevokeInvitation } from "@/features/invitations/components/revoke-invitation";
import { isNucleusAuthUnavailable } from "@/features/nuclei/nucleus-access";
import { OnboardingShell } from "@/features/onboarding/components/onboarding-shell";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { routes } from "@/shared/routes";

export const metadata: Metadata = { title: "Gerenciar convites" };
const filters = { ativos: "Ativos", expirados: "Expirados", revogados: "Revogados" } as const;
type Filter = keyof typeof filters;
const date = (value: string) => new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short", timeZone: "UTC" }).format(new Date(value));

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
  if (membership?.role !== "creator") notFound();
  // RLS restringe os convites do criador; a consulta nunca transporta códigos para a lista.
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
  return <OnboardingShell>
    <Link href={`/nucleos/${id}`} className="mb-4 inline-flex min-h-11 items-center text-sm font-semibold text-leaf underline">Voltar ao Núcleo</Link>
    <p className="step-label mb-3 text-lilac">A porta do Núcleo merece cuidado</p>
    <h1 className="font-display text-[30px] font-medium md:text-[38px]">Gerenciar convites</h1>
    <p className="mt-3 text-sm leading-7 text-muted">Só o criador gerencia os códigos. Revogar um convite não remove participantes.</p>
    <nav aria-label="Status dos convites" className="mt-6 flex flex-wrap gap-2 rounded-2xl bg-[#edf3e5] p-2">
      {Object.entries(filters).map(([key, label]) => <Link key={key} href={`/nucleos/${id}/convites?status=${key}`} aria-current={filter === key ? "page" : undefined} className={`min-h-11 rounded-xl px-4 py-3 text-sm font-semibold transition-colors hover:bg-white ${filter === key ? "bg-white text-leaf" : "text-muted"}`}>{label}</Link>)}
    </nav>
    {invitations.length === 0 && <p role="status" className="mt-5 rounded-[22px] border border-line bg-white p-5 text-sm text-muted">Nenhum convite {filters[filter].toLowerCase().slice(0, -1)} nesta página.</p>}
    <div className="mt-5 space-y-3">
      {invitations.slice(0, 20).map(invitation => <article key={invitation.id} className="rounded-[22px] border border-line bg-white p-5">
        <h2 className="font-display text-lg">Convite {filters[filter].toLowerCase().slice(0, -1)}</h2>
        <p className="mt-2 text-sm leading-6 text-muted">Criado em {date(invitation.created_at)} UTC</p>
        <p className="text-sm leading-6 text-muted">{invitation.revoked_at ? `Revogado em ${date(invitation.revoked_at)}` : `Expira em ${date(invitation.expires_at)}`} UTC</p>
        {filter === "ativos" && <RevokeInvitation nucleusId={id} invitationId={invitation.id} />}
      </article>)}
    </div>
    {(page > 1 || invitations.length > 20) && <nav aria-label="Páginas dos convites" className="mt-4 flex justify-between gap-3">
      {page > 1 && <Link href={href(page - 1)} className="min-h-11 py-3 text-sm font-semibold text-leaf underline">Página anterior</Link>}
      {invitations.length > 20 && <Link href={href(page + 1)} className="min-h-11 py-3 text-sm font-semibold text-leaf underline">Próxima página</Link>}
    </nav>}
    <Link href={`${routes.initialInvitation}/${id}`} className="continue-button mt-5 inline-flex min-h-12 items-center rounded-xl bg-forest px-5 text-sm font-semibold text-white">Gerar ou compartilhar convite</Link>
    <aside className="mt-5 rounded-2xl bg-[#eff3e6] p-5 text-sm leading-7 text-muted"><h2 className="font-semibold text-forest">Próximas possibilidades · planejadas</h2><p>QR e leitura por câmera, convites por link, destinatários individuais e administradores terão contratos próprios. O histórico de quem aceitou cada convite também está previsto; o código atual pode ser usado por mais de uma pessoa e não registra esse histórico.</p></aside>
  </OnboardingShell>;
}
