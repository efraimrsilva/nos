import type { Metadata } from "next";
import { OnboardingShell } from "@/features/onboarding/components/onboarding-shell";
import { FuturePreview } from "@/features/preview/future-preview";
import { getPreviewNucleus } from "@/features/preview/preview-access";

export const metadata: Metadata = { title: "Ponte do Nós · Esboço" };

export default async function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const nucleus = await getPreviewNucleus(id, "cuidado");
  return <OnboardingShell nucleusName={nucleus.name}>
    <FuturePreview kind="cuidado" nucleusId={id} />
  </OnboardingShell>;
}
