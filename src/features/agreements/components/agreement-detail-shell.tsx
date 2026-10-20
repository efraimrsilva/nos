import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { OnboardingShell } from "@/features/onboarding/components/onboarding-shell";
import "../agreements-layout.css";

export function AgreementDetailShell({ title, subtitle, back, backLabel = "Voltar a Acordos", nucleusName, children }: {
  title: string; subtitle: string; back: string; backLabel?: string; nucleusName: string; children: ReactNode;
}) {
  return <OnboardingShell nucleusName={nucleusName}><div className="agreement-detail-page">
    <Link href={back} className="ui-back"><ArrowLeft size={16} aria-hidden="true" />{backLabel}</Link>
    <header className="ui-page-header"><div><p className="ui-kicker">Combinados do Núcleo</p><h1 className="ui-title">{title}</h1><p className="ui-copy">{subtitle}</p></div></header>
    <div className="agreement-detail-content">{children}</div>
  </div></OnboardingShell>;
}

export function AgreementSection({ title, children }: { title: string; children: ReactNode }) {
  return <section className="ui-panel agreement-detail-section"><h2>{title}</h2>{children}</section>;
}
