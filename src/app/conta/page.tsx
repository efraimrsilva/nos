import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AuthForm } from "@/features/auth/components/auth-form";
import { signOut } from "@/features/auth/actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { routes } from "@/shared/routes";

export const metadata: Metadata = { title: "Sua conta" };

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ erro?: string }> }) {
  const error = (await searchParams).erro;
  const supabase = await createSupabaseServerClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  return <>
    <Link href={routes.start} className="mb-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-muted"><ArrowLeft size={17} aria-hidden="true" />Voltar</Link>
    <p className="step-label mb-3 text-lilac">Um lugar seguro para seus vínculos</p>
    <h1 className="font-display text-[30px] font-medium leading-tight md:text-[38px]">Sua conta no Nós</h1>
    <p className="mt-3 text-sm leading-7 text-muted">Crie uma conta ou entre para cuidar dos seus Núcleos com privacidade.</p>
    {error === "confirmacao" && <p role="alert" className="mt-5 rounded-xl bg-[#fce9f1] p-4 text-sm text-[#9a3153]">Não foi possível confirmar o e-mail. Solicite um novo cadastro ou tente entrar.</p>}
    {error === "saida" && <p role="alert" className="mt-5 rounded-xl bg-[#fce9f1] p-4 text-sm text-[#9a3153]">Não foi possível sair agora. Tente novamente.</p>}
    {user ? <section className="mt-6 rounded-[22px] border border-line bg-white p-6">
      <p className="text-sm leading-7 text-muted">Você está conectado como {user.email ?? "membro do Nós"}.</p>
      <Link href={routes.start} className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-leaf underline">Continuar para o Nós</Link>
      <form action={signOut} className="mt-4"><button type="submit" className="min-h-11 rounded-xl border border-line px-5 text-sm font-semibold">Sair da conta</button></form>
    </section> : <AuthForm />}
  </>;
}
