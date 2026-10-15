import { notFound, redirect } from "next/navigation";
import { isNucleusAuthUnavailable } from "@/features/nuclei/nucleus-access";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { routes } from "@/shared/routes";

export const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function loadHabitContext(id: string, agreementId: string, includeEnded = false, includeProposals = false) {
  if (!uuid.test(id) || !uuid.test(agreementId)) notFound();
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect(routes.account);
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (isNucleusAuthUnavailable(authError)) throw new Error("Não foi possível conferir a sessão agora.");
  if (!user) redirect(routes.account);

  const { data: membership, error: membershipError } = await supabase.from("nucleus_members")
    .select("role").eq("nucleus_id", id).eq("user_id", user.id).maybeSingle();
  if (membershipError) throw new Error("Não foi possível consultar a participação no Núcleo.");
  if (!membership) notFound();
  const { data: nucleus, error: nucleusError } = await supabase.from("nuclei")
    .select("name").eq("id", id).maybeSingle();
  if (nucleusError) throw new Error("Não foi possível consultar o Núcleo.");
  if (!nucleus) notFound();

  // O filtro da URL complementa a RLS; a resposta aninhada expõe somente a da pessoa autenticada.
  let request = supabase.from("nucleus_agreements")
    .select("category,title,description,timing,frequency,status,trial_days,created_at,terms_version,test_started_at,nucleus_agreement_participants(response,accepted_version)")
    .eq("id", agreementId).eq("nucleus_id", id);
  if (!includeProposals) request = request.eq("category", "habit");
  const { data: habit, error: habitError } = await request
    .in("status", includeProposals ? ["pending", "testing", "active", "ended", "declined"] : includeEnded ? ["testing", "active", "ended"] : ["testing", "active"]).maybeSingle();
  if (habitError) throw new Error("Não foi possível consultar o hábito agora.");
  if (!habit) notFound();
  return { supabase, user, nucleus, habit, membership };
}
