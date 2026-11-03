"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { readNucleusIdentityVersion } from "./identity-version";

export async function getNucleusIdentityVersion(): Promise<string | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return readNucleusIdentityVersion(supabase);
}
