import type { Metadata } from "next";
import { requireControlsSession } from "@/features/controls/access";
import { ControlsShell, ControlSection } from "@/features/controls/components/controls-shell";
import { routes } from "@/shared/routes";

export const metadata: Metadata = { title: "Privacidade e visibilidade" };
export default async function PrivacyPage() {
  await requireControlsSession(routes.privacy);
  return <ControlsShell title="Privacidade e visibilidade" subtitle="Conheça o alcance das informações antes de compartilhar." back={routes.settings}>
    <ControlSection title="Núcleos privados"><p>Somente pessoas associadas podem consultar o espaço. Conferir um convite não cria vínculo; aceitar é uma decisão explícita. Revogar um convite impede novos aceites, mas preserva quem já entrou.</p></ControlSection>
    <ControlSection title="O que é compartilhado"><p>Nome e propósito do Núcleo, propostas, termos dos acordos, momentos do Hábito com humor e nota, revisões e agenda interna ficam disponíveis às pessoas associadas ao Núcleo. Escreva suas notas considerando esse alcance.</p></ControlSection>
    <ControlSection title="Decisões individuais"><p>Você responde por si. Na confirmação do Hábito, votos individuais ficam privados; o resultado coletivo só fica disponível quando as condições de autorização são atendidas. Silêncio não é aceite.</p></ControlSection>
    <ControlSection title="Escolhas de visibilidade" planned><p>Perfil afetivo, rascunhos, conversas e mídia terão regras próprias. Ainda não há opção para ocultar retroativamente notas compartilhadas nem para escolher leitores de um momento.</p></ControlSection>
    <ControlSection title="Seus dados e histórico compartilhado" planned><p>Exportação, correção e exclusão de dados pessoais precisam preservar direitos e informações de outras pessoas. A política de retenção e o procedimento para esses pedidos ainda serão definidos.</p></ControlSection>
  </ControlsShell>;
}
