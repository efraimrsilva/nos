import { createHash } from "node:crypto";
import type { createSupabaseServerClient } from "@/lib/supabase/server";

// O mesmo leitor alimenta a renderização e a conferência periódica. A RLS limita
// a consulta aos Núcleos acessíveis pela sessão; só o resumo é enviado ao cliente.
export async function readNucleusIdentityVersion(supabase: NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>) {
  const hash = createHash("sha256");
  let after: string | undefined;
  while (true) {
    let query = supabase.from("nuclei").select("id,name,purpose").order("id").limit(200);
    if (after) query = query.gt("id", after);
    const { data, error } = await query;
    if (error || !data) return null;
    for (const nucleus of data) hash.update(JSON.stringify(nucleus));
    // Paginação evita ignorar mudanças depois do limite padrão da API.
    if (data.length < 200) return hash.digest("hex");
    after = data[data.length - 1].id;
  }
}
