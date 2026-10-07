import type { Metadata } from "next";
import { AccessHeading } from "@/features/auth/components/access-heading";
import { EmailActionForm } from "@/features/auth/components/access-forms";
import { safeAuthNext } from "@/features/auth/input";

export const metadata: Metadata = { title: "Recuperar acesso" };
export default async function RecoveryPage({ searchParams }: { searchParams: Promise<{ next?: string | string[] }> }) {
  const next = safeAuthNext((await searchParams).next);
  return <><AccessHeading title="Recuperar acesso" subtitle="Vamos ajudar você a voltar." next={next} /><EmailActionForm kind="recovery" next={next} /></>;
}
