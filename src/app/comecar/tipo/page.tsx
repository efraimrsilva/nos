import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { NucleusTypeForm } from "@/features/onboarding/components/nucleus-type-form";
import { findNucleusType } from "@/features/nuclei/nucleus-types";
import { routes } from "@/shared/routes";

export const metadata: Metadata = { title: "Tipo de Núcleo" };
export default async function NucleusTypePage({ searchParams }: { searchParams: Promise<{ tipo?: string | string[] }> }) {
  const selectedType = findNucleusType((await searchParams).tipo);
  return (
    <>
      <Link href={routes.start} className="mb-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-muted"><ArrowLeft size={17} aria-hidden="true" />Voltar</Link>
      <p className="step-label mb-3 text-lilac">Um espaço com o jeito de vocês</p>
      <h1 className="font-display text-[30px] font-medium leading-tight md:text-[38px]">Que relação vocês têm?</h1>
      <p className="mt-3 text-sm leading-7 text-muted">Cada tipo de Núcleo cresce com objetivos diferentes.</p>
      <NucleusTypeForm selectedType={selectedType?.id} />
    </>
  );
}
