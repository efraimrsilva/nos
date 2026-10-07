import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowRight, CalendarDays, Handshake, LockKeyhole, Sprout } from "lucide-react";
import { isNucleusAuthUnavailable } from "@/features/nuclei/nucleus-access";
import { getNucleusHomeDetails } from "@/features/nuclei/nucleus-home-details";
import { OnboardingShell } from "@/features/onboarding/components/onboarding-shell";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { routes } from "@/shared/routes";

export const metadata: Metadata = { title: "Início do Núcleo" };

export default async function NucleusPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) notFound();
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect(routes.account);
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  // Sessão ausente pede entrada; falha operacional do Auth oferece nova tentativa na própria Home.
  if (isNucleusAuthUnavailable(authError)) throw new Error("Não foi possível conferir a sessão agora.");
  if (!user) redirect(routes.account);
  // A participação é lida com a sessão da requisição; a política RLS expõe só o vínculo da própria pessoa.
  const { data: membership, error: membershipError } = await supabase.from("nucleus_members")
    .select("role").eq("nucleus_id", id).eq("user_id", user.id).maybeSingle();
  if (membershipError) throw new Error("Não foi possível consultar a participação no Núcleo.");
  if (!membership) notFound();
  const { data: nucleus, error: nucleusError } = await supabase.from("nuclei")
    .select("id,name,type,purpose").eq("id", id).maybeSingle();
  if (nucleusError) throw new Error("Não foi possível consultar o Núcleo.");
  if (!nucleus) notFound();
  const details = getNucleusHomeDetails(nucleus.type, membership.role, id);

  return <OnboardingShell>
    <Link href={routes.nucleus} className="mb-4 inline-flex min-h-11 items-center text-sm font-semibold text-leaf underline">Voltar a Seus Núcleos</Link>
    <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-semibold text-muted">
      <span className="rounded-full bg-[#edf3e5] px-3 py-1.5 text-leaf">{details.typeLabel}</span>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5"><LockKeyhole size={13} aria-hidden="true" />Espaço privado</span>
    </div>
    <p className="step-label mb-3 text-lilac">Início do Núcleo</p>
    <h1 className="break-words font-display text-[32px] font-medium leading-tight md:text-[42px]">{nucleus.name}</h1>
    <p className="mt-3 text-sm leading-7 text-muted">Um lugar para cultivar os vínculos no tempo de vocês.</p>

    <section className="mt-7 rounded-[22px] border border-line bg-white p-5 shadow-[0_5px_18px_#52403805] sm:p-7" aria-labelledby="purpose-heading">
      <div className="flex items-center gap-2.5"><Sprout size={20} className="text-leaf" aria-hidden="true" /><h2 id="purpose-heading" className="font-display text-xl">Nosso propósito</h2></div>
      <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-7 text-muted">{nucleus.purpose}</p>
    </section>
    <section className="mt-4 rounded-[22px] border border-line bg-[#f0f3e8] p-5 sm:p-6" aria-labelledby="participation-heading">
      <h2 id="participation-heading" className="font-display text-lg">Seu lugar aqui</h2>
      <p className="mt-2 text-sm leading-7 text-muted">{details.participation}. Apenas participantes podem abrir esta página.</p>
      {details.invitationHref && <Link href={details.invitationHref} className="continue-button mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-forest px-5 text-sm font-semibold text-white">Convidar alguém<ArrowRight size={17} aria-hidden="true" /></Link>}
    </section>
    <section className="mt-4 rounded-[22px] border border-line bg-white p-5 sm:p-6" aria-labelledby="agenda-heading">
      <div className="flex items-center gap-2.5"><CalendarDays size={20} className="text-leaf" aria-hidden="true" /><h2 id="agenda-heading" className="font-display text-lg">Agenda do Núcleo</h2></div>
      <p className="mt-2 text-sm leading-7 text-muted">Planejem momentos juntos e respondam no tempo de cada pessoa.</p>
      <Link href={`${routes.nucleus}/${id}/agenda`} className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-leaf underline">Abrir agenda<ArrowRight size={16} aria-hidden="true" /></Link>
    </section>
    <section className="mt-4 rounded-[22px] border border-line bg-white p-5 sm:p-6" aria-labelledby="agreements-heading">
      <div className="flex items-center gap-2.5"><Handshake size={20} className="text-leaf" aria-hidden="true" /><h2 id="agreements-heading" className="font-display text-lg">Acordos do Núcleo</h2></div>
      <p className="mt-2 text-sm leading-7 text-muted">Construam propostas juntos. Cada pessoa decide se aceita participar.</p>
      <Link href={`${routes.nucleus}/${id}/acordos`} className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-leaf underline">Abrir acordos<ArrowRight size={16} aria-hidden="true" /></Link>
    </section>
    <Link href={routes.account} className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-leaf underline">Minha conta e sair</Link>
  </OnboardingShell>;
}
