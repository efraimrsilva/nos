"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isThemeId } from "./themes";

export async function saveThemePreference(theme: unknown, expectedUserId: string): Promise<{ error: string }> {
  if (!isThemeId(theme)) return { error: "Escolha um dos temas disponíveis." };
  try {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return { error: "Não foi possível salvar o tema. Tente novamente." };
    const { data: { user }, error: sessionError } = await supabase.auth.getUser();
    // Uma aba antiga não pode aplicar a preferência de outra pessoa após troca de conta.
    if (sessionError || !user || user.id !== expectedUserId) return { error: "Sua sessão mudou. Entre novamente para salvar o tema." };
    // Metadados pessoais não autorizam acesso; envia somente esta chave, preservando nome e demais dados.
    const { data, error } = await supabase.auth.updateUser({ data: { appearance_theme: theme } });
    if (error || data.user?.id !== user.id || data.user.user_metadata.appearance_theme !== theme) {
      return { error: "O tema está aplicado, mas não foi possível salvá-lo na conta. Tente novamente." };
    }
    return { error: "" };
  } catch {
    return { error: "O tema está aplicado, mas a conexão falhou ao salvar. Tente novamente." };
  }
}
