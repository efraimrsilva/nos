import type { Metadata } from "next";
import { Plus, UsersRound, Leaf } from "lucide-react";
import { PathCard } from "@/features/onboarding/components/path-card";
import { routes } from "@/shared/routes";
import Link from "next/link";

export const metadata: Metadata = { title: "Escolher caminho" };

export default function ChoosePathPage() {
  return (
    <>
      <Link href={routes.nucleus} className="mb-5 inline-flex min-h-11 items-center text-sm font-semibold text-leaf underline">Voltar a Seus Núcleos</Link>
      <p className="step-label mb-3 flex items-center gap-2 text-lilac"><span className="h-1.5 w-1.5 rounded-full bg-lilac" aria-hidden="true" />Seu primeiro passo</p>
      <h1 className="max-w-md font-display text-[30px] font-medium leading-[1.18] md:text-[42px]">Como você quer começar?</h1>
      <p className="mt-3 max-w-sm text-[13px] leading-6 text-muted md:text-sm md:leading-7">Crie um espaço novo ou junte-se a quem te convidou.</p>
      <nav aria-label="Escolha como começar" className="mt-7 flex flex-col gap-3.5 md:mt-8">
        <PathCard href={routes.nucleusType} title="Criar um núcleo" description="Comece um novo jardim com quem você ama." icon={Plus} />
        <PathCard href={routes.invitation} title="Entrar com um convite" description="Recebeu um código de alguém? Junte-se a eles." icon={UsersRound} variant="invite" />
      </nav>
      <div className="mt-6 flex items-start gap-2.5 px-1 text-xs leading-6 text-muted">
        <Leaf size={16} className="mt-1 shrink-0 text-leaf" aria-hidden="true" />
        <p>Um Núcleo é um espaço de cuidado para as relações da sua vida. Cada vínculo tem seu jeito de florescer.</p>
      </div>
    </>
  );
}
