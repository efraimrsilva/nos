import type { SupabaseClient } from "@supabase/supabase-js";

export type NavigationCounts = { nuclei: number; agreements: number; events: number; people: number };

export async function readNavigationCounts(supabase: Pick<SupabaseClient, "rpc">): Promise<NavigationCounts | null> {
  try {
    // A função usa auth.uid(): o navegador nunca escolhe de quem consultar os totais.
    const { data, error } = await supabase.rpc("get_navigation_counts");
    if (error || !data || !["nuclei", "agreements", "events", "people"].every(key => Number.isSafeInteger(data[key]) && data[key] >= 0)) return null;
    return { nuclei: data.nuclei, agreements: data.agreements, events: data.events, people: data.people };
  } catch {
    // Falha de rede/migração não bloqueia a navegação nem inventa ausência de vínculos.
    return null;
  }
}
