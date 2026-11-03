import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AccountNucleus = { id: string; name: string; role: string };
// Reutiliza a leitura apenas nesta requisição para o perfil, Mais e página da conta.
export const readAccountNuclei = cache(async (userId: string): Promise<AccountNucleus[] | null> => {
  try {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return null;
    const [spaces, memberships] = await Promise.all([
      supabase.from("nuclei").select("id,name").order("name").order("id"),
      supabase.from("nucleus_members").select("nucleus_id,role").eq("user_id", userId),
    ]);
    if (spaces.error || memberships.error) return null;
    // Os dados são lidos com a sessão; a RLS e as ações de servidor continuam responsáveis pelo acesso.
    const roles = new Map((memberships.data ?? []).map(member => [member.nucleus_id, member.role]));
    return (spaces.data ?? []).filter(space => roles.has(space.id)).map(space => ({ ...space, role: roles.get(space.id)! }));
  } catch { return null; }
});
