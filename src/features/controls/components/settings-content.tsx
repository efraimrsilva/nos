import Link from "next/link";
import { savePrivacyPreference } from "@/features/controls/actions";
import { ControlActionForm } from "./action-form";
import { routes } from "@/shared/routes";

// Rotas diretas e diálogos exibem os mesmos contratos; ações continuam validadas no servidor.
export function PrivacyContent({ hidden }: { hidden: boolean }) {
  return <div className="settings-copy">
    <section className="control-section"><h3>Núcleos privados</h3><p>Somente pessoas associadas consultam o espaço. Administradores gerenciam pessoas e convites; esse papel não permite consultar conteúdos pessoais privados.</p></section>
    <section className="control-section"><h3>O que é compartilhado</h3><p>Nome e propósito do Núcleo, termos dos acordos, momentos do Hábito com humor e nota, histórico de alterações e agenda ficam disponíveis às pessoas associadas. Cada pessoa aceita sua própria participação; silêncio não é aceite.</p></section>
    <section className="control-section"><h3>Ocultar autoria depois de sair</h3><p>Esta preferência vale para suas próximas saídas de qualquer Núcleo. Ela preserva o conteúdo e oculta a identificação da autoria; não apaga notas nem altera saídas anteriores. Uma autoria já ocultada não será revelada ao desativar a preferência. O próprio texto ainda pode identificar você.</p><ControlActionForm action={savePrivacyPreference} label="Salvar preferência"><label className="control-check"><input name="hideAuthorship" type="checkbox" defaultChecked={hidden} /><span>Ocultar minha autoria nas interações após sair de um Núcleo</span></label></ControlActionForm></section>
    <section className="control-section"><h3>Seus dados</h3><p>Acesso, correção e exportação são solicitados ao suporte. Você pode apagar sua própria conta no bloco Apagar minha conta. O histórico compartilhado permanece com autoria “Conta excluída”; textos ainda podem identificar você.</p><Link href="/conta#apagar-minha-conta">Abrir Apagar minha conta</Link></section>
    <section className="control-section control-planned"><span className="ui-badge">Esboço de funcionalidade · ainda não desenvolvido</span><h3>Próximas opções de privacidade</h3><p>Perfil afetivo, rascunhos, conversas livres, mídia e seleção de leitores terão controles próprios. Essas funções ainda não estão disponíveis.</p></section>
  </div>;
}

export function HelpContent() {
  return <div className="settings-copy">
    <section className="control-section"><h3>Responsável e suporte</h3><p>Sintagma Software</p><a href="mailto:sintagmasoftware@gmail.com">sintagmasoftware@gmail.com</a><p>Informe o tipo de pedido e o e-mail da sua conta. Não envie senha, código, link de acesso ou conteúdo íntimo. O envio e recebimento dependem do e-mail e da disponibilidade do canal.</p></section>
    <section className="control-section"><h3>Como funcionam os Núcleos?</h3><p>Administradores convidam, gerenciam participantes e organizam acordos. A nomeação comum exige aceite. Se o último administrador sair, o aplicativo sorteia um participante restante. Se o último membro sair, o Núcleo é encerrado.</p><Link href={routes.nucleus}>Abrir Seus Núcleos</Link></section>
    <section className="control-section"><h3>Proposta, teste e acordo ativo</h3><p>Qualquer participante pode propor. Administradores iniciam o teste, ativam e encerram os acordos. Cada pessoa decide se participa. Uma recusa não encerra o acordo das outras pessoas. Alterar os termos exige novo aceite individual; o histórico permanece.</p></section>
    <section className="control-section"><h3>Informações sobre o tratamento de dados</h3><p>A conta permite autenticar você e proteger o acesso aos Núcleos. Participação, convites, acordos, agenda e momentos são usados para oferecer essas funções. O conteúdo compartilhado fica disponível às pessoas associadas, inclusive depois da saída de quem o registrou. A preferência pode ocultar a autoria nas próximas saídas.</p><Link href="/conta#privacidade">Conferir privacidade</Link></section>
    <section className="control-section"><h3>Acesso, correção, exportação e exclusão</h3><p>Para acesso, correção e exportação, solicite atendimento no e-mail acima. Para apagar sua própria conta, abra o bloco Apagar minha conta. A exclusão retira seu acesso e identificação, preservando o histórico compartilhado como “Conta excluída”. Textos podem identificar você; retenção e cópias de segurança exigem tratamento próprio do serviço.</p><Link href="/conta#apagar-minha-conta">Abrir Apagar minha conta</Link></section>
    <section className="control-section"><h3>Condições de uso do MVP</h3><p>Respeite a privacidade e os direitos das outras pessoas. Compartilhe apenas conteúdo que você pode disponibilizar aos participantes do Núcleo. Administrar não autoriza aceitar acordos por outra pessoa. Você pode sair a qualquer momento; a tela de saída explica as consequências antes da confirmação.</p></section>
    <section className="control-section control-planned"><span className="ui-badge">Esboço de funcionalidade · ainda não desenvolvido</span><h3>Documentos e atendimento</h3><p>Os termos de uso e a política de dados completos, o procedimento operacional do suporte e a comprovação do ambiente de uso ainda precisam ser concluídos. A configuração de e-mail dependente do Google permanece adiada.</p></section>
  </div>;
}
