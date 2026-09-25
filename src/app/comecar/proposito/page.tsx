import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { findNucleusType } from "@/features/nuclei/nucleus-types";
import { UpcomingStep } from "@/features/onboarding/components/upcoming-step";
import { routes } from "@/shared/routes";

export const metadata: Metadata = { title: "Propósito do Núcleo" };

export default async function NucleusPurposePage({ searchParams }: { searchParams: Promise<{ tipo?: string | string[] }> }) {
  const type = findNucleusType((await searchParams).tipo);
  if (!type) redirect(routes.nucleusType);

  return (
    <>
      <UpcomingStep title="O que vocês querem cultivar?" description="O próximo passo será dar um nome ao Núcleo e encontrar um propósito que faça sentido para vocês." backHref={`${routes.nucleusType}?tipo=${type.id}`} />
      <p className="mt-5 text-sm font-semibold">Tipo escolhido: {type.label}</p>
    </>
  );
}
