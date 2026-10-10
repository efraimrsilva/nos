"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type InvitationState = { error: string; code: string; preview: null | { id: string; name: string; type: string; purpose: string } };

export async function generateInvitation(previous: InvitationState, formData: FormData): Promise<InvitationState> {
  const id = String(formData.get("nucleus_id") ?? "");
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) return { ...previous, error: "Núcleo inválido." };
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { ...previous, error: "O serviço ainda não está configurado." };
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ...previous, error: "Entre na sua conta para gerar um convite." };
  const { data, error } = await supabase.rpc("create_initial_invitation", { target_nucleus: id });
  if (error || typeof data !== "string") return { ...previous, error: "Não foi possível gerar o convite. Confira seu acesso e tente novamente." };
  return { ...previous, code: data, error: "" };
}

export async function inspectInvitation(_previous: InvitationState, formData: FormData): Promise<InvitationState> {
  const code = String(formData.get("code") ?? "").trim().toLowerCase();
  const clear = (error: string): InvitationState => ({ error, code: "", preview: null });
  if (!code) return clear("Informe o código de convite.");
  if (!/^[0-9a-f]{32}$/.test(code)) return clear("Informe um código válido de 32 caracteres.");
  const supabase = await createSupabaseServerClient();
  if (!supabase) return clear("O serviço ainda não está configurado.");
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return clear("Entre na sua conta antes de conferir o convite.");
  const { data, error } = await supabase.rpc("inspect_invitation", { invitation_code: code });
  const row = Array.isArray(data) ? data[0] : null;
  if (error || !row) return clear("Convite não encontrado, expirado ou revogado.");
  return { error: "", code, preview: { id: row.nucleus_id, name: row.nucleus_name, type: row.nucleus_type, purpose: row.nucleus_purpose } };
}

export async function acceptInvitation(_previous: InvitationState, formData: FormData): Promise<InvitationState> {
  const code = String(formData.get("code") ?? "").trim().toLowerCase();
  if (!/^[0-9a-f]{32}$/.test(code)) return { error: "Código inválido.", code: "", preview: null };
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { error: "O serviço ainda não está configurado.", code, preview: null };
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Entre na sua conta para aceitar o convite.", code, preview: null };
  // O banco valida expiração e revogação outra vez no momento do aceite.
  const { data, error } = await supabase.rpc("accept_invitation", { invitation_code: code });
  if (error || typeof data !== "string") return { error: "Este convite não está mais disponível.", code, preview: null };
  redirect(`/nucleos/${encodeURIComponent(data)}`);
}
