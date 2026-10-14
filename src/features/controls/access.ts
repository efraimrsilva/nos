import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isNucleusAuthUnavailable } from "@/features/nuclei/nucleus-access";
import { withAuthNext } from "@/features/auth/input";

export async function requireControlsSession(destination: string) {
  const supabase = await createSupabaseServerClient();
  const login = withAuthNext("/conta?modo=login", destination);
  if (!supabase) redirect(login);
  // Verificação em cada página: layout compartilhado não revalida sessão a cada navegação.
  const { data: { user }, error } = await supabase.auth.getUser();
  if (isNucleusAuthUnavailable(error)) throw new Error("Não foi possível conferir sua sessão agora.");
  if (!user) redirect(login);
  return { supabase, user };
}
