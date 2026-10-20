import { notFound, redirect } from "next/navigation";
import { isNucleusAuthUnavailable } from "@/features/nuclei/nucleus-access";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { routes } from "@/shared/routes";

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function getPreviewNucleus(id: string, section: string) {
  if (!uuid.test(id)) notFound();
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error("A autenticação está indisponível. Não foi possível abrir o esboço do Núcleo.");

  // Mesmo um esboço visual pertence ao espaço privado: o servidor confere a sessão e o vínculo.
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (isNucleusAuthUnavailable(authError)) throw new Error("Não foi possível conferir a sessão agora.");
  if (!user) redirect(`${routes.account}?next=${encodeURIComponent(`${routes.nucleus}/${id}/${section}`)}`);

  const { data: membership, error: membershipError } = await supabase.from("nucleus_members")
    .select("role").eq("nucleus_id", id).eq("user_id", user.id).maybeSingle();
  if (membershipError) throw new Error("Não foi possível consultar a participação no Núcleo.");
  if (!membership) notFound();
  const { data: nucleus, error: nucleusError } = await supabase.from("nuclei")
    .select("name").eq("id", id).maybeSingle();
  if (nucleusError) throw new Error("Não foi possível consultar o Núcleo.");
  if (!nucleus) notFound();
  return nucleus;
}
