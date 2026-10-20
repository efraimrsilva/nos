import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { InitialInvitation } from "@/features/invitations/components/initial-invitation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { routes } from "@/shared/routes";
import { isNucleusAuthUnavailable } from "@/features/nuclei/nucleus-access";
import { OnboardingSteps } from "@/features/onboarding/components/onboarding-steps";

export const metadata: Metadata = { title: "Convite inicial" };

export default async function InitialInvitationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) notFound();
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect(routes.account);
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (isNucleusAuthUnavailable(authError)) throw new Error("Não foi possível conferir a sessão agora.");
  if (!user) redirect(routes.account);
  const { data: membership, error: membershipError } = await supabase.from("nucleus_members").select("role").eq("nucleus_id", id).eq("user_id", user.id).maybeSingle();
  if (membershipError) throw new Error("Não foi possível consultar sua participação.");
  if (membership?.role !== "admin") notFound();
  const { data: nucleus, error: nucleusError } = await supabase.from("nuclei").select("id,name").eq("id", id).maybeSingle();
  if (nucleusError) throw new Error("Não foi possível consultar o Núcleo.");
  if (!nucleus) notFound();
  const { data: invitations, error: invitationsError } = await supabase.from("nucleus_invitations").select("code,expires_at").eq("nucleus_id", id).is("revoked_at", null).gt("expires_at", new Date().toISOString()).order("created_at", { ascending: false }).order("id", { ascending: false }).limit(1);
  if (invitationsError) throw new Error("Não foi possível consultar o convite.");

  return <>
    <OnboardingSteps current={3} />
    <header className="ui-page-header"><div><p className="ui-kicker">Núcleo criado</p>
    <h1 className="ui-title">Convide quem faz parte</h1>
    <p className="ui-copy">{nucleus.name} já é seu espaço privado. Convidar alguém agora é opcional.</p></div></header>
    <InitialInvitation key={invitations?.[0]?.code ?? "empty"} nucleusId={id} initialCode={invitations?.[0]?.code ?? ""} expiresAt={invitations?.[0]?.expires_at} />
    <Link href={`/nucleos/${encodeURIComponent(id)}`} className="ui-button-secondary mt-5">Concluir por enquanto</Link>
  </>;
}
