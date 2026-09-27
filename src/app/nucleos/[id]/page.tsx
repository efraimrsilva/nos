import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { OnboardingShell } from "@/features/onboarding/components/onboarding-shell";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { routes } from "@/shared/routes";

export const metadata: Metadata = { title: "Seu Núcleo" };

export default async function NucleusPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) notFound();
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect(routes.account);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(routes.account);
  const { data: nucleus } = await supabase.from("nuclei").select("id,name,purpose,created_by").eq("id", id).single();
  if (!nucleus) notFound();

  return <OnboardingShell>
    <p className="step-label mb-3 text-lilac">Seu Núcleo</p>
    <h1 className="font-display text-[30px] font-medium leading-tight md:text-[38px]">{nucleus.name}</h1>
    <section className="mt-6 rounded-[22px] border border-line bg-white p-5 sm:p-7">
      <h2 className="font-display text-xl">Nosso propósito</h2>
      <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-muted">{nucleus.purpose}</p>
    </section>
    {nucleus.created_by === user.id && <Link href={`${routes.initialInvitation}/${encodeURIComponent(id)}`} className="mt-6 inline-flex min-h-11 items-center text-sm font-semibold text-leaf underline">Convidar alguém</Link>}
    <p className="mt-5 text-xs leading-6 text-muted">Este é o início do seu Núcleo. As demais áreas serão adicionadas nas próximas etapas.</p>
    <Link href={routes.account} className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-leaf underline">Minha conta e sair</Link>
  </OnboardingShell>;
}
