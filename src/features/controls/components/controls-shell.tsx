import Link from "next/link";
import type { ReactNode } from "react";
import { OnboardingShell } from "@/features/onboarding/components/onboarding-shell";

export function ControlsShell({ title, subtitle, back, children }: { title: string; subtitle: string; back: string; children: ReactNode }) {
  return <OnboardingShell>
    <Link href={back} className="mb-4 inline-flex min-h-11 items-center text-sm font-semibold text-leaf underline">Voltar</Link>
    <p className="step-label mb-3 text-lilac">Autonomia e proteção</p>
    <h1 className="font-display text-[30px] font-medium leading-tight md:text-[38px]">{title}</h1>
    <p className="mt-3 text-sm leading-7 text-muted">{subtitle}</p>
    <div className="mt-6 space-y-4">{children}</div>
  </OnboardingShell>;
}

export function ControlSection({ title, children, planned = false }: { title: string; children: ReactNode; planned?: boolean }) {
  return <section className="rounded-[22px] border border-line bg-white p-5 text-sm leading-7 text-muted">
    <h2 className="mb-2 font-display text-xl text-ink">{title}</h2>
    {planned && <p className="mb-2 text-xs font-semibold text-lilac">Planejado · ainda indisponível</p>}
    {children}
  </section>;
}
