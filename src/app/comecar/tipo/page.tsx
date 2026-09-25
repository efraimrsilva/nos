import type { Metadata } from "next";
import { UpcomingStep } from "@/features/onboarding/components/upcoming-step";

export const metadata: Metadata = { title: "Tipo de Núcleo" };
export default function NucleusTypePage() {
  return <UpcomingStep title="Que relação vocês têm?" description="Cada tipo de Núcleo cresce com objetivos diferentes. Vamos preparar uma escolha que acolha todos os tipos de vínculo, sem limitar o espaço a casais ou a duas pessoas." />;
}
