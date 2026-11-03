"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { uuid } from "./habit-access";

export type AgreementResponseCount = { agreement_id: string; accepted: number; declined: number; pending: number };
export async function getAgreementResponseCounts(nucleusId: string, agreementIds: string[]): Promise<{ counts?: AgreementResponseCount[]; error?: string }> {
  if (!uuid.test(nucleusId) || !Array.isArray(agreementIds) || agreementIds.length > 50 || agreementIds.some(id => typeof id !== "string" || !uuid.test(id))) return { error: "Consulta inválida." };
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { error: "Não foi possível conferir as participações." };
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { error: "Entre novamente para conferir as participações." };
  // A RPC também confere vínculo atual e Núcleo aberto; nenhum dado de terceiros passa pela tabela de respostas.
  const { data, error } = await supabase.rpc("get_nucleus_agreement_response_counts", { target_nucleus: nucleusId, agreement_ids: agreementIds });
  return error ? { error: "Não foi possível atualizar as participações. Tentaremos novamente." } : { counts: data ?? [] };
}
