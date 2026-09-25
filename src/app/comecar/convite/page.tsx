import type { Metadata } from "next";
import { UpcomingStep } from "@/features/onboarding/components/upcoming-step";

export const metadata: Metadata = { title: "Entrar por convite" };
export default function InvitationPage() {
  return <UpcomingStep title="Um convite para cultivar juntos" description="Aqui você poderá conferir um convite e decidir se quer fazer parte do Núcleo. Entrar será sempre uma escolha sua, com aceite explícito." />;
}
