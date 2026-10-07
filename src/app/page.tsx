import { redirect } from "next/navigation";
import { routes } from "@/shared/routes";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Mantém a URL raiz curta e direciona a entrada para o primeiro passo do fluxo.
export default async function Page() {
  const supabase = await createSupabaseServerClient();
  // A entrada pública respeita a identidade validada; quem já entrou escolhe um Núcleo existente.
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  redirect(user ? routes.nucleus : routes.account);
}
