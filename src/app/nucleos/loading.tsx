import { OnboardingShell } from "@/features/onboarding/components/onboarding-shell";
export default function Loading() {
  return <OnboardingShell><p role="status" className="rounded-[22px] border border-line bg-white p-6 text-sm text-muted">Carregando seus Núcleos…</p></OnboardingShell>;
}
