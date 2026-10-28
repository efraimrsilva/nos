import { AccountPreferences } from "@/features/controls/components/account-preferences";
import type { Metadata } from "next";
import Link from "next/link";

import { AuthForm } from "@/features/auth/components/auth-form";

import { createSupabaseServerClient } from "@/lib/supabase/server";

import { safeAuthNext, withAuthNext } from "@/features/auth/input";
import { isNucleusAuthUnavailable } from "@/features/nuclei/nucleus-access";
import { OnboardingShell } from "@/features/onboarding/components/onboarding-shell";

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

  let privacyHidden: boolean | undefined;
  if (user && supabase) {
    try {
      const { data, error: privacyError } = await supabase.rpc("get_my_privacy_preference");
      if (!privacyError) privacyHidden = Boolean(data);
    } catch { /* O restante da conta permanece disponível. */ }
  }

  return <OnboardingShell showTree={!user}><div className={`account-experience ${user ? "account-workspace" : "account-auth-heading"}`}>
    <header className="ui-page-header"><div>
      {user && <p className="ui-kicker">Sua conta</p>}
      <h1 className="ui-title">{user ? "Conta, Preferências e Ajuda" : "Sua conta no Nós"}</h1>
      <p className="ui-copy">{user ? "Seu perfil, acesso, Núcleos e preferências em um só lugar." : "Crie uma conta ou entre para cuidar dos seus Núcleos com privacidade."}</p>
    </div></header>
    {unavailable && <p role="alert" className="ui-feedback mb-5">Não foi possível conferir sua sessão. Tente novamente em instantes.</p>}
    {error === "confirmacao" && <p role="alert" className="ui-feedback mb-5">Não foi possível confirmar o e-mail. <Link href={withAuthNext("/conta/confirmar-email", next)} className="underline">Solicite outro link de confirmação</Link> ou tente entrar.</p>}
    {params.resultado === "senha" && <p role="status" className="ui-feedback mb-5">Senha atualizada. Entre com sua nova senha.</p>}
    {!user && params.resultado === "conta-excluida" && <p role="status" className="ui-feedback mb-5">Sua conta foi apagada. Seu acesso e seus vínculos foram removidos. O histórico compartilhado permanece com autoria “Conta excluída”.</p>}
    {error === "revogacao" && <p role="alert" className="ui-feedback mb-5">A senha foi alterada, mas não foi possível encerrar todas as sessões. Entre com a nova senha, volte à Conta e use Sair da conta para tentar encerrar as outras sessões.</p>}
    {error === "saida" && <p role="alert" className="ui-feedback mb-5">Não foi possível sair agora. Tente novamente.</p>}
    {user ? <AccountPreferences name={name} email={user.email} emailConfirmed={Boolean(user.email_confirmed_at)} next={next} initialAccess={initialAccess} privacyHidden={privacyHidden} /> : <AuthForm next={next} initialMode={params.resultado === "senha" || params.modo === "login" ? "login" : "signup"} initialAccess={initialAccess} />}
  </div></OnboardingShell>;
}
