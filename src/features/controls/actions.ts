"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireControlsSession } from "./access";
import { uuid } from "@/features/agreements/habit-access";

export type ControlActionState = { error: string; success?: string };
export type ManagementOperation = "details" | "nominate" | "accept" | "decline" | "demote" | "remove" | "leave" | "close";

export async function savePrivacyPreference(_previous: ControlActionState, form: FormData): Promise<ControlActionState> {
  const { supabase } = await requireControlsSession("/configuracoes/privacidade");
  const { error } = await supabase.rpc("set_my_privacy_preference", { hide_authorship: form.get("hideAuthorship") === "on" });
  if (error) return { error: "Não foi possível salvar sua preferência. Tente novamente." };
  revalidatePath("/configuracoes/privacidade");
  revalidatePath("/conta");
  return { error: "", success: "Preferência salva. Ela será aplicada às suas próximas saídas." };
}

export async function manageNucleus(nucleusId: string, operation: ManagementOperation, targetUser: string | null,
  _previous: ControlActionState, form: FormData): Promise<ControlActionState> {
  if (!uuid.test(nucleusId) || (targetUser !== null && !uuid.test(targetUser))) return { error: "Identificador inválido." };
  if (!["details", "nominate", "accept", "decline", "demote", "remove", "leave", "close"].includes(operation)) return { error: "Ação inválida." };
  if (form.get("confirmed") !== "on") return { error: "Confirme que compreendeu a ação antes de continuar." };
  const path = `/nucleos/${nucleusId}${operation === "leave" ? "/sair" : ""}`;
  const { supabase } = await requireControlsSession(path);
  // A ação valida a entrada; a função no banco revalida o papel sob a trava do Núcleo.
  const name = String(form.get("name") ?? "").trim();
  const purpose = String(form.get("purpose") ?? "").trim();
  const confirmationName = String(form.get("confirmationName") ?? "").trim();
  if (operation === "close" && (!confirmationName || confirmationName.length > 80)) return { error: "Digite o nome do Núcleo para confirmar o encerramento." };
  if (operation === "details" && (!name || name.length > 80 || !purpose || purpose.length > 500)) return { error: "Informe nome (até 80 caracteres) e propósito (até 500 caracteres)." };
  const calls = {
    details: ["update_nucleus_details", { target_nucleus: nucleusId, nucleus_name: name, nucleus_purpose: purpose }],
    nominate: ["nominate_nucleus_admin", { target_nucleus: nucleusId, target_user: targetUser }],
    accept: ["respond_nucleus_admin_nomination", { target_nucleus: nucleusId, accept_nomination: true }],
    decline: ["respond_nucleus_admin_nomination", { target_nucleus: nucleusId, accept_nomination: false }],
    demote: ["demote_nucleus_admin", { target_nucleus: nucleusId, target_user: targetUser }],
    remove: ["remove_nucleus_member", { target_nucleus: nucleusId, target_user: targetUser }],
    leave: ["leave_nucleus", { target_nucleus: nucleusId }],
    close: ["close_nucleus", { target_nucleus: nucleusId, confirmation_name: confirmationName }],
  } as const;
  const [rpc, args] = calls[operation];
  const { error } = await supabase.rpc(rpc, args);
  // O banco compara o nome sob trava, inclusive se outro administrador o alterou nesta página aberta.
  if (operation === "close" && error?.code === "22023") return { error: "O nome informado não corresponde ao Núcleo. Confira o nome atual e tente novamente." };
  if (error) return { error: "Não foi possível concluir. Atualize a página e confira sua permissão e a situação atual do Núcleo." };
  revalidatePath("/nucleos", "layout");
  if (operation === "leave") redirect("/nucleos");
  if (operation === "close") redirect("/nucleos?resultado=encerrado");
  return { error: "", success: "Alteração concluída." };
}

// A RPC altera um único campo sob trava, preservando edições concorrentes do outro campo.
export async function updateNucleusIdentity(id: string, field: "name" | "purpose", _previous: ControlActionState, form: FormData): Promise<ControlActionState> {
  if (!uuid.test(id) || !["name", "purpose"].includes(field)) return { error: "Identificador inválido." };
  if (form.get("confirmed") !== "on") return { error: "Confirme que compreendeu a alteração." };
  const value = String(form.get(field) ?? "").trim();
  const max = field === "name" ? 80 : 500;
  if (!value || Array.from(value).length > max) return { error: `Informe ${field === "name" ? "um nome" : "um propósito"} com até ${max} caracteres.` };
  const { supabase } = await requireControlsSession(`/nucleos/${id}`);
  const { error } = await supabase.rpc("update_nucleus_identity", { target_nucleus: id, identity_field: field, identity_value: value });
  if (error) return { error: "Não foi possível salvar. Confira sua permissão e tente novamente." };
  revalidatePath("/nucleos", "layout");
  return { error: "", success: field === "name" ? "Nome atualizado." : "Propósito atualizado." };
}
