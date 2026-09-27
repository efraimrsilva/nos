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
    <Link href={routes.start} className="mb-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-muted"><ArrowLeft size={17} aria-hidden="true" />Voltar</Link>
    <p className="step-label mb-3 text-lilac">Um convite para cultivar juntos</p>
    <h1 className="font-display text-[30px] font-medium leading-tight md:text-[38px]">Você recebeu um convite?</h1>
    <p className="mt-3 text-sm leading-7 text-muted">Digite o código que te enviaram. Você poderá conhecer o Núcleo antes de decidir.</p>
    <InvitationEntry isAuthenticated={Boolean(user)} />
  </>;
}
