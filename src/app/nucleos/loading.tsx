import { OnboardingShell } from "@/features/onboarding/components/onboarding-shell";
import { LoadingIndicator } from "@/shared/components/loading-indicator";
export default function Loading() {
  return <OnboardingShell><p role="status" className="rounded-[22px] border border-line bg-white p-6 text-sm text-muted"><LoadingIndicator>Carregando seus Núcleos…</LoadingIndicator></p></OnboardingShell>;
}
