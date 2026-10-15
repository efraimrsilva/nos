import type { Metadata } from "next";
import Link from "next/link";
import { signOut } from "@/features/auth/actions";
import { withAuthNext } from "@/features/auth/input";
import { requireControlsSession } from "@/features/controls/access";
import { ControlsShell, ControlSection } from "@/features/controls/components/controls-shell";
import { SignOutButton } from "@/features/controls/components/sign-out-button";
import { routes } from "@/shared/routes";

export const metadata: Metadata = { title: "Conta e segurança" };
export default async function SecurityPage() {
  await requireControlsSession(routes.security);
  return <ControlsShell title="Conta e segurança" subtitle="Cuide também do seu acesso." back={routes.settings}>
    <ControlSection title="Recuperar acesso e trocar a senha"><p>Solicite um link para o e-mail da conta. A troca exige uma prova de recuperação válida; após salvar, entre com a nova senha. O recebimento depende do envio de e-mail disponível no ambiente.</p><Link className="inline-flex min-h-11 items-center font-semibold text-leaf underline" href={withAuthNext("/conta/recuperar", routes.security)}>Solicitar recuperação de acesso</Link></ControlSection>
    <ControlSection title="Sair da conta"><p>Sair encerra o acesso da sessão e não remove sua participação em nenhum Núcleo. Você poderá voltar entrando na conta.</p>
      {/* Reutiliza a ação do Auth; nenhuma associação do banco é alterada pelo logout. */}
      <form action={signOut} className="mt-3"><SignOutButton /></form>
    </ControlSection>
    <ControlSection title="Sessões e dispositivos" planned><p>Uma lista de dispositivos e a revogação individual de sessões ainda não estão disponíveis. Nunca compartilhe senha ou links de acesso.</p></ControlSection>
    <ControlSection title="Meus dados"><p>Acesso, correção, exportação e exclusão são solicitados manualmente à Sintagma Software. O atendimento verifica a titularidade e protege terceiros. Excluir a conta é diferente de sair de um Núcleo.</p><Link href={routes.help} className="inline-flex min-h-11 items-center font-semibold text-leaf underline">Ajuda sobre meus dados</Link></ControlSection>
    <ControlSection title="Próximas ações de segurança" planned><p>Reautenticação específica e alteração de e-mail ainda não estão disponíveis.</p></ControlSection>
  </ControlsShell>;
}
