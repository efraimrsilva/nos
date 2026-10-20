import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { findNucleusType } from "@/features/nuclei/nucleus-types";
import { NucleusPurposeForm } from "@/features/onboarding/components/nucleus-purpose-form";
import { OnboardingSteps } from "@/features/onboarding/components/onboarding-steps";
import { routes } from "@/shared/routes";

export const metadata: Metadata = { title: "Propósito do Núcleo" };

export default async function NucleusPurposePage({ searchParams }: { searchParams: Promise<{ tipo?: string | string[] }> }) {
  const type = findNucleusType((await searchParams).tipo);
  if (!type) redirect(routes.nucleusType);

  return <>
    <Link href={`${routes.nucleusType}?tipo=${type.id}`} className="ui-text-link mb-5"><ArrowLeft size={16} aria-hidden="true" />Voltar</Link>
    <OnboardingSteps current={2} />
    <header className="ui-page-header"><div><p className="ui-kicker">Um espaço com o jeito de vocês</p><h1 className="ui-title">Qual o propósito de vocês?</h1><p className="ui-copy">A bússola que guia as escolhas do Núcleo.</p></div></header>
    <p className="ui-badge">Tipo escolhido: {type.label}</p>
    {/* A página valida o tipo; textos afetivos ficam no cliente até confirmar a criação protegida. */}
    <NucleusPurposeForm suggestion={type.description} type={type.id} />
  </>;
}
