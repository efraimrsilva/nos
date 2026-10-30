"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function saveProfileName(value: unknown, expectedUserId: string): Promise<{ error: string; name?: string }> {
  const name = typeof value === "string" ? value.trim() : "";
  if (!name || name.length > 80) return { error: "Informe um nome de 1 a 80 caracteres." };
  try {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return { error: "Não foi possível salvar seu nome. Tente novamente." };
    const { data: { user }, error: sessionError } = await supabase.auth.getUser();
    // O identificador exibido protege abas antigas; somente a sessão autoriza a gravação.
    if (sessionError || !user || user.id !== expectedUserId) {
      return { error: "Não foi possível confirmar sua sessão. Entre novamente na conta ou atualize a página." };
    }
    // Auth altera só o nome da própria conta, preservando tema e demais metadados.
    // O nome é apresentação e nunca deve decidir permissões.
    const { data, error } = await supabase.auth.updateUser({ data: { name } });
    if (error || data.user?.id !== user.id || data.user.user_metadata.name !== name) {
      return { error: "Não foi possível salvar seu nome. Tente novamente." };
    }
  } catch {
    return { error: "A conexão falhou ao salvar seu nome. Confira os dados e tente novamente." };
  }
  // Atualiza também as iniciais da navegação e os nomes nas listas de participantes.
  revalidatePath("/", "layout");
  return { error: "", name };
}
