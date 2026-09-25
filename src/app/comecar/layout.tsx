import type { ReactNode } from "react";
import { OnboardingShell } from "@/features/onboarding/components/onboarding-shell";

export default function Layout({ children }: { children: ReactNode }) {
  return <OnboardingShell>{children}</OnboardingShell>;
}
