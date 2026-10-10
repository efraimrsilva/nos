import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { withAuthNext } from "@/features/auth/input";

export function AccessHeading({ title, subtitle, next }: { title: string; subtitle: string; next: string }) {
  return <>
    {/* Confirmação e recuperação pertencem a uma conta existente; o retorno preserva o destino e abre login. */}
    <Link href={withAuthNext("/conta?modo=login", next)} className="mb-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-muted"><ArrowLeft size={17} aria-hidden="true" />Voltar para Conta</Link>
    <p className="step-label mb-3 text-lilac">Conta e entrada</p>
    <h1 className="font-display text-[30px] font-medium leading-tight md:text-[38px]">{title}</h1>
    <p className="mt-3 text-sm leading-7 text-muted">{subtitle}</p>
  </>;
}
