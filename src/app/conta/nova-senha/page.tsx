import type { Metadata } from "next";
import Link from "next/link";
import { AccessHeading } from "@/features/auth/components/access-heading";
import { PasswordResetForm } from "@/features/auth/components/access-forms";
import { safeAuthNext, withAuthNext } from "@/features/auth/input";
import { getRecoverySession } from "@/features/auth/recovery-session";

export const metadata: Metadata = { title: "Redefinir senha" };
export default async function NewPasswordPage({ searchParams }: { searchParams: Promise<{ next?: string | string[]; erro?: string | string[] }> }) {
  const params = await searchParams;
  const next = safeAuthNext(params.next);
  const authorized = !params.erro && await getRecoverySession();
  return <>
    <AccessHeading title="Redefinir senha" subtitle="Um novo acesso, com segurança." next={next} />
    {authorized ? <PasswordResetForm next={next} /> : <p role="alert" className="mt-6 rounded-xl bg-[#fce9f1] p-4 text-sm text-[#9a3153]">Abra um link de recuperação válido. O link pode ter expirado, já ter sido usado ou precisar ser aberto no navegador em que você o solicitou.</p>}
    <Link href={withAuthNext("/conta/recuperar", next)} className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-leaf underline">Solicitar outro link</Link>
  </>;
}
