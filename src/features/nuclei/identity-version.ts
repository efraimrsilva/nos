import type { SupabaseClient } from "@supabase/supabase-js";

// Renderização e polling usam o mesmo resumo de Núcleos e nomes de integrantes.
// A RPC aplica o vínculo da sessão no banco e devolve só o detector de mudança.
export async function readNucleusIdentityVersion(supabase: Pick<SupabaseClient, "rpc">): Promise<string | null> {
  const { data, error } = await supabase.rpc("get_nucleus_identity_version");
  // Migração indisponível/falha de consulta não é uma versão vazia: preserva a tela.
  return !error && typeof data === "string" && /^[0-9a-f]{32}$/.test(data) ? data : null;
}
