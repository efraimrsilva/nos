import type { ReactNode } from "react";
import { ApplicationShell } from "@/shared/components/application-shell";

// O conteúdo continua no servidor; a estrutura cuida somente da navegação e apresentação.
export function OnboardingShell({ children, showTree = false, nucleusName }: { children: ReactNode; showTree?: boolean; nucleusName?: string }) {
  return <ApplicationShell showTree={showTree} nucleusName={nucleusName}>{children}</ApplicationShell>;
}
