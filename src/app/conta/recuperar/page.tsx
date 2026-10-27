import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { safeAuthNext, withAuthNext } from "@/features/auth/input";

export const metadata: Metadata = { title: "Recuperar acesso" };
export default async function RecoveryPage({ searchParams }: { searchParams: Promise<{ next?: string | string[] }> }) {
  const next = safeAuthNext((await searchParams).next);
  redirect(withAuthNext("/conta?modo=login&acesso=recovery", next));
}
