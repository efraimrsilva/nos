import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AuthForm } from "@/features/auth/components/auth-form";
import { signOut } from "@/features/auth/actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { routes } from "@/shared/routes";
import { safeAuthNext, withAuthNext } from "@/features/auth/input";

export const metadata: Metadata = { title: "Sua conta" };

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ erro?: string | string[]; next?: string | string[]; resultado?: string | string[]; modo?: string | string[] }> }) {
  const params = await searchParams;
  const error = params.erro;
  const next = safeAuthNext(params.next);
  const supabase = await createSupabaseServerClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  return <>
    <Link href={user ? routes.nucleus : "/boas-vindas"} className="mb-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-muted"><ArrowLeft size={17} aria-hidden="true" />{user ? "Seus Núcleos" : "Voltar às boas-vindas"}</Link>
    <p className="step-label mb-3 text-lilac">Um lugar seguro para seus vínculos</p>
    <h1 className="font-display text-[30px] font-medium leading-tight md:text-[38px]">Sua conta no Nós</h1>
    <p className="mt-3 text-sm leading-7 text-muted">Crie uma conta ou entre para cuidar dos seus Núcleos com privacidade.</p>
    {error === "confirmacao" && <p role="alert" className="mt-5 rounded-xl bg-[#fce9f1] p-4 text-sm text-[#9a3153]">Não foi possível confirmar o e-mail. <Link href={withAuthNext("/conta/confirmar-email", next)} className="font-semibold underline">Solicite outro link de confirmação</Link> ou tente entrar.</p>}
    {params.resultado === "senha" && <p role="status" className="mt-5 rounded-xl bg-[#eff3e6] p-4 text-sm">Senha atualizada. Entre com sua nova senha.</p>}
    {error === "revogacao" && <p role="alert" className="mt-5 rounded-xl bg-[#fce9f1] p-4 text-sm text-[#9a3153]">A senha foi alterada, mas não foi possível encerrar todas as sessões. Entre com a nova senha, volte à Conta e use Sair da conta para tentar encerrar as outras sessões.</p>}
    {error === "saida" && <p role="alert" className="mt-5 rounded-xl bg-[#fce9f1] p-4 text-sm text-[#9a3153]">Não foi possível sair agora. Tente novamente.</p>}
    {user ? <section className="mt-6 rounded-[22px] border border-line bg-white p-6">
      <p className="text-sm leading-7 text-muted">Você está conectado como {user.email ?? "membro do Nós"}.</p>
      <Link href={next} className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-leaf underline">Continuar para o Nós</Link>
      <form action={signOut} className="mt-4"><button type="submit" className="min-h-11 rounded-xl border border-line px-5 text-sm font-semibold">Sair da conta</button></form>
    </section> : <AuthForm next={next} initialMode={params.resultado === "senha" || params.modo === "login" ? "login" : "signup"} />}
    <Link href="/boas-vindas" className="mt-4 inline-flex min-h-11 items-center text-xs font-semibold text-leaf underline">Conheça o Nós</Link>
  </>;
}
