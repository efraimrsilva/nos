import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { InvitationEntry } from "@/features/invitations/components/invitation-entry";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { routes } from "@/shared/routes";

export const metadata: Metadata = { title: "Entrar por convite" };
export default async function InvitationPage() {
  const supabase = await createSupabaseServerClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  return <>
    <Link href={routes.start} className="ui-text-link mb-5"><ArrowLeft size={16} aria-hidden="true" />Voltar</Link>
    <header className="ui-page-header"><div><p className="ui-kicker">Um convite para cultivar juntos</p><h1 className="ui-title">Você recebeu um convite?</h1><p className="ui-copy">Digite o código que te enviaram. Você poderá conhecer o Núcleo antes de decidir.</p></div></header>
    <InvitationEntry isAuthenticated={Boolean(user)} />
  </>;
}
