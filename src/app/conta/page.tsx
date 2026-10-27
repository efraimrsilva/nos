import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, KeyRound, LockKeyhole, LogOut, UsersRound } from "lucide-react";
import { AuthForm } from "@/features/auth/components/auth-form";
import { AccountAccessDialog } from "@/features/auth/components/account-access-dialog";
import { signOut } from "@/features/auth/actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { routes } from "@/shared/routes";
import { safeAuthNext, withAuthNext } from "@/features/auth/input";
import { isNucleusAuthUnavailable } from "@/features/nuclei/nucleus-access";
import { OnboardingShell } from "@/features/onboarding/components/onboarding-shell";
import { AccountRow } from "@/features/controls/components/account-row";
import { SecurityContent } from "@/features/controls/components/settings-content";
import { SignOutButton } from "@/features/controls/components/sign-out-button";
import { ActionDialog } from "@/shared/components/ui/action-dialog";
import "@/features/controls/accounts-layout.css";
import "@/features/auth/account-motion.css";

export const metadata: Metadata = { title: "Sua conta" };

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ erro?: string | string[]; next?: string | string[]; resultado?: string | string[]; modo?: string | string[]; acesso?: string | string[] }> }) {
  const params = await searchParams;
  const error = params.erro;
  const next = safeAuthNext(params.next);
  const initialAccess = params.acesso === "recovery" || params.acesso === "confirmation" ? params.acesso : undefined;
  const supabase = await createSupabaseServerClient();
  const session = supabase ? await supabase.auth.getUser() : null;
  const user = session?.data.user ?? null;
  // Falha na consulta não comprova saída da conta; a mensagem permite tentar novamente.
  const unavailable = isNucleusAuthUnavailable(session?.error ?? null) || (!user && error === "servico");
  const name = typeof user?.user_metadata?.name === "string" ? user.user_metadata.name.trim() : "";
  const displayName = name || "Sua conta";
  const initials = name ? name.split(/\s+/).slice(0, 2).map((part: string) => part[0]).join("").toLocaleUpperCase("pt-BR") : "N";

  return <OnboardingShell showTree={!user}><div className={`account-experience ${user ? "account-workspace" : "account-auth-heading"}`}>
    {!user && <Link href="/boas-vindas" className="ui-text-link mb-5"><ArrowLeft size={16} aria-hidden="true" />Voltar às boas-vindas</Link>}
    <header className="ui-page-header"><div>
      <p className="ui-kicker">{user ? "Sua conta" : "Um lugar seguro para seus vínculos"}</p>
      <h1 className="ui-title">{user ? "Seu espaço também merece cuidado." : "Sua conta no Nós"}</h1>
      <p className="ui-copy">{user ? "Seu acesso, seus dados e os caminhos para cuidar da sua conta." : "Crie uma conta ou entre para cuidar dos seus Núcleos com privacidade."}</p>
    </div></header>
    {unavailable && <p role="alert" className="ui-feedback mb-5">Não foi possível conferir sua sessão. Tente novamente em instantes.</p>}
    {error === "confirmacao" && <p role="alert" className="ui-feedback mb-5">Não foi possível confirmar o e-mail. <Link href={withAuthNext("/conta/confirmar-email", next)} className="underline">Solicite outro link de confirmação</Link> ou tente entrar.</p>}
    {params.resultado === "senha" && <p role="status" className="ui-feedback mb-5">Senha atualizada. Entre com sua nova senha.</p>}
    {!user && params.resultado === "conta-excluida" && <p role="status" className="ui-feedback mb-5">Sua conta foi apagada. Seu acesso e seus vínculos foram removidos. O histórico compartilhado permanece com autoria “Conta excluída”.</p>}
    {error === "revogacao" && <p role="alert" className="ui-feedback mb-5">A senha foi alterada, mas não foi possível encerrar todas as sessões. Entre com a nova senha, volte à Conta e use Sair da conta para tentar encerrar as outras sessões.</p>}
    {error === "saida" && <p role="alert" className="ui-feedback mb-5">Não foi possível sair agora. Tente novamente.</p>}
    {user ? <div className="ui-grid">
      <section className="ui-panel account-panel"><h2 className="settings-panel-title">{displayName}<ArrowRight size={16} aria-hidden="true" /></h2>
        <div className="account-profile"><span className="ui-avatar" aria-hidden="true">{initials}</span><h2>Seu acesso ao Nós</h2><p>Você está conectado como {user.email ?? "membro do Nós"}.</p></div>
        <ActionDialog variant="text" className="account-dialog-trigger" title="Dados da conta" description="Nome e identificação do seu acesso." trigger={<AccountRow icon={UsersRound} title="Dados da conta" description="Nome e identificação" />}><dl className="wizard-summary"><div><dt>Nome</dt><dd>{name || "Nome não informado"}</dd></div><div><dt>E-mail</dt><dd>{user.email ?? "E-mail não disponível"}</dd></div><div><dt>Confirmação de e-mail</dt><dd>{user.email_confirmed_at ? "E-mail confirmado" : "Confirmação pendente"}</dd></div></dl><p className="settings-copy">Para solicitar correção dos seus dados, consulte a responsável pelo aplicativo na área de ajuda.</p><Link href={routes.help} className="ui-button-secondary mt-5">Ajuda sobre meus dados</Link></ActionDialog>
        <ActionDialog variant="text" className="account-dialog-trigger" title="Conta e segurança" description="Senha, recuperação e acesso." size="wide" trigger={<AccountRow icon={LockKeyhole} title="Conta e segurança" description="Senha, recuperação e acesso" />}><SecurityContent /></ActionDialog>
        <AccountAccessDialog kind="confirmation" next={next} defaultOpen={initialAccess === "confirmation"} className="account-dialog-trigger" trigger={<AccountRow icon={Check} title="Confirmar e-mail" description={user.email_confirmed_at ? "Seu e-mail já está confirmado" : "Conferir a etapa de confirmação"} />} />
      </section>
      <section className="ui-panel account-panel"><h2>Entrar e recuperar</h2>
        <Link href={next}><AccountRow icon={LockKeyhole} title="Continuar para o Nós" description="Acessar seus vínculos com a conta conectada" /></Link>
        <AccountAccessDialog kind="recovery" next={next} defaultOpen={initialAccess === "recovery"} className="account-dialog-trigger" trigger={<AccountRow icon={KeyRound} title="Recuperar acesso" description="Link de recuperação e nova senha" />} />
        <ActionDialog variant="text" className="account-dialog-trigger" title="Sair da conta" description="Encerrar o acesso desta conta." trigger={<AccountRow icon={LogOut} title="Sair da conta" description="Encerrar acesso com segurança" />}><p className="settings-copy">Sair encerra a sessão e não remove sua participação em nenhum Núcleo. Para voltar, entre novamente com sua conta.</p><form action={signOut} className="mt-5"><SignOutButton /></form></ActionDialog>
      </section>
    </div> : <AuthForm next={next} initialMode={params.resultado === "senha" || params.modo === "login" ? "login" : "signup"} initialAccess={initialAccess} />}
  </div></OnboardingShell>;
}
