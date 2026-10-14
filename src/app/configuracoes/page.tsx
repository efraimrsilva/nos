import type { Metadata } from "next";
import Link from "next/link";
import { requireControlsSession } from "@/features/controls/access";
import { ControlsShell, ControlSection } from "@/features/controls/components/controls-shell";
import { routes } from "@/shared/routes";

export const metadata: Metadata = { title: "Configurações" };
export default async function SettingsPage() {
  await requireControlsSession(routes.settings);
  return <ControlsShell title="Configurações" subtitle="Um espaço que respeita suas escolhas." back={routes.nucleus}>
    <nav aria-label="Configurações" className="space-y-3">
      {[[routes.privacy, "Privacidade e visibilidade", "Entenda quem pode consultar as informações."], [routes.security, "Conta e segurança", "Cuide do acesso à sua conta."], [routes.help, "Ajuda e suporte", "Conheça os fluxos e seus limites."]].map(([href, title, description]) => <Link key={href} href={href} className="nucleus-card block rounded-[22px] border border-line bg-white p-5"><h2 className="font-display text-xl">{title}</h2><p className="mt-2 text-sm leading-7 text-muted">{description}</p></Link>)}
    </nav>
    <ControlSection title="Este espaço é privado"><p>O acesso a cada Núcleo depende da sua associação. Preferências pessoais não mudam as regras coletivas nem tornam um Núcleo público.</p></ControlSection>
    <ControlSection title="Preferências pessoais e notificações" planned><p>Perfil, visibilidade por informação, canais de aviso e horários de silêncio terão controles próprios quando estiverem disponíveis.</p></ControlSection>
  </ControlsShell>;
}
