"use server";

import { redirect } from "next/navigation";
import { findNucleusType } from "@/features/nuclei/nucleus-types";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { routes } from "@/shared/routes";

export type CreateNucleusState = { error: string };

export async function createNucleus(_previous: CreateNucleusState, formData: FormData): Promise<CreateNucleusState> {
  const type = findNucleusType(String(formData.get("type") ?? ""));
  const name = String(formData.get("name") ?? "").trim();
  const purpose = String(formData.get("purpose") ?? "").trim();
  if (!type || !name || !purpose || name.length > 80 || purpose.length > 500) {
    return { error: "Revise o tipo, o nome e o propósito antes de criar o Núcleo." };
  }
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { error: "O serviço ainda não está configurado neste ambiente." };
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { error: "Entre na sua conta antes de criar o Núcleo." };

  // A função SQL faz criação e associação do criador na mesma transação, sob auth.uid().
  const { data, error } = await supabase.rpc("create_nucleus", {
    nucleus_type: type.id,
    nucleus_name: name,
    nucleus_purpose: purpose,
  });
  if (error || typeof data !== "string") return { error: "Não foi possível criar o Núcleo agora. Tente novamente." };
  redirect(`${routes.initialInvitation}/${encodeURIComponent(data)}`);
}
