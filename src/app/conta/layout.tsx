import { OnboardingShell } from "@/features/onboarding/components/onboarding-shell";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <OnboardingShell>{children}</OnboardingShell>;
}
