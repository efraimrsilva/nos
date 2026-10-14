import type { Metadata } from "next";
import Link from "next/link";
import { requireControlsSession } from "@/features/controls/access";
import { ControlsShell, ControlSection } from "@/features/controls/components/controls-shell";
import { routes } from "@/shared/routes";

export const metadata: Metadata = { title: "Ajuda e suporte" };
export default async function HelpPage() {
  await requireControlsSession(routes.help);
  return <ControlsShell title="Ajuda e suporte" subtitle="Orientação quando precisar." back={routes.settings}>
    <ControlSection title="Como funcionam os Núcleos?"><p>São espaços privados. Crie um Núcleo ou confira um convite e aceite quando fizer sentido. Para alternar entre espaços, volte a Seus Núcleos.</p><Link href={routes.nucleus} className="inline-flex min-h-11 items-center font-semibold text-leaf underline">Abrir Seus Núcleos</Link></ControlSection>
    <ControlSection title="Proposta, teste e acordo ativo"><p>Enviar uma proposta não cria um acordo ativo. Todos os participantes originais precisam aceitar para iniciar o teste. Após o prazo, a confirmação segue a regra coletiva. Ajuste ou encerramento exigem unanimidade, sete dias de reflexão e aplicação explícita; encerrar preserva o histórico.</p></ControlSection>
    <ControlSection title="Agenda e privacidade"><p>Criar um evento convida as pessoas atuais do Núcleo. Cada pessoa responde por si; remarcação solicita nova resposta aos demais. Remover um evento apaga o evento e suas respostas após confirmação.</p><Link href={routes.privacy} className="inline-flex min-h-11 items-center font-semibold text-leaf underline">Conferir alcance dos registros</Link></ControlSection>
    <ControlSection title="Sair da conta ou do Núcleo?"><p>Sair da conta permite entrar novamente e conserva seus vínculos. No Início de cada Núcleo, você pode consultar as consequências da saída. A remoção do vínculo ainda não está disponível.</p></ControlSection>
    <ControlSection title="Suporte, termos e direitos sobre dados" planned><p>O canal de suporte, responsável pelo atendimento, termos de uso e procedimento para acesso, correção, exportação e exclusão de dados ainda serão definidos antes de abrir o piloto. Não envie credenciais, links de acesso ou conteúdo íntimo em pedidos de ajuda.</p></ControlSection>
  </ControlsShell>;
}
