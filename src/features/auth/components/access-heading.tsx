import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { withAuthNext } from "@/features/auth/input";

export function AccessHeading({ title, subtitle, next }: { title: string; subtitle: string; next: string }) {
  return <div className="account-auth-heading">
    {/* O retorno preserva o destino protegido e abre a aba de login. */}
    <Link href={withAuthNext("/conta?modo=login", next)} className="ui-text-link mb-5"><ArrowLeft size={16} aria-hidden="true" />Voltar para Conta</Link>
    <header className="ui-page-header"><div><p className="ui-kicker">Conta e entrada</p><h1 className="ui-title">{title}</h1><p className="ui-copy">{subtitle}</p></div></header>
  </div>;
}
