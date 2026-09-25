import Link from "next/link";
import { ArrowLeft, Sprout } from "lucide-react";
import { routes } from "@/shared/routes";

export function UpcomingStep({ title, description, backHref = routes.start }: { title: string; description: string; backHref?: string }) {
  return (
    <>
      {/* Cada fluxo fornece seu retorno; a etapa preparatória não grava dados. */}
      <Link href={backHref} className="mb-8 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-muted"><ArrowLeft size={17} aria-hidden="true" />Voltar</Link>
      <p className="step-label mb-4 text-lilac">Nosso próximo passo</p>
      <h1 className="font-display text-3xl font-medium leading-tight md:text-4xl">{title}</h1>
      <p className="mt-4 text-sm leading-7 text-muted">{description}</p>
      <div className="mt-8 rounded-[22px] border border-line bg-white p-6">
        <Sprout className="mb-4 text-leaf" size={25} aria-hidden="true" />
        <h2 className="font-semibold">Esta etapa está sendo preparada</h2>
        <p className="mt-3 text-sm leading-7 text-muted">Este é o espaço da próxima etapa — nenhum Núcleo foi criado e nenhum convite foi aceito.</p>
      </div>
    </>
  );
}
