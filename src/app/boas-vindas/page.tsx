import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { OnboardingShell } from "@/features/onboarding/components/onboarding-shell";
import "@/features/controls/accounts-layout.css";

export const metadata: Metadata = { title: "Boas-vindas" };

// Os caminhos permanecem diretos; criar conta e entrar preservam seus modos de acesso.
export default function WelcomePage() {
  return <OnboardingShell><section className="welcome-introduction">
    <p className="ui-kicker">Um começo, muitas possibilidades</p>
    <h1 className="ui-title">Fortalecendo os laços que unem quem você ama.</h1>
    <p className="ui-copy">Um espaço privado para cultivar suas relações com pequenos cuidados, conversas e acordos no tempo de vocês.</p>
    <blockquote>Vínculos reais. Pequenos cuidados. No tempo de vocês.</blockquote>
    <div className="welcome-actions"><Link href="/conta" className="ui-button">Começar agora<ArrowRight size={16} aria-hidden="true" /></Link><Link href="/conta?modo=login" className="ui-button-secondary">Entrar na minha conta</Link></div>
    <p className="onboarding-note">Cada pessoa participa por escolha. Seus Núcleos permanecem privados para quem faz parte deles.</p>
  </section></OnboardingShell>;
}
