import type { Metadata } from "next";
import { ArrowLeft, Plus, UsersRound } from "lucide-react";
import { PathCard } from "@/features/onboarding/components/path-card";
import { routes } from "@/shared/routes";
import Link from "next/link";

export const metadata: Metadata = { title: "Escolher caminho" };

export default function ChoosePathPage() {
  return <>
    <Link href={routes.nucleus} className="ui-text-link mb-5"><ArrowLeft size={16} aria-hidden="true" />Voltar a Seus Núcleos</Link>
    <header className="ui-page-header"><div><p className="ui-kicker">Seu primeiro passo</p><h1 className="ui-title">Como você quer começar?</h1><p className="ui-copy">Crie um espaço novo ou junte-se a quem te convidou.</p></div></header>
    <nav aria-label="Escolha como começar" className="onboarding-choices">
      <PathCard href={routes.nucleusType} title="Criar um núcleo" description="Dê um nome ao vínculo, escolha o propósito de vocês e convide quem faz parte." icon={Plus} />
      <PathCard href={routes.invitation} title="Entrar com um convite" description="Recebeu um código de alguém? Confira o Núcleo e decida se quer participar." icon={UsersRound} variant="invite" />
    </nav>
    <p className="onboarding-note">Um Núcleo é um espaço privado de cuidado para as relações da sua vida. Cada vínculo tem seu jeito de florescer.</p>
  </>;
}
