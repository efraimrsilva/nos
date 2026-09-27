import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { findNucleusType } from "@/features/nuclei/nucleus-types";
import { NucleusPurposeForm } from "@/features/onboarding/components/nucleus-purpose-form";
import { routes } from "@/shared/routes";

export const metadata: Metadata = { title: "Propósito do Núcleo" };

export default async function NucleusPurposePage({ searchParams }: { searchParams: Promise<{ tipo?: string | string[] }> }) {
  const type = findNucleusType((await searchParams).tipo);
  if (!type) redirect(routes.nucleusType);

  return (
    <>
      <Link href={`${routes.nucleusType}?tipo=${type.id}`} className="mb-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-muted"><ArrowLeft size={17} aria-hidden="true" />Voltar</Link>
      <p className="step-label mb-3 text-lilac">Um espaço com o jeito de vocês</p>
      <h1 className="font-display text-[30px] font-medium leading-tight md:text-[38px]">Qual o propósito de vocês?</h1>
      <p className="mt-3 text-sm leading-7 text-muted">A bússola que guia as escolhas do Núcleo.</p>
      <p className="mt-3 text-sm font-semibold">Tipo escolhido: {type.label}</p>
      {/* A página valida somente o tipo; os campos afetivos permanecem no cliente até existir uma criação protegida. */}
      <NucleusPurposeForm suggestion={type.description} />
    </>
  );
}
