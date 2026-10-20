import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { NucleusTypeForm } from "@/features/onboarding/components/nucleus-type-form";
import { OnboardingSteps } from "@/features/onboarding/components/onboarding-steps";
import { findNucleusType } from "@/features/nuclei/nucleus-types";
import { routes } from "@/shared/routes";

export const metadata: Metadata = { title: "Tipo de Núcleo" };
export default async function NucleusTypePage({ searchParams }: { searchParams: Promise<{ tipo?: string | string[] }> }) {
  const selectedType = findNucleusType((await searchParams).tipo);
  return <>
    <Link href={routes.start} className="ui-text-link mb-5"><ArrowLeft size={16} aria-hidden="true" />Voltar</Link>
    <OnboardingSteps current={1} />
    <header className="ui-page-header"><div><p className="ui-kicker">Um espaço com o jeito de vocês</p><h1 className="ui-title">Que relação vocês têm?</h1><p className="ui-copy">Cada tipo de Núcleo cresce com objetivos diferentes.</p></div></header>
    <NucleusTypeForm selectedType={selectedType?.id} />
  </>;
}
