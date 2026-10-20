import type { ReactNode } from "react";
import { OnboardingShell } from "@/features/onboarding/components/onboarding-shell";
import "@/features/controls/accounts-layout.css";

export default function Layout({ children }: { children: ReactNode }) {
  return <OnboardingShell><div className="onboarding-workspace">{children}</div></OnboardingShell>;
}
