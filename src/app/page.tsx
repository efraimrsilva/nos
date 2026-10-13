import { redirect } from "next/navigation";
import { routes } from "@/shared/routes";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isNucleusAuthUnavailable } from "@/features/nuclei/nucleus-access";

// Mantém a URL raiz curta e direciona a entrada para o primeiro passo do fluxo.
export default async function Page() {
  const supabase = await createSupabaseServerClient();
  // A entrada pública respeita a identidade validada; quem já entrou escolhe um Núcleo existente.
  const session = supabase ? await supabase.auth.getUser() : null;
  // Preserva o motivo da consulta falha ao encaminhar para a entrada pública.
  if (isNucleusAuthUnavailable(session?.error ?? null)) redirect(`${routes.account}?erro=servico`);
  const user = session?.data.user ?? null;
  redirect(user ? routes.nucleus : routes.account);
}
