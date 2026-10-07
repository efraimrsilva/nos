import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { recoveryCookie, recoverySecret, verifyRecoveryProof } from "./recovery-proof";

export async function getRecoverySession() {
  const key = recoverySecret();
  const supabase = await createSupabaseServerClient();
  if (!key || !supabase) return null;
  // getUser consulta o Auth e getClaims verifica o JWT; a prova é vinculada à sessão verificada.
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  const { data, error: claimsError } = await supabase.auth.getClaims();
  const session = data?.claims.session_id;
  if (claimsError || typeof session !== "string" || data?.claims.sub !== user.id) return null;
  const jar = await cookies();
  return verifyRecoveryProof(jar.get(recoveryCookie)?.value, user.id, session, key) ? supabase : null;
}
