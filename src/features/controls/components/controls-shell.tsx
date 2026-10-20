import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { OnboardingShell } from "@/features/onboarding/components/onboarding-shell";
import "../accounts-layout.css";

export function ControlsShell({ title, subtitle, back, children, nucleusName, showBack = true }: { title: string; subtitle: string; back: string; children: ReactNode; nucleusName?: string; showBack?: boolean }) {
  return <OnboardingShell nucleusName={nucleusName}>
    <div className="controls-workspace">
    {showBack && <Link href={back} className="ui-text-link mb-5"><ArrowLeft size={16} aria-hidden="true" />Voltar</Link>}
    <header className="ui-page-header"><div>
    <p className="ui-kicker">Suas escolhas</p>
    <h1 className="ui-title">{title}</h1>
    <p className="ui-copy">{subtitle}</p>
    </div></header>
    <div className="mt-6 space-y-5">{children}</div>
    </div>
  </OnboardingShell>;
}

export function ControlSection({ title, children, planned = false }: { title: string; children: ReactNode; planned?: boolean }) {
  return <section className={`control-section settings-copy ${planned ? "control-planned" : "ui-panel"}`}>
    <h2>{title}</h2>
    {planned && <p className="ui-badge">Esboço de funcionalidade · ainda não desenvolvido</p>}
    {children}
  </section>;
}
