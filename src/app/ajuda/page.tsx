import type { Metadata } from "next";
import Link from "next/link";
import { requireControlsSession } from "@/features/controls/access";
import { ControlsShell, ControlSection } from "@/features/controls/components/controls-shell";
import { routes } from "@/shared/routes";
export const metadata: Metadata = { title: "Ajuda e suporte" };
export default async function HelpPage() {
  await requireControlsSession(routes.help);
  return <ControlsShell title="Ajuda e suporte" subtitle="Orientação e contato com a responsável pelo aplicativo." back={routes.settings}>
    <ControlSection title="Responsável e suporte"><p>Sintagma Software</p><a href="mailto:sintagmasoftware@gmail.com" className="inline-flex min-h-11 break-all items-center font-semibold text-leaf underline">sintagmasoftware@gmail.com</a><p>Informe o tipo de pedido e o e-mail da sua conta. Não envie senha, código, link de acesso ou conteúdo íntimo. O envio e recebimento dependem do e-mail e da disponibilidade do canal.</p></ControlSection>
    <ControlSection title="Como funcionam os Núcleos?"><p>Administradores convidam, gerenciam participantes e organizam acordos. A nomeação comum exige aceite. Se o último administrador sair, o aplicativo sorteia um participante restante. Se o último membro sair, o Núcleo é encerrado.</p><Link href={routes.nucleus} className="inline-flex min-h-11 items-center font-semibold text-leaf underline">Abrir Seus Núcleos</Link></ControlSection>
    <ControlSection title="Proposta, teste e acordo ativo"><p>Qualquer participante pode propor. Administradores iniciam o teste, ativam e encerram os acordos. Cada pessoa decide se participa. Uma recusa não encerra o acordo das outras pessoas. Alterar os termos exige novo aceite individual; o histórico permanece.</p></ControlSection>
    <ControlSection title="Informações sobre o tratamento de dados"><p>A conta permite autenticar você e proteger o acesso aos Núcleos. Participação, convites, acordos, agenda e momentos são usados para oferecer essas funções. O conteúdo compartilhado fica disponível às pessoas associadas, inclusive depois da saída de quem o registrou. A preferência pode ocultar a autoria nas próximas saídas.</p><Link href={routes.privacy} className="inline-flex min-h-11 items-center font-semibold text-leaf underline">Conferir privacidade</Link></ControlSection>
    <ControlSection title="Acesso, correção, exportação e exclusão"><p>Solicite atendimento no e-mail acima. A responsável verificará sua titularidade antes de fornecer ou alterar dados e avaliará o conteúdo compartilhado para proteger terceiros. Não há exclusão automática nesta tela nem prazo de retenção definido.</p></ControlSection>
    <ControlSection title="Condições de uso do MVP"><p>Respeite a privacidade e os direitos das outras pessoas. Compartilhe apenas conteúdo que você pode disponibilizar aos participantes do Núcleo. Administrar não autoriza aceitar acordos por outra pessoa. Você pode sair a qualquer momento; a tela de saída explica as consequências antes da confirmação.</p></ControlSection>
    <ControlSection title="Antes do piloto" planned><p>Os termos de uso e a política de dados completos, o procedimento operacional do suporte e a comprovação do ambiente de uso ainda precisam ser concluídos. A configuração de e-mail dependente do Google permanece adiada.</p></ControlSection>
  </ControlsShell>;
}
